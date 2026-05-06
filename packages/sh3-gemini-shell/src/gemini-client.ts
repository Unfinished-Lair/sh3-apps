const ENDPOINT = (modelId: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

export class GeminiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function askOnce(
  apiKey: string,
  prompt: string,
  modelId: string,
  signal?: AbortSignal,
): Promise<string> {
  const url = `${ENDPOINT(modelId)}?key=${apiKey}`;
  const composed = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(30_000)])
    : AbortSignal.timeout(30_000);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: composed,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    let envelopeMsg: string | undefined;
    try {
      const body = await res.json();
      envelopeMsg = body?.error?.message;
    } catch {
      // body wasn't JSON — fall through to status fallback
    }
    const raw = envelopeMsg ?? `HTTP ${res.status}`;
    throw new GeminiError(redactKey(raw, apiKey), res.status);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts as Array<{ text?: string }> | undefined;
  if (!parts || parts.length === 0) {
    throw new GeminiError('unexpected response shape');
  }
  return parts.map((p) => p.text ?? '').join('');
}

function redactKey(message: string, apiKey: string): string {
  if (!apiKey) return message;
  return message.split(apiKey).join('***');
}

const LIST_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface ModelInfo {
  id: string;
  displayName: string;
}

export async function listModels(apiKey: string): Promise<ModelInfo[]> {
  const url = `${LIST_ENDPOINT}?key=${apiKey}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    let envelopeMsg: string | undefined;
    try {
      const body = await res.json();
      envelopeMsg = body?.error?.message;
    } catch {
      // body wasn't JSON — fall through to status fallback
    }
    const raw = envelopeMsg ?? `HTTP ${res.status}`;
    throw new GeminiError(redactKey(raw, apiKey), res.status);
  }

  const data = await res.json();
  const models = Array.isArray(data?.models) ? data.models : [];
  return models
    .filter((m: { supportedGenerationMethods?: string[] }) =>
      m.supportedGenerationMethods?.includes('generateContent'),
    )
    .map((m: { name: string; displayName?: string }) => ({
      id: m.name.replace(/^models\//, ''),
      displayName: m.displayName ?? m.name.replace(/^models\//, ''),
    }))
    .sort((a: ModelInfo, b: ModelInfo) => a.id.localeCompare(b.id));
}

export async function iterateChain<T>(
  chain: string[],
  isAuthFailure: (err: unknown) => boolean,
  run: (model: string) => Promise<T>,
): Promise<{ model: string; value: T }> {
  if (chain.length === 0) {
    throw new Error('iterateChain: chain is empty');
  }
  const attempts: { model: string; error: string }[] = [];
  for (const model of chain) {
    try {
      const value = await run(model);
      return { model, value };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ model, error: msg });
      if (isAuthFailure(err)) break;
    }
  }
  const tried = attempts.map((a) => a.model).join(', ');
  const last = attempts[attempts.length - 1]?.error ?? 'unknown error';
  throw new Error(`all models failed (tried ${tried}); last error: ${last}`);
}

import type { ChatMessage, ChatChunk } from './ai/provider';

const STREAM_ENDPOINT = (modelId: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent`;

export async function* chatStream(
  apiKey: string,
  messages: ChatMessage[],
  modelId: string,
  signal: AbortSignal,
): AsyncIterable<ChatChunk> {
  const url = `${STREAM_ENDPOINT(modelId)}?alt=sse&key=${apiKey}`;
  const composed = AbortSignal.any([signal, AbortSignal.timeout(60_000)]);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      }),
      signal: composed,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    let envelopeMsg: string | undefined;
    try {
      const body = await res.json();
      envelopeMsg = body?.error?.message;
    } catch {
      // body wasn't JSON
    }
    const raw = envelopeMsg ?? `HTTP ${res.status}`;
    throw new GeminiError(redactKey(raw, apiKey), res.status);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new GeminiError('streamGenerateContent: empty body');
  }

  function* extractTokens(parsed: unknown): Iterable<string> {
    const parts = (parsed as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
      ?.candidates?.[0]?.content?.parts;
    if (!parts) return;
    for (const p of parts) {
      if (typeof p.text === 'string' && p.text.length > 0) yield p.text;
    }
  }

  function* parseSseEvent(event: string): Iterable<string> {
    for (const line of event.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      // SSE allows an optional single space after the colon; trim handles both forms.
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }
      yield* extractTokens(parsed);
    }
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let raw = '';
  let yieldedAny = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      raw += chunk;

      // Split on blank-line event boundary, tolerating CRLF and LF.
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? '';
      for (const event of events) {
        for (const text of parseSseEvent(event)) {
          yieldedAny = true;
          yield { type: 'token', text };
        }
      }
    }
    const tail = decoder.decode();
    buffer += tail;
    raw += tail;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  // Drain trailing SSE event (no terminating blank line).
  if (buffer.trim().length > 0) {
    for (const text of parseSseEvent(buffer)) {
      yieldedAny = true;
      yield { type: 'token', text };
    }
  }

  // Fallback: if SSE parsing yielded nothing but we got bytes, try JSON-array.
  // `streamGenerateContent` without alt=sse honored returns
  // `[GenerateContentResponse, ...]` with Content-Type application/json.
  if (!yieldedAny && raw.trim().length > 0) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = undefined;
    }
    if (parsed !== undefined) {
      const chunks = Array.isArray(parsed) ? parsed : [parsed];
      for (const chunk of chunks) {
        for (const text of extractTokens(chunk)) {
          yieldedAny = true;
          yield { type: 'token', text };
        }
      }
    }
  }

  if (!yieldedAny) {
    const preview = raw.slice(0, 200).replace(/\s+/g, ' ');
    throw new GeminiError(
      `streamGenerateContent: empty stream${preview ? ` (body preview: ${preview})` : ''}`,
    );
  }
  yield { type: 'done' };
}

import type { AiProvider } from './ai/provider';

export interface GeminiProviderDeps {
  getApiKey: () => string;
  getChain: () => string[];
}

export function geminiProvider(deps: GeminiProviderDeps): AiProvider {
  return {
    id: 'gemini',
    label: 'Gemini',
    chain: () => deps.getChain(),
    chat(messages, model, signal) {
      return chatStream(deps.getApiKey(), messages, model, signal);
    },
    isAuthFailure(err: unknown): boolean {
      return (
        err instanceof GeminiError &&
        (err.status === 400 || err.status === 401 || err.status === 403)
      );
    },
  };
}
