import { describe, it, expect, vi } from 'vitest';
import { upload } from './upload';
import type { R2Client } from './r2/client';
import type { BackupTarget } from './targets';
import type { DocumentHandle } from 'sh3-core';
import { sha256Hex } from './r2/hash';

const target: BackupTarget = {
  id: 'tgt-1',
  label: 'test',
  accountId: 'acc',
  bucket: 'b',
  region: 'auto',
  keyPrefix: 'pfx/',
  accessKeyId: 'AKID',
  secretAccessKey: 'secret',
  createdAt: '2026-04-20T00:00:00Z',
};

function fakeLogHandle(): DocumentHandle {
  const store = new Map<string, string>();
  return {
    async list() { return Array.from(store.keys()).map((p) => ({ path: p, size: store.get(p)!.length, lastModified: 0 })); },
    async read(p: string) { return store.get(p) ?? null; },
    async write(p: string, c: string) { store.set(p, c); },
    async delete(p: string) { store.delete(p); },
    async exists(p: string) { return store.has(p); },
    async status() { return null; },
    async resolveConflict() {},
    watch() { return () => {}; },
    autosave(): never { throw new Error('unused'); },
    async dispose() {},
  } as unknown as DocumentHandle;
}

function fakeClient(over: Partial<R2Client> = {}): R2Client {
  return {
    headBucket: async () => {},
    putObject: async () => ({ etag: '"e"' }),
    headObject: async () => null,
    listObjectsV2: () => ({ [Symbol.asyncIterator]: async function* () {} }),
    getObject: async () => '',
    ...over,
  };
}

describe('upload primitive', () => {
  it('uploads when no remote match', async () => {
    const put = vi.fn().mockResolvedValue({ etag: '"e"' });
    const client = fakeClient({ putObject: put });
    const logH = fakeLogHandle();
    const res = await upload({
      target,
      client,
      logHandle: logH,
      readForeign: async () => 'hello',
      shardId: 'notes',
      path: 'a.md',
    });
    expect(res.status).toBe('uploaded');
    expect(put).toHaveBeenCalledOnce();
    expect(res.entry).toMatchObject({ status: 'uploaded', shardId: 'notes', path: 'a.md' });
    expect(res.entry?.sha256).toBeTruthy();
  });

  it('skips when remote sha256 matches', async () => {
    const hash = await sha256Hex('same');
    const put = vi.fn();
    const client = fakeClient({
      headObject: async () => ({ size: 4, sha256: hash, etag: '"x"' }),
      putObject: put,
    });
    const res = await upload({
      target,
      client,
      logHandle: fakeLogHandle(),
      readForeign: async () => 'same',
      shardId: 'notes',
      path: 'a.md',
    });
    expect(res.status).toBe('skipped-unchanged');
    expect(put).not.toHaveBeenCalled();
  });

  it('fails gracefully on reader returning null', async () => {
    const res = await upload({
      target,
      client: fakeClient(),
      logHandle: fakeLogHandle(),
      readForeign: async () => null,
      shardId: 'notes',
      path: 'gone.md',
    });
    expect(res.status).toBe('failed');
    expect(res.reason).toMatch(/not found/i);
  });
});
