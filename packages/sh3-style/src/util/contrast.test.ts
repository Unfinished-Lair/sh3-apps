import { describe, it, expect } from 'vitest';
import { relativeLuminance, contrastRatio, wcagBadge } from './contrast';

describe('relativeLuminance', () => {
  it('returns 1 for white', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });
  it('returns 0 for black', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
  });
  it('accepts 3-digit hex', () => {
    expect(relativeLuminance('#fff')).toBeCloseTo(1, 5);
    expect(relativeLuminance('#000')).toBeCloseTo(0, 5);
  });
  it('returns undefined for invalid hex (garbage, wrong length, alpha)', () => {
    expect(relativeLuminance('not a color')).toBeUndefined();
    expect(relativeLuminance('#ff')).toBeUndefined();
    expect(relativeLuminance('#ffffffaa')).toBeUndefined();
  });
});

describe('contrastRatio', () => {
  it('21 for white on black', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
  });
  it('1 for identical colors', () => {
    expect(contrastRatio('#abcdef', '#abcdef')).toBeCloseTo(1, 5);
  });
  it('about 4.48 for #777 on #fff', () => {
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
  });
  it('symmetric', () => {
    const a = contrastRatio('#123456', '#abcdef');
    const b = contrastRatio('#abcdef', '#123456');
    expect(a).toEqual(b);
  });
  it('returns undefined for invalid', () => {
    expect(contrastRatio('nope', '#fff')).toBeUndefined();
    expect(contrastRatio('#fff', 'nope')).toBeUndefined();
  });
});

describe('wcagBadge', () => {
  it('text thresholds', () => {
    expect(wcagBadge(7, 'text')).toBe('AAA');
    expect(wcagBadge(6.99, 'text')).toBe('AA');
    expect(wcagBadge(4.5, 'text')).toBe('AA');
    expect(wcagBadge(4.49, 'text')).toBe('fail');
  });
  it('ui thresholds', () => {
    expect(wcagBadge(4.5, 'ui')).toBe('AAA');
    expect(wcagBadge(4.49, 'ui')).toBe('AA');
    expect(wcagBadge(3, 'ui')).toBe('AA');
    expect(wcagBadge(2.99, 'ui')).toBe('fail');
  });
});
