import { describe, it, expect } from 'vitest';
import { walkScope } from './walker';

describe('walkScope', () => {
  it('filters docs by shardId and path prefix', async () => {
    const docs = [
      { shardId: 'notes', path: 'a.md' },
      { shardId: 'notes', path: 'sub/b.md' },
      { shardId: 'editor', path: 'c.md' },
      { shardId: 'notes', path: 'other/d.md' },
    ];
    const seen: string[] = [];
    const stats = await walkScope({
      list: async () => docs,
      scope: { shardId: 'notes', pathPrefix: 'sub/' },
      onItem: async (item) => { seen.push(`${item.shardId}/${item.path}`); return 'uploaded'; },
    });
    expect(seen).toEqual(['notes/sub/b.md']);
    expect(stats).toEqual({ total: 1, uploaded: 1, skipped: 0, failed: 0 });
  });

  it('counts outcomes', async () => {
    const docs = [
      { shardId: 'notes', path: 'a.md' },
      { shardId: 'notes', path: 'b.md' },
      { shardId: 'notes', path: 'c.md' },
    ];
    const outcomes = ['uploaded', 'skipped-unchanged', 'failed'] as const;
    let i = 0;
    const stats = await walkScope({
      list: async () => docs,
      scope: { shardId: 'notes' },
      onItem: async () => outcomes[i++],
    });
    expect(stats).toEqual({ total: 3, uploaded: 1, skipped: 1, failed: 1 });
  });

  it('with recursive=false, matches only direct children of pathPrefix', async () => {
    const docs = [
      { shardId: 'notes', path: 'sub/a.md' },
      { shardId: 'notes', path: 'sub/nested/b.md' },
      { shardId: 'notes', path: 'sub/nested/deep/c.md' },
      { shardId: 'notes', path: 'other.md' },
    ];
    const seen: string[] = [];
    const stats = await walkScope({
      list: async () => docs,
      scope: { shardId: 'notes', pathPrefix: 'sub/', recursive: false },
      onItem: async (item) => { seen.push(item.path); return 'uploaded'; },
    });
    expect(seen).toEqual(['sub/a.md']);
    expect(stats.total).toBe(1);
  });

  it('with recursive=false and no pathPrefix, matches only top-level files in shard', async () => {
    const docs = [
      { shardId: 'notes', path: 'a.md' },
      { shardId: 'notes', path: 'sub/b.md' },
    ];
    const seen: string[] = [];
    await walkScope({
      list: async () => docs,
      scope: { shardId: 'notes', recursive: false },
      onItem: async (item) => { seen.push(item.path); return 'uploaded'; },
    });
    expect(seen).toEqual(['a.md']);
  });

  it('defaults to recursive when recursive is omitted', async () => {
    const docs = [
      { shardId: 'notes', path: 'sub/a.md' },
      { shardId: 'notes', path: 'sub/nested/b.md' },
    ];
    const seen: string[] = [];
    await walkScope({
      list: async () => docs,
      scope: { shardId: 'notes', pathPrefix: 'sub/' },
      onItem: async (item) => { seen.push(item.path); return 'uploaded'; },
    });
    expect(seen).toEqual(['sub/a.md', 'sub/nested/b.md']);
  });
});
