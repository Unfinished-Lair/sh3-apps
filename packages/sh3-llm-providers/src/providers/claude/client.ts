import type { AiProvider, ChatChunk, ChatMessage, ChatOptions } from 'sh3-ai';
import { makeIdleTimer } from '../idle-timer';
import { redactKey } from '../../shared/redact';
import { encodeToolName, decodeToolName } from '../../shared/tool-name-codec';
import { readErrorEnvelope } from '../../shared/error-envelope';
import { parseSseStream } from '../../shared/sse';
import type { ModelInfo, ProviderDeps } from '../types';

const BASE_URL = 'https://api.anthropic.com';
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MAX_TOKENS = 8192;
const THINKING_BUDGET_TOKENS = 4096;
const THINKING_MODEL_PREFIXES = ['claude-opus-', 'claude-sonnet-'];

export class ClaudeError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ClaudeError';
  }
}

function isThinkingCapable(modelId: string): boolean {
  return THINKING_MODEL_PREFIXES.some((p) => modelId.startsWith(p));
}

export interface ClaudeGenerationConfig {
  /** Anthropic requires `max_tokens` on every request. When the user has
   *  set it, use that; otherwise fall back to DEFAULT_MAX_TOKENS. */
  maxOutputTokens?: number | null;
}

export async function listModels(apiKey: string): Promise<ModelInfo[]> {
  const url = `${BASE_URL}/v1/models`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new ClaudeError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    const raw = await readErrorEnvelope(res);
    throw new ClaudeError(redactKey(raw, apiKey), res.status);
  }

  const data = await res.json();
  const models = Array.isArray(data?.data) ? data.data : [];
  return models
    .map((m: { id: string; display_name?: string }) => ({
      id: m.id,
      displayName: m.display_name ?? m.id,
    }))
    .sort((a: ModelInfo, b: ModelInfo) => a.id.localeCompare(b.id));
}

type ContentBlockKind = 'text' | 'tool_use' | 'thinking';

interface PendingBlock {
  kind: ContentBlockKind;
  // tool_use accumulators
  id?: string;
  name?: string;
  argString?: string;
  // thinking accumulators
  thinkingText?: string;
  signature?: string;
}

interface ClaudeRequestBody {
  model: string;
  max_tokens: number;
  messages: unknown[];
  system?: string | unknown[];
  tools?: unknown[];
  thinking?: { type: 'enabled'; budget_tokens: number };
  temperature?: number;
  stream: true;
}

function buildToolsField(options: ChatOptions | undefined): { tools?: unknown[] } {
  if (!options?.tools || options.tools.length === 0) return {};
  return {
    tools: options.tools.map((t) => ({
      name: encodeToolName(t.name),
      description: t.description,
      input_schema: t.inputSchema,
    })),
  };
}

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: unknown;
}

interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | unknown[];
}

function buildMessages(
  messages: ChatMessage[],
  options: ChatOptions | undefined,
): AnthropicMessage[] {
  const out: AnthropicMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const pendingCalls = options?.toolCalls;
  if (!pendingCalls || pendingCalls.length === 0) {
    return out;
  }

  const toolUseBlocks: ToolUseBlock[] = pendingCalls.map((c) => ({
    type: 'tool_use',
    id: c.id,
    name: encodeToolName(c.name),
    input: c.arguments ?? {},
  }));

  const last = out[out.length - 1];
  const reasoning = options?.reasoningContent;
  const thinkingBlocks: unknown[] =
    typeof reasoning === 'object' && reasoning !== null && Array.isArray(reasoning.providerBlocks)
      ? reasoning.providerBlocks
      : [];

  if (last && last.role === 'assistant') {
    const priorText = typeof last.content === 'string' ? last.content : '';
    const newContent: unknown[] = [];
    newContent.push(...thinkingBlocks);
    if (priorText.length > 0) {
      newContent.push({ type: 'text', text: priorText });
    }
    newContent.push(...toolUseBlocks);
    last.content = newContent;
  } else {
    const newContent: unknown[] = [];
    newContent.push(...thinkingBlocks);
    newContent.push(...toolUseBlocks);
    out.push({ role: 'assistant', content: newContent });
  }

  const toolResultBlocks: ToolResultBlock[] = (options?.toolResults ?? []).map((r) => ({
    type: 'tool_result',
    tool_use_id: r.toolCallId,
    content: typeof r.content === 'string' ? r.content : JSON.stringify({ error: r.content.error }),
  }));

  if (toolResultBlocks.length > 0) {
    out.push({ role: 'user', content: toolResultBlocks });
  }

  return out;
}

function buildBody(
  messages: ChatMessage[],
  modelId: string,
  config: ClaudeGenerationConfig | undefined,
  options: ChatOptions | undefined,
): ClaudeRequestBody {
  const max_tokens =
    typeof config?.maxOutputTokens === 'number'
      ? config.maxOutputTokens
      : DEFAULT_MAX_TOKENS;
  const body: ClaudeRequestBody = {
    model: modelId,
    max_tokens,
    messages: buildMessages(messages, options),
    stream: true,
    ...buildToolsField(options),
  };
  if (isThinkingCapable(modelId)) {
    body.thinking = { type: 'enabled', budget_tokens: THINKING_BUDGET_TOKENS };
  }

  const sysText = options?.systemInstruction;
  if (sysText && sysText.length > 0) {
    body.system = [
      { type: 'text', text: sysText, cache_control: { type: 'ephemeral' } },
    ];
  }

  if (typeof options?.temperature === 'number') {
    body.temperature = options.temperature;
  }

  return body;
}

