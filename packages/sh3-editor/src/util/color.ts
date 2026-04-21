/** HSV / RGB / Hex color conversion utilities. Ported from GraphLive's
 *  src/lib/utils/color.ts with normalization + validation helpers added. */

export interface HSV {
  h: number; // 0–360
  s: number; // 0–100
  v: number; // 0–100
}

export interface RGB {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
}

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const s1 = s / 100;
  const v1 = v / 100;
  const c = v1 * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v1 - c;

  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60)        { r1 = c; g1 = x; }
  else if (h < 120)  { r1 = x; g1 = c; }
  else if (h < 180)  { g1 = c; b1 = x; }
  else if (h < 240)  { g1 = x; b1 = c; }
  else if (h < 300)  { r1 = x; b1 = c; }
  else               { r1 = c; b1 = x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r1)      h = 60 * (((g1 - b1) / d) % 6);
    else if (max === g1) h = 60 * ((b1 - r1) / d + 2);
    else                 h = 60 * ((r1 - g1) / d + 4);
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;

  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export function hexToRgb(hex: string): RGB {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv));
}

export function hexToHsv(hex: string): HSV {
  return rgbToHsv(hexToRgb(hex));
}

/** True when `s` is a valid hex color ('#fff', 'fff', '#ffffff', 'ffffff'), case-insensitive. */
export function validateHex(s: string): boolean {
  return HEX_RE.test(s);
}

/** Canonicalize input to a 6-digit lowercase hex with a leading '#'. Returns null when invalid. */
export function normalizeHex(s: string): string | null {
  if (!validateHex(s)) return null;
  let h = s.replace(/^#/, '').toLowerCase();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return `#${h}`;
}
