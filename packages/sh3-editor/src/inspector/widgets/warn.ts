/** Per-(slotId, tag) dedupe of widget fallback warnings. The walker re-renders
 *  on every value mutation; without dedupe, a tagged-but-mismatched field
 *  spams the console. Module-level state is fine — entries leak harmlessly
 *  for the lifetime of the page and reset on full reload. */

const seen = new Set<string>();

export function warnOnce(slotId: string, tag: string, message: string): void {
  const key = `${slotId}\0${tag}`;
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(`[sh3-editor:inspector ${slotId} ${tag}] ${message}`);
}

/** Test-only. Production has no reset hook — by design, warns are page-lifetime. */
export function __resetWarnState(): void {
  seen.clear();
}
