import { describe, it, expect } from 'vitest';
import { listTargets, saveTarget, deleteTarget, newTargetId, type BackupTarget } from './targets';
import type { DocumentHandle, DocumentMeta } from 'sh3-core';

function makeFakeHandle(): DocumentHandle & { _store: Map<string, string> } {
  const store = new Map<string, string>();
  const handle = {
    _store: store,
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
    autosave(): never { throw new Error('not used in tests'); },
    async dispose() {},
  };
  return handle as unknown as DocumentHandle & { _store: Map<string, string> };
}

const sample = (): Omit<BackupTarget, 'id' | 'createdAt'> => ({
  label: 'test',
  accountId: 'acc',
  bucket: 'b',
  region: 'auto',
  keyPrefix: 'p/',
  accessKeyId: 'AKID',
  secretAccessKey: 'secret',
});

describe('targets persistence', () => {
  it('saves and lists a target', async () => {
    const h = makeFakeHandle();
    const tgt: BackupTarget = { id: newTargetId(), createdAt: new Date().toISOString(), ...sample() };
    await saveTarget(h, tgt);
    const list = await listTargets(h);
    expect(list).toHaveLength(1);
    expect(list[0].label).toBe('test');
    expect(h._store.has(`/targets/${tgt.id}.json`)).toBe(true);
  });

  it('deletes a target', async () => {
    const h = makeFakeHandle();
    const tgt: BackupTarget = { id: newTargetId(), createdAt: new Date().toISOString(), ...sample() };
    await saveTarget(h, tgt);
    await deleteTarget(h, tgt.id);
    expect(await listTargets(h)).toEqual([]);
  });

  it('newTargetId produces stable prefix', () => {
    expect(newTargetId()).toMatch(/^tgt-[0-9a-f]{16}$/);
  });
});
