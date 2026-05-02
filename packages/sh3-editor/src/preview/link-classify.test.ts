import { describe, it, expect } from 'vitest';
import { classifyLink } from './link-classify';

describe('classifyLink', () => {
  it('classifies fragment hrefs as anchor', () => {
    expect(classifyLink('#section')).toBe('anchor');
    expect(classifyLink('#')).toBe('anchor');
  });

  it('classifies absolute URLs with a scheme as external', () => {
    expect(classifyLink('http://example.com')).toBe('external');
    expect(classifyLink('https://example.com/path')).toBe('external');
    expect(classifyLink('mailto:foo@bar.com')).toBe('external');
    expect(classifyLink('data:text/plain,hello')).toBe('external');
    expect(classifyLink('file:///etc/hosts')).toBe('external');
  });

  it('classifies relative paths as internal', () => {
    expect(classifyLink('./setup.md')).toBe('internal');
    expect(classifyLink('../guide.md')).toBe('internal');
    expect(classifyLink('subdir/page.md')).toBe('internal');
  });

  it('classifies root-relative paths as internal', () => {
    expect(classifyLink('/docs/index.md')).toBe('internal');
  });

  it('classifies scheme-less hostnames as internal (no protocol prefix)', () => {
    expect(classifyLink('example.com')).toBe('internal');
  });

  it('classifies empty href as internal', () => {
    expect(classifyLink('')).toBe('internal');
  });

  it('rejects non-scheme prefixes that resemble URLs', () => {
    expect(classifyLink('123:foo')).toBe('internal');
  });
});
