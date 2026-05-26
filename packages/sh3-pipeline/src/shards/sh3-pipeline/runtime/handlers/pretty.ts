/**
 * Render a value as a single human-readable string suitable for a RunLog
 * `message` field. Strings pass through verbatim; primitives stringify;
 * records and arrays JSON pretty-print (2-space indent). Falls back to
 * `String(v)` if JSON.stringify throws (e.g. circular).
 */
export function toDisplay(v: unknown): string {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    try { return JSON.stringify(v, null, 2); }
    catch { return String(v); }
  }
  return String(v);
}
