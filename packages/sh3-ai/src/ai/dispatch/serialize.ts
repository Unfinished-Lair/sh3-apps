export interface SerializeOptions {
  /** Hard cap on output length in characters. Default 4096. */
  maxBytes?: number;
}

const DEFAULT_MAX = 4_096;

interface MaybeLLMString {
  toLLMString(): string;
}

function hasToLLMString(v: unknown): v is MaybeLLMString {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as { toLLMString?: unknown }).toLLMString === 'function'
  );
}

export function serializeResult(value: unknown, opts?: SerializeOptions): string {
  const max = opts?.maxBytes ?? DEFAULT_MAX;
  let raw: string;

  if (typeof value === 'string') {
    raw = value;
  } else if (hasToLLMString(value)) {
    raw = value.toLLMString();
  } else {
    try {
      const json = JSON.stringify(value, null, 2);
      raw = json === undefined ? String(value) : json;
    } catch {
      raw = String(value);
    }
  }

  if (raw.length <= max) return raw;
  const elided = raw.length - max;
  return `${raw.slice(0, max)} … [truncated, ${elided} bytes elided]`;
}
