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
