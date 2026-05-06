/*
 * Abstract AI provider contract for the sh3-ai shard. Concrete providers
 * (e.g. sh3-gemini-shell) register `AiProvider` instances against
 * `SH3_AI_PROVIDER_CONTRIBUTION` via `ctx.contributions.register(...)`.
 */

export const SH3_AI_PROVIDER_CONTRIBUTION = 'sh3-ai.provider';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatChunk =
  | { type: 'token'; text: string }
  | { type: 'done' };

export interface AiProvider {
  /** Stable id, e.g. 'gemini'. */
  id: string;
  /** Display label for picker/badges. */
  label: string;
  /** Live read of the user's preferred model order (highest priority first). */
  chain(): string[];
  /** Stream chat tokens for the given messages against the given model. */
  chat(
    messages: ChatMessage[],
    model: string,
    signal: AbortSignal,
  ): AsyncIterable<ChatChunk>;
  /** Provider-specific classification of auth failures (so the dispatcher
   *  can break out of the model-chain fallback loop without retrying). */
  isAuthFailure(err: unknown): boolean;
  /** Readiness signal. `true` = ready to dispatch; a string = user-facing
   *  not-ready reason (e.g. "gemini: no API key configured"). */
  isReady(): true | string;
}
