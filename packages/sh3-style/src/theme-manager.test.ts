import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock sh3-core's setTokenOverrides so theme-manager can import in tests.
vi.mock('sh3-core', () => ({
  setTokenOverrides: vi.fn(),
}));

import { resolveStyleArg, buildStylesRows, updateToken, createTheme } from './theme-manager';
import type { ThemeState } from './theme-manager';
import type { DefaultTheme } from './types';
import { DARK, BUILTIN_PRESETS } from './presets';
import { driveOppositeColor, contrastRatio } from './util/contrast';

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

describe('buildStylesRows — order and composition', () => {
  it('places default first when defaultTheme is set', () => {
    const rows = buildStylesRows(makeState(), ADMIN_DEFAULT, null);
    expect(rows[0]).toMatchObject({ id: 'env-default', kind: 'default' });
  });

  it('omits the default row when defaultTheme is null', () => {
    const rows = buildStylesRows(makeState(), null, null);
    expect(rows.some(r => r.kind === 'default')).toBe(false);
  });

  it('orders builtins before user themes', () => {
    const state = makeState({
      userThemes: [{ id: 'user-1', name: 'Mine', builtin: false, tokens: {} }],
    });
    const rows = buildStylesRows(state, null, null);
    const firstBuiltin = rows.findIndex(r => r.kind === 'builtin');
    const firstUser = rows.findIndex(r => r.kind === 'user');
    expect(firstBuiltin).toBeGreaterThanOrEqual(0);
    expect(firstUser).toBeGreaterThan(firstBuiltin);
  });
});

describe('buildStylesRows — state markers', () => {
  it('marks the confirmed builtin as active when useDefault is false', () => {
    const state = makeState({ activeThemeId: 'builtin-dark', useDefault: false });
    const rows = buildStylesRows(state, null, null);
    const dark = rows.find(r => r.id === 'builtin-dark');
    expect(dark?.state).toBe('active');
  });

  it('marks env-default as active when useDefault is true', () => {
    const state = makeState({ useDefault: true });
    const rows = buildStylesRows(state, ADMIN_DEFAULT, null);
    const def = rows.find(r => r.id === 'env-default');
    expect(def?.state).toBe('active');
  });

  it('marks the preview row as "preview" when it differs from the confirmed row', () => {
    const state = makeState({ activeThemeId: 'builtin-dark', useDefault: false });
    const rows = buildStylesRows(state, null, 'builtin-light');
    const light = rows.find(r => r.id === 'builtin-light');
    const dark = rows.find(r => r.id === 'builtin-dark');
    expect(light?.state).toBe('preview');
    expect(dark?.state).toBe('active');
  });

  it('collapses to a single "active" row when preview id equals confirmed id', () => {
    const state = makeState({ activeThemeId: 'builtin-dark', useDefault: false });
    const rows = buildStylesRows(state, null, 'builtin-dark');
    const dark = rows.find(r => r.id === 'builtin-dark');
    expect(dark?.state).toBe('active');
    expect(rows.filter(r => r.state === 'preview')).toHaveLength(0);
  });

  it('leaves non-active non-preview rows with empty state', () => {
    const state = makeState({ activeThemeId: 'builtin-dark', useDefault: false });
    const rows = buildStylesRows(state, null, null);
    const light = rows.find(r => r.id === 'builtin-light');
    expect(light?.state).toBe('');
  });
});

