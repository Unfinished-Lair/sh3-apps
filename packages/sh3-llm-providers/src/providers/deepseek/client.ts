import type { AiProvider, ChatChunk, ChatMessage, ChatOptions } from 'sh3-ai';
import { makeIdleTimer } from '../idle-timer';
import { redactKey } from '../../shared/redact';
import { encodeToolName, decodeToolName } from '../../shared/tool-name-codec';
import { readErrorEnvelope } from '../../shared/error-envelope';
import { parseSseStream } from '../../shared/sse';
import type { ModelInfo, ProviderDeps } from '../types';

const BASE_URL = 'https://api.deepseek.com';

export class DeepseekError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'DeepseekError';
  }
}

export interface DeepseekGenerationConfig {
  /** null/omitted → do not send `temperature`. */
  temperature?: number | null;
  /** null/omitted → do not send `max_tokens`. */
  maxOutputTokens?: number | null;
}

interface DeepseekToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

type DeepseekMessage =
  | { role: 'system' | 'user'; content: string }
  | {
      role: 'assistant';
      content: string;
      tool_calls?: DeepseekToolCall[];
      reasoning_content?: string;
    }
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

  // Re-attach the prior round's tool_calls so the upcoming `tool` messages
  // are valid per OpenAI's contract: every `role:tool` must follow an
  // assistant message whose `tool_calls[]` contains the matching id. The
  // sh3-ai dispatcher splits this state across `messages` (text) and
  // `options.toolCalls` (calls), so we stitch them back together here. If
  // the last message is the assistant that produced these calls, attach
  // in-place; otherwise inject an empty-content assistant turn carrying
  // just the tool_calls.
  const pendingCalls = options?.toolCalls;
  if (pendingCalls && pendingCalls.length > 0) {
    const tool_calls: DeepseekToolCall[] = pendingCalls.map((c) => ({
      id: c.id,
      type: 'function',
      function: {
        name: encodeToolName(c.name),
        arguments: typeof c.arguments === 'string'
          ? c.arguments
          : JSON.stringify(c.arguments ?? {}),
      },
    }));
    const reasoning_content = options?.reasoningContent;
    const last = out[out.length - 1];
    if (last && last.role === 'assistant') {
      last.tool_calls = tool_calls;
      if (reasoning_content) last.reasoning_content = reasoning_content;
    } else {
      const assistant: DeepseekMessage = { role: 'assistant', content: '', tool_calls };
      if (reasoning_content) assistant.reasoning_content = reasoning_content;
      out.push(assistant);
    }
  }

  for (const r of options?.toolResults ?? []) {
    const content = typeof r.content === 'string'
      ? r.content
      : JSON.stringify({ error: r.content.error });
    out.push({ role: 'tool', tool_call_id: r.toolCallId, content });
  }
  return out;
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
    messages: buildMessages(messages, options?.systemInstruction, options),
    stream,
    ...buildToolsField(options),
  };
  if (typeof config?.temperature === 'number') body.temperature = config.temperature;
  if (typeof config?.maxOutputTokens === 'number') body.max_tokens = config.maxOutputTokens;
  return body;
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
  const idle = makeIdleTimer(signal, options?.idleTimeoutMs);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildBody(messages, modelId, true, config, options)),
      signal: idle.signal,
    });
  } catch (err) {
    idle.clear();
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
    reasoning?: string;
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
          reasoning_content?: string;
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
        reasoning: c.delta?.reasoning_content,
        toolDeltas: c.delta?.tool_calls,
        finishReason: c.finish_reason,
      };
    }
  }

  function applyDelta(d: Delta): ChatChunk[] {
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
    const chunks: ChatChunk[] = [];
    if (d.reasoning && d.reasoning.length > 0) {
      chunks.push({ type: 'reasoning', text: d.reasoning });
    }
    if (d.text && d.text.length > 0) {
      chunks.push({ type: 'token', text: d.text });
    }
    return chunks;
  }

  let yieldedAny = false;

  try {
    for await (const data of parseSseStream(reader)) {
      idle.bump();
      let parsed: unknown;
      try { parsed = JSON.parse(data); } catch { continue; }
      for (const delta of extractDeltas(parsed)) {
        for (const chunk of applyDelta(delta)) {
          yieldedAny = true;
          yield chunk;
        }
      }
    }
  } catch (err) {
    idle.clear();
    const msg = err instanceof Error ? err.message : String(err);
    throw new DeepseekError(redactKey(msg, apiKey));
  }

  idle.clear();

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

export function deepseekProvider(deps: ProviderDeps): AiProvider {
  return {
    id: 'deepseek',
    label: 'DeepSeek',
    capabilities: { tools: true },
    chain: () => deps.getChain(),
    chat(messages, model, signal, options) {
      return chatStream(
        deps.getApiKey(), messages, model, signal,
        {
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
        : 'deepseek: no API key configured. Open the DeepSeek settings (palette: "AI Configuration..." → "DeepSeek") to set one.';
    },
  };
}
