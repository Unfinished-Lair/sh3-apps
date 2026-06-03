import { describe, it, expect } from 'vitest';
import { resolveHighlighter } from './highlight-resolve';
import type { EditorHighlighterContribution } from './contributions';

function hl(id: string, fn: (t: string, l: string) => string, extra: Partial<EditorHighlighterContribution> = {}): EditorHighlighterContribution {
  return { id, highlight: fn, ...extra };
}

describe('resolveHighlighter', () => {
  it('returns null when language is null', () => {
    const list = [hl('a', (t) => t)];
    expect(resolveHighlighter(list, null)).toBeNull();
  });

  it('returns null when no highlighter matches the language', () => {
    const list = [hl('ts', (t) => t, { languages: ['ts'] })];
    expect(resolveHighlighter(list, 'guml')).toBeNull();
  });

  it('matches a highlighter that declares the language', () => {
    const fn = (t: string) => `<g>${t}</g>`;
    const list = [hl('guml', fn, { languages: ['guml'] })];
    const resolved = resolveHighlighter(list, 'guml');
    expect(resolved).toBe(fn);
  });

  it('treats an omitted languages list as a wildcard fallback', () => {
    const fn = (t: string) => `<any>${t}</any>`;
    const list = [hl('any', fn)];
    expect(resolveHighlighter(list, 'json')).toBe(fn);
  });

  it('prefers a language-specific match over a wildcard fallback regardless of order', () => {
    const wildcard = (t: string) => `<any>${t}</any>`;
    const specific = (t: string) => `<json>${t}</json>`;
    const list = [hl('any', wildcard), hl('json', specific, { languages: ['json'] })];
    // wildcard has no priority (0); specific also 0 — but specificity wins ties.
    expect(resolveHighlighter(list, 'json')).toBe(specific);
  });

  it('picks the highest priority among multiple matches', () => {
    const low = (t: string) => `low${t}`;
    const high = (t: string) => `high${t}`;
    const list = [
      hl('low', low, { languages: ['md'], priority: 1 }),
      hl('high', high, { languages: ['md'], priority: 10 }),
    ];
    expect(resolveHighlighter(list, 'md')).toBe(high);
  });

  it('falls back to wildcard only when no specific match exists', () => {
    const wildcard = (t: string) => `w${t}`;
    const list = [hl('w', wildcard), hl('ts', (t) => t, { languages: ['ts'] })];
    expect(resolveHighlighter(list, 'yaml')).toBe(wildcard);
  });

  it('returns null for an empty list', () => {
    expect(resolveHighlighter([], 'guml')).toBeNull();
  });
});
