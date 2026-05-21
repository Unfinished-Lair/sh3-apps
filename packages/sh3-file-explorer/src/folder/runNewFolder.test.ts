import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sh3-core', () => ({ sh3: { toast: { notify: vi.fn() } } }));

import { validateFolderName, computePlaceholderPath } from './runNewFolder';

beforeEach(() => vi.clearAllMocks());

describe('validateFolderName', () => {
  it('rejects empty / whitespace', () => {
    expect(validateFolderName('', [])).toMatch(/empty/i);
    expect(validateFolderName('   ', [])).toMatch(/empty/i);
  });

  it('rejects path separators and traversal', () => {
    expect(validateFolderName('a/b', [])).toMatch(/separator|"\/"/);
    expect(validateFolderName('..', [])).toMatch(/separator|".."/);
  });

  it('rejects sibling collision', () => {
    expect(validateFolderName('docs', ['docs', 'images'])).toMatch(/already exists/);
  });

  it('returns null when the name is acceptable', () => {
    expect(validateFolderName('newfolder', ['docs'])).toBeNull();
  });
});

describe('computePlaceholderPath', () => {
  it('joins parent + name + /.keep', () => {
    expect(computePlaceholderPath('docs', 'new')).toBe('docs/new/.keep');
  });

  it('handles shard-root parent', () => {
    expect(computePlaceholderPath('', 'new')).toBe('new/.keep');
  });
});
