export type Errors = Record<string, Record<string, string>>;

/** Pure: return a new Errors map with `[shardId][key]` set to `msg`, or cleared when msg === undefined. */
export function setError(
  prev: Errors,
  shardId: string,
  key: string,
  msg: string | undefined,
): Errors {
  const shardErrors = { ...(prev[shardId] ?? {}) };
  if (msg === undefined) delete shardErrors[key];
  else shardErrors[key] = msg;
  return { ...prev, [shardId]: shardErrors };
}

/** Pure: return an Errors map containing only entries for shards in `activeShardIds`.
 *  Returns `prev` unchanged (same reference) when nothing needs pruning, so callers
 *  inside Svelte `$effect` can assign the result without triggering a re-run. */
export function pruneErrors(prev: Errors, activeShardIds: string[]): Errors {
  const prevKeys = Object.keys(prev);
  if (prevKeys.length === 0) return prev;
  const active = new Set(activeShardIds);
  let needsPrune = false;
  for (const sid of prevKeys) {
    if (!active.has(sid)) {
      needsPrune = true;
      break;
    }
  }
  if (!needsPrune) return prev;
  const next: Errors = {};
  for (const sid of prevKeys) {
    if (active.has(sid)) next[sid] = prev[sid];
  }
  return next;
}
