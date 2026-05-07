/**
 * Persisted shape of a single conversation. Stored as JSON at
 * `conversations/{id}.json` via the shard's documents handle.
 *
 * Same layout as `ConversationState`'s in-memory form — persistence
 * is direct serialization. Do NOT diverge: the round-trip through
 * `serialize`/`parse` is the canonical contract.
 */
export interface ConversationDocument {
  /** UUID generated at creation time. Same as the file basename. */
  id: string;
  /** Schema version. Bump and add migration when shape changes. */
  version: 1;
  /** Display title. Empty string until the title strategy fires. */
  title: string;
  /** Epoch ms; immutable after create. */
  createdAt: number;
  /** Epoch ms; updated on every persisted mutation. */
  updatedAt: number;
  /** Snapshot of the active provider id at last turn. */
  providerId: string | null;
  /** Locked-in model id at last turn (or null if unlocked). */
  model: string | null;
  messages: PersistedMessage[];
  toolCalls: PersistedToolCall[];
  toolResults: PersistedToolResult[];
}

export type PersistedMessage =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string; model: string };

export interface PersistedToolCall {
  messageIndex: number;
  callId: string;
  name: string;
  arguments: unknown;
}

export interface PersistedToolResult {
  messageIndex: number;
  callId: string;
  content: string | { error: string };
}

/** Lightweight projection used by the browser view + ai:list verb. */
export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  providerId: string | null;
  model: string | null;
  messageCount: number;
}
