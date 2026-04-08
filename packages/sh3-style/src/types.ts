/** All token names that sh3-style can override. */
export type ThemeToken =
  | 'shell-bg' | 'shell-bg-elevated' | 'shell-bg-sunken'
  | 'shell-border' | 'shell-border-strong'
  | 'shell-fg' | 'shell-fg-muted' | 'shell-fg-subtle'
  | 'shell-accent' | 'shell-accent-muted'
  | 'shell-font-ui' | 'shell-font-mono' | 'shell-font-size' | 'shell-line'
  | 'shell-grad-bg' | 'shell-grad-bg-elevated' | 'shell-grad-bg-sunken';

/** Complete list of valid token names, for import validation. */
export const THEME_TOKENS: ThemeToken[] = [
  'shell-bg', 'shell-bg-elevated', 'shell-bg-sunken',
  'shell-border', 'shell-border-strong',
  'shell-fg', 'shell-fg-muted', 'shell-fg-subtle',
  'shell-accent', 'shell-accent-muted',
  'shell-font-ui', 'shell-font-mono', 'shell-font-size', 'shell-line',
  'shell-grad-bg', 'shell-grad-bg-elevated', 'shell-grad-bg-sunken',
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
