import { describe, it, expect, vi, beforeEach } from 'vitest';

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));

vi.mock('sh3-core', () => ({
  sh3: { toast: { notify } },
}));

import { runPaste } from './runPaste';

function makeBrowse(overrides: Partial<{
  readFrom: (s: string, p: string) => Promise<string | ArrayBuffer | null>;
  writeTo: (s: string, p: string, c: string | ArrayBuffer) => Promise<void>;
  renameFrom: (s: string, op: string, np: string) => Promise<void>;
  deleteFrom: (s: string, p: string) => Promise<void>;
}> = {}) {
  return {
    readFrom: overrides.readFrom ?? vi.fn(async (_s: string, _p: string) => 'hello' as string | ArrayBuffer | null),
    writeTo: overrides.writeTo ?? vi.fn(async () => {}),
    renameFrom: overrides.renameFrom ?? vi.fn(async () => {}),
    deleteFrom: overrides.deleteFrom ?? vi.fn(async () => {}),
  };
}

function makeStore(overrides: Partial<{ clipboard: any; documents: any[]; setSelection: (s: any) => void; clearClipboard: () => void }> = {}) {
  return {
    ready: true as const,
    clipboard: overrides.clipboard ?? null,
    documents: overrides.documents ?? [],
    setSelection: overrides.setSelection ?? vi.fn(),
    clearClipboard: overrides.clearClipboard ?? vi.fn(),
  } as any;
}

beforeEach(() => { vi.clearAllMocks(); });

describe('runPaste — files', () => {
  it('cross-shard cut: readFrom + writeTo + deleteFrom + clearClipboard', async () => {
    const browse = makeBrowse();
    const clearClipboard = vi.fn();
    const store = makeStore({
      clipboard: { mode: 'cut', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
      clearClipboard,
    });
    await runPaste(browse as any, store, { shardId: 'B', path: 'sub', kind: 'folder' });
    expect(browse.readFrom).toHaveBeenCalledWith('A', 'foo/bar.txt');
    expect(browse.writeTo).toHaveBeenCalledWith('B', 'sub/bar.txt', 'hello');
    expect(browse.deleteFrom).toHaveBeenCalledWith('A', 'foo/bar.txt');
    expect(clearClipboard).toHaveBeenCalled();
  });

  it('cross-shard copy: readFrom + writeTo, NO delete, clipboard preserved', async () => {
    const browse = makeBrowse();
    const clearClipboard = vi.fn();
    const store = makeStore({
      clipboard: { mode: 'copy', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
      clearClipboard,
    });
    await runPaste(browse as any, store, { shardId: 'B', path: 'sub', kind: 'folder' });
    expect(browse.writeTo).toHaveBeenCalled();
    expect(browse.deleteFrom).not.toHaveBeenCalled();
    expect(clearClipboard).not.toHaveBeenCalled();
  });

  it('same-shard cut uses renameFrom (atomic move)', async () => {
    const browse = makeBrowse();
    const store = makeStore({
      clipboard: { mode: 'cut', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
    });
    await runPaste(browse as any, store, { shardId: 'A', path: 'sub', kind: 'folder' });
    expect(browse.renameFrom).toHaveBeenCalledWith('A', 'foo/bar.txt', 'sub/bar.txt');
    expect(browse.writeTo).not.toHaveBeenCalled();
    expect(browse.deleteFrom).not.toHaveBeenCalled();
  });

  it('same-folder copy: auto-rename with (copy) suffix', async () => {
    const browse = makeBrowse({
      readFrom: vi.fn(async (_s: string, p: string) => p === 'foo/bar.txt' ? 'hello' : null),
    });
    const store = makeStore({
      clipboard: { mode: 'copy', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
    });
    await runPaste(browse as any, store, { shardId: 'A', path: 'foo', kind: 'folder' });
    expect(browse.writeTo).toHaveBeenCalledWith('A', 'foo/bar (copy).txt', 'hello');
  });

  it('same source and destination (cut): toast + abort', async () => {
    const browse = makeBrowse();
    const store = makeStore({
      clipboard: { mode: 'cut', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
    });
    await runPaste(browse as any, store, { shardId: 'A', path: 'foo', kind: 'folder' });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('identical'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(browse.renameFrom).not.toHaveBeenCalled();
  });

  it('source no longer exists: toast + clear clipboard', async () => {
    const browse = makeBrowse({ readFrom: vi.fn(async () => null) });
    const clearClipboard = vi.fn();
    const store = makeStore({
      clipboard: { mode: 'copy', ref: { shardId: 'A', path: 'gone.txt', kind: 'file' } },
      clearClipboard,
    });
    await runPaste(browse as any, store, { shardId: 'B', path: 'sub', kind: 'folder' });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('no longer exists'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(browse.writeTo).not.toHaveBeenCalled();
    expect(clearClipboard).toHaveBeenCalled();
  });
});
