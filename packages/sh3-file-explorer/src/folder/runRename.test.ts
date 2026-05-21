import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sh3-core', () => ({ sh3: { toast: { notify: vi.fn() } } }));

import { renamePathsFor } from './runRename';

beforeEach(() => vi.clearAllMocks());

describe('renamePathsFor', () => {
  it('builds a single (old, new) pair for a file', () => {
    const pairs = renamePathsFor(
      { shardId: 'A', path: 'src/a.txt', kind: 'file' },
      'b.txt',
      [],
    );
    expect(pairs).toEqual([['src/a.txt', 'src/b.txt']]);
  });

  it('renames at shard root', () => {
    const pairs = renamePathsFor(
      { shardId: 'A', path: 'a.txt', kind: 'file' },
      'b.txt',
      [],
    );
    expect(pairs).toEqual([['a.txt', 'b.txt']]);
  });

  it('fans out folder rename across all descendants under the new prefix', () => {
    const pairs = renamePathsFor(
      { shardId: 'A', path: 'src/lib', kind: 'folder' },
      'core',
      [
        { shardId: 'A', path: 'src/lib/a.txt', size: 0, lastModified: 0 },
        { shardId: 'A', path: 'src/lib/sub/b.txt', size: 0, lastModified: 0 },
        { shardId: 'B', path: 'src/lib/c.txt', size: 0, lastModified: 0 },
      ],
    );
    expect(pairs).toEqual(expect.arrayContaining([
      ['src/lib/a.txt', 'src/core/a.txt'],
      ['src/lib/sub/b.txt', 'src/core/sub/b.txt'],
    ]));
    expect(pairs).toHaveLength(2);
  });
});
