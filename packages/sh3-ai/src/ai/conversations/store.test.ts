import { describe, it, expect, vi } from 'vitest';
import type {
  DocumentHandle,
  DocumentMeta,
  DocumentChange,
  AutosaveController,
} from 'sh3-core';
import { ConversationStore } from './store';
import type { ConversationDocument } from './types';
import { serializeConversation } from './serialize';

/** Minimal in-memory fake DocumentHandle covering the surface ConversationStore uses. */
function fakeHandle() {
  const docs = new Map<string, string>();
  const watchers = new Set<(c: DocumentChange) => void>();
  const fireWatch = (type: DocumentChange['type'], path: string, oldPath?: string) => {
    for (const w of watchers) {
      w({ type, path, oldPath, tenantId: 't', shardId: 'ai' });
    }
  };
  const handle: Pick<
    DocumentHandle,
    'list' | 'read' | 'write' | 'delete' | 'rename' | 'exists' | 'watch' | 'autosave'
  > & { _docs: Map<string, string> } = {
    _docs: docs,
    async list(): Promise<DocumentMeta[]> {
      return [...docs.entries()].map(([path, content]) => ({
        path, size: content.length, lastModified: 0,
      }));
    },
    async read(path: string) {
      return docs.has(path) ? (docs.get(path) ?? null) : null;
    },
    async write(path: string, content: string) {
      const had = docs.has(path);
      docs.set(path, content);
      fireWatch(had ? 'update' : 'create', path);
    },
    async delete(path: string) {
      if (docs.delete(path)) fireWatch('delete', path);
    },
    async rename(oldPath: string, newPath: string) {
      const c = docs.get(oldPath);
      if (c === undefined) throw new Error('missing');
      docs.delete(oldPath);
      docs.set(newPath, c);
      fireWatch('rename', newPath, oldPath);
    },
    async exists(path: string) {
      return docs.has(path);
    },
    watch(cb) {
      watchers.add(cb);
      return () => watchers.delete(cb);
    },
    autosave(path: string): AutosaveController {
      // Synchronous mock: every update writes through immediately.
      const controller = {
        dirty: false,
        update(content: string) {
          handle.write(path, content);
        },
        async flush() {},
        async dispose() {},
      };
      return controller;
    },
  };
  return handle;
}

describe('ConversationStore', () => {
  it('list() returns summaries sorted by updatedAt desc', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    handle._docs.set('conversations/a.json', serializeConversation({
      id: 'a', version: 1, title: 'old', createdAt: 0, updatedAt: 100,
      providerId: null, model: null, messages: [], toolCalls: [], toolResults: [],
    }));
    handle._docs.set('conversations/b.json', serializeConversation({
      id: 'b', version: 1, title: 'new', createdAt: 0, updatedAt: 500,
      providerId: 'gemini', model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'q' }], toolCalls: [], toolResults: [],
    }));
    const list = await store.list();
    expect(list.map((s) => s.id)).toEqual(['b', 'a']);
    expect(list[0]).toMatchObject({ title: 'new', providerId: 'gemini', messageCount: 1 });
  });

  it('list() skips entries that fail to parse', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    handle._docs.set('conversations/bad.json', '{not json');
    handle._docs.set('conversations/good.json', serializeConversation({
      id: 'good', version: 1, title: 't', createdAt: 0, updatedAt: 0,
      providerId: null, model: null, messages: [], toolCalls: [], toolResults: [],
    }));
    const list = await store.list();
    expect(list.map((s) => s.id)).toEqual(['good']);
  });

  it('list() ignores files outside conversations/ namespace', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    handle._docs.set('other/file.json', '{}');
    expect(await store.list()).toEqual([]);
  });

  it('load() returns the document', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const doc: ConversationDocument = {
      id: 'x', version: 1, title: 't', createdAt: 0, updatedAt: 0,
      providerId: null, model: null, messages: [], toolCalls: [], toolResults: [],
    };
    handle._docs.set('conversations/x.json', serializeConversation(doc));
    expect(await store.load('x')).toEqual(doc);
  });

  it('load() returns null when missing', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    expect(await store.load('missing')).toBeNull();
  });

  it('create() generates a UUID and writes a doc with defaults', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const doc = await store.create();
    expect(doc.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(doc.version).toBe(1);
    expect(doc.title).toBe('');
    expect(doc.messages).toEqual([]);
    expect(handle._docs.has(`conversations/${doc.id}.json`)).toBe(true);
  });

  it('create(seed) merges seed into defaults', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const doc = await store.create({ providerId: 'gemini', model: 'gemini-2.5-flash', title: 'x' });
    expect(doc.title).toBe('x');
    expect(doc.providerId).toBe('gemini');
    expect(doc.model).toBe('gemini-2.5-flash');
  });

  it('delete() removes the doc', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const doc = await store.create();
    await store.delete(doc.id);
    expect(handle._docs.has(`conversations/${doc.id}.json`)).toBe(false);
  });

  it('rename() updates title + bumps updatedAt; doc id unchanged', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const doc = await store.create({ title: 'old' });
    const before = doc.updatedAt;
    await new Promise(r => setTimeout(r, 5));
    await store.rename(doc.id, 'new');
    const reloaded = await store.load(doc.id);
    expect(reloaded?.title).toBe('new');
    expect(reloaded!.updatedAt).toBeGreaterThanOrEqual(before);
  });

  it('autosave() returns a controller that writes to the conversation path', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const doc = await store.create();
    const ctrl = store.autosave(doc.id);
    ctrl.update(serializeConversation({ ...doc, title: 'updated' }));
    const reloaded = await store.load(doc.id);
    expect(reloaded?.title).toBe('updated');
  });

  it('watch() forwards DocumentChange events from the handle', async () => {
    const handle = fakeHandle();
    const store = new ConversationStore(handle as unknown as DocumentHandle);
    const cb = vi.fn();
    const off = store.watch(cb);
    await store.create();
    expect(cb).toHaveBeenCalled();
    off();
  });
});
