import { describe, it, expect } from 'vitest';
import { buildBadgeIndexFromLog } from './badge-index';
import type { UploadLogEntry } from './upload-log';

const u = (over: Partial<UploadLogEntry>): UploadLogEntry => ({
  id: 'x', targetId: 't', shardId: 'notes', path: 'a.md', sha256: 'h', size: 1,
  status: 'uploaded', at: '2026-04-01T00:00:00.000Z', ...over,
});

describe('buildBadgeIndexFromLog', () => {
  it('keys entries by shardId/path', () => {
    const ix = buildBadgeIndexFromLog([u({ shardId: 'notes', path: 'a.md' })]);
    expect(ix.has('notes/a.md')).toBe(true);
  });

  it('keeps the newest entry per key', () => {
    const ix = buildBadgeIndexFromLog([
      u({ id: 'old', shardId: 'notes', path: 'a.md', at: '2026-04-01T00:00:00.000Z' }),
      u({ id: 'new', shardId: 'notes', path: 'a.md', at: '2026-04-05T00:00:00.000Z' }),
      u({ id: 'mid', shardId: 'notes', path: 'a.md', at: '2026-04-03T00:00:00.000Z' }),
    ]);
    expect(ix.get('notes/a.md')?.id).toBe('new');
  });

  it('excludes failed and skipped entries', () => {
    const ix = buildBadgeIndexFromLog([
      u({ id: 'ok', shardId: 'notes', path: 'a.md', status: 'uploaded' }),
      u({ id: 'fail', shardId: 'notes', path: 'b.md', status: 'failed' }),
      u({ id: 'skip', shardId: 'notes', path: 'c.md', status: 'skipped-unchanged' }),
    ]);
    expect([...ix.keys()].sort()).toEqual(['notes/a.md']);
  });

  it('separates same-path entries across shards', () => {
    const ix = buildBadgeIndexFromLog([
      u({ shardId: 'notes', path: 'a.md' }),
      u({ shardId: 'editor', path: 'a.md' }),
    ]);
    expect(ix.size).toBe(2);
  });
});
