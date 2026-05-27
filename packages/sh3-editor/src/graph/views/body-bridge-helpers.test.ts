import { describe, it, expect } from 'vitest';
import {
  splitKeyPath, resolveValueAtPath, evalShow,
} from './body-bridge-helpers';

describe('splitKeyPath', () => {
  it('returns [] for undefined', () => {
    expect(splitKeyPath(undefined)).toEqual([]);
  });
  it('splits dotted string', () => {
    expect(splitKeyPath('a.b.c')).toEqual(['a', 'b', 'c']);
  });
  it('passes arrays through', () => {
    expect(splitKeyPath(['a', 0, 'b'])).toEqual(['a', 0, 'b']);
  });
  it('returns single-segment for non-dotted string', () => {
    expect(splitKeyPath('only')).toEqual(['only']);
  });
});

describe('resolveValueAtPath', () => {
  it('returns undefined for empty path', () => {
    expect(resolveValueAtPath({ a: 1 }, [])).toBeUndefined();
  });
  it('reads top-level', () => {
    expect(resolveValueAtPath({ a: 1 }, ['a'])).toBe(1);
  });
  it('reads nested', () => {
    expect(resolveValueAtPath({ a: { b: { c: 42 } } }, ['a', 'b', 'c'])).toBe(42);
  });
  it('returns undefined on missing intermediate', () => {
    expect(resolveValueAtPath({ a: {} }, ['a', 'b', 'c'])).toBeUndefined();
  });
  it('reads array index', () => {
    expect(resolveValueAtPath({ a: [10, 20, 30] }, ['a', 1])).toBe(20);
  });
});

describe('evalShow', () => {
  it('returns true when show is undefined', () => {
    expect(evalShow(undefined, {})).toBe(true);
  });
  it('returns the predicate result', () => {
    expect(evalShow((c) => c.x === 1, { x: 1 })).toBe(true);
    expect(evalShow((c) => c.x === 1, { x: 2 })).toBe(false);
  });
  it('treats thrown predicates as false (logged)', () => {
    expect(evalShow(() => { throw new Error('oops'); }, {})).toBe(false);
  });
});
