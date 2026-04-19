import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appendPending, listPending, removePending } from './pending.js';

describe('pending queue', () => {
  let dir: string;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'sh3-sync-p-')); });

  it('is empty when nothing appended', async () => {
    expect(await listPending(dir, 'alice')).toEqual([]);
  });

  it('appends and lists', async () => {
    await appendPending(dir, 'alice', {
      shardId: 'notes', path: 'a.txt', content: 'x', expectedLocalVersion: 0, origin: 'vps',
    });
    const list = await listPending(dir, 'alice');
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ shardId: 'notes', path: 'a.txt', content: 'x' });
  });

  it('lists multiple entries across shards and nested paths', async () => {
    await appendPending(dir, 'alice', {
      shardId: 'notes', path: 'a.txt', content: 'x', expectedLocalVersion: 0, origin: 'vps',
    });
    await appendPending(dir, 'alice', {
      shardId: 'notes', path: 'sub/b.txt', content: 'y', expectedLocalVersion: 0, origin: 'vps',
    });
    await appendPending(dir, 'alice', {
      shardId: 'editor', path: 'c.md', content: 'z', expectedLocalVersion: 0, origin: 'vps',
    });
    const list = await listPending(dir, 'alice');
    expect(list).toHaveLength(3);
  });

  it('remove deletes the file', async () => {
    await appendPending(dir, 'alice', {
      shardId: 'notes', path: 'a.txt', content: 'x', expectedLocalVersion: 0, origin: 'vps',
    });
    await removePending(dir, 'alice', 'notes', 'a.txt');
    expect(await listPending(dir, 'alice')).toEqual([]);
  });

  it('remove on missing file is a no-op', async () => {
    await removePending(dir, 'alice', 'notes', 'missing.txt');
    expect(await listPending(dir, 'alice')).toEqual([]);
  });
});
