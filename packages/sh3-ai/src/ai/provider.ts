/*
 * Abstract AI provider contract for the sh3-ai shard. Concrete providers
 * (e.g. sh3-gemini-shell) register `AiProvider` instances against
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
  | { type: 'tool-call'; id: string; name: string; arguments: unknown }
  | {
      type: 'done';
      // Optional to preserve compatibility with providers that haven't yet
      // adopted the tool-call surface; absent → treat as 'stop'.
      finishReason?: 'stop' | 'tool-calls' | 'length' | 'error';
    };

export interface ChatOptions {
  tools?: ToolSpec[];
  toolResults?: ToolResult[];
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
