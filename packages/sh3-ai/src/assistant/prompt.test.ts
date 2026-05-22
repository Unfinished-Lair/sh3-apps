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
  it('JSON.stringifies json kind with 2-space indent inside ```json fences', () => {
    expect(formatValue({ a: 1 }, 'json')).toBe('```json\n{\n  "a": 1\n}\n```');
  });
  it('wraps markdown kind in ```markdown fences', () => {
    expect(formatValue('# title', 'markdown')).toBe('```markdown\n# title\n```');
  });
  it('returns text kind verbatim (no fence)', () => {
    expect(formatValue('plain', 'text')).toBe('plain');
  });
  it('truncates string kind past 8000 chars', () => {
    const long = 'x'.repeat(9000);
    const out = formatValue(long, 'string');
    expect(out.endsWith('\n…[truncated]')).toBe(true);
    expect(out.length).toBe(8000 + '\n…[truncated]'.length);
  });
  it('truncates json kind past 8000 chars and still fences the truncated body', () => {
    const big = { s: 'x'.repeat(9000) };
    const out = formatValue(big, 'json');
    expect(out.startsWith('```json\n')).toBe(true);
    expect(out.endsWith('\n…[truncated]\n```')).toBe(true);
  });
  it('truncates markdown kind past 8000 chars inside the fence', () => {
    const big = 'm'.repeat(9000);
    const out = formatValue(big, 'markdown');
    expect(out.startsWith('```markdown\n')).toBe(true);
    expect(out.endsWith('\n…[truncated]\n```')).toBe(true);
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

  it('includes a CONTEXT block with one field entry using the field: origin header', () => {
    const ctxs: ContextEntry[] = [
      {
        origin: 'field',
        originKey: 'sh3-editor:title',
        label: 'Title',
        kind: 'string',
        value: 'My Project',
      },
    ];
    const out = buildPrompt({ original: 'orig', instruction: 'tweak', contexts: ctxs });
    expect(out).toContain('--- CONTEXT ---\n[Title] (field:sh3-editor:title)\nMy Project\n');
    expect(out.indexOf('--- CONTEXT ---')).toBeLessThan(out.indexOf('--- ORIGINAL ---'));
  });

  it('includes a source entry with the source: origin header and fenced markdown', () => {
    const ctxs: ContextEntry[] = [
      {
        origin: 'source',
        originKey: 'my-app:current-notes',
        label: 'Current notes',
        kind: 'markdown',
        value: '# h',
      },
    ];
    const out = buildPrompt({ original: 'o', instruction: 'i', contexts: ctxs });
    expect(out).toContain('[Current notes] (source:my-app:current-notes)\n```markdown\n# h\n```\n');
  });

  it('includes a document entry with the document: origin header', () => {
    const ctxs: ContextEntry[] = [
      {
        origin: 'document',
        originKey: 'sh3-server:docs/README.md',
        label: 'README.md',
        kind: 'markdown',
        value: '# Hello',
      },
    ];
    const out = buildPrompt({ original: 'o', instruction: 'i', contexts: ctxs });
    expect(out).toContain('[README.md] (document:sh3-server:docs/README.md)\n```markdown\n# Hello\n```\n');
  });

  it('preserves entry order across mixed origins', () => {
    const ctxs: ContextEntry[] = [
      { origin: 'field',  originKey: 'sh3-editor:title', label: 'Title', kind: 'string',   value: 'A' },
      { origin: 'source', originKey: 'my-app:notes',     label: 'Notes', kind: 'markdown', value: 'B' },
    ];
    const out = buildPrompt({ original: 'o', instruction: 'i', contexts: ctxs });
    expect(out.indexOf('[Title] (field:sh3-editor:title)'))
      .toBeLessThan(out.indexOf('[Notes] (source:my-app:notes)'));
  });

  it('keeps the legacy preamble lines', () => {
    const out = buildPrompt({ original: 'o', instruction: 'i', contexts: [] });
    expect(out.startsWith("Rewrite the following text per the user's instruction.\nReturn ONLY the rewritten text, no commentary.\n")).toBe(true);
  });
});
