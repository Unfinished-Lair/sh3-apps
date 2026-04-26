import { describe, it, expect } from 'vitest';
import { buildR2Badge } from './badges';
import type { UploadLogEntry } from './upload-log';

const entry = (over: Partial<UploadLogEntry>): UploadLogEntry => ({
  id: 'x', targetId: 't', shardId: 'notes', path: 'a.md', sha256: 'h', size: 1,
  status: 'uploaded', at: '2026-04-01T00:00:00.000Z', ...over,
});

describe('buildR2Badge — file', () => {
  it('returns null for index miss', () => {
    const ix = new Map<string, UploadLogEntry>();
    expect(buildR2Badge(ix, { shardId: 'notes', path: 'a.md', kind: 'file' })).toBeNull();
  });

  it('returns ok-tone badge for index hit', () => {
    const ix = new Map<string, UploadLogEntry>([['notes/a.md', entry({ at: '2026-04-01T00:00:00.000Z' })]]);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'a.md', kind: 'file' });
    expect(b).toMatchObject({ tone: 'ok', icon: '☁', label: 'Backed up to R2', detail: '2026-04-01T00:00:00.000Z' });
  });

  it('returns warn-tone when lastModified > entry.at', () => {
    const ix = new Map<string, UploadLogEntry>([['notes/a.md', entry({ at: '2026-04-01T00:00:00.000Z' })]]);
    const lm = Date.parse('2026-04-02T00:00:00.000Z');
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'a.md', kind: 'file', lastModified: lm });
    expect(b?.tone).toBe('warn');
    expect(b?.icon).toBe('⚠');
    expect(b?.label).toBe('Backup is stale');
  });

  it('returns ok-tone when lastModified === entry.at (strict greater-than)', () => {
    const at = '2026-04-01T00:00:00.000Z';
    const ix = new Map<string, UploadLogEntry>([['notes/a.md', entry({ at })]]);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'a.md', kind: 'file', lastModified: Date.parse(at) });
    expect(b?.tone).toBe('ok');
  });
});

describe('buildR2Badge — folder', () => {
  const make = (paths: string[]) =>
    new Map<string, UploadLogEntry>(paths.map((p) => [`notes/${p}`, entry({ shardId: 'notes', path: p })]));

  it('returns null when descendantCount is 0 even if orphans exist', () => {
    const ix = make(['orphan.md']);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'old', kind: 'folder', descendantCount: 0 });
    expect(b).toBeNull();
  });

  it('returns null when no descendants are backed up', () => {
    const ix = make([]);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'sub', kind: 'folder', descendantCount: 5 });
    expect(b).toBeNull();
  });

  it('returns "X/Y backed up" with descendantCount', () => {
    const ix = make(['sub/a.md', 'sub/b.md', 'sub/nested/c.md']);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'sub', kind: 'folder', descendantCount: 5 });
    expect(b).toMatchObject({ tone: 'ok', icon: '☁', label: '3/5 backed up' });
  });

  it('returns "N backed up" without descendantCount', () => {
    const ix = make(['sub/a.md', 'sub/b.md']);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'sub', kind: 'folder' });
    expect(b?.label).toBe('2 backed up');
  });

  it('clamps display to descendantCount when orphans inflate count', () => {
    const ix = make(['sub/a.md', 'sub/b.md', 'sub/orphan.md']);
    const b = buildR2Badge(ix, { shardId: 'notes', path: 'sub', kind: 'folder', descendantCount: 2 });
    expect(b?.label).toBe('2/2 backed up');
  });

  it('handles shard-root folder (path === "")', () => {
    const ix = make(['a.md', 'b.md']);
    const b = buildR2Badge(ix, { shardId: 'notes', path: '', kind: 'folder', descendantCount: 2 });
    expect(b?.label).toBe('2/2 backed up');
  });
});
