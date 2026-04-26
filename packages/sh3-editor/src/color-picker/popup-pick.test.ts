import { describe, it, expect } from 'vitest';
import { decideSettleValue } from './popup-pick';

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
