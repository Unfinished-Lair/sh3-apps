/** WCAG 2.1 contrast math. */

/** 3- or 6-digit hex without alpha. */
const HEX_NO_ALPHA = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function parseHex(hex: string): [number, number, number] | undefined {
  if (!HEX_NO_ALPHA.test(hex)) return undefined;
  let h = hex.slice(1);
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function linearize(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

/** Relative luminance per WCAG 2.1. Returns undefined on invalid hex. */
export function relativeLuminance(hex: string): number | undefined {
  const rgb = parseHex(hex);
  if (!rgb) return undefined;
  const [r, g, b] = rgb.map(linearize) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two hex colors per WCAG 2.1. Undefined on invalid input. */
export function contrastRatio(a: string, b: string): number | undefined {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === undefined || lb === undefined) return undefined;
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagBadge = 'AAA' | 'AA' | 'fail';
export type WcagUsage = 'text' | 'ui';

/** Badge for a ratio. `text` uses 4.5/7 thresholds; `ui` uses 3/4.5. */
export function wcagBadge(ratio: number, usage: WcagUsage): WcagBadge {
  if (usage === 'text') {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'fail';
  }
  if (ratio >= 4.5) return 'AAA';
  if (ratio >= 3) return 'AA';
  return 'fail';
}