export async function* chatStream(
  apiKey: string,
  messages: ChatMessage[],
  modelId: string,
  signal: AbortSignal,
  config?: ClaudeGenerationConfig,
  options?: ChatOptions,
): AsyncIterable<ChatChunk> {
  const url = `${BASE_URL}/v1/messages`;
  const idle = makeIdleTimer(signal, options?.idleTimeoutMs);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(buildBody(messages, modelId, config, options)),
      signal: idle.signal,
    });
  } catch (err) {
    idle.clear();
    const msg = err instanceof Error ? err.message : String(err);
    throw new ClaudeError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    const raw = await readErrorEnvelope(res);
    throw new ClaudeError(redactKey(raw, apiKey), res.status);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new ClaudeError('messages: empty body');
  }

  const pending = new Map<number, PendingBlock>();
  let observedFinishReason: 'stop' | 'tool-calls' | 'length' | 'error' | undefined;
  let yieldedAny = false;

  try {
    for await (const data of parseSseStream(reader)) {
      idle.bump();
      let parsed: { type?: string; index?: number; content_block?: { type?: string }; delta?: Record<string, unknown> };
      try { parsed = JSON.parse(data); } catch { continue; }

      const eventType = parsed.type;

      if (eventType === 'content_block_start') {
        const idx = parsed.index!;
        const cbType = parsed.content_block?.type as ContentBlockKind | undefined;
        if (cbType === 'text') {
          pending.set(idx, { kind: 'text' });
        } else if (cbType === 'tool_use') {
          const cb = parsed.content_block as { id?: string; name?: string } | undefined;
          pending.set(idx, {
            kind: 'tool_use',
            id: cb?.id ?? crypto.randomUUID(),
            name: cb?.name ?? '',
            argString: '',
          });
        } else if (cbType === 'thinking') {
          pending.set(idx, {
            kind: 'thinking',
            thinkingText: '',
            signature: '',
          });
        }
        continue;
      }

      if (eventType === 'content_block_delta') {
        const idx = parsed.index!;
        const dType = parsed.delta?.type as string | undefined;
        if (dType === 'text_delta') {
          const text = (parsed.delta!.text as string) ?? '';
          if (text.length > 0) {
            yieldedAny = true;
            yield { type: 'token', text };
          }
        } else if (dType === 'input_json_delta') {
          const block = pending.get(idx);
          if (block && block.kind === 'tool_use') {
            block.argString = (block.argString ?? '') + ((parsed.delta!.partial_json as string) ?? '');
          }
        } else if (dType === 'thinking_delta') {
          const text = (parsed.delta!.thinking as string) ?? '';
          const block = pending.get(idx);
          if (block && block.kind === 'thinking') {
            block.thinkingText = (block.thinkingText ?? '') + text;
          }
          if (text.length > 0) {
            yieldedAny = true;
            yield { type: 'reasoning', text };
          }
        } else if (dType === 'signature_delta') {
          const sig = (parsed.delta!.signature as string) ?? '';
          const block = pending.get(idx);
          if (block && block.kind === 'thinking') {
            block.signature = (block.signature ?? '') + sig;
          }
        }
        continue;
      }

      if (eventType === 'content_block_stop') {
        const idx = parsed.index!;
        const block = pending.get(idx);
        if (block && block.kind === 'tool_use') {
          let parsedArgs: unknown;
          try {
            parsedArgs = block.argString && block.argString.length > 0
              ? JSON.parse(block.argString)
              : {};
          } catch {
            parsedArgs = { _raw: block.argString };
          }
          yieldedAny = true;
          yield {
            type: 'tool-call',
            id: block.id!,
            name: decodeToolName(block.name ?? ''),
            arguments: parsedArgs,
          };
        } else if (block && block.kind === 'thinking') {
          yieldedAny = true;
          yield {
            type: 'reasoning',
            text: '',
            providerData: {
              type: 'thinking',
              thinking: block.thinkingText ?? '',
              signature: block.signature ?? '',
            },
          };
        }
        pending.delete(idx);
        continue;
      }

      if (eventType === 'message_delta') {
        const stopReason = (parsed.delta as { stop_reason?: string } | undefined)?.stop_reason;
        if (stopReason === 'end_turn') observedFinishReason = 'stop';
        else if (stopReason === 'tool_use') observedFinishReason = 'tool-calls';
        else if (stopReason === 'max_tokens') observedFinishReason = 'length';
        continue;
      }

      if (eventType === 'message_stop') {
        break;
      }
      // message_start and ping are intentionally ignored
    }
  } catch (err) {
    idle.clear();
    const msg = err instanceof Error ? err.message : String(err);
    throw new ClaudeError(redactKey(msg, apiKey));
  }

  idle.clear();

  if (!yieldedAny) {
    throw new ClaudeError('messages: empty stream');
  }

  yield { type: 'done', finishReason: observedFinishReason ?? 'stop' };
  // pending map will be used in later tasks for tool_use and thinking; suppress unused warning
  void pending;
}

export function claudeProvider(deps: ProviderDeps): AiProvider {
  return {
    id: 'claude',
    label: 'Claude',
    capabilities: { tools: true },
    chain: () => deps.getChain(),
    chat(messages, model, signal, options) {
      return chatStream(
        deps.getApiKey(), messages, model, signal,
        { maxOutputTokens: deps.getMaxOutputTokens() },
        options,
      );
    },
    isAuthFailure(err: unknown): boolean {
      return (
        err instanceof ClaudeError &&
        (err.status === 400 || err.status === 401 || err.status === 403)
      );
    },
    isReady() {
      return deps.getApiKey().length > 0
        ? true
        : 'claude: no API key configured. Open the Claude settings (palette: "AI Configuration..." → "Claude") to set one.';
    },
  };
}
