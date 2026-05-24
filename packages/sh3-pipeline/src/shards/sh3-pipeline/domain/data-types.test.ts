import { describe, it, expect } from 'vitest';
import { dataTypeFromJsonSchema } from './data-types';

describe('dataTypeFromJsonSchema', () => {
  it('null / non-object schema → unknown', () => {
    expect(dataTypeFromJsonSchema(null)).toBe('unknown');
    expect(dataTypeFromJsonSchema(undefined)).toBe('unknown');
    expect(dataTypeFromJsonSchema('string')).toBe('unknown');
    expect(dataTypeFromJsonSchema(42)).toBe('unknown');
  });

  it('primitive types map directly', () => {
    expect(dataTypeFromJsonSchema({ type: 'string' })).toBe('string');
    expect(dataTypeFromJsonSchema({ type: 'number' })).toBe('number');
    expect(dataTypeFromJsonSchema({ type: 'integer' })).toBe('number');
    expect(dataTypeFromJsonSchema({ type: 'boolean' })).toBe('boolean');
    expect(dataTypeFromJsonSchema({ type: 'array' })).toBe('array');
    expect(dataTypeFromJsonSchema({ type: 'object' })).toBe('record');
  });

  it('unknown type → unknown', () => {
    expect(dataTypeFromJsonSchema({ type: 'null' })).toBe('unknown');
    expect(dataTypeFromJsonSchema({})).toBe('unknown');
  });

  it('format: "sh3-document" short-circuits to doc regardless of type', () => {
    expect(dataTypeFromJsonSchema({ type: 'object', format: 'sh3-document' })).toBe('doc');
    expect(dataTypeFromJsonSchema({ format: 'sh3-document' })).toBe('doc');
  });
});
