import { describe, it, expect, vi, beforeEach } from 'vitest';

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));

vi.mock('sh3-core', () => ({
  sh3: { toast: { notify } },
}));

import { runPaste } from './runPaste';

function toBuf(s: string): ArrayBuffer {
  return new TextEncoder().encode(s).buffer as ArrayBuffer;
}

function makeCtx(overrides: Partial<{
  readBinary: (path: string) => Promise<ArrayBuffer | null>;
  writeBinary: (path: string, content: ArrayBuffer) => Promise<void>;
  rename: (op: string, np: string) => Promise<void>;
  delete: (path: string) => Promise<void>;
}> = {}) {
  return {
    documents: {
      readBinary: overrides.readBinary ?? vi.fn(async (_p: string) => toBuf('hello') as ArrayBuffer | null),
      writeBinary: overrides.writeBinary ?? vi.fn(async () => {}),
      rename: overrides.rename ?? vi.fn(async () => {}),
      delete: overrides.delete ?? vi.fn(async () => {}),
    },
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
  it('cross-shard cut: readBinary + writeBinary + delete + clearClipboard, scope-rooted paths', async () => {
    const ctx = makeCtx();
    const clearClipboard = vi.fn();
    const store = makeStore({
      clipboard: { mode: 'cut', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
      clearClipboard,
    });
    await runPaste(ctx as any, store, { shardId: 'B', path: 'sub', kind: 'folder' });
    expect(ctx.documents.readBinary).toHaveBeenCalledWith('A/foo/bar.txt');
    expect(ctx.documents.writeBinary).toHaveBeenCalledWith('B/sub/bar.txt', expect.any(ArrayBuffer));
    expect(ctx.documents.delete).toHaveBeenCalledWith('A/foo/bar.txt');
    expect(clearClipboard).toHaveBeenCalled();
  });

  it('cross-shard copy: readBinary + writeBinary, NO delete, clipboard preserved', async () => {
    const ctx = makeCtx();
    const clearClipboard = vi.fn();
    const store = makeStore({
      clipboard: { mode: 'copy', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
      clearClipboard,
    });
    await runPaste(ctx as any, store, { shardId: 'B', path: 'sub', kind: 'folder' });
    expect(ctx.documents.writeBinary).toHaveBeenCalled();
    expect(ctx.documents.delete).not.toHaveBeenCalled();
    expect(clearClipboard).not.toHaveBeenCalled();
  });

  it('same-shard cut uses rename (atomic move) with scope-rooted paths', async () => {
    const ctx = makeCtx();
    const store = makeStore({
      clipboard: { mode: 'cut', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
    });
    await runPaste(ctx as any, store, { shardId: 'A', path: 'sub', kind: 'folder' });
    expect(ctx.documents.rename).toHaveBeenCalledWith('A/foo/bar.txt', 'A/sub/bar.txt');
    expect(ctx.documents.writeBinary).not.toHaveBeenCalled();
    expect(ctx.documents.delete).not.toHaveBeenCalled();
  });

  it('same-folder copy: auto-rename with (copy) suffix', async () => {
    const ctx = makeCtx({
      readBinary: vi.fn(async (p: string) => p === 'A/foo/bar.txt' ? toBuf('hello') : null),
    });
    const store = makeStore({
      clipboard: { mode: 'copy', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
    });
    await runPaste(ctx as any, store, { shardId: 'A', path: 'foo', kind: 'folder' });
    expect(ctx.documents.writeBinary).toHaveBeenCalledWith('A/foo/bar (copy).txt', expect.any(ArrayBuffer));
  });

  it('same source and destination (cut): toast + abort', async () => {
    const ctx = makeCtx();
    const store = makeStore({
      clipboard: { mode: 'cut', ref: { shardId: 'A', path: 'foo/bar.txt', kind: 'file' } },
    });
    await runPaste(ctx as any, store, { shardId: 'A', path: 'foo', kind: 'folder' });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('identical'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(ctx.documents.rename).not.toHaveBeenCalled();
  });

  it('source no longer exists: toast + clear clipboard', async () => {
    const ctx = makeCtx({ readBinary: vi.fn(async () => null) });
    const clearClipboard = vi.fn();
    const store = makeStore({
      clipboard: { mode: 'copy', ref: { shardId: 'A', path: 'gone.txt', kind: 'file' } },
      clearClipboard,
    });
    await runPaste(ctx as any, store, { shardId: 'B', path: 'sub', kind: 'folder' });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('no longer exists'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(ctx.documents.writeBinary).not.toHaveBeenCalled();
    expect(clearClipboard).toHaveBeenCalled();
  });
});
