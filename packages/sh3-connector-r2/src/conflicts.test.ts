import { describe, it, expect, vi } from 'vitest';
import { ConflictSessionOrphanedError, type ConflictsApi } from 'sh3-core';
import { presentImportConflicts, type ImportConflictInput } from './conflicts';

function fakeConflictsApi(over: Partial<ConflictsApi> = {}): ConflictsApi {
  return {
    resolve: vi.fn(async () => ({ status: 'resolved', choices: [], skipped: [] })),
    resolveDocuments: vi.fn(async () => ({ status: 'resolved', resolved: [], failed: [], skipped: [] })),
    ...over,
  };
}

describe('presentImportConflicts', () => {
  it('returns [] and does not call resolve when input is empty', async () => {
    const api = fakeConflictsApi();
    const result = await presentImportConflicts(api, []);
    expect(result).toEqual([]);
    expect(api.resolve).not.toHaveBeenCalled();
  });
});

describe('presentImportConflicts — item construction', () => {
  it('passes a ConflictItem per input with correct id, label, extension, branches, meta', async () => {
    const resolve = vi.fn(async () => ({ status: 'resolved' as const, choices: [], skipped: [] }));
    const api = fakeConflictsApi({ resolve });
    const inputs: ImportConflictInput[] = [
      {
        shardId: 'notes',
        path: 'a/b.md',
        localContent: 'local-a',
        localVersion: 3,
        localAt: 1700000000000,
        incomingContent: 'remote-a',
        incomingAt: 1700000111111,
        targetLabel: 'backup-prod',
        remoteKey: 'pfx/notes/a/b.md',
      },
    ];

    await presentImportConflicts(api, inputs);

    expect(resolve).toHaveBeenCalledOnce();
    const [items, opts] = resolve.mock.calls[0];
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: 'notes/a/b.md',
      label: 'notes/a/b.md',
      extension: '.md',
      branches: [
        { origin: 'local', version: 3, at: 1700000000000, content: 'local-a' },
        { origin: 'r2:backup-prod', version: 0, at: 1700000111111, content: 'remote-a' },
      ],
      meta: { remoteKey: 'pfx/notes/a/b.md', shardId: 'notes', path: 'a/b.md' },
    });
    expect(opts).toEqual({ title: 'Resolve R2 import conflicts' });
  });

  it('omits extension for dotless paths and for dots in parent dirs', async () => {
    const resolve = vi.fn(async () => ({ status: 'resolved' as const, choices: [], skipped: [] }));
    const api = fakeConflictsApi({ resolve });
    await presentImportConflicts(api, [
      { shardId: 's', path: 'README', localContent: '', localVersion: 1, localAt: 0, incomingContent: '', incomingAt: 0, targetLabel: 't', remoteKey: 'k1' },
      { shardId: 's', path: 'dir.with.dot/file', localContent: '', localVersion: 1, localAt: 0, incomingContent: '', incomingAt: 0, targetLabel: 't', remoteKey: 'k2' },
    ]);
    const [items] = resolve.mock.calls[0];
    expect(items[0].extension).toBeUndefined();
    expect(items[1].extension).toBeUndefined();
  });
});

describe('presentImportConflicts — outcome mapping', () => {
  const baseInput = (over: Partial<ImportConflictInput> = {}): ImportConflictInput => ({
    shardId: 'notes',
    path: 'a.md',
    localContent: 'L',
    localVersion: 1,
    localAt: 0,
    incomingContent: 'R',
    incomingAt: 100,
    targetLabel: 'prod',
    remoteKey: 'pfx/notes/a.md',
    ...over,
  });

  it('maps chosen origin "local" to decision "local"', async () => {
    const resolve = vi.fn(async () => ({
      status: 'resolved' as const,
      choices: [{ itemId: 'notes/a.md', chosen: { origin: 'local', version: 1, at: 0, content: 'L' } }],
      skipped: [],
    }));
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [baseInput()]);
    expect(result).toEqual([
      { path: 'a.md', shardId: 'notes', choice: 'local', remoteKey: 'pfx/notes/a.md' },
    ]);
  });

  it('maps chosen r2-prefixed origin to decision "incoming"', async () => {
    const resolve = vi.fn(async () => ({
      status: 'resolved' as const,
      choices: [{ itemId: 'notes/a.md', chosen: { origin: 'r2:prod', version: 0, at: 100, content: 'R' } }],
      skipped: [],
    }));
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [baseInput()]);
    expect(result).toEqual([
      { path: 'a.md', shardId: 'notes', choice: 'incoming', remoteKey: 'pfx/notes/a.md' },
    ]);
  });

  it('maps skipped item ids to decision "skipped"', async () => {
    const resolve = vi.fn(async () => ({
      status: 'resolved' as const,
      choices: [],
      skipped: ['notes/a.md'],
    }));
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [baseInput()]);
    expect(result).toEqual([
      { path: 'a.md', shardId: 'notes', choice: 'skipped', remoteKey: 'pfx/notes/a.md' },
    ]);
  });

  it('returns the literal "cancelled" string when status is "cancelled"', async () => {
    const resolve = vi.fn(async () => ({ status: 'cancelled' as const }));
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [baseInput()]);
    expect(result).toBe('cancelled');
  });

  it('returns "cancelled" when resolve throws ConflictSessionOrphanedError', async () => {
    const resolve = vi.fn(async () => { throw new ConflictSessionOrphanedError(); });
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [
      {
        shardId: 'notes', path: 'a.md',
        localContent: 'L', localVersion: 1, localAt: 0,
        incomingContent: 'R', incomingAt: 100,
        targetLabel: 'prod', remoteKey: 'pfx/notes/a.md',
      },
    ]);
    expect(result).toBe('cancelled');
  });

  it('returns "cancelled" when resolve throws an unknown error', async () => {
    const resolve = vi.fn(async () => { throw new Error('boom'); });
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [
      {
        shardId: 'notes', path: 'a.md',
        localContent: 'L', localVersion: 1, localAt: 0,
        incomingContent: 'R', incomingAt: 100,
        targetLabel: 'prod', remoteKey: 'pfx/notes/a.md',
      },
    ]);
    expect(result).toBe('cancelled');
  });

  it('mixes local/incoming/skipped decisions correctly', async () => {
    const resolve = vi.fn(async () => ({
      status: 'resolved' as const,
      choices: [
        { itemId: 'notes/one.md', chosen: { origin: 'local', version: 1, at: 0, content: 'L1' } },
        { itemId: 'notes/two.md', chosen: { origin: 'r2:prod', version: 0, at: 200, content: 'R2' } },
      ],
      skipped: ['notes/three.md'],
    }));
    const api = fakeConflictsApi({ resolve });
    const result = await presentImportConflicts(api, [
      baseInput({ path: 'one.md', remoteKey: 'pfx/notes/one.md' }),
      baseInput({ path: 'two.md', remoteKey: 'pfx/notes/two.md' }),
      baseInput({ path: 'three.md', remoteKey: 'pfx/notes/three.md' }),
    ]);
    expect(result).toEqual([
      { path: 'one.md', shardId: 'notes', choice: 'local', remoteKey: 'pfx/notes/one.md' },
      { path: 'two.md', shardId: 'notes', choice: 'incoming', remoteKey: 'pfx/notes/two.md' },
      { path: 'three.md', shardId: 'notes', choice: 'skipped', remoteKey: 'pfx/notes/three.md' },
    ]);
  });
});
