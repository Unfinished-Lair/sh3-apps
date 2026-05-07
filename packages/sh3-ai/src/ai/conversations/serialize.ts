import type { ConversationDocument } from './types';

/** Serialize a conversation document to JSON. Stable key order so equal
 *  documents stringify identically (useful for autosave dedup). */
export function serializeConversation(doc: ConversationDocument): string {
  // JSON.stringify preserves insertion order; we reconstruct the object
  // with a fixed key order to keep the output deterministic.
  const ordered = {
    id: doc.id,
    version: doc.version,
    title: doc.title,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    providerId: doc.providerId,
    model: doc.model,
    messages: doc.messages,
    toolCalls: doc.toolCalls,
    toolResults: doc.toolResults,
  };
  return JSON.stringify(ordered, null, 2);
}

/** Parse a conversation document. Throws on malformed JSON, wrong
 *  version, or missing required fields. */
export function parseConversation(json: string): ConversationDocument {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (err) {
    throw new Error(`failed to parse conversation: ${(err as Error).message}`);
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('conversation payload must be an object');
  }
  const r = raw as Record<string, unknown>;
  if (r.version !== 1) {
    throw new Error(`unsupported conversation version: ${String(r.version)}`);
  }
  if (typeof r.id !== 'string' || r.id.length === 0) {
    throw new Error('conversation: missing or invalid id');
  }
  return {
    id: r.id,
    version: 1,
    title: typeof r.title === 'string' ? r.title : '',
    createdAt: typeof r.createdAt === 'number' ? r.createdAt : 0,
    updatedAt: typeof r.updatedAt === 'number' ? r.updatedAt : 0,
    providerId: typeof r.providerId === 'string' ? r.providerId : null,
    model: typeof r.model === 'string' ? r.model : null,
    messages: Array.isArray(r.messages) ? (r.messages as ConversationDocument['messages']) : [],
    toolCalls: Array.isArray(r.toolCalls) ? (r.toolCalls as ConversationDocument['toolCalls']) : [],
    toolResults: Array.isArray(r.toolResults) ? (r.toolResults as ConversationDocument['toolResults']) : [],
  };
}
