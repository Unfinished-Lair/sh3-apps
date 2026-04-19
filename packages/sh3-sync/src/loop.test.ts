import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runLoopOnce } from './loop.js';
import { appendPending, listPending } from './pending.js';

function makeCursor(initial = 0) {
  let v = initial;
  return {
    get: async () => v,
    set: async (n: number) => { v = n; },
    peek: () => v,
  };
}

describe('runLoopOnce', () => {
  let dir: string;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'sh3-sync-l-')); });

  it('drains pending, calls pull, and updates cursor to returned tick', async () => {
    await appendPending(dir, 'alice', {
      shardId: 'notes', path: 'a.txt', content: 'x', expectedLocalVersion: 0, origin: 'vps',
    });
    const push = vi.fn().mockResolvedValue([{ applied: true, version: 1 }]);
    const pull = vi.fn().mockResolvedValue({ tick: 5, changes: [] });
    const applyChange = vi.fn();
    const cursor = makeCursor(0);

    await runLoopOnce({
      dataDir: dir, tenant: 'alice',
      primaryUrl: 'u', apiKey: 'k',
      push, pull, applyChange, cursor,
    });

    expect(push).toHaveBeenCalledWith('u', 'k', 'alice', expect.arrayContaining([
      expect.objectContaining({ shardId: 'notes', path: 'a.txt' }),
    ]));
    expect(pull).toHaveBeenCalledWith('u', 'k', 'alice', 0);
    expect(await listPending(dir, 'alice')).toEqual([]);
    expect(cursor.peek()).toBe(5);
  });

  it('applies pulled changes and advances cursor', async () => {
    const apply = vi.fn();
    const pull = vi.fn().mockResolvedValue({
      tick: 9,
      changes: [
        { shardId: 'notes', path: 'x', content: 'remote', version: 2, metadata: { syncMode: 'sync' } },
      ],
    });
    const cursor = makeCursor(0);

    await runLoopOnce({
      dataDir: dir, tenant: 'alice',
      primaryUrl: 'u', apiKey: 'k',
      push: vi.fn(), pull, applyChange: apply, cursor,
    });

    expect(apply).toHaveBeenCalledWith(expect.objectContaining({
      shardId: 'notes', path: 'x', content: 'remote', version: 2,
    }));
    expect(cursor.peek()).toBe(9);
  });

  it('keeps pending entries when push returns applied:false', async () => {
    await appendPending(dir, 'alice', {
      shardId: 'notes', path: 'c.txt', content: 'x', expectedLocalVersion: 0, origin: 'vps',
    });
    const push = vi.fn().mockResolvedValue([{ applied: false, reason: 'stale' }]);
    const pull = vi.fn().mockResolvedValue({ tick: 1, changes: [] });

    await runLoopOnce({
      dataDir: dir, tenant: 'alice',
      primaryUrl: 'u', apiKey: 'k',
      push, pull, applyChange: vi.fn(), cursor: makeCursor(0),
    });

    const remaining = await listPending(dir, 'alice');
    expect(remaining).toHaveLength(1);
  });

  it('skips push phase when nothing pending', async () => {
    const push = vi.fn();
    const pull = vi.fn().mockResolvedValue({ tick: 0, changes: [] });

    await runLoopOnce({
      dataDir: dir, tenant: 'alice',
      primaryUrl: 'u', apiKey: 'k',
      push, pull, applyChange: vi.fn(), cursor: makeCursor(0),
    });

    expect(push).not.toHaveBeenCalled();
    expect(pull).toHaveBeenCalled();
  });
});