describe('DARK preset fg-on-* values', () => {
  const endpoints = () => ({
    light: DARK.tokens['shell-fg']!,
    dark: DARK.tokens['shell-bg']!,
  });

  it('declares fg-on-accent matching Algorithm A', () => {
    const driven = driveOppositeColor(DARK.tokens['shell-accent']!, endpoints());
    expect(DARK.tokens['shell-fg-on-accent']).toBe(driven!.color);
  });
  it('declares fg-on-error matching Algorithm A', () => {
    const driven = driveOppositeColor(DARK.tokens['shell-error']!, endpoints());
    expect(DARK.tokens['shell-fg-on-error']).toBe(driven!.color);
  });
  it('declares fg-on-warning matching Algorithm A', () => {
    const driven = driveOppositeColor(DARK.tokens['shell-warning']!, endpoints());
    expect(DARK.tokens['shell-fg-on-warning']).toBe(driven!.color);
  });
  it('declares fg-on-success matching Algorithm A', () => {
    const driven = driveOppositeColor(DARK.tokens['shell-success']!, endpoints());
    expect(DARK.tokens['shell-fg-on-success']).toBe(driven!.color);
  });
  it('every declared pair meets AA for text', () => {
    const pairs: Array<['shell-accent' | 'shell-error' | 'shell-warning' | 'shell-success', 'shell-fg-on-accent' | 'shell-fg-on-error' | 'shell-fg-on-warning' | 'shell-fg-on-success']> = [
      ['shell-accent', 'shell-fg-on-accent'],
      ['shell-error', 'shell-fg-on-error'],
      ['shell-warning', 'shell-fg-on-warning'],
      ['shell-success', 'shell-fg-on-success'],
    ];
    for (const [surfaceKey, fgKey] of pairs) {
      const r = contrastRatio(DARK.tokens[fgKey]!, DARK.tokens[surfaceKey]!);
      expect(r, `${surfaceKey} must pair to AA`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('updateToken semantic cascade', () => {
  function makeState(): ThemeState {
    const state: ThemeState = { activeThemeId: '', useDefault: false, userThemes: [] };
    const t = createTheme('Test', state);
    t.tokens['shell-fg'] = '#e4e6eb';
    t.tokens['shell-bg'] = '#1a1b1e';
    return state;
  }

  it('updating shell-error also writes shell-fg-on-error via Algorithm A', () => {
    const state = makeState();
    const id = state.userThemes[0].id;
    updateToken(id, 'shell-error', '#ff3300', state);
    const theme = state.userThemes[0];
    expect(theme.tokens['shell-error']).toBe('#ff3300');
    // For #ff3300 against fg=#e4e6eb / bg=#1a1b1e, dark endpoint wins.
    expect(theme.tokens['shell-fg-on-error']).toBe('#1a1b1e');
  });

  it('updating shell-warning cascades the pair', () => {
    const state = makeState();
    const id = state.userThemes[0].id;
    updateToken(id, 'shell-warning', '#ffcc00', state);
    expect(state.userThemes[0].tokens['shell-fg-on-warning']).toBeDefined();
  });

  it('updating shell-success cascades the pair', () => {
    const state = makeState();
    const id = state.userThemes[0].id;
    updateToken(id, 'shell-success', '#00cc66', state);
    expect(state.userThemes[0].tokens['shell-fg-on-success']).toBeDefined();
  });

  it('updating a non-semantic token does NOT cascade', () => {
    const state = makeState();
    const id = state.userThemes[0].id;
    updateToken(id, 'shell-border', '#444444', state);
    expect(state.userThemes[0].tokens['shell-fg-on-error']).toBeUndefined();
    expect(state.userThemes[0].tokens['shell-fg-on-warning']).toBeUndefined();
    expect(state.userThemes[0].tokens['shell-fg-on-success']).toBeUndefined();
  });

  it('updating shell-accent does NOT cascade (ColorSection owns this)', () => {
    const state = makeState();
    const id = state.userThemes[0].id;
    updateToken(id, 'shell-accent', '#6ea8fe', state);
    expect(state.userThemes[0].tokens['shell-accent']).toBe('#6ea8fe');
    expect(state.userThemes[0].tokens['shell-fg-on-accent']).toBeUndefined();
  });
});

describe('every built-in preset has AA-compliant fg-on-* pairs', () => {
  for (const preset of BUILTIN_PRESETS) {
    describe(preset.name, () => {
      it('declares every fg-on-* token', () => {
        expect(preset.tokens['shell-fg-on-accent']).toBeDefined();
        expect(preset.tokens['shell-fg-on-error']).toBeDefined();
        expect(preset.tokens['shell-fg-on-warning']).toBeDefined();
        expect(preset.tokens['shell-fg-on-success']).toBeDefined();
      });
      it('every pair meets AA for text (ratio >= 4.5)', () => {
        const pairs: Array<['accent' | 'error' | 'warning' | 'success']> = [
          ['accent'], ['error'], ['warning'], ['success'],
        ];
        for (const [key] of pairs) {
          const surface = preset.tokens[`shell-${key}` as const]!;
          const fg = preset.tokens[`shell-fg-on-${key}` as const]!;
          const ratio = contrastRatio(fg, surface);
          expect(ratio, `${preset.name}: shell-fg-on-${key} vs shell-${key}`)
            .toBeGreaterThanOrEqual(4.5);
        }
      });
    });
  }
});
