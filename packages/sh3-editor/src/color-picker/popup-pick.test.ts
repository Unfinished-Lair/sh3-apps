import { describe, it, expect } from 'vitest';
import { decideSettleValue, normalizeOrFallback } from './popup-pick';

describe('decideSettleValue', () => {
  it('returns null when Escape was pressed (regardless of touch)', () => {
    expect(decideSettleValue({ escapePressed: true,  userTouched: true,  currentValue: '#abcdef' })).toBe(null);
    expect(decideSettleValue({ escapePressed: true,  userTouched: false, currentValue: '#abcdef' })).toBe(null);
  });

  it('returns null when user never touched the picker', () => {
    expect(decideSettleValue({ escapePressed: false, userTouched: false, currentValue: '#abcdef' })).toBe(null);
  });

  it('returns currentValue when user touched and did not press Escape', () => {
    expect(decideSettleValue({ escapePressed: false, userTouched: true,  currentValue: '#abcdef' })).toBe('#abcdef');
  });
});

describe('normalizeOrFallback', () => {
  it('returns valid #rrggbb input unchanged', () => {
    expect(normalizeOrFallback('#abcdef')).toBe('#abcdef');
    expect(normalizeOrFallback('#FF8800')).toBe('#FF8800');
  });

  it('returns #000000 for undefined', () => {
    expect(normalizeOrFallback(undefined)).toBe('#000000');
  });

  it('returns #000000 for malformed strings', () => {
    expect(normalizeOrFallback('garbage')).toBe('#000000');
    expect(normalizeOrFallback('#abc')).toBe('#000000');
    expect(normalizeOrFallback('#abcdefgh')).toBe('#000000');
    expect(normalizeOrFallback('rgb(1,2,3)')).toBe('#000000');
    expect(normalizeOrFallback('')).toBe('#000000');
  });
});
