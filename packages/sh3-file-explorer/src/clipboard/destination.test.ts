import { describe, it, expect } from 'vitest';
import { computeDestination, addCopySuffix, isPasteIntoSelf } from './destination';

describe('computeDestination', () => {
  it('joins the target folder with the source basename', () => {
    expect(computeDestination({ shardId: 'A', path: 'a/b.txt', kind: 'file' }, { shardId: 'B', path: 'sub', kind: 'folder' }))
      .toEqual({ shardId: 'B', path: 'sub/b.txt' });
  });

  it('handles shard-root target (empty path)', () => {
    expect(computeDestination({ shardId: 'A', path: 'a/b.txt', kind: 'file' }, { shardId: 'B', path: '', kind: 'folder' }))
      .toEqual({ shardId: 'B', path: 'b.txt' });
  });

  it('treats file selection as paste-into-parent', () => {
    expect(computeDestination({ shardId: 'A', path: 'a/b.txt', kind: 'file' }, { shardId: 'B', path: 'docs/readme.md', kind: 'file' }))
      .toEqual({ shardId: 'B', path: 'docs/b.txt' });
  });

  it('handles file-at-shard-root target', () => {
    expect(computeDestination({ shardId: 'A', path: 'a/b.txt', kind: 'file' }, { shardId: 'B', path: 'readme.md', kind: 'file' }))
      .toEqual({ shardId: 'B', path: 'b.txt' });
  });

  it('folder source preserves its name under the destination folder', () => {
    expect(computeDestination({ shardId: 'A', path: 'src/lib', kind: 'folder' }, { shardId: 'B', path: 'dst', kind: 'folder' }))
      .toEqual({ shardId: 'B', path: 'dst/lib' });
  });
});

describe('addCopySuffix', () => {
  it('appends " (copy)" before the extension on first collision', () => {
    expect(addCopySuffix('notes/readme.md', 1)).toBe('notes/readme (copy).md');
  });

  it('uses numbered suffix at attempt N>1', () => {
    expect(addCopySuffix('notes/readme.md', 2)).toBe('notes/readme (copy 2).md');
    expect(addCopySuffix('notes/readme.md', 5)).toBe('notes/readme (copy 5).md');
  });

  it('handles files with no extension', () => {
    expect(addCopySuffix('LICENSE', 1)).toBe('LICENSE (copy)');
    expect(addCopySuffix('LICENSE', 3)).toBe('LICENSE (copy 3)');
  });

  it('handles dotfiles', () => {
    expect(addCopySuffix('.gitignore', 1)).toBe('.gitignore (copy)');
  });
});

describe('isPasteIntoSelf', () => {
  it('folder into itself', () => {
    expect(isPasteIntoSelf({ shardId: 'A', path: 'docs', kind: 'folder' }, { shardId: 'A', path: 'docs', kind: 'folder' }))
      .toBe(true);
  });

  it('folder into its own descendant', () => {
    expect(isPasteIntoSelf({ shardId: 'A', path: 'docs', kind: 'folder' }, { shardId: 'A', path: 'docs/sub', kind: 'folder' }))
      .toBe(true);
  });

  it('sibling folders are fine', () => {
    expect(isPasteIntoSelf({ shardId: 'A', path: 'docs', kind: 'folder' }, { shardId: 'A', path: 'other', kind: 'folder' }))
      .toBe(false);
  });

  it('file source cannot paste-into-self', () => {
    expect(isPasteIntoSelf({ shardId: 'A', path: 'docs/a.txt', kind: 'file' }, { shardId: 'A', path: 'docs', kind: 'folder' }))
      .toBe(false);
  });

  it('cross-shard cannot paste-into-self', () => {
    expect(isPasteIntoSelf({ shardId: 'A', path: 'docs', kind: 'folder' }, { shardId: 'B', path: 'docs', kind: 'folder' }))
      .toBe(false);
  });
});
