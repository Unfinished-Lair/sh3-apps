import { describe, it, expect } from 'vitest';
import { resolveStyleArg, buildStylesRows } from './theme-manager';
import type { ThemeState } from './theme-manager';
import type { DefaultTheme } from './types';

function makeState(over: Partial<ThemeState> = {}): ThemeState {
  return {
    activeThemeId: 'builtin-dark',
    useDefault: false,
    userThemes: [],
    ...over,
  };
}

const ADMIN_DEFAULT: DefaultTheme = {
  base: 'builtin-dark',
  tokens: {},
  name: 'Company Dark',
};

describe('resolveStyleArg — exact id match', () => {
  it('matches a builtin id', () => {
    const out = resolveStyleArg('builtin-dark', makeState(), null);
    expect(out).toEqual({ ok: true, id: 'builtin-dark' });
  });

  it('matches a user theme id', () => {
    const state = makeState({
      userThemes: [{ id: 'user-42', name: 'Mine', builtin: false, tokens: {} }],
    });
    const out = resolveStyleArg('user-42', state, null);
    expect(out).toEqual({ ok: true, id: 'user-42' });
  });

  it('matches the env-default pseudo id when defaultTheme is set', () => {
    const out = resolveStyleArg('env-default', makeState(), ADMIN_DEFAULT);
    expect(out).toEqual({ ok: true, id: 'env-default' });
  });

  it('does not match env-default when defaultTheme is null', () => {
    const out = resolveStyleArg('env-default', makeState(), null);
    expect(out.ok).toBe(false);
  });
});

describe('resolveStyleArg — case-insensitive name match', () => {
  it('matches "dark" against the Dark builtin', () => {
    const out = resolveStyleArg('dark', makeState(), null);
    expect(out).toEqual({ ok: true, id: 'builtin-dark' });
  });

  it('matches "LIGHT" against the Light builtin', () => {
    const out = resolveStyleArg('LIGHT', makeState(), null);
    expect(out).toEqual({ ok: true, id: 'builtin-light' });
  });

  it('matches "Mine" against a user theme named "Mine"', () => {
    const state = makeState({
      userThemes: [{ id: 'user-42', name: 'Mine', builtin: false, tokens: {} }],
    });
    const out = resolveStyleArg('Mine', state, null);
    expect(out).toEqual({ ok: true, id: 'user-42' });
  });

  it('takes the first candidate when two themes share a name', () => {
    const state = makeState({
      userThemes: [
        { id: 'user-1', name: 'Dark', builtin: false, tokens: {} },
      ],
    });
    // Builtin "Dark" comes before user "Dark" in candidate order → builtin wins.
    const out = resolveStyleArg('Dark', state, null);
    expect(out).toEqual({ ok: true, id: 'builtin-dark' });
  });
});

describe('resolveStyleArg — no match + hints', () => {
  it('returns startsWith hints on miss', () => {
    const out = resolveStyleArg('darl', makeState(), null);
    expect(out.ok).toBe(false);
    if (out.ok) return;
    // No hint matches "darl" (no name or id starts with that).
    expect(out.hints).toEqual([]);
  });

  it('returns up to three startsWith prefix hits on near-miss', () => {
    const state = makeState({
      userThemes: [
        { id: 'user-1', name: 'Daredevil', builtin: false, tokens: {} },
        { id: 'user-2', name: 'Daring', builtin: false, tokens: {} },
        { id: 'user-3', name: 'Daybreak', builtin: false, tokens: {} },
        { id: 'user-4', name: 'Dapper', builtin: false, tokens: {} },
      ],
    });
    const out = resolveStyleArg('dar', state, null);
    expect(out.ok).toBe(false);
    if (out.ok) return;
    // "Dark" (builtin) comes first in candidate order; user themes follow.
    expect(out.hints.length).toBeLessThanOrEqual(3);
    expect(out.hints[0]).toEqual({ id: 'builtin-dark', name: 'Dark' });
  });

  it('matches prefix by id as well as name', () => {
    const out = resolveStyleArg('builtin-', makeState(), null);
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.hints.length).toBeGreaterThan(0);
    expect(out.hints[0].id.startsWith('builtin-')).toBe(true);
  });

  it('returns ok:false with empty hints for pure gibberish', () => {
    const out = resolveStyleArg('zzzzzzz', makeState(), null);
    expect(out).toEqual({ ok: false, hints: [] });
  });
});

describe('buildStylesRows — placeholder (filled in Task 3)', () => {
  it('is defined', () => {
    expect(typeof buildStylesRows).toBe('function');
  });
});
