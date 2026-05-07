import { describe, it, expect } from 'vitest';
import { matchesGlob } from './glob';

describe('matchesGlob', () => {
  it('matches exact strings', () => {
    expect(matchesGlob('sh3-fe.read', 'sh3-fe.read')).toBe(true);
    expect(matchesGlob('sh3-fe.read', 'sh3-fe.delete')).toBe(false);
  });

  it('matches a single segment with *', () => {
    expect(matchesGlob('sh3-fe.read', 'sh3-fe.*')).toBe(true);
    expect(matchesGlob('sh3-fe.delete', 'sh3-fe.*')).toBe(true);
    // '*' is single-segment; should NOT cross dots.
    expect(matchesGlob('sh3-fe.subns.read', 'sh3-fe.*')).toBe(false);
  });

  it('matches the prefix segment with *', () => {
    expect(matchesGlob('sh3-fe.read', '*.read')).toBe(true);
    expect(matchesGlob('sh3-r2.read', '*.read')).toBe(true);
    expect(matchesGlob('sh3-fe.delete', '*.read')).toBe(false);
  });

  it('matches both segments with *', () => {
    expect(matchesGlob('foo.bar', '*.*')).toBe(true);
    // Two-segment '*.* ' does not match a single-segment name.
    expect(matchesGlob('singleseg', '*.*')).toBe(false);
  });

  it('matches a single bare * to any single-segment name', () => {
    expect(matchesGlob('foo', '*')).toBe(true);
    expect(matchesGlob('foo.bar', '*')).toBe(false); // single segment only
  });

  it('treats . in pattern as literal dot', () => {
    expect(matchesGlob('foo.bar', 'foo.bar')).toBe(true);
    expect(matchesGlob('fooXbar', 'foo.bar')).toBe(false);
  });
});
