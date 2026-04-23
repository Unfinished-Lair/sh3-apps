import { setTokenOverrides } from 'sh3-core';
import { BUILTIN_PRESETS, DARK } from './presets';
import { THEME_TOKENS, type ThemeDefinition, type ThemeFile, type ThemeToken, type DefaultTheme } from './types';

export interface ThemeState {
  [key: string]: unknown;
  activeThemeId: string;
  useDefault: boolean;
  userThemes: ThemeDefinition[];
}

/** Sentinel ID for the admin default pseudo-entry. */
export const DEFAULT_THEME_ID = 'env-default';

/**
 * Resolve the full token map for a theme. Starts from the Dark preset
 * defaults, then overlays the theme's tokens. This ensures all 17 tokens
 * are always present even if the theme only overrides a few.
 */
export function resolveTokens(theme: ThemeDefinition): Record<string, string> {
  const base = { ...DARK.tokens };
  return { ...base, ...theme.tokens } as Record<string, string>;
}

/** Apply a theme by ID. Resolves tokens and calls sh3-core. */
export function applyTheme(
  themeId: string,
  state: ThemeState,
  defaultTheme: DefaultTheme | null = null,
): void {
  const theme = findTheme(themeId, state, defaultTheme);
  if (!theme) return;
  setTokenOverrides(resolveTokens(theme));
}

/** Find a theme by ID across default, builtins, and user themes. */
export function findTheme(
  themeId: string,
  state: ThemeState,
  defaultTheme: DefaultTheme | null = null,
): ThemeDefinition | undefined {
  if (themeId === DEFAULT_THEME_ID) return buildDefaultPseudoTheme(defaultTheme);
  return BUILTIN_PRESETS.find(t => t.id === themeId)
    ?? state.userThemes.find(t => t.id === themeId);
}

/** All themes in display order: default (if set), builtins, then user themes. */
export function allThemes(
  state: ThemeState,
  defaultTheme: DefaultTheme | null,
): ThemeDefinition[] {
  const def = buildDefaultPseudoTheme(defaultTheme);
  return [...(def ? [def] : []), ...BUILTIN_PRESETS, ...state.userThemes];
}

/**
 * Build a ThemeDefinition from the env-stored default.
 * Returns undefined if no default is set.
 */
export function buildDefaultPseudoTheme(
  defaultTheme: DefaultTheme | null,
): ThemeDefinition | undefined {
  if (!defaultTheme) return undefined;
  return {
    id: DEFAULT_THEME_ID,
    name: defaultTheme.name,
    builtin: true,
    base: defaultTheme.base,
    tokens: { ...defaultTheme.tokens },
  };
}

/**
 * Snapshot a theme for storage in env as the admin default.
 * Resolves all tokens so the default is self-contained.
 */
export function snapshotForDefault(theme: ThemeDefinition): DefaultTheme {
  return {
    base: theme.builtin ? theme.id : theme.base,
    tokens: resolveTokens(theme),
    name: theme.name,
  };
}

/** Create a new empty theme (based on Dark defaults). */
export function createTheme(name: string, state: ThemeState): ThemeDefinition {
  const theme: ThemeDefinition = {
    id: `user-${Date.now()}`,
    name,
    builtin: false,
    base: 'builtin-dark',
    tokens: {},
  };
  state.userThemes.push(theme);
  return theme;
}

/** Duplicate an existing theme into a user theme. */
export function duplicateTheme(sourceId: string, state: ThemeState): ThemeDefinition | undefined {
  const source = findTheme(sourceId, state);
  if (!source) return undefined;
  const theme: ThemeDefinition = {
    id: `user-${Date.now()}`,
    name: `${source.name} (copy)`,
    builtin: false,
    base: source.id,
    tokens: { ...source.tokens },
  };
  state.userThemes.push(theme);
  return theme;
}

/** Delete a user theme. Returns false if builtin or not found. */
export function deleteTheme(themeId: string, state: ThemeState): boolean {
  const idx = state.userThemes.findIndex(t => t.id === themeId);
  if (idx === -1) return false;
  state.userThemes.splice(idx, 1);
  if (state.activeThemeId === themeId) {
    state.activeThemeId = 'builtin-dark';
    applyTheme('builtin-dark', state);
  }
  return true;
}

/** Rename a user theme. Returns false if not found or builtin. */
export function renameTheme(themeId: string, name: string, state: ThemeState): boolean {
  const theme = state.userThemes.find(t => t.id === themeId);
  if (!theme) return false;
  theme.name = name;
  return true;
}

/** Update a token on a user theme and apply live. */
export function updateToken(
  themeId: string,
  token: ThemeToken,
  value: string,
  state: ThemeState,
): void {
  const theme = state.userThemes.find(t => t.id === themeId);
  if (!theme) return;
  theme.tokens[token] = value;
  setTokenOverrides(resolveTokens(theme));
}

