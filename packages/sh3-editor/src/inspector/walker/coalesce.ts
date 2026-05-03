/** Decision returned by `decideCoalesce`. The walker turns this into either
 *  `api.push(cmd)` or `api.history.replaceTop(cmd)`, with the command's
 *  `revert` closure capturing `before`. */
export interface CoalesceDecision {
  action: 'push' | 'replaceTop';
  /** The pre-gesture value to use as the command's revert target. For 'push'
   *  this is captured fresh from the call; for 'replaceTop' this is the
   *  before-value captured on the first call of the gesture. */
  before: unknown;
}

interface Entry {
  key: string;
  before: unknown;
}

/** Per-walker-instance state. The walker creates one of these in its script
 *  scope and clears entries on gesture-end (no-key onCommit) or on remount. */
export interface CoalesceState {
  clear(path: string): void;
  /** Internal: only `decideCoalesce` should read or write this. Exposed
   *  on the interface so the decision function can stay a free function. */
  readonly _entries: Map<string, Entry>;
}

export function makeCoalesceState(): CoalesceState {
  const entries = new Map<string, Entry>();
  return {
    clear(path) { entries.delete(path); },
    _entries: entries,
  };
}

/** First call with any new (path, key) combination returns
 *  { action: 'push', before: <captured-now> } and stores the entry.
 *  Subsequent calls with the same (path, key) return
 *  { action: 'replaceTop', before: <stored> }. */
export function decideCoalesce(
  state: CoalesceState,
  path: string,
  key: string,
  currentBefore: unknown,
): CoalesceDecision {
  const existing = state._entries.get(path);
  if (existing && existing.key === key) {
    return { action: 'replaceTop', before: existing.before };
  }
  state._entries.set(path, { key, before: currentBefore });
  return { action: 'push', before: currentBefore };
}
