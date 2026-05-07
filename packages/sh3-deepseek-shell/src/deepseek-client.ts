import type { AiProvider, ChatChunk, ChatMessage, ChatOptions } from 'sh3-ai';

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

type DeepseekMessage =
  | { role: 'system' | 'user' | 'assistant'; content: string }
  | { role: 'tool'; tool_call_id: string; content: string };

function buildMessages(
  messages: ChatMessage[],
  systemInstruction: string | undefined,
  options: ChatOptions | undefined,
): DeepseekMessage[] {
  const out: DeepseekMessage[] = [];
  if (systemInstruction && systemInstruction.length > 0) {
    out.push({ role: 'system', content: systemInstruction });
  }
  for (const m of messages) out.push({ role: m.role, content: m.content });
  for (const r of options?.toolResults ?? []) {
    const content = typeof r.content === 'string'
      ? r.content
      : JSON.stringify({ error: r.content.error });
    out.push({ role: 'tool', tool_call_id: r.toolCallId, content });
  }
  return out;
}

/** OpenAI-compatible providers (DeepSeek included) validate function names
 *  against `^[a-zA-Z0-9_-]+$` — '.' is rejected. sh3-ai tool names use '.'
 *  as the segment separator, so we encode '.' → '__' on the wire and decode
 *  the inverse on incoming `tool_calls[i].function.name`. */
function encodeToolName(name: string): string {
  return name.replace(/\./g, '__');
}
function decodeToolName(name: string): string {
  return name.replace(/__/g, '.');
}

function buildToolsField(options: ChatOptions | undefined): Record<string, unknown> {
  if (!options?.tools || options.tools.length === 0) return {};
  return {
    tools: options.tools.map((t) => ({
      type: 'function',
      function: {
        name: encodeToolName(t.name),
        description: t.description,
        parameters: t.inputSchema,
      },
    })),
  };
}

function buildBody(
  messages: ChatMessage[],
  modelId: string,
  stream: boolean,
  config: DeepseekGenerationConfig | undefined,
  options: ChatOptions | undefined,
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: modelId,
    messages: buildMessages(messages, config?.systemInstruction, options),
    stream,
    ...buildToolsField(options),
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
  options?: ChatOptions,
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
      body: JSON.stringify(buildBody(messages, modelId, true, config, options)),
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

  // Per-index tool-call accumulators. OpenAI-style streaming sends
  // tool_calls deltas keyed by `index`; the function name arrives once and
  // the `arguments` string accumulates across deltas.
  const toolCallAcc = new Map<
    number,
    { id: string; name: string; argString: string }
  >();
  let observedFinishReason: 'stop' | 'tool-calls' | 'length' | 'error' | undefined;

  type Delta = {
    text?: string;
    toolDeltas?: Array<{
      index: number;
      id?: string;
      function?: { name?: string; arguments?: string };
    }>;
    finishReason?: string | null;
  };

  function* extractDeltas(parsed: unknown): Iterable<Delta> {
    const choices = (parsed as {
      choices?: Array<{
        delta?: {
          content?: string;
          tool_calls?: Array<{
            index: number;
            id?: string;
            function?: { name?: string; arguments?: string };
          }>;
        };
        finish_reason?: string | null;
      }>;
    })?.choices;
    if (!choices) return;
    for (const c of choices) {
      yield {
        text: c.delta?.content,
        toolDeltas: c.delta?.tool_calls,
        finishReason: c.finish_reason,
      };
    }
  }

  function* parseSseEvent(event: string): Iterable<Delta> {
    for (const line of event.split(/\r?\n/)) {
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      let parsed: unknown;
      try { parsed = JSON.parse(data); } catch { continue; }
      yield* extractDeltas(parsed);
    }
  }

  function applyDelta(d: Delta): ChatChunk | null {
    if (d.toolDeltas) {
      for (const td of d.toolDeltas) {
        let acc = toolCallAcc.get(td.index);
        if (!acc) {
          acc = { id: td.id ?? crypto.randomUUID(), name: '', argString: '' };
          toolCallAcc.set(td.index, acc);
        }
        if (td.id && !acc.id) acc.id = td.id;
        if (td.function?.name) acc.name = td.function.name;
        if (typeof td.function?.arguments === 'string') {
          acc.argString += td.function.arguments;
        }
      }
    }
    if (d.finishReason === 'tool_calls') observedFinishReason = 'tool-calls';
    else if (d.finishReason === 'stop') observedFinishReason = 'stop';
    else if (d.finishReason === 'length') observedFinishReason = 'length';
    if (d.text && d.text.length > 0) return { type: 'token', text: d.text };
    return null;
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
        for (const delta of parseSseEvent(event)) {
          const chunk = applyDelta(delta);
          if (chunk) {
            yieldedAny = true;
            yield chunk;
          }
        }
      }
    }
    buffer += decoder.decode();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new DeepseekError(redactKey(msg, apiKey));
  }

  if (buffer.trim().length > 0) {
    for (const delta of parseSseEvent(buffer)) {
      const chunk = applyDelta(delta);
      if (chunk) {
        yieldedAny = true;
        yield chunk;
      }
    }
  }

  // Emit accumulated tool-calls as discrete chunks before the done chunk.
  for (const acc of toolCallAcc.values()) {
    let parsedArgs: unknown;
    try { parsedArgs = acc.argString ? JSON.parse(acc.argString) : {}; }
    catch { parsedArgs = { _raw: acc.argString }; }
    yieldedAny = true;
    yield { type: 'tool-call', id: acc.id, name: decodeToolName(acc.name), arguments: parsedArgs };
  }

  if (!yieldedAny) {
    throw new DeepseekError('chat/completions: empty stream');
  }

  yield observedFinishReason === 'tool-calls'
    ? { type: 'done', finishReason: 'tool-calls' }
    : { type: 'done' };
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
      );
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
