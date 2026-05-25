/**
 * Canonical key for matching a stored selection against a freshly-fetched
 * list of rows. Uses the stringified value-field when present and resolvable;
 * otherwise falls back to a stable JSON-stringified row (keys sorted) so two
 * rows with the same content always hash to the same key.
 */
export function keyOf(
  row: Record<string, unknown>,
  valueField: string | null,
): string {
  if (valueField !== null) {
    const v = row[valueField];
    if (v !== null && v !== undefined) return String(v);
  }
  return stableStringify(row);
}

function stableStringify(obj: Record<string, unknown>): string {
  const keys = Object.keys(obj).sort();
  const sorted: Record<string, unknown> = {};
  for (const k of keys) sorted[k] = obj[k];
  return JSON.stringify(sorted);
}
