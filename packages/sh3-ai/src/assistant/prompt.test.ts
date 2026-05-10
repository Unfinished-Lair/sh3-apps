import { describe, it, expect } from 'vitest';
import { buildPrompt, formatValue, truncate, type ContextEntry } from './prompt';

describe('truncate', () => {
  it('returns the input unchanged when shorter than max', () => {
    expect(truncate('hello', 100)).toBe('hello');
  });
  it('returns the input unchanged when exactly max', () => {
    expect(truncate('abc', 3)).toBe('abc');
  });
  it('slices and appends marker when longer than max', () => {
    expect(truncate('abcdef', 3)).toBe('abc\n…[truncated]');
  });
});

describe('formatValue', () => {
  it('returns string kind values verbatim', () => {
    expect(formatValue('hello', 'string')).toBe('hello');
  });
  it('stringifies number kind', () => {
    expect(formatValue(42, 'number')).toBe('42');
  });
  it('stringifies integer kind', () => {
    expect(formatValue(7, 'integer')).toBe('7');
  });
  it('stringifies boolean kind', () => {
    expect(formatValue(true, 'boolean')).toBe('true');
  });
  it('stringifies enum values as primitives', () => {
    expect(formatValue('open', 'enum')).toBe('open');
  });
  it('JSON.stringifies json kind with 2-space indent', () => {
    expect(formatValue({ a: 1 }, 'json')).toBe('{\n  "a": 1\n}');
  });
  it('truncates string kind past 8000 chars', () => {
    const long = 'x'.repeat(9000);
    const out = formatValue(long, 'string');
    expect(out.endsWith('\n…[truncated]')).toBe(true);
    expect(out.length).toBe(8000 + '\n…[truncated]'.length);
  });
  it('truncates json kind past 8000 chars on the stringified form', () => {
    const big = { s: 'x'.repeat(9000) };
    const out = formatValue(big, 'json');
    expect(out.endsWith('\n…[truncated]')).toBe(true);
  });
});

describe('buildPrompt', () => {
  it('omits the CONTEXT block when contexts is empty', () => {
    const out = buildPrompt({
      original: 'orig',
      instruction: 'rewrite cleaner',
      contexts: [],
    });
    expect(out).not.toContain('--- CONTEXT ---');
    expect(out).toContain('--- ORIGINAL ---\norig');
    expect(out).toContain('--- INSTRUCTION ---\nrewrite cleaner');
  });

  it('includes a CONTEXT block with one labeled entry', () => {
    const ctxs: ContextEntry[] = [
      { shardId: 'sh3-editor', fieldId: 'title', label: 'Title', kind: 'string', value: 'My Project' },
    ];
    const out = buildPrompt({ original: 'orig', instruction: 'tweak', contexts: ctxs });
    expect(out).toContain('--- CONTEXT ---\n[Title] (sh3-editor)\nMy Project\n');
    expect(out.indexOf('--- CONTEXT ---')).toBeLessThan(out.indexOf('--- ORIGINAL ---'));
  });

  it('includes multiple context entries in order', () => {
    const ctxs: ContextEntry[] = [
      { shardId: 'sh3-editor', fieldId: 'title', label: 'Title', kind: 'string', value: 'A' },
      { shardId: 'sh3-editor', fieldId: 'summary', label: 'Summary', kind: 'string', value: 'B' },
    ];
    const out = buildPrompt({ original: 'orig', instruction: 'tweak', contexts: ctxs });
    expect(out.indexOf('[Title] (sh3-editor)')).toBeLessThan(out.indexOf('[Summary] (sh3-editor)'));
  });

  it('keeps the legacy preamble lines', () => {
    const out = buildPrompt({ original: 'o', instruction: 'i', contexts: [] });
    expect(out.startsWith("Rewrite the following text per the user's instruction.\nReturn ONLY the rewritten text, no commentary.\n")).toBe(true);
  });
});
