import type { DocumentHandle, DocumentChange, AutosaveController } from 'sh3-core';
import type { ConversationDocument, ConversationSummary } from './types';
import { serializeConversation, parseConversation } from './serialize';

const DIR = 'conversations/';

/** Wrapper over a per-shard DocumentHandle that provides typed CRUD,
 *  list-as-summaries, and autosave controllers for the dispatch loop. */
export class ConversationStore {
  constructor(private readonly handle: DocumentHandle) {}

  /**
   * Build the scope-rooted path for a conversation document. sh3-core 0.26
   * requires every path passed to the handle to be `<boundId>/<rest>`; we
   * resolve `boundId` lazily so it follows the handle as it rotates between
   * shard-standalone and app-bound modes.
   */
  private path(id: string): string {
    return `${this.handle.boundId}/${DIR}${id}.json`;
  }

  /** List summaries sorted by `updatedAt` desc. Files that fail to parse
   *  are skipped (logged via console.warn). */
  async list(): Promise<ConversationSummary[]> {
    const metas = await this.handle.list();
    const prefix = `${this.handle.boundId}/${DIR}`;
    const summaries: ConversationSummary[] = [];
    for (const meta of metas) {
      if (!meta.path.startsWith(prefix)) continue;
      const content = await this.handle.readText(meta.path);
      if (content === null) continue;
      try {
        const doc = parseConversation(content);
        summaries.push({
          id: doc.id,
          title: doc.title,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          providerId: doc.providerId,
          model: doc.model,
          messageCount: doc.messages.length,
        });
      } catch (err) {
        console.warn(`sh3-ai: skipping malformed conversation ${meta.path}: ${(err as Error).message}`);
      }
    }
    summaries.sort((a, b) => b.updatedAt - a.updatedAt);
    return summaries;
  }

  async load(id: string): Promise<ConversationDocument | null> {
    const content = await this.handle.readText(this.path(id));
    if (content === null) return null;
    return parseConversation(content);
  }

  async create(seed: Partial<ConversationDocument> = {}): Promise<ConversationDocument> {
    const id = seed.id ?? crypto.randomUUID();
    const now = Date.now();
    const doc: ConversationDocument = {
      id,
      version: 1,
      title: seed.title ?? '',
      createdAt: seed.createdAt ?? now,
      updatedAt: seed.updatedAt ?? now,
      providerId: seed.providerId ?? null,
      model: seed.model ?? null,
      messages: seed.messages ?? [],
      toolCalls: seed.toolCalls ?? [],
      toolResults: seed.toolResults ?? [],
    };
    await this.handle.writeText(this.path(id), serializeConversation(doc));
    return doc;
  }

  async delete(id: string): Promise<void> {
    await this.handle.delete(this.path(id));
  }

  async rename(id: string, newTitle: string): Promise<void> {
    const doc = await this.load(id);
    if (!doc) throw new Error(`conversation ${id} not found`);
    doc.title = newTitle;
    doc.updatedAt = Date.now();
    await this.handle.writeText(this.path(id), serializeConversation(doc));
  }

  /** Returns an autosave controller bound to the conversation's path.
   *  Caller (ConversationState) feeds it serialized JSON; the handle
   *  debounces the write. */
  autosave(id: string): AutosaveController {
    return this.handle.autosave(this.path(id), { debounceMs: 500 });
  }

  /** Subscribe to handle change events. The callback fires for every
   *  document mutation in the shard's namespace, not only conversations. */
  watch(cb: (change: DocumentChange) => void): () => void {
    return this.handle.watch(cb);
  }
}
