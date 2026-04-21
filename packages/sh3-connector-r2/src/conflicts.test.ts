import { describe, it, expect, vi } from 'vitest';
import type { ConflictsApi } from 'sh3-core';
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
