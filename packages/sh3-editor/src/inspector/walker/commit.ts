import type { WalkerCommitOverride } from '../../types';

/** Route a field-site commit through an optional consumer override before the walker's
 *  default apply-and-push fallback. Returns whether the consumer handled the edit. */
export function attemptCommit(
  override: WalkerCommitOverride | undefined,
  path: (string | number)[],
  next: unknown,
  fallback: () => void,
): boolean {
  if (override) {
    const handled = override(path, next);
    if (handled === true) return true;
  }
  fallback();
  return false;
}
