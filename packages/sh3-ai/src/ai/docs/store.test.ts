import { describe, it, expect } from 'vitest';
import type { DocumentHandle, DocumentMeta } from 'sh3-core';
import { DocsStore } from './store';

const BOUND = 'ai';
const ROOT = `${BOUND}/docs/`;

function fakeHandle() {
  const docs = new Map<string, string>();
  const handle: Pick<DocumentHandle, 'boundId' | 'grants' | 'list' | 'readText' | 'writeText' | 'delete'> & {
    _docs: Map<string, string>;
  } = {
    _docs: docs,
    boundId: BOUND,
    grants: { browse: false, write: false },
    async list(): Promise<DocumentMeta[]> {
      return [...docs.entries()].map(([path, content]) => ({
        path,
        size: content.length,
        lastModified: 0,
      }));
    },
    async readText(path: string) {
      return docs.has(path) ? (docs.get(path) ?? null) : null;
    },
    async writeText(path: string, content: string) {
      docs.set(path, content);
    },
    async delete(path: string) {
      docs.delete(path);
    },
  };
  return handle;
}

describe('DocsStore.list', () => {
  it('returns docs grouped by provider, sorted by lastModified desc', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}gemini/a.md`, 'a');
    handle._docs.set(`${ROOT}deepseek/b.md`, 'b');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    const list = await store.list();
    expect(list).toHaveLength(2);
    expect(list.map((d) => d.path).sort()).toEqual(['deepseek/b.md', 'gemini/a.md']);
    expect(list.find((d) => d.providerId === 'gemini')?.path).toBe('gemini/a.md');
  });

  it('filters out non-docs/ entries (e.g. conversations)', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}gemini/a.md`, 'a');
    handle._docs.set(`${BOUND}/conversations/x.json`, '{}');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    expect(await store.list()).toHaveLength(1);
  });

  it('skips orphan files directly under docs/ with no provider folder', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}orphan.md`, 'no provider');
    handle._docs.set(`${ROOT}gemini/a.md`, 'a');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    const list = await store.list();
    expect(list.map((d) => d.path)).toEqual(['gemini/a.md']);
  });

  it('filters by provider when given', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}gemini/a.md`, 'a');
    handle._docs.set(`${ROOT}deepseek/b.md`, 'b');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    const list = await store.list('gemini');
    expect(list.map((d) => d.path)).toEqual(['gemini/a.md']);
  });
});

describe('DocsStore.read', () => {
  it('reads by absolute path under docs/', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}gemini/a.md`, 'hello');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    expect(await store.read('gemini/a.md')).toBe('hello');
  });

  it('returns null for missing paths', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    expect(await store.read('gemini/missing.md')).toBeNull();
  });

  it('rejects paths missing a provider segment', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.read('orphan.md')).rejects.toThrow(/provider segment/);
  });

  it('rejects traversal segments', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.read('gemini/../conversations/x.json')).rejects.toThrow(/illegal segment/);
  });

  it('rejects leading slash', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.read('/gemini/a.md')).rejects.toThrow(/must not start with/);
  });
});

describe('DocsStore.write', () => {
  it('composes <boundId>/docs/<provider>/<rel>', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await store.write('gemini', 'notes.md', 'hi');
    expect(handle._docs.get(`${ROOT}gemini/notes.md`)).toBe('hi');
  });

  it('allows subdirectories', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await store.write('gemini', 'memo/2026.md', 'x');
    expect(handle._docs.get(`${ROOT}gemini/memo/2026.md`)).toBe('x');
  });

  it('rejects empty rel path', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.write('gemini', '', 'x')).rejects.toThrow(/empty/);
  });

  it('rejects traversal via ..', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.write('gemini', '../deepseek/a.md', 'x')).rejects.toThrow(/illegal segment/);
  });

  it('rejects leading slash', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.write('gemini', '/notes.md', 'x')).rejects.toThrow(/must not start with/);
  });

  it('rejects providers containing a slash', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.write('gemini/sub', 'a.md', 'x')).rejects.toThrow(/illegal characters/);
  });

  it('rejects empty provider', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.write('', 'a.md', 'x')).rejects.toThrow(/empty/);
  });
});

describe('DocsStore.delete', () => {
  it('deletes within own provider folder', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}gemini/a.md`, 'x');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await store.delete('gemini', 'gemini/a.md');
    expect(handle._docs.has(`${ROOT}gemini/a.md`)).toBe(false);
  });

  it('refuses cross-provider delete', async () => {
    const handle = fakeHandle();
    handle._docs.set(`${ROOT}deepseek/b.md`, 'x');
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.delete('gemini', 'deepseek/b.md')).rejects.toThrow(
      /outside provider folder/,
    );
    expect(handle._docs.has(`${ROOT}deepseek/b.md`)).toBe(true);
  });

  it('rejects paths missing provider segment', async () => {
    const handle = fakeHandle();
    const store = new DocsStore(handle as unknown as DocumentHandle);
    await expect(store.delete('gemini', 'orphan.md')).rejects.toThrow(/provider segment/);
  });
});
