import { describe, it, expect } from 'vitest';
import { resolvePath } from './print-path';

describe('print path mini-language', () => {
  const fixture = {
    items: [{ name: 'first', meta: { color: 'red' } }, { name: 'second' }],
    nested: { 'with key': 42 },
    'top key': 'top value',
  };

  it('empty path returns input as-is', () => {
    expect(resolvePath(fixture, '')).toEqual(fixture);
  });

  it('dot notation', () => {
    expect(resolvePath(fixture, 'items')).toEqual(fixture.items);
  });

  it('numeric bracket', () => {
    expect(resolvePath(fixture, 'items[0]')).toEqual(fixture.items[0]);
  });

  it('string bracket double-quoted', () => {
    expect(resolvePath(fixture, 'nested["with key"]')).toBe(42);
  });

  it('string bracket single-quoted', () => {
    expect(resolvePath(fixture, "['top key']")).toBe('top value');
  });

  it('mixed nested', () => {
    expect(resolvePath(fixture, 'items[0].meta.color')).toBe('red');
  });

  it('returns undefined on miss', () => {
    expect(resolvePath(fixture, 'items[5].name')).toBeUndefined();
    expect(resolvePath(fixture, 'nope.bar')).toBeUndefined();
  });

  it('handles null gracefully', () => {
    expect(resolvePath(null, 'a')).toBeUndefined();
  });

  it('throws on malformed expression', () => {
    expect(() => resolvePath(fixture, 'items[')).toThrow();
    expect(() => resolvePath(fixture, '..a')).toThrow();
  });
});
