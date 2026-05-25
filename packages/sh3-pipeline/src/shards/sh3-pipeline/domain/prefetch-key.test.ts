import { describe, expect, it } from 'vitest';
import { keyOf } from './prefetch-key';

describe('keyOf', () => {
  it('stringifies the valueField value when valueField is set', () => {
    expect(keyOf({ id: 'workspace-acme', name: 'Acme' }, 'id')).toBe('workspace-acme');
  });

  it('coerces numeric value-field to string', () => {
    expect(keyOf({ id: 42, name: 'forty-two' }, 'id')).toBe('42');
  });

  it('coerces boolean value-field to string', () => {
    expect(keyOf({ active: true }, 'active')).toBe('true');
  });

  it('returns JSON of the row when valueField is null', () => {
    expect(keyOf({ a: 1, b: 'x' }, null)).toBe('{"a":1,"b":"x"}');
  });

  it('returns JSON of the row when the value-field is missing on the row', () => {
    expect(keyOf({ id: 'x' }, 'missing')).toBe('{"id":"x"}');
  });

  it('returns JSON of the row when the value-field exists but is null/undefined', () => {
    expect(keyOf({ id: null }, 'id')).toBe('{"id":null}');
  });

  it('handles deterministic JSON ordering by sorting keys', () => {
    expect(keyOf({ b: 2, a: 1 }, null)).toBe(keyOf({ a: 1, b: 2 }, null));
  });
});
