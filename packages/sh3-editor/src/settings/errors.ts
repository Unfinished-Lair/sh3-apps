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

/** Pure: return a new Errors map containing only entries for shards in `activeShardIds`. */
export function pruneErrors(prev: Errors, activeShardIds: string[]): Errors {
  const active = new Set(activeShardIds);
  const next: Errors = {};
  for (const sid of Object.keys(prev)) {
    if (active.has(sid)) next[sid] = prev[sid];
  }
  return next;
}
