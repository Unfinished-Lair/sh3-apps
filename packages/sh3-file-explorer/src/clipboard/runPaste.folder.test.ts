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

function makeBrowse() {
  return {
    readFrom: vi.fn(async () => 'content'),
    writeTo: vi.fn(async () => {}),
    renameFrom: vi.fn(async () => {}),
    deleteFrom: vi.fn(async () => {}),
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
  it('cross-shard copy fans out reads + writes for every descendant under the new folder', async () => {
    const browse = makeBrowse();
    const store = makeStore({ mode: 'copy', ref: { shardId: 'A', path: 'src/lib', kind: 'folder' } });
    await runPaste(browse as any, store, { shardId: 'B', path: 'dst', kind: 'folder' });
    const writeArgs = browse.writeTo.mock.calls.map((c) => [c[0], c[1]]);
    expect(writeArgs).toEqual(expect.arrayContaining([
      ['B', 'dst/lib/a.txt'],
      ['B', 'dst/lib/b.txt'],
      ['B', 'dst/lib/sub/c.txt'],
    ]));
    expect(writeArgs).toHaveLength(3);
    expect(browse.deleteFrom).not.toHaveBeenCalled();
  });

  it('same-shard cut uses renameFrom per descendant', async () => {
    const browse = makeBrowse();
    const store = makeStore({ mode: 'cut', ref: { shardId: 'A', path: 'src/lib', kind: 'folder' } });
    await runPaste(browse as any, store, { shardId: 'A', path: 'dst', kind: 'folder' });
    const renameArgs = browse.renameFrom.mock.calls.map((c) => [c[1], c[2]]);
    expect(renameArgs).toEqual(expect.arrayContaining([
      ['src/lib/a.txt', 'dst/lib/a.txt'],
      ['src/lib/b.txt', 'dst/lib/b.txt'],
      ['src/lib/sub/c.txt', 'dst/lib/sub/c.txt'],
    ]));
    expect(browse.writeTo).not.toHaveBeenCalled();
  });

  it('reports partial failure count', async () => {
    const browse = makeBrowse();
    browse.writeTo.mockRejectedValueOnce(new Error('disk full'));
    const store = makeStore({ mode: 'copy', ref: { shardId: 'A', path: 'src/lib', kind: 'folder' } });
    await runPaste(browse as any, store, { shardId: 'B', path: 'dst', kind: 'folder' });
    expect(notify.mock.calls.some((c: any) => /1.*failed/i.test(c[0]))).toBe(true);
  });
});
