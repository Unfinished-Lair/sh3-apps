import { setTokenOverrides, clearTokenOverrides, getTokenOverrides } from 'sh3-core';
import { BUILTIN_PRESETS, DARK } from './presets';
import { THEME_TOKENS, type ThemeDefinition, type ThemeFile, type ThemeToken } from './types';

export interface ThemeState {
  activeThemeId: string;
  useDefault: boolean;
  userThemes: ThemeDefinition[];
}

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
export function applyTheme(themeId: string, state: ThemeState): void {
  const theme = findTheme(themeId, state);
  if (!theme) return;
  setTokenOverrides(resolveTokens(theme));
}

/** Find a theme by ID across builtins and user themes. */
export function findTheme(themeId: string, state: ThemeState): ThemeDefinition | undefined {
  return BUILTIN_PRESETS.find(t => t.id === themeId)
    ?? state.userThemes.find(t => t.id === themeId);
}

/** All themes in display order: builtins first, then user themes. */
export function allThemes(state: ThemeState): ThemeDefinition[] {
  return [...BUILTIN_PRESETS, ...state.userThemes];
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
  if (state.activeThemeId === themeId) {
    setTokenOverrides(resolveTokens(theme));
  }
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
  if (state.activeThemeId === themeId) {
    setTokenOverrides(resolveTokens(theme));
  }
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
