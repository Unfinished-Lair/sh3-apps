import { describe, it, expect } from 'vitest';
import {
  isString, isNumber, isNumberPair, isNumberRecord,
  isStringOrStringArray, isFileOrFileArrayOrNull,
} from './match';

describe('widget value-shape predicates', () => {
  it('isString accepts strings, rejects others', () => {
    expect(isString('x')).toBe(true);
    expect(isString('')).toBe(true);
    expect(isString(0)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });

  it('isNumber accepts finite numbers; rejects NaN, Infinity, non-numbers', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-1.5)).toBe(true);
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isNumber('1')).toBe(false);
  });

  it('isNumberPair accepts [number, number] tuples', () => {
    expect(isNumberPair([0, 1])).toBe(true);
    expect(isNumberPair([0, 1, 2])).toBe(false);
    expect(isNumberPair([0])).toBe(false);
    expect(isNumberPair(['0', '1'])).toBe(false);
    expect(isNumberPair(null)).toBe(false);
  });

  it('isNumberRecord accepts { [k]: number } records', () => {
    expect(isNumberRecord({ a: 1, b: 2 })).toBe(true);
    expect(isNumberRecord({})).toBe(true);
    expect(isNumberRecord({ a: '1' })).toBe(false);
    expect(isNumberRecord([1, 2])).toBe(false);   // arrays excluded
    expect(isNumberRecord(null)).toBe(false);
  });

  it('isStringOrStringArray accepts string or string[]', () => {
    expect(isStringOrStringArray('a')).toBe(true);
    expect(isStringOrStringArray(['a', 'b'])).toBe(true);
    expect(isStringOrStringArray([])).toBe(true);
    expect(isStringOrStringArray([1, 2])).toBe(false);
    expect(isStringOrStringArray(0)).toBe(false);
  });

  it('isFileOrFileArrayOrNull accepts File, File[], or null', () => {
    const f = new File([''], 'a.txt');
    expect(isFileOrFileArrayOrNull(null)).toBe(true);
    expect(isFileOrFileArrayOrNull(f)).toBe(true);
    expect(isFileOrFileArrayOrNull([f])).toBe(true);
    expect(isFileOrFileArrayOrNull([])).toBe(true);
    expect(isFileOrFileArrayOrNull('a.txt')).toBe(false);
  });
});
