/** Pure shape predicates used by widget renderers to decide whether to render
 *  the widget or fall through to the read-only leaf. Per the spec, mismatches
 *  emit one console.warn per slot via warn.ts. */

export function isString(v: unknown): v is string {
  return typeof v === 'string';
}

export function isNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function isNumberPair(v: unknown): v is [number, number] {
  return Array.isArray(v) && v.length === 2 && isNumber(v[0]) && isNumber(v[1]);
}

export function isNumberRecord(v: unknown): v is Record<string, number> {
  if (v === null || typeof v !== 'object') return false;
  if (Array.isArray(v)) return false;
  for (const val of Object.values(v as Record<string, unknown>)) {
    if (!isNumber(val)) return false;
  }
  return true;
}

export function isStringOrStringArray(v: unknown): v is string | string[] {
  if (typeof v === 'string') return true;
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export function isFileOrFileArrayOrNull(v: unknown): v is File | File[] | null {
  if (v === null) return true;
  if (typeof File !== 'undefined' && v instanceof File) return true;
  return Array.isArray(v) && v.every((x) => typeof File !== 'undefined' && x instanceof File);
}
