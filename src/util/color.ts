import type { GradientMode } from '../types';

/** Check if a string is a valid hex color (#rgb, #rrggbb, #rrggbbaa). */
export function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

/**
 * Build a CSS gradient string from mode and color stops.
 *
 * - vertical: top → bottom (180deg), 2 colors
 * - horizontal: left → right (90deg), 2 colors
 * - 4-corner: approximated with layered radial gradients at each corner
 */
export function buildGradient(
  mode: GradientMode,
  colors: string[],
): string {
  switch (mode) {
    case 'vertical':
      return `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`;
    case 'horizontal':
      return `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`;
    case '4-corner':
      return [
        `linear-gradient(135deg, ${colors[0]} 0%, transparent 50%)`,
        `linear-gradient(225deg, ${colors[1]} 0%, transparent 50%)`,
        `linear-gradient(315deg, ${colors[2]} 0%, transparent 50%)`,
        `linear-gradient(45deg, ${colors[3]} 0%, transparent 50%)`,
      ].join(', ');
    default:
      return colors[0];
  }
}

/**
 * Parse a CSS gradient string back into mode + colors.
 * Returns undefined if the string doesn't match a known pattern.
 */
export function parseGradient(
  css: string,
): { mode: GradientMode; colors: string[] } | undefined {
  // Check for 4-corner (multiple linear-gradient layers)
  if (css.includes('135deg') && css.includes('225deg')) {
    const hexes = css.match(/#[0-9a-fA-F]{3,8}/g);
    if (hexes && hexes.length >= 4) {
      return { mode: '4-corner', colors: hexes.slice(0, 4) };
    }
  }
  // Check for vertical (180deg)
  const vertMatch = css.match(/linear-gradient\(180deg,\s*(#[0-9a-fA-F]{3,8}),\s*(#[0-9a-fA-F]{3,8})\)/);
  if (vertMatch) {
    return { mode: 'vertical', colors: [vertMatch[1], vertMatch[2]] };
  }
  // Check for horizontal (90deg)
  const horizMatch = css.match(/linear-gradient\(90deg,\s*(#[0-9a-fA-F]{3,8}),\s*(#[0-9a-fA-F]{3,8})\)/);
  if (horizMatch) {
    return { mode: 'horizontal', colors: [horizMatch[1], horizMatch[2]] };
  }
  // Generic linear-gradient with angle
  const genericMatch = css.match(/linear-gradient\(\d+deg,\s*(#[0-9a-fA-F]{3,8})[^,]*,\s*(#[0-9a-fA-F]{3,8})/);
  if (genericMatch) {
    return { mode: 'vertical', colors: [genericMatch[1], genericMatch[2]] };
  }
  return undefined;
}
