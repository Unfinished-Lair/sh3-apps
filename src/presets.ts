import type { ThemeDefinition } from './types';

export const DARK: ThemeDefinition = {
  id: 'builtin-dark',
  name: 'Dark',
  builtin: true,
  tokens: {
    'shell-bg':            '#1a1b1e',
    'shell-bg-elevated':   '#22232a',
    'shell-bg-sunken':     '#141518',
    'shell-border':        '#2e3038',
    'shell-border-strong': '#3c3f4a',
    'shell-fg':            '#e4e6eb',
    'shell-fg-muted':      '#9aa0aa',
    'shell-fg-subtle':     '#6b7280',
    'shell-accent':        '#6ea8fe',
    'shell-accent-muted':  '#3a5580',
    'shell-font-ui':       'system-ui, -apple-system, "Segoe UI", sans-serif',
    'shell-font-mono':     'ui-monospace, "Cascadia Code", "Consolas", monospace',
    'shell-font-size':     '13px',
    'shell-line':          '1.45',
  },
};

export const LIGHT: ThemeDefinition = {
  id: 'builtin-light',
  name: 'Light',
  builtin: true,
  tokens: {
    'shell-bg':            '#f5f5f7',
    'shell-bg-elevated':   '#ffffff',
    'shell-bg-sunken':     '#e8e8ed',
    'shell-border':        '#d2d2d7',
    'shell-border-strong': '#b8b8bf',
    'shell-fg':            '#1d1d1f',
    'shell-fg-muted':      '#6e6e73',
    'shell-fg-subtle':     '#86868b',
    'shell-accent':        '#0066cc',
    'shell-accent-muted':  '#99c4e8',
    'shell-font-ui':       'system-ui, -apple-system, "Segoe UI", sans-serif',
    'shell-font-mono':     'ui-monospace, "Cascadia Code", "Consolas", monospace',
    'shell-font-size':     '13px',
    'shell-line':          '1.45',
  },
};

export const NEON_PULSE: ThemeDefinition = {
  id: 'builtin-neon-pulse',
  name: 'Neon Pulse',
  builtin: true,
  tokens: {
    'shell-bg':            '#0d0b1a',
    'shell-bg-elevated':   '#1a1035',
    'shell-bg-sunken':     '#080610',
    'shell-border':        '#6c3bff33',
    'shell-border-strong': '#6c3bff55',
    'shell-fg':            '#e8e0ff',
    'shell-fg-muted':      '#8877aa',
    'shell-fg-subtle':     '#554466',
    'shell-accent':        '#bf7aff',
    'shell-accent-muted':  '#6c3bff',
    'shell-font-ui':       'system-ui, -apple-system, "Segoe UI", sans-serif',
    'shell-font-mono':     'ui-monospace, "Cascadia Code", "Consolas", monospace',
    'shell-font-size':     '13px',
    'shell-line':          '1.45',
    'shell-grad-bg':          'linear-gradient(135deg, #0d0b1a 0%, #1a1035 100%)',
    'shell-grad-bg-elevated': 'linear-gradient(180deg, #2a1a4a, #1a1035)',
    'shell-grad-bg-sunken':   'linear-gradient(180deg, #080610, #0d0b1a)',
  },
};

export const JADE_GARDEN: ThemeDefinition = {
  id: 'builtin-jade-garden',
  name: 'Jade Garden',
  builtin: true,
  tokens: {
    'shell-bg':            '#fafbf9',
    'shell-bg-elevated':   '#ffffff',
    'shell-bg-sunken':     '#e8ede4',
    'shell-border':        '#c8d4c0',
    'shell-border-strong': '#a8b8a0',
    'shell-fg':            '#2d3a2e',
    'shell-fg-muted':      '#5a6a58',
    'shell-fg-subtle':     '#7a8a72',
    'shell-accent':        '#5a8a5e',
    'shell-accent-muted':  '#a0c8a2',
    'shell-font-ui':       'Georgia, "Times New Roman", serif',
    'shell-font-mono':     'ui-monospace, "Cascadia Code", "Consolas", monospace',
    'shell-font-size':     '13px',
    'shell-line':          '1.5',
    'shell-grad-bg':          'linear-gradient(160deg, #fafbf9 0%, #f0f4ec 100%)',
    'shell-grad-bg-elevated': 'linear-gradient(180deg, #f5f8f2, #eef2ea)',
    'shell-grad-bg-sunken':   'linear-gradient(90deg, #e8ede4, #eef2ea)',
  },
};

export const MATCHA_INK: ThemeDefinition = {
  id: 'builtin-matcha-ink',
  name: 'Matcha Ink',
  builtin: true,
  tokens: {
    'shell-bg':            '#1c2420',
    'shell-bg-elevated':   '#243028',
    'shell-bg-sunken':     '#161e19',
    'shell-border':        '#2d3d30',
    'shell-border-strong': '#3a4d3e',
    'shell-fg':            '#c8d8c4',
    'shell-fg-muted':      '#7a9a78',
    'shell-fg-subtle':     '#5a7a58',
    'shell-accent':        '#88c88a',
    'shell-accent-muted':  '#3a6a3c',
    'shell-font-ui':       'system-ui, -apple-system, "Segoe UI", sans-serif',
    'shell-font-mono':     'ui-monospace, "Cascadia Code", "Consolas", monospace',
    'shell-font-size':     '13px',
    'shell-line':          '1.45',
    'shell-grad-bg':          'linear-gradient(150deg, #1c2420 0%, #202d25 50%, #1a2320 100%)',
    'shell-grad-bg-elevated': 'linear-gradient(180deg, #243028, #1c2420)',
    'shell-grad-bg-sunken':   'linear-gradient(90deg, #161e19, #1a241e)',
  },
};

/** All built-in presets, in display order. */
export const BUILTIN_PRESETS: ThemeDefinition[] = [
  DARK, LIGHT, NEON_PULSE, JADE_GARDEN, MATCHA_INK,
];
