import type { AiProvider, ChatChunk, ChatMessage } from 'sh3-ai';

const BASE_URL = 'https://api.deepseek.com';

export class DeepseekError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'DeepseekError';
  }
}

export interface DeepseekGenerationConfig {
  /** Empty/omitted → no `system` message is prepended. */
  systemInstruction?: string;
  /** null/omitted → do not send `temperature`. */
  temperature?: number | null;
  /** null/omitted → do not send `max_tokens`. */
  maxOutputTokens?: number | null;
}

function buildMessages(
  messages: ChatMessage[],
  systemInstruction?: string,
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const out: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];
  if (systemInstruction && systemInstruction.length > 0) {
    out.push({ role: 'system', content: systemInstruction });
  }
  for (const m of messages) out.push({ role: m.role, content: m.content });
  return out;
}

function buildBody(
  messages: ChatMessage[],
  modelId: string,
  stream: boolean,
  config: DeepseekGenerationConfig | undefined,
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: modelId,
    messages: buildMessages(messages, config?.systemInstruction),
    stream,
  };
  if (typeof config?.temperature === 'number') body.temperature = config.temperature;
  if (typeof config?.maxOutputTokens === 'number') body.max_tokens = config.maxOutputTokens;
  return body;
}

function redactKey(message: string, apiKey: string): string {
  if (!apiKey) return message;
  return message.split(apiKey).join('***');
}

async function readErrorEnvelope(res: Response): Promise<string> {
  let envelopeMsg: string | undefined;
  try {
    const body = await res.json();
    envelopeMsg = body?.error?.message;
  } catch {
    // body wasn't JSON — fall through to status fallback
  }
  return envelopeMsg ?? `HTTP ${res.status}`;
}

export interface ModelInfo {
  id: string;
  displayName: string;
}

export async function listModels(apiKey: string): Promise<ModelInfo[]> {
  const url = `${BASE_URL}/models`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new DeepseekError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    const raw = await readErrorEnvelope(res);
    throw new DeepseekError(redactKey(raw, apiKey), res.status);
  }

  const data = await res.json();
  const models = Array.isArray(data?.data) ? data.data : [];
  return models
    .map((m: { id: string }) => ({ id: m.id, displayName: m.id }))
    .sort((a: ModelInfo, b: ModelInfo) => a.id.localeCompare(b.id));
}

export async function* chatStream(
  apiKey: string,
  messages: ChatMessage[],
  modelId: string,
  signal: AbortSignal,
  config?: DeepseekGenerationConfig,
): AsyncIterable<ChatChunk> {
  const url = `${BASE_URL}/chat/completions`;
  const composed = AbortSignal.any([signal, AbortSignal.timeout(60_000)]);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildBody(messages, modelId, true, config)),
      signal: composed,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new DeepseekError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    const raw = await readErrorEnvelope(res);
    throw new DeepseekError(redactKey(raw, apiKey), res.status);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new DeepseekError('chat/completions: empty body');
  }

  function* extractTokens(parsed: unknown): Iterable<string> {
    const choices = (parsed as { choices?: { delta?: { content?: string } }[] })?.choices;
    if (!choices) return;
    for (const c of choices) {
      const text = c.delta?.content;
      if (typeof text === 'string' && text.length > 0) yield text;
    }
  }

  function* parseSseEvent(event: string): Iterable<string> {
    for (const line of event.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
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
  let yieldedAny = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? '';
      for (const event of events) {
        for (const text of parseSseEvent(event)) {
          yieldedAny = true;
          yield { type: 'token', text };
        }
      }
    }
    buffer += decoder.decode();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new DeepseekError(redactKey(msg, apiKey));
  }

  if (buffer.trim().length > 0) {
    for (const text of parseSseEvent(buffer)) {
      yieldedAny = true;
      yield { type: 'token', text };
    }
  }

  if (!yieldedAny) {
    throw new DeepseekError('chat/completions: empty stream');
  }
  yield { type: 'done' };
}

export interface DeepseekProviderDeps {
  getApiKey: () => string;
  getChain: () => string[];
  getSystemInstruction: () => string;
  getTemperature: () => number | null;
  getMaxOutputTokens: () => number | null;
}

export function deepseekProvider(deps: DeepseekProviderDeps): AiProvider {
  return {
    id: 'deepseek',
    label: 'DeepSeek',
    chain: () => deps.getChain(),
    chat(messages, model, signal) {
      return chatStream(deps.getApiKey(), messages, model, signal, {
        systemInstruction: deps.getSystemInstruction(),
        temperature: deps.getTemperature(),
        maxOutputTokens: deps.getMaxOutputTokens(),
      });
    },
    isAuthFailure(err: unknown): boolean {
      // 400 invalid format, 401 bad key, 402 insufficient balance, 403 forbidden —
      // all four won't recover by retrying with a different model.
      return (
        err instanceof DeepseekError &&
        (err.status === 400 ||
          err.status === 401 ||
          err.status === 402 ||
          err.status === 403)
      );
    },
    isReady() {
      return deps.getApiKey().length > 0
        ? true
        : 'deepseek: no API key configured. Open the DeepSeek settings (palette: "Open Settings: DeepSeek") to set one.';
    },
  };
}
