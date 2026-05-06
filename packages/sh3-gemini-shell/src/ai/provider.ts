/*
 * Provider abstraction for AI chat backends. Lives in `ai/` because it is
 * destined for sh3-ai when that shard is extracted; sh3-gemini-shell will
 * then become a contributor that registers a `geminiProvider` instance
 * against sh3-ai's contribution point.
 */

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
}