/** Remove a token override from a user theme (reverts to Dark default). */
export function clearToken(
  themeId: string,
  token: ThemeToken,
  state: ThemeState,
): void {
  const theme = state.userThemes.find(t => t.id === themeId);
  if (!theme) return;
  delete theme.tokens[token];
  setTokenOverrides(resolveTokens(theme));
}

/** Export a theme as a .sh3theme.json object. */
export function exportTheme(themeId: string, state: ThemeState): ThemeFile | undefined {
  const theme = findTheme(themeId, state);
  if (!theme) return undefined;
  return {
    name: theme.name,
    tokens: { ...theme.tokens } as Record<string, string>,
  };
}

/** Import a theme from a parsed .sh3theme.json. Returns the new theme, or undefined if invalid. */
export function importTheme(file: unknown, state: ThemeState): ThemeDefinition | undefined {
  if (typeof file !== 'object' || file === null || Array.isArray(file)) return undefined;
  const f = file as Record<string, unknown>;
  if (typeof f.name !== 'string' || typeof f.tokens !== 'object' || f.tokens === null) {
    return undefined;
  }

  const rawTokens = f.tokens as Record<string, unknown>;
  const tokens: Partial<Record<ThemeToken, string>> = {};
  for (const key of THEME_TOKENS) {
    if (typeof rawTokens[key] === 'string') {
      tokens[key] = rawTokens[key] as string;
    }
  }

  const theme: ThemeDefinition = {
    id: `user-${Date.now()}`,
    name: f.name,
    builtin: false,
    tokens,
  };
  state.userThemes.push(theme);
  return theme;
}

/**
 * Build the ordered candidate pool used by the verb layer:
 * admin default (if set) → builtins → user themes.
 */
function styleCandidates(
  state: ThemeState,
  defaultTheme: DefaultTheme | null,
): Array<{ id: string; name: string }> {
  const out: Array<{ id: string; name: string }> = [];
  if (defaultTheme) {
    out.push({ id: DEFAULT_THEME_ID, name: defaultTheme.name });
  }
  for (const t of BUILTIN_PRESETS) out.push({ id: t.id, name: t.name });
  for (const t of state.userThemes) out.push({ id: t.id, name: t.name });
  return out;
}

/**
 * Resolve a user-typed argument to a theme id.
 *
 * Algorithm:
 *   1. Exact id match across [default, builtins, user themes].
 *   2. Case-insensitive exact name match across the same set, first wins.
 *   3. Otherwise collect up to 3 startsWith hints (by name OR id, case-insensitive).
 */
export function resolveStyleArg(
  arg: string,
  state: ThemeState,
  defaultTheme: DefaultTheme | null,
): { ok: true; id: string } | { ok: false; hints: Array<{ id: string; name: string }> } {
  const candidates = styleCandidates(state, defaultTheme);
  const needle = arg.toLowerCase();

  const idHit = candidates.find(c => c.id === arg);
  if (idHit) return { ok: true, id: idHit.id };

  const nameHit = candidates.find(c => c.name.toLowerCase() === needle);
  if (nameHit) return { ok: true, id: nameHit.id };

  const hints: Array<{ id: string; name: string }> = [];
  for (const c of candidates) {
    if (c.name.toLowerCase().startsWith(needle) || c.id.toLowerCase().startsWith(needle)) {
      hints.push({ id: c.id, name: c.name });
      if (hints.length === 3) break;
    }
  }
  return { ok: false, hints };
}

export type StyleRowState = 'active' | 'preview' | '';

export interface StyleRow {
  id: string;
  name: string;
  kind: 'default' | 'builtin' | 'user';
  state: StyleRowState;
}

/**
 * Build the row set rendered by StylesTable.
 * Order: default (if set) → builtins → user themes.
 * State: 'active' for the confirmed row; 'preview' for the ephemeral
 * preview row if it differs from confirmed; '' otherwise.
 */
export function buildStylesRows(
  state: ThemeState,
  defaultTheme: DefaultTheme | null,
  ephemeralPreviewId: string | null,
): StyleRow[] {
  const confirmedId = state.useDefault ? DEFAULT_THEME_ID : state.activeThemeId;
  const showPreview =
    ephemeralPreviewId != null && ephemeralPreviewId !== confirmedId;

  const rows: StyleRow[] = [];
  const push = (id: string, name: string, kind: StyleRow['kind']) => {
    let rowState: StyleRowState = '';
    if (showPreview && id === ephemeralPreviewId) rowState = 'preview';
    else if (id === confirmedId) rowState = 'active';
    rows.push({ id, name, kind, state: rowState });
  };

  if (defaultTheme) push(DEFAULT_THEME_ID, defaultTheme.name, 'default');
  for (const t of BUILTIN_PRESETS) push(t.id, t.name, 'builtin');
  for (const t of state.userThemes) push(t.id, t.name, 'user');
  return rows;
}
