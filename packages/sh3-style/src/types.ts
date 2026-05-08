/** All token names that sh3-style can override. */
export type ThemeToken =
  | 'sh3-bg' | 'sh3-bg-elevated' | 'sh3-bg-sunken'
  | 'sh3-input-bg'
  | 'sh3-border' | 'sh3-border-strong'
  | 'sh3-fg' | 'sh3-fg-muted' | 'sh3-fg-subtle'
  | 'sh3-fg-on-accent' | 'sh3-fg-on-error' | 'sh3-fg-on-warning' | 'sh3-fg-on-success'
  | 'sh3-accent' | 'sh3-accent-muted'
  | 'sh3-error' | 'sh3-warning' | 'sh3-success'
  | 'sh3-focus-ring' | 'sh3-input-border-focus'
  | 'sh3-radius-sm' | 'sh3-radius' | 'sh3-radius-md' | 'sh3-radius-lg'
  | 'sh3-font-ui' | 'sh3-font-mono' | 'sh3-font-size' | 'sh3-line'
  | 'sh3-grad-bg' | 'sh3-grad-bg-elevated' | 'sh3-grad-bg-sunken';

/** Complete list of valid token names, for import validation. */
export const THEME_TOKENS: ThemeToken[] = [
  'sh3-bg', 'sh3-bg-elevated', 'sh3-bg-sunken',
  'sh3-input-bg',
  'sh3-border', 'sh3-border-strong',
  'sh3-fg', 'sh3-fg-muted', 'sh3-fg-subtle',
  'sh3-fg-on-accent', 'sh3-fg-on-error', 'sh3-fg-on-warning', 'sh3-fg-on-success',
  'sh3-accent', 'sh3-accent-muted',
  'sh3-error', 'sh3-warning', 'sh3-success',
  'sh3-focus-ring', 'sh3-input-border-focus',
  'sh3-radius-sm', 'sh3-radius', 'sh3-radius-md', 'sh3-radius-lg',
  'sh3-font-ui', 'sh3-font-mono', 'sh3-font-size', 'sh3-line',
  'sh3-grad-bg', 'sh3-grad-bg-elevated', 'sh3-grad-bg-sunken',
];

export interface ThemeDefinition {
  id: string;
  name: string;
  builtin: boolean;
  /** Preset ID this was duplicated from (informational). */
  base?: string;
  /** Token overrides. Only changed tokens are present. */
  tokens: Partial<Record<ThemeToken, string>>;
}

/** Shape of .sh3theme.json files for import/export. */
export interface ThemeFile {
  name: string;
  tokens: Record<string, string>;
}

/** Gradient modes supported by the editor. */
export type GradientMode = 'vertical' | 'horizontal' | '4-corner';

/** Shape of the admin-published default theme stored in env. */
export interface DefaultTheme {
  /** Built-in preset ID used as base, if applicable. */
  base?: string;
  /** Full resolved token overrides. */
  tokens: Partial<Record<ThemeToken, string>>;
  /** Display name for the default entry in the sidebar. */
  name: string;
}
