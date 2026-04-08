import type { KeySummary } from '../types';

/**
 * Generate a human-readable type summary for a single value.
 * Designed for top-level display; does not recurse into nested objects.
 */
export function summarizeType(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  switch (typeof value) {
    case 'string':
      return value.length <= 20 ? `string("${value}")` : 'string';
    case 'number':
      return String(value);
    case 'boolean':
      return String(value);
    default:
      break;
  }

  if (Array.isArray(value)) {
    return `array[${value.length}]`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>);
    return `object{${keys.length} keys}`;
  }

  return typeof value;
}

/**
 * Summarize all top-level keys of an object into display-friendly entries.
 * Returns an empty array if the value is not an object.
 */
export function summarizeKeys(data: unknown): KeySummary[] {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return [];
  }
  const obj = data as Record<string, unknown>;
  return Object.keys(obj).map((key) => ({
    key,
    typeSummary: summarizeType(obj[key]),
  }));
}
