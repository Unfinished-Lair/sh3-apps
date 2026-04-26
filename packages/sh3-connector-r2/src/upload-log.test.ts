import { describe, it, expect } from 'vitest';
import { appendLog, listRecentLog, listAllSuccessfulLog, type UploadLogEntry } from './upload-log';
import type { DocumentHandle, DocumentMeta } from 'sh3-core';

function makeFakeHandle(): DocumentHandle {
  const store = new Map<string, string>();
  return {
    async list(): Promise<DocumentMeta[]> {
      return Array.from(store.keys()).map((path) => ({ path, size: store.get(path)!.length, lastModified: 0 }));
    },
    async read(path: string) { return store.get(path) ?? null; },
    async write(path: string, content: string) { store.set(path, content); },
    async delete(path: string) { store.delete(path); },
    async exists(path: string) { return store.has(path); },
    async status() { return null; },
    async resolveConflict() {},
    watch() { return () => {}; },
    autosave(): never { throw new Error('not used'); },
    async dispose() {},
  } as unknown as DocumentHandle;
}

const entry = (overrides: Partial<UploadLogEntry> = {}): UploadLogEntry => ({
  id: '01-aaaa',
  targetId: 'tgt-1',
  shardId: 'notes',
  path: 'a.md',
  sha256: 'c0ffee',
  size: 5,
  status: 'uploaded',
  at: '2026-04-20T00:00:00Z',
  ...overrides,
});

describe('upload log', () => {
  it('appends an entry under /uploads/YYYY-MM/', async () => {
    const h = makeFakeHandle();
    await appendLog(h, entry());
    const metas = await h.list();
    expect(metas.some((m) => m.path.startsWith('uploads/2026-04/') && m.path.endsWith('.json'))).toBe(true);
  });

  it('writes filenames without colons (Windows-safe)', async () => {
    const h = makeFakeHandle();
    await appendLog(h, entry({ at: '2026-04-26T00:11:01.019Z' }));
    const metas = await h.list();
    const stored = metas.find((m) => m.path.startsWith('uploads/'))!;
    expect(stored.path).not.toContain(':');
    expect(stored.path).toMatch(/2026-04-26T00-11-01\.019Z/);
  });

  it('listRecentLog returns entries newest-first', async () => {
    const h = makeFakeHandle();
    await appendLog(h, entry({ id: 'a', at: '2026-04-20T00:00:01Z' }));
    await appendLog(h, entry({ id: 'b', at: '2026-04-20T00:00:02Z' }));
    const list = await listRecentLog(h, 10);
    expect(list.map((e) => e.id)).toEqual(['b', 'a']);
  });

  it('merges across the two latest months', async () => {
    const h = makeFakeHandle();
    await appendLog(h, entry({ id: 'old', at: '2026-03-31T23:59:59Z' }));
    await appendLog(h, entry({ id: 'new', at: '2026-04-01T00:00:00Z' }));
    const list = await listRecentLog(h, 10);
    expect(list.map((e) => e.id)).toEqual(['new', 'old']);
  });

  it('listAllSuccessfulLog returns every uploaded entry across all months', async () => {
    const h = makeFakeHandle();
    await appendLog(h, entry({ id: 'jan', path: 'a.md', at: '2026-01-01T00:00:00Z' }));
    await appendLog(h, entry({ id: 'apr-ok', path: 'b.md', at: '2026-04-01T00:00:00Z' }));
    await appendLog(h, entry({ id: 'apr-fail', path: 'c.md', status: 'failed', at: '2026-04-02T00:00:00Z' }));
    await appendLog(h, entry({ id: 'apr-skip', path: 'd.md', status: 'skipped-unchanged', at: '2026-04-02T00:00:00Z' }));
    const all = await listAllSuccessfulLog(h);
    expect(all.map((e) => e.id).sort()).toEqual(['apr-ok', 'jan']);
  });

  it('listAllSuccessfulLog returns empty when no uploads have been logged', async () => {
    const h = makeFakeHandle();
    expect(await listAllSuccessfulLog(h)).toEqual([]);
  });
});
