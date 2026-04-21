import { describe, it, expect } from 'vitest';
import {
  hsvToRgb,
  rgbToHsv,
  hexToRgb,
  rgbToHex,
  hsvToHex,
  hexToHsv,
  validateHex,
  normalizeHex,
} from './color';

describe('rgbToHex', () => {
  it('lowercases and pads', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 15, g: 15, b: 15 })).toBe('#0f0f0f');
  });
});

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('expands 3-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#f0a')).toEqual({ r: 255, g: 0, b: 170 });
  });

  it('tolerates missing leading #', () => {
    expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('fff')).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe('hex ↔ rgb round-trip', () => {
  const fixtures = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#8a2be2', '#808080'];
  for (const hex of fixtures) {
    it(`round-trips ${hex}`, () => {
      expect(rgbToHex(hexToRgb(hex))).toBe(hex);
    });
  }
});

describe('hsv ↔ rgb round-trip', () => {
  const fixtures = [
    { h: 0, s: 100, v: 100 },   // red
    { h: 120, s: 100, v: 100 }, // green
    { h: 240, s: 100, v: 100 }, // blue
    { h: 0, s: 0, v: 0 },       // black
    { h: 0, s: 0, v: 100 },     // white
    { h: 0, s: 0, v: 50 },      // gray
  ];
  for (const hsv of fixtures) {
    it(`round-trips ${JSON.stringify(hsv)}`, () => {
      const rgb = hsvToRgb(hsv);
      const back = rgbToHsv(rgb);
      // hue is meaningless when s === 0; otherwise must round-trip exactly (rounded).
      if (hsv.s > 0) expect(back.h).toBe(hsv.h);
      expect(back.s).toBe(hsv.s);
      expect(back.v).toBe(hsv.v);
    });
  }
});

describe('hsv ↔ hex round-trip', () => {
  it('round-trips pure colors', () => {
    expect(hsvToHex({ h: 0, s: 100, v: 100 })).toBe('#ff0000');
    expect(hsvToHex({ h: 120, s: 100, v: 100 })).toBe('#00ff00');
    expect(hsvToHex({ h: 240, s: 100, v: 100 })).toBe('#0000ff');
  });

  it('hexToHsv → hsvToHex fixed points', () => {
    const fixtures = ['#ff0000', '#00ff00', '#0000ff', '#000000', '#ffffff'];
    for (const hex of fixtures) {
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
    }
  });
});

describe('validateHex', () => {
  it('accepts valid forms', () => {
    expect(validateHex('#fff')).toBe(true);
    expect(validateHex('#FFFFFF')).toBe(true);
    expect(validateHex('fff')).toBe(true);
    expect(validateHex('FFFFFF')).toBe(true);
    expect(validateHex('#a1b2c3')).toBe(true);
  });

  it('rejects invalid forms', () => {
    expect(validateHex('')).toBe(false);
    expect(validateHex('#')).toBe(false);
    expect(validateHex('#gg')).toBe(false);
    expect(validateHex('#ff')).toBe(false);
    expect(validateHex('#fffff')).toBe(false);
    expect(validateHex('foo')).toBe(false);
    expect(validateHex('#gggggg')).toBe(false);
  });
});

describe('normalizeHex', () => {
  it('returns lowercased 6-digit hex with leading #', () => {
    expect(normalizeHex('fff')).toBe('#ffffff');
    expect(normalizeHex('#FFF')).toBe('#ffffff');
    expect(normalizeHex('FF0000')).toBe('#ff0000');
    expect(normalizeHex('#ff0000')).toBe('#ff0000');
  });

  it('returns null for invalid input', () => {
    expect(normalizeHex('gg')).toBeNull();
    expect(normalizeHex('')).toBeNull();
  });
});
