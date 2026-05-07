import { describe, it, expect } from 'vitest';
import { serializeResult } from './serialize';

describe('serializeResult', () => {
  it('returns a string as-is', () => {
    expect(serializeResult('hello')).toBe('hello');
  });

  it('calls toLLMString() when present', () => {
    const obj = { toLLMString: () => 'custom-form' };
    expect(serializeResult(obj)).toBe('custom-form');
  });

  it('JSON-stringifies plain objects', () => {
    expect(serializeResult({ a: 1, b: 'x' })).toBe('{\n  "a": 1,\n  "b": "x"\n}');
  });

  it('falls back to String() for non-serializable values', () => {
    expect(serializeResult(undefined)).toBe('undefined');
    expect(serializeResult(null)).toBe('null');
  });

  it('truncates strings longer than the cap', () => {
    const big = 'x'.repeat(5_000);
    const out = serializeResult(big, { maxBytes: 4_096 });
    expect(out.length).toBeLessThanOrEqual(4_096 + 64); // cap + truncation suffix
    expect(out).toMatch(/\[truncated, \d+ bytes elided\]$/);
  });

  it('does not truncate when under the cap', () => {
    const small = 'short';
    expect(serializeResult(small, { maxBytes: 4_096 })).toBe('short');
  });

  it('truncates JSON output that exceeds the cap', () => {
    const obj = { data: 'x'.repeat(5_000) };
    const out = serializeResult(obj, { maxBytes: 4_096 });
    expect(out.length).toBeLessThanOrEqual(4_096 + 64);
    expect(out).toMatch(/\[truncated, \d+ bytes elided\]$/);
  });
});
