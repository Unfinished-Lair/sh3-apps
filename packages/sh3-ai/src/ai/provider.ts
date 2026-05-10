/*
 * Abstract AI provider contract for the sh3-ai shard. Concrete providers
 * (e.g. sh3-llm-providers) register `AiProvider` instances against
 * `SH3_AI_PROVIDER_CONTRIBUTION` via `ctx.contributions.register(...)`.
 */

import type { ToolSpec, ToolResult } from './catalog/types';

export const SH3_AI_PROVIDER_CONTRIBUTION = 'sh3-ai.provider';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatChunk =
  | { type: 'token'; text: string }
  | { type: 'reasoning'; text: string }
  | { type: 'tool-call'; id: string; name: string; arguments: unknown }
  | {
      type: 'done';
      // Optional to preserve compatibility with providers that haven't yet
      // adopted the tool-call surface; absent → treat as 'stop'.
      finishReason?: 'stop' | 'tool-calls' | 'length' | 'error';
    };

/** Spec of a single tool call the dispatcher just produced. Mirrors the
 *  shape carried in `ChatChunk` `tool-call` events. Passed to `chat()`
 *  alongside `toolResults` so OpenAI-style providers can rebuild the
 *  required `tool_calls` field on the preceding assistant turn. */
export interface ToolCallSpec {
  id: string;
  name: string;
  arguments: unknown;
}

export interface ChatOptions {
  tools?: ToolSpec[];
  /** Tool calls produced by the prior round (1:1 with `toolResults`).
   *  Providers that need explicit assistant→tool linking (DeepSeek, OpenAI,
   *  Anthropic) use this to reconstruct that turn. Providers that don't
   *  (Gemini, which uses `functionCall`/`functionResponse` parts) may ignore. */
  toolCalls?: ToolCallSpec[];
  toolResults?: ToolResult[];
  /** Chain-of-thought emitted by the prior round on reasoning models that
   *  require it to be echoed back (DeepSeek `deepseek-reasoner`: the
   *  `reasoning_content` field). Provider attaches it to the assistant turn
   *  carrying `toolCalls`; ignored on non-reasoning models. */
  reasoningContent?: string;
  /** User's system instruction. Shared across all providers. Each provider
   *  injects it into its native wire shape (Gemini: `systemInstruction.parts`;
   *  OpenAI-compat: prepended `role:'system'` message). Empty/undefined → no
   *  system message is sent. Owned by sh3-ai's user state and forwarded by
   *  the dispatcher on every `chat()` call. */
  systemInstruction?: string;
  /** Idle timeout in milliseconds for streaming requests: abort if no
   *  chunk (token, reasoning, or tool-call) arrives within this window.
   *  The provider re-arms the timer on every emitted chunk, so a model
   *  that thinks for a long time but produces output in bursts will not
   *  trip it. `0` or `undefined` disables the internal watchdog — the
   *  external `signal` remains the only way to cancel. */
  idleTimeoutMs?: number;
  /** Sampling temperature, shared across providers. `null` / `undefined`
   *  → omit from the wire request and let the API apply its default. The
   *  provider is responsible for translating into its native field
   *  (Gemini: `generationConfig.temperature`; OpenAI-compat: `temperature`).
   *  Owned by sh3-ai's user state so a single setting applies regardless
   *  of which provider is active. */
  temperature?: number | null;
}

export interface AiProvider {
  /** Stable id, e.g. 'gemini'. */
  id: string;
  /** Display label for picker/badges. */
  label: string;
  /** Live read of the user's preferred model order (highest priority first). */
  chain(): string[];
  /** Capability flags. Absent or `tools: false` means the dispatcher will
   *  not pass `tools`; the provider is treated as text-only. Additive in
   *  future minor revisions of this contract. */
  capabilities?: { tools?: boolean };
  /** Stream chat tokens (and tool-call chunks, when `options.tools` is set
   *  and the provider supports them) for the given messages against the
   *  given model. Existing 4-argument calls remain valid; the 5th arg is
   *  optional and defaults to no tools. */
  chat(
    messages: ChatMessage[],
    model: string,
    signal: AbortSignal,
    options?: ChatOptions,
  ): AsyncIterable<ChatChunk>;
  /** Provider-specific classification of auth failures. */
  isAuthFailure(err: unknown): boolean;
  /** Readiness signal. */
  isReady(): true | string;
}

export type { ToolSpec, ToolResult };
