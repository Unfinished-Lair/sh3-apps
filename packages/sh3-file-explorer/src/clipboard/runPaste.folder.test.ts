import { describe, it, expect, vi, beforeEach } from 'vitest';

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));

vi.mock('sh3-core', () => ({
  sh3: { toast: { notify } },
}));

import { runPaste } from './runPaste';

beforeEach(() => vi.clearAllMocks());

const docs = [
  { shardId: 'A', path: 'src/lib/a.txt', size: 0, lastModified: 0 },
  { shardId: 'A', path: 'src/lib/b.txt', size: 0, lastModified: 0 },
  { shardId: 'A', path: 'src/lib/sub/c.txt', size: 0, lastModified: 0 },
  { shardId: 'A', path: 'src/other.txt', size: 0, lastModified: 0 },
];

function toBuf(s: string): ArrayBuffer {
  return new TextEncoder().encode(s).buffer as ArrayBuffer;
}

function makeCtx() {
  return {
    documents: {
      readBinary: vi.fn(async (_path: string) => toBuf('content') as ArrayBuffer | null),
      writeBinary: vi.fn(async (_path: string, _content: ArrayBuffer) => {}),
      rename: vi.fn(async (_old: string, _new: string) => {}),
      delete: vi.fn(async (_path: string) => {}),
    },
  };
}

function makeStore(clipboard: any) {
  return {
    ready: true as const,
    clipboard,
    documents: docs,
    setSelection: vi.fn(),
    clearClipboard: vi.fn(),
  } as any;
}

describe('runPaste — folders', () => {
  it('cross-shard copy fans out reads + writes (scope-rooted) for every descendant under the new folder', async () => {
    const ctx = makeCtx();
    const store = makeStore({ mode: 'copy', ref: { shardId: 'A', path: 'src/lib', kind: 'folder' } });
    await runPaste(ctx as any, store, { shardId: 'B', path: 'dst', kind: 'folder' });
    const writeArgs = ctx.documents.writeBinary.mock.calls.map((c) => c[0]);
    expect(writeArgs).toEqual(expect.arrayContaining([
      'B/dst/lib/a.txt',
      'B/dst/lib/b.txt',
      'B/dst/lib/sub/c.txt',
    ]));
    expect(writeArgs).toHaveLength(3);
    expect(ctx.documents.delete).not.toHaveBeenCalled();
  });

  it('same-shard cut uses rename per descendant with scope-rooted paths', async () => {
    const ctx = makeCtx();
    const store = makeStore({ mode: 'cut', ref: { shardId: 'A', path: 'src/lib', kind: 'folder' } });
    await runPaste(ctx as any, store, { shardId: 'A', path: 'dst', kind: 'folder' });
    const renameArgs = ctx.documents.rename.mock.calls.map((c) => [c[0], c[1]]);
    expect(renameArgs).toEqual(expect.arrayContaining([
      ['A/src/lib/a.txt', 'A/dst/lib/a.txt'],
      ['A/src/lib/b.txt', 'A/dst/lib/b.txt'],
      ['A/src/lib/sub/c.txt', 'A/dst/lib/sub/c.txt'],
    ]));
    expect(ctx.documents.writeBinary).not.toHaveBeenCalled();
  });

  it('reports partial failure count', async () => {
    const ctx = makeCtx();
    ctx.documents.writeBinary.mockRejectedValueOnce(new Error('disk full'));
    const store = makeStore({ mode: 'copy', ref: { shardId: 'A', path: 'src/lib', kind: 'folder' } });
    await runPaste(ctx as any, store, { shardId: 'B', path: 'dst', kind: 'folder' });
    expect(notify.mock.calls.some((c: any) => /1.*failed/i.test(c[0]))).toBe(true);
  });
});
