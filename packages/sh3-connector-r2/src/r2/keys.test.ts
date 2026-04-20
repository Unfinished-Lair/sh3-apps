import { describe, it, expect } from 'vitest';
import { buildObjectKey, contentTypeFor } from './keys';

describe('buildObjectKey', () => {
  it('concatenates prefix, shardId, path', () => {
    expect(buildObjectKey('sh3-laptop/', 'notes', 'daily/a.md'))
      .toBe('sh3-laptop/notes/daily/a.md');
  });

  it('strips a single leading slash from path', () => {
    expect(buildObjectKey('p/', 'shard', '/foo.md'))
      .toBe('p/shard/foo.md');
  });

  it('tolerates an empty prefix', () => {
    expect(buildObjectKey('', 'shard', 'foo.md'))
      .toBe('shard/foo.md');
  });

  it('rejects path traversal', () => {
    expect(() => buildObjectKey('p/', 'shard', '../secrets.md')).toThrow(/traversal/i);
    expect(() => buildObjectKey('p/', 'shard', 'a/../b.md')).toThrow(/traversal/i);
  });

  it('rejects empty shardId', () => {
    expect(() => buildObjectKey('p/', '', 'x.md')).toThrow();
  });

  it('preserves unicode', () => {
    expect(buildObjectKey('p/', 'notes', 'é/中.md')).toBe('p/notes/é/中.md');
  });
});

describe('contentTypeFor', () => {
  it('maps known extensions', () => {
    expect(contentTypeFor('a.md')).toBe('text/markdown');
    expect(contentTypeFor('a.json')).toBe('application/json');
    expect(contentTypeFor('a.txt')).toBe('text/plain');
    expect(contentTypeFor('a.guml')).toBe('text/plain');
    expect(contentTypeFor('a.html')).toBe('text/html');
  });

  it('falls back to application/octet-stream', () => {
    expect(contentTypeFor('a.unknown')).toBe('application/octet-stream');
    expect(contentTypeFor('no-extension')).toBe('application/octet-stream');
  });

  it('is case-insensitive on extension', () => {
    expect(contentTypeFor('A.MD')).toBe('text/markdown');
  });
});
