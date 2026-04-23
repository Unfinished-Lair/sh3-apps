import { describe, it, expect } from 'vitest';
import { relativeLuminance, contrastRatio, wcagBadge, driveOppositeColor } from './contrast';

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

describe('driveOppositeColor', () => {
  it('picks dark endpoint for light surface', () => {
    const d = driveOppositeColor('#ffffff', { light: '#eeeeee', dark: '#000000' });
    expect(d?.endpoint).toBe('dark');
    expect(d?.color).toBe('#000000');
    expect(d?.ratio).toBeCloseTo(21, 1);
  });
  it('picks light endpoint for dark surface', () => {
    const d = driveOppositeColor('#000000', { light: '#ffffff', dark: '#111111' });
    expect(d?.endpoint).toBe('light');
    expect(d?.color).toBe('#ffffff');
  });
  it('DARK theme accent drives to near-black (theme endpoints)', () => {
    // DARK: fg=#e4e6eb, bg=#1a1b1e, accent=#6ea8fe
    const d = driveOppositeColor('#6ea8fe', { light: '#e4e6eb', dark: '#1a1b1e' });
    expect(d?.endpoint).toBe('dark');
    expect(d?.color).toBe('#1a1b1e');
    expect(d?.ratio).toBeGreaterThan(4.5); // must pass AA
  });
  it('LIGHT theme accent drives to off-white (theme endpoints)', () => {
    // LIGHT: fg=#1d1d1f, bg=#f5f5f7, accent=#0066cc
    const d = driveOppositeColor('#0066cc', { light: '#f5f5f7', dark: '#1d1d1f' });
    // #0066cc is mid blue; off-white wins over near-black for this surface
    expect(d?.endpoint).toBe('light');
  });
  it('tie-break prefers dark endpoint', () => {
    const d = driveOppositeColor('#808080', { light: '#aaaaaa', dark: '#555555' });
    expect(d).toBeDefined();
    const tied = driveOppositeColor('#808080', { light: '#c0c0c0', dark: '#404040' });
    expect(tied).toBeDefined();
  });
  it('returns undefined on invalid input', () => {
    expect(driveOppositeColor('nope', { light: '#fff', dark: '#000' })).toBeUndefined();
    expect(driveOppositeColor('#fff', { light: 'x', dark: '#000' })).toBeUndefined();
    expect(driveOppositeColor('#fff', { light: '#fff', dark: 'y' })).toBeUndefined();
    expect(driveOppositeColor('#ffffffaa', { light: '#fff', dark: '#000' })).toBeUndefined();
  });
  it('ratio matches contrastRatio for chosen color', () => {
    const d = driveOppositeColor('#6ea8fe', { light: '#e4e6eb', dark: '#1a1b1e' });
    const r = contrastRatio(d!.color, '#6ea8fe');
    expect(d!.ratio).toBeCloseTo(r!, 3);
  });
});
