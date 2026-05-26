import { describe, it, expect } from 'vitest';
import {
  DATA_TYPES, DATA_TYPE_DEFS, CONVERSIONS, parseNumberOrThrow, parseBooleanOrThrow,
  dataTypeFromJsonSchema,
  type DataType,
} from './data-types';

describe('data-types', () => {
  it('DATA_TYPES uses "run" instead of "control"', () => {
    expect(DATA_TYPES).toContain('run');
    expect(DATA_TYPES).not.toContain('control' as DataType);
  });

  it('DATA_TYPE_DEFS has label + color for every DataType', () => {
    for (const t of DATA_TYPES) {
      expect(DATA_TYPE_DEFS[t].label).toBeTruthy();
      expect(DATA_TYPE_DEFS[t].color).toMatch(/^#/);
    }
  });

  it('CONVERSIONS declares the v1 set', () => {
    const ids = CONVERSIONS.map((c) => c.id).sort();
    expect(ids).toEqual([
      'pipeline:boolean-to-string',
      'pipeline:number-to-string',
      'pipeline:string-to-boolean',
      'pipeline:string-to-number',
    ].sort());
  });

  it('parseNumberOrThrow accepts numerics, throws on garbage', () => {
    expect(parseNumberOrThrow('42')).toBe(42);
    expect(parseNumberOrThrow('-3.5')).toBe(-3.5);
    expect(() => parseNumberOrThrow('abc')).toThrow();
    expect(() => parseNumberOrThrow('NaN')).toThrow();
  });

  it('parseBooleanOrThrow accepts true-ish / false-ish / throws otherwise', () => {
    expect(parseBooleanOrThrow('true')).toBe(true);
    expect(parseBooleanOrThrow(' YES ')).toBe(true);
    expect(parseBooleanOrThrow('1')).toBe(true);
    expect(parseBooleanOrThrow('false')).toBe(false);
    expect(parseBooleanOrThrow('0')).toBe(false);
    expect(parseBooleanOrThrow('')).toBe(false);
    expect(() => parseBooleanOrThrow('maybe')).toThrow();
  });

  it('dataTypeFromJsonSchema unchanged for primitives', () => {
    expect(dataTypeFromJsonSchema({ type: 'string' })).toBe('string');
    expect(dataTypeFromJsonSchema({ type: 'integer' })).toBe('number');
  });
});
