const ENDPOINT = (modelId: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

export class GeminiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GeminiError';
  }
}

export interface GeminiGenerationConfig {
  /** Empty/omitted → do not send `systemInstruction`. */
  systemInstruction?: string;
  /** null/omitted → do not send `generationConfig.temperature`. */
  temperature?: number | null;
  /** null/omitted → do not send `generationConfig.maxOutputTokens`. */
  maxOutputTokens?: number | null;
}

function buildGenerationFields(
  config: GeminiGenerationConfig | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (config?.systemInstruction) {
    out.systemInstruction = { parts: [{ text: config.systemInstruction }] };
  }
  const generationConfig: Record<string, number> = {};
  if (typeof config?.temperature === 'number') {
    generationConfig.temperature = config.temperature;
  }
  if (typeof config?.maxOutputTokens === 'number') {
    generationConfig.maxOutputTokens = config.maxOutputTokens;
  }
  if (Object.keys(generationConfig).length > 0) {
    out.generationConfig = generationConfig;
  }
  return out;
}

export async function askOnce(
  apiKey: string,
  prompt: string,
  modelId: string,
  signal?: AbortSignal,
  config?: GeminiGenerationConfig,
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
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        ...buildGenerationFields(config),
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

import type { ChatMessage, ChatChunk, ChatOptions } from 'sh3-ai';

const STREAM_ENDPOINT = (modelId: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent`;

/** Gemini function names must match `[a-zA-Z_][a-zA-Z0-9_-]{0,63}` — '.' is
 *  rejected. sh3-ai tool names use '.' as the segment separator, so we
 *  encode '.' → '__' on the wire and decode the inverse on incoming
 *  functionCall.name fields. Round-trip-safe for any sh3-ai-shaped name. */
function encodeToolName(name: string): string {
  return name.replace(/\./g, '__');
}
function decodeToolName(name: string): string {
  return name.replace(/__/g, '.');
}

function buildToolsField(options: ChatOptions | undefined): Record<string, unknown> {
  if (!options?.tools || options.tools.length === 0) return {};
  return {
    tools: [
      {
        functionDeclarations: options.tools.map((t) => ({
          name: encodeToolName(t.name),
          description: t.description,
          parameters: t.inputSchema,
        })),
      },
    ],
  };
}

function toolResultsToContents(
  options: ChatOptions | undefined,
  callIdToName: Map<string, string>,
): Array<Record<string, unknown>> {
  if (!options?.toolResults || options.toolResults.length === 0) return [];
  return options.toolResults.map((r) => {
    const decoded = callIdToName.get(r.toolCallId);
    const encoded = decoded ? encodeToolName(decoded) : r.toolCallId;
    const response = typeof r.content === 'string'
      ? { result: r.content }
      : { error: r.content.error };
    return {
      role: 'function',
      parts: [{ functionResponse: { name: encoded, response } }],
    };
  });
}

export async function* chatStream(
  apiKey: string,
  messages: ChatMessage[],
  modelId: string,
  signal: AbortSignal,
  config?: GeminiGenerationConfig,
  options?: ChatOptions,
  callIdToName: Map<string, string> = new Map(),
): AsyncIterable<ChatChunk> {
  const url = `${STREAM_ENDPOINT(modelId)}?alt=sse&key=${apiKey}`;
  const composed = AbortSignal.any([signal, AbortSignal.timeout(60_000)]);
  let res: Response;
  try {
    const baseContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [...baseContents, ...toolResultsToContents(options, callIdToName)],
        ...buildGenerationFields(config),
        ...buildToolsField(options),
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

  type SsePart =
    | { kind: 'token'; text: string }
    | { kind: 'tool-call'; id: string; name: string; arguments: unknown };

  function* extractParts(parsed: unknown): Iterable<SsePart> {
    const parts = (parsed as {
      candidates?: {
        content?: {
          parts?: Array<{
            text?: string;
            functionCall?: { name?: string; args?: unknown };
          }>;
        };
      }[];
    })?.candidates?.[0]?.content?.parts;
    if (!parts) return;
    for (const p of parts) {
      if (typeof p.text === 'string' && p.text.length > 0) {
        yield { kind: 'token', text: p.text };
      } else if (p.functionCall && typeof p.functionCall.name === 'string') {
        yield {
          kind: 'tool-call',
          id: crypto.randomUUID(),
          name: decodeToolName(p.functionCall.name),
          arguments: p.functionCall.args ?? {},
        };
      }
    }
  }

  function* parseSseEvent(event: string): Iterable<SsePart> {
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
      yield* extractParts(parsed);
    }
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let raw = '';
  let yieldedAny = false;
  let yieldedToolCall = false;

  async function* yieldPart(part: SsePart): AsyncIterable<ChatChunk> {
    yieldedAny = true;
    if (part.kind === 'token') {
      yield { type: 'token', text: part.text };
    } else {
      yieldedToolCall = true;
      // Remember encoded↔decoded mapping so a follow-up turn carrying
      // toolResults can address the correct functionResponse.name.
      callIdToName.set(part.id, part.name);
      yield { type: 'tool-call', id: part.id, name: part.name, arguments: part.arguments };
    }
  }

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
        for (const part of parseSseEvent(event)) {
          yield* yieldPart(part);
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
    for (const part of parseSseEvent(buffer)) {
      yield* yieldPart(part);
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
        for (const part of extractParts(chunk)) {
          yield* yieldPart(part);
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
  yield yieldedToolCall
    ? { type: 'done', finishReason: 'tool-calls' }
    : { type: 'done' };
}

import type { AiProvider } from 'sh3-ai';

export interface GeminiProviderDeps {
  getApiKey: () => string;
  getChain: () => string[];
  getSystemInstruction: () => string;
  getTemperature: () => number | null;
  getMaxOutputTokens: () => number | null;
}

export function geminiProvider(deps: GeminiProviderDeps): AiProvider {
  // Persist the encoded-name ↔ decoded-name map across turns of the same
  // dispatch loop so functionResponse.name can be addressed correctly.
  // sh3-ai's dispatch loop uses the same provider instance per loop.
  const callIdToName = new Map<string, string>();
  return {
    id: 'gemini',
    label: 'Gemini',
    capabilities: { tools: true },
    chain: () => deps.getChain(),
    chat(messages, model, signal, options) {
      return chatStream(
        deps.getApiKey(), messages, model, signal,
        {
          systemInstruction: deps.getSystemInstruction(),
          temperature: deps.getTemperature(),
          maxOutputTokens: deps.getMaxOutputTokens(),
        },
        options,
        callIdToName,
      );
    },
    isAuthFailure(err: unknown): boolean {
      return (
        err instanceof GeminiError &&
        (err.status === 400 || err.status === 401 || err.status === 403)
      );
    },
    isReady() {
      return deps.getApiKey().length > 0
        ? true
        : 'gemini: no API key configured. Open the Gemini app to set one.';
    },
  };
}
