export interface SettleState {
  escapePressed: boolean;
  userTouched: boolean;
  currentValue: string;
}

/**
 * Decides what value to resolve the pick promise with, based on the wrapper's
 * end-of-life flags. Pure function — owned here so it's exhaustively unit-
 * testable without mounting the wrapper.
 *
 * - Escape pressed (any time)        → null   ("user dismissed")
 * - Never interacted (no onChange)   → null   ("dismissed without picking")
 * - Otherwise                        → currentValue
 */
export function decideSettleValue(state: SettleState): string | null {
  if (state.escapePressed) return null;
  if (!state.userTouched) return null;
  return state.currentValue;
}

/**
 * Coerces an `opts.initial` value to a guaranteed valid `#rrggbb` string.
 * Anything that doesn't match the strict 6-digit hex pattern (including
 * undefined, 3-digit shorthand, RGBA 8-digit, or non-hex) becomes `#000000`.
 * Matches the standalone view's "invalid hex falls back to #000000" rule
 * documented in docs/sh3-editor/color-picker.md §2.
 */
export function normalizeOrFallback(initial: string | undefined): string {
  if (initial && /^#[0-9a-f]{6}$/i.test(initial)) return initial;
  return '#000000';
}
