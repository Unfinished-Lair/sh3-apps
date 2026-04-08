# sh3-style App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an external npm package (`sh3-style`) that provides a theme management app for SH3 — with built-in presets, user theme CRUD, gradient editing, and JSON import/export.

**Architecture:** A standard SH3 app+shard package. The shard contributes one view (the theme editor) and uses the `setTokenOverrides` / `getTokenOverrides` / `clearTokenOverrides` API from `sh3-core` to apply themes. All theme intelligence (presets, user themes, persistence) lives in this package. The shard stores its own state in the User zone (active theme ID + user-created themes). Theme application to `:root` is handled by sh3-core — this package just calls the API.

**Tech Stack:** Svelte 5, TypeScript, Vite, `sh3-core` (npm dependency)

**Spec:** `docs/claude-plans/2026-04-08-sh3-style-design.md` (in the SH3 repo)

**Prerequisites:** sh3-core must be published with the token override API (see `docs/claude-plans/2026-04-08-sh3-style-core-plan.md`). The required API:
- `setTokenOverrides(overrides: Record<string, string>): void`
- `clearTokenOverrides(): void`
- `getTokenOverrides(): Record<string, string>`
- Gradient tokens: `--shell-grad-bg`, `--shell-grad-bg-elevated`, `--shell-grad-bg-sunken` (empty by default, override surface backgrounds when set)

---

## sh3-core API Reference (what you can import)

```ts
import {
  // Theme API
  setTokenOverrides,
  clearTokenOverrides,
  getTokenOverrides,

  // App/Shard types
  type Shard,
  type ShardManifest,
  type ShardContext,
  type ViewFactory,
  type ViewHandle,
  type MountContext,
  type App,
  type AppManifest,
  type LayoutNode,
  type ZoneSchema,
  type StateZones,
} from 'sh3-core';

// CSS tokens (import for type reference, auto-inlined by build)
import 'sh3-core/tokens.css';
```

Shards can ONLY import from `'sh3-core'` and `'sh3-core/tokens.css'`. No other import paths are allowed.

## Shard Contract Quick Reference

A **shard** has:
- `manifest: ShardManifest` — `{ id, label, version, views: ViewDeclaration[] }`
- `activate(ctx: ShardContext): void | Promise<void>` — called by the framework when the app loads
- `deactivate?(): void | Promise<void>` — cleanup

A **ShardContext** provides:
- `state<T>(schema: T): StateZones<T>` — shard-scoped reactive state zones
- `registerView(viewId: string, factory: ViewFactory): void` — register a view

A **ViewFactory** has:
- `mount(container: HTMLElement, context: MountContext): ViewHandle` — mount UI into a raw DOM element
- The container is a plain `HTMLElement` with `min-width: 0; min-height: 0` set by the framework

A **ViewHandle** has:
- `unmount(): void` — teardown
- `onResize?(width: number, height: number): void` — optional resize callback

An **App** has:
- `manifest: AppManifest` — `{ id, label, version, requiredShards: string[], layoutVersion: number }`
- `initialLayout: LayoutNode` — starting panel arrangement
- `activate?(ctx: AppContext): void | Promise<void>` — optional post-launch hook
- `deactivate?(): void | Promise<void>` — optional pre-unload hook

**State zones:** The shard declares a schema with zone names as keys. Only `user` and `workspace` are persistent. `user` persists forever across sessions (localStorage). `workspace` persists per workspace.

**Building:** SH3 shard/app packages are built with Vite. The sh3-core build plugin `sh3CssInline()` auto-inlines CSS into the JS bundle. Use the standard shard build setup (see `sh3-validate` for the contract validator that checks your bundle).

---

## File Structure

```
sh3-style/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── index.ts              — exports app + shard
│   ├── shard.ts              — shard definition + activate
│   ├── app.ts                — app definition + layout
│   ├── types.ts              — ThemeDefinition, ThemeToken, etc.
│   ├── presets.ts            — 5 built-in theme definitions
│   ├── theme-manager.ts      — CRUD logic for themes (create, duplicate, delete, resolve, import/export)
│   ├── editor/
│   │   ├── ThemeEditor.svelte    — root editor component (sidebar + panel)
│   │   ├── ThemeSidebar.svelte   — theme list sidebar
│   │   ├── ColorSection.svelte   — color swatch grid + picker
│   │   ├── TypographySection.svelte — font/size/line-height controls
│   │   ├── GradientSection.svelte   — per-surface gradient toggle + editor
│   │   └── GradientPicker.svelte    — single gradient editor (mode + color stops)
│   └── util/
│       └── color.ts          — hex validation, gradient CSS generation
```

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sh3-style",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "peerDependencies": {
    "sh3-core": "*"
  },
  "devDependencies": {
    "sh3-core": "*",
    "svelte": "^5.0.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "types": ["svelte"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create vite.config.ts**

Use the sh3-core build plugin for CSS inlining. The exact Vite config depends on whether you're building a shard bundle (single-file JS output) or a library. For SH3 shard packages, build as a library with `sh3CssInline()`:

```ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['sh3-core', 'sh3-core/tokens.css'],
    },
  },
});
```

Note: Check sh3-core's `build.ts` for the `sh3CssInline()` plugin and import it if available via the build tooling path. If building as a registry-installable package, follow the artifact build pattern used by other SH3 packages.

- [ ] **Step 4: Create stub index.ts**

Create `src/index.ts`:

```ts
export { app } from './app';
export { shard } from './shard';
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold sh3-style package"
```

---

### Task 2: Types and presets

**Files:**
- Create: `src/types.ts`
- Create: `src/presets.ts`

- [ ] **Step 1: Define types**

Create `src/types.ts`:

```ts
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
```

- [ ] **Step 2: Define built-in presets**

Create `src/presets.ts`:

```ts
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
```

- [ ] **Step 3: Commit**

```bash
git add src/types.ts src/presets.ts
git commit -m "feat: define theme types and 5 built-in presets"
```

---

### Task 3: Theme manager (CRUD logic)

**Files:**
- Create: `src/theme-manager.ts`

- [ ] **Step 1: Create theme-manager.ts**

This module encapsulates all theme CRUD operations. It operates on the shard's User zone state and calls `setTokenOverrides` from sh3-core.

```ts
import { setTokenOverrides, clearTokenOverrides, getTokenOverrides } from 'sh3-core';
import { BUILTIN_PRESETS, DARK } from './presets';
import { THEME_TOKENS, type ThemeDefinition, type ThemeFile, type ThemeToken } from './types';

export interface ThemeState {
  activeThemeId: string;
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
  // If the deleted theme was active, revert to Dark
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

  // Filter to known tokens only
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
```

- [ ] **Step 2: Commit**

```bash
git add src/theme-manager.ts
git commit -m "feat: theme manager with CRUD, import/export, and live application"
```

---

### Task 4: Color utility

**Files:**
- Create: `src/util/color.ts`

- [ ] **Step 1: Create color.ts**

```ts
import type { GradientMode } from '../types';

/** Check if a string is a valid hex color (#rgb, #rrggbb, #rrggbbaa). */
export function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

/**
 * Build a CSS gradient string from mode and color stops.
 *
 * - vertical: top → bottom (180deg), 2 colors
 * - horizontal: left → right (90deg), 2 colors
 * - 4-corner: approximated with layered radial gradients at each corner
 */
export function buildGradient(
  mode: GradientMode,
  colors: string[],
): string {
  switch (mode) {
    case 'vertical':
      return `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`;
    case 'horizontal':
      return `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`;
    case '4-corner':
      // 4-corner gradient: blend four colors at the corners using layered
      // gradients. This approximation uses two diagonal linear-gradients
      // with transparency to simulate a bilinear interpolation.
      return [
        `linear-gradient(135deg, ${colors[0]} 0%, transparent 50%)`,
        `linear-gradient(225deg, ${colors[1]} 0%, transparent 50%)`,
        `linear-gradient(315deg, ${colors[2]} 0%, transparent 50%)`,
        `linear-gradient(45deg, ${colors[3]} 0%, transparent 50%)`,
      ].join(', ');
    default:
      return colors[0];
  }
}

/**
 * Parse a CSS gradient string back into mode + colors.
 * Returns undefined if the string doesn't match a known pattern.
 */
export function parseGradient(
  css: string,
): { mode: GradientMode; colors: string[] } | undefined {
  // Check for 4-corner (multiple linear-gradient layers)
  if (css.includes('135deg') && css.includes('225deg')) {
    const hexes = css.match(/#[0-9a-fA-F]{3,8}/g);
    if (hexes && hexes.length >= 4) {
      return { mode: '4-corner', colors: hexes.slice(0, 4) };
    }
  }
  // Check for vertical (180deg)
  const vertMatch = css.match(/linear-gradient\(180deg,\s*(#[0-9a-fA-F]{3,8}),\s*(#[0-9a-fA-F]{3,8})\)/);
  if (vertMatch) {
    return { mode: 'vertical', colors: [vertMatch[1], vertMatch[2]] };
  }
  // Check for horizontal (90deg)
  const horizMatch = css.match(/linear-gradient\(90deg,\s*(#[0-9a-fA-F]{3,8}),\s*(#[0-9a-fA-F]{3,8})\)/);
  if (horizMatch) {
    return { mode: 'horizontal', colors: [horizMatch[1], horizMatch[2]] };
  }
  // Generic linear-gradient with angle
  const genericMatch = css.match(/linear-gradient\(\d+deg,\s*(#[0-9a-fA-F]{3,8})[^,]*,\s*(#[0-9a-fA-F]{3,8})/);
  if (genericMatch) {
    return { mode: 'vertical', colors: [genericMatch[1], genericMatch[2]] };
  }
  return undefined;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/util/color.ts
git commit -m "feat: color/gradient utility functions"
```

---

### Task 5: Shard and app definitions

**Files:**
- Create: `src/shard.ts`
- Create: `src/app.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Create shard.ts**

```ts
import type { Shard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import type { ThemeState } from './theme-manager';
import { applyTheme, findTheme } from './theme-manager';
import ThemeEditor from './editor/ThemeEditor.svelte';

export const shard: Shard = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.1.0',
    views: [{ id: 'sh3-style-editor', label: 'Style Editor' }],
  },

  activate(ctx: ShardContext) {
    // Hydrate shard state from User zone
    const state = ctx.state<{ user: ThemeState }>({
      user: { activeThemeId: 'builtin-dark', userThemes: [] },
    });

    // sh3-core already applied persisted token overrides at boot.
    // But if the user's active theme has changed in our state vs what's
    // on :root, re-apply to stay in sync.
    const theme = findTheme(state.user.activeThemeId, state.user);
    if (theme) {
      applyTheme(state.user.activeThemeId, state.user);
    }

    ctx.registerView('sh3-style-editor', {
      mount(container, _context) {
        const component = mount(ThemeEditor, {
          target: container,
          props: { state: state.user },
        });

        return {
          unmount() {
            unmount(component);
          },
        };
      },
    });
  },
};
```

- [ ] **Step 2: Create app.ts**

```ts
import type { App } from 'sh3-core';

export const app: App = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.1.0',
    requiredShards: ['sh3-style'],
    layoutVersion: 1,
  },

  initialLayout: {
    type: 'tabs',
    children: [{ viewId: 'sh3-style-editor', label: 'Style Editor' }],
    activeIndex: 0,
  },
};
```

- [ ] **Step 3: Update index.ts**

```ts
export { app } from './app';
export { shard } from './shard';
```

- [ ] **Step 4: Commit**

```bash
git add src/shard.ts src/app.ts src/index.ts
git commit -m "feat: define sh3-style shard and app"
```

---

### Task 6: Theme editor — root component and sidebar

**Files:**
- Create: `src/editor/ThemeEditor.svelte`
- Create: `src/editor/ThemeSidebar.svelte`

- [ ] **Step 1: Create ThemeEditor.svelte**

Root component that composes sidebar + editor panel:

```svelte
<script lang="ts">
  import 'sh3-core/tokens.css';
  import type { ThemeState } from '../theme-manager';
  import { allThemes, applyTheme, findTheme } from '../theme-manager';
  import ThemeSidebar from './ThemeSidebar.svelte';
  import ColorSection from './ColorSection.svelte';
  import TypographySection from './TypographySection.svelte';
  import GradientSection from './GradientSection.svelte';

  let { state }: { state: ThemeState } = $props();

  let selectedThemeId = $state(state.activeThemeId);

  const selectedTheme = $derived(findTheme(selectedThemeId, state));
  const isBuiltin = $derived(selectedTheme?.builtin ?? true);

  function onSelectTheme(id: string) {
    selectedThemeId = id;
  }

  function onActivateTheme(id: string) {
    state.activeThemeId = id;
    applyTheme(id, state);
  }
</script>

<div class="theme-editor">
  <ThemeSidebar
    {state}
    {selectedThemeId}
    activeThemeId={state.activeThemeId}
    onselect={onSelectTheme}
    onactivate={onActivateTheme}
  />
  <div class="editor-panel">
    {#if selectedTheme}
      <div class="editor-header">
        <h2>{selectedTheme.name}</h2>
        <span class="badge" class:builtin={isBuiltin}>
          {isBuiltin ? 'BUILTIN' : 'USER'}
        </span>
      </div>
      <div class="editor-body">
        <ColorSection theme={selectedTheme} {state} disabled={isBuiltin} />
        <TypographySection theme={selectedTheme} {state} disabled={isBuiltin} />
        <GradientSection theme={selectedTheme} {state} disabled={isBuiltin} />
      </div>
    {/if}
  </div>
</div>

<style>
  .theme-editor {
    display: flex;
    height: 100%;
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
    font-size: var(--shell-font-size);
  }
  .editor-panel {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
  .editor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .editor-header h2 {
    margin: 0;
    font-size: 16px;
  }
  .badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
  }
  .badge.builtin {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }
  .editor-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
```

- [ ] **Step 2: Create ThemeSidebar.svelte**

```svelte
<script lang="ts">
  import type { ThemeState } from '../theme-manager';
  import {
    allThemes,
    createTheme,
    duplicateTheme,
    deleteTheme,
    importTheme,
    exportTheme,
  } from '../theme-manager';
  import { BUILTIN_PRESETS } from '../presets';

  let {
    state,
    selectedThemeId,
    activeThemeId,
    onselect,
    onactivate,
  }: {
    state: ThemeState;
    selectedThemeId: string;
    activeThemeId: string;
    onselect: (id: string) => void;
    onactivate: (id: string) => void;
  } = $props();

  function handleNew() {
    const theme = createTheme('New Theme', state);
    onselect(theme.id);
  }

  function handleDuplicate() {
    const theme = duplicateTheme(selectedThemeId, state);
    if (theme) onselect(theme.id);
  }

  function handleDelete() {
    if (deleteTheme(selectedThemeId, state)) {
      onselect(activeThemeId);
    }
  }

  function handleExport() {
    const data = exportTheme(selectedThemeId, state);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}.sh3theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sh3theme.json,.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const theme = importTheme(parsed, state);
        if (theme) onselect(theme.id);
      } catch {
        // Invalid file — silently ignore
      }
    };
    input.click();
  }

  const isSelectedBuiltin = $derived(
    BUILTIN_PRESETS.some(p => p.id === selectedThemeId)
  );
</script>

<div class="sidebar">
  <div class="section-label">Built-in</div>
  {#each BUILTIN_PRESETS as theme}
    <button
      class="theme-item"
      class:selected={selectedThemeId === theme.id}
      class:active={activeThemeId === theme.id}
      onclick={() => onselect(theme.id)}
      ondblclick={() => onactivate(theme.id)}
    >
      <span class="lock">🔒</span>
      <span class="name">{theme.name}</span>
      {#if activeThemeId === theme.id}
        <span class="active-dot"></span>
      {/if}
    </button>
  {/each}

  {#if state.userThemes.length > 0}
    <div class="section-label">User</div>
    {#each state.userThemes as theme}
      <button
        class="theme-item"
        class:selected={selectedThemeId === theme.id}
        class:active={activeThemeId === theme.id}
        onclick={() => onselect(theme.id)}
        ondblclick={() => onactivate(theme.id)}
      >
        <span class="name">{theme.name}</span>
        {#if activeThemeId === theme.id}
          <span class="active-dot"></span>
        {/if}
      </button>
    {/each}
  {/if}

  <div class="sidebar-actions">
    <button class="action-btn" onclick={handleNew}>+ New Theme</button>
    <button class="action-btn" onclick={handleDuplicate}>Duplicate</button>
    <div class="action-row">
      <button class="action-btn" onclick={handleImport}>Import</button>
      <button class="action-btn" onclick={handleExport}>Export</button>
    </div>
    {#if !isSelectedBuiltin}
      <button class="action-btn danger" onclick={handleDelete}>Delete</button>
    {/if}
  </div>
</div>

<style>
  .sidebar {
    width: 180px;
    min-width: 140px;
    border-right: 1px solid var(--shell-border);
    padding: var(--shell-pad-md);
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
  }
  .section-label {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    padding: 4px 8px;
    margin-top: 8px;
  }
  .section-label:first-child { margin-top: 0; }
  .theme-item {
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--shell-font-size);
    color: var(--shell-fg);
  }
  .theme-item:hover {
    background: var(--shell-bg-elevated);
  }
  .theme-item.selected {
    background: var(--shell-accent-muted);
    border-left: 2px solid var(--shell-accent);
  }
  .lock { font-size: 10px; }
  .name { flex: 1; }
  .active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--shell-accent);
  }
  .sidebar-actions {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 8px;
  }
  .action-row {
    display: flex;
    gap: 4px;
  }
  .action-row .action-btn { flex: 1; }
  .action-btn {
    all: unset;
    padding: 4px 8px;
    background: var(--shell-bg-elevated);
    border-radius: 4px;
    text-align: center;
    font-size: 11px;
    cursor: pointer;
    color: var(--shell-fg);
  }
  .action-btn:hover {
    background: var(--shell-border);
  }
  .action-btn.danger {
    color: #ff6b6b;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/editor/ThemeEditor.svelte src/editor/ThemeSidebar.svelte
git commit -m "feat: theme editor root component and sidebar"
```

---

### Task 7: Color section component

**Files:**
- Create: `src/editor/ColorSection.svelte`

- [ ] **Step 1: Create ColorSection.svelte**

```svelte
<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';

  let {
    theme,
    state,
    disabled,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
  } = $props();

  const COLOR_TOKENS: { token: ThemeToken; label: string }[] = [
    { token: 'shell-accent', label: 'Accent' },
    { token: 'shell-accent-muted', label: 'Accent Muted' },
    { token: 'shell-bg', label: 'Background' },
    { token: 'shell-bg-elevated', label: 'Elevated' },
    { token: 'shell-bg-sunken', label: 'Sunken' },
    { token: 'shell-border', label: 'Border' },
    { token: 'shell-border-strong', label: 'Border Strong' },
    { token: 'shell-fg', label: 'Text' },
    { token: 'shell-fg-muted', label: 'Text Muted' },
    { token: 'shell-fg-subtle', label: 'Text Subtle' },
  ];

  const resolved = $derived(resolveTokens(theme));

  function handleChange(token: ThemeToken, value: string) {
    if (disabled) return;
    updateToken(theme.id, token, value, state);
  }
</script>

<div class="section">
  <div class="section-title">Colors</div>
  <div class="swatch-grid">
    {#each COLOR_TOKENS as { token, label }}
      <label class="swatch-item">
        <input
          type="color"
          value={resolved[token] ?? '#000000'}
          {disabled}
          onchange={(e) => handleChange(token, e.currentTarget.value)}
        />
        <span class="swatch-label">{label}</span>
      </label>
    {/each}
  </div>
</div>

<style>
  .section {
    background: var(--shell-bg-elevated);
    border-radius: 6px;
    padding: 12px;
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    margin-bottom: 8px;
  }
  .swatch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }
  .swatch-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .swatch-item input[type="color"] {
    width: 36px;
    height: 36px;
    border: 1px solid var(--shell-border);
    border-radius: 6px;
    padding: 2px;
    cursor: pointer;
    background: none;
  }
  .swatch-item input[type="color"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .swatch-label {
    font-size: 10px;
    color: var(--shell-fg-muted);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/ColorSection.svelte
git commit -m "feat: color section with swatch grid and color picker"
```

---

### Task 8: Typography section component

**Files:**
- Create: `src/editor/TypographySection.svelte`

- [ ] **Step 1: Create TypographySection.svelte**

```svelte
<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';

  let {
    theme,
    state,
    disabled,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
  } = $props();

  const resolved = $derived(resolveTokens(theme));

  function handleChange(token: ThemeToken, value: string) {
    if (disabled) return;
    updateToken(theme.id, token, value, state);
  }
</script>

<div class="section">
  <div class="section-title">Typography</div>
  <div class="typo-grid">
    <div class="field">
      <label class="field-label">UI Font</label>
      <input
        type="text"
        class="field-input"
        value={resolved['shell-font-ui'] ?? ''}
        {disabled}
        onchange={(e) => handleChange('shell-font-ui', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Mono Font</label>
      <input
        type="text"
        class="field-input mono"
        value={resolved['shell-font-mono'] ?? ''}
        {disabled}
        onchange={(e) => handleChange('shell-font-mono', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Size</label>
      <input
        type="text"
        class="field-input small"
        value={resolved['shell-font-size'] ?? '13px'}
        {disabled}
        onchange={(e) => handleChange('shell-font-size', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Line Height</label>
      <input
        type="text"
        class="field-input small"
        value={resolved['shell-line'] ?? '1.45'}
        {disabled}
        onchange={(e) => handleChange('shell-line', e.currentTarget.value)}
      />
    </div>
  </div>
</div>

<style>
  .section {
    background: var(--shell-bg-elevated);
    border-radius: 6px;
    padding: 12px;
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    margin-bottom: 8px;
  }
  .typo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .field-label {
    font-size: 10px;
    color: var(--shell-fg-muted);
  }
  .field-input {
    background: var(--shell-bg);
    border: 1px solid var(--shell-border);
    border-radius: 4px;
    padding: 4px 8px;
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
    font-size: 12px;
  }
  .field-input.mono {
    font-family: var(--shell-font-mono);
  }
  .field-input.small {
    max-width: 80px;
  }
  .field-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/editor/TypographySection.svelte
git commit -m "feat: typography section with font and size controls"
```

---

### Task 9: Gradient section and picker

**Files:**
- Create: `src/editor/GradientSection.svelte`
- Create: `src/editor/GradientPicker.svelte`

- [ ] **Step 1: Create GradientPicker.svelte**

A single-surface gradient editor: mode picker + color stops.

```svelte
<script lang="ts">
  import type { GradientMode, ThemeToken } from '../types';
  import { buildGradient, parseGradient, isValidHex } from '../util/color';

  let {
    value,
    disabled,
    onchange,
  }: {
    value: string;
    disabled: boolean;
    onchange: (css: string) => void;
  } = $props();

  const parsed = $derived(parseGradient(value));
  let mode: GradientMode = $state(parsed?.mode ?? 'vertical');
  let colors: string[] = $state(parsed?.colors ?? ['#1a1b1e', '#22232a', '#141518', '#1a1b1e']);

  // Re-sync when external value changes
  $effect(() => {
    const p = parseGradient(value);
    if (p) {
      mode = p.mode;
      colors = p.colors;
    }
  });

  const colorCount = $derived(mode === '4-corner' ? 4 : 2);

  function handleModeChange(newMode: GradientMode) {
    if (disabled) return;
    mode = newMode;
    // Ensure enough colors for the mode
    while (colors.length < (newMode === '4-corner' ? 4 : 2)) {
      colors.push(colors[colors.length - 1] ?? '#1a1b1e');
    }
    onchange(buildGradient(mode, colors));
  }

  function handleColorChange(index: number, hex: string) {
    if (disabled || !isValidHex(hex)) return;
    colors[index] = hex;
    onchange(buildGradient(mode, colors));
  }

  const MODE_LABELS: Record<GradientMode, string> = {
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    '4-corner': '4-Corner',
  };
</script>

<div class="gradient-picker">
  <div class="mode-selector">
    {#each (['vertical', 'horizontal', '4-corner'] as GradientMode[]) as m}
      <button
        class="mode-btn"
        class:active={mode === m}
        {disabled}
        onclick={() => handleModeChange(m)}
      >{MODE_LABELS[m]}</button>
    {/each}
  </div>
  <div class="color-stops">
    {#each { length: colorCount } as _, i}
      <label class="stop">
        <input
          type="color"
          value={colors[i] ?? '#1a1b1e'}
          {disabled}
          onchange={(e) => handleColorChange(i, e.currentTarget.value)}
        />
        <span class="stop-label">
          {#if mode === '4-corner'}
            {['TL', 'TR', 'BL', 'BR'][i]}
          {:else}
            {i === 0 ? 'Start' : 'End'}
          {/if}
        </span>
      </label>
    {/each}
  </div>
  <div class="preview" style:background={buildGradient(mode, colors)}></div>
</div>

<style>
  .gradient-picker {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mode-selector {
    display: flex;
    gap: 4px;
  }
  .mode-btn {
    all: unset;
    padding: 3px 8px;
    font-size: 10px;
    border-radius: 3px;
    background: var(--shell-bg);
    color: var(--shell-fg-muted);
    cursor: pointer;
  }
  .mode-btn.active {
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
  }
  .mode-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .color-stops {
    display: flex;
    gap: 8px;
  }
  .stop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
  }
  .stop input[type="color"] {
    width: 28px;
    height: 28px;
    border: 1px solid var(--shell-border);
    border-radius: 4px;
    padding: 2px;
    cursor: pointer;
    background: none;
  }
  .stop-label {
    font-size: 9px;
    color: var(--shell-fg-subtle);
  }
  .preview {
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--shell-border);
  }
</style>
```

- [ ] **Step 2: Create GradientSection.svelte**

```svelte
<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, clearToken, resolveTokens } from '../theme-manager';
  import GradientPicker from './GradientPicker.svelte';

  let {
    theme,
    state,
    disabled,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
  } = $props();

  const SURFACES: { token: ThemeToken; label: string }[] = [
    { token: 'shell-grad-bg', label: 'Background' },
    { token: 'shell-grad-bg-elevated', label: 'Elevated' },
    { token: 'shell-grad-bg-sunken', label: 'Sunken' },
  ];

  const resolved = $derived(resolveTokens(theme));

  function isEnabled(token: ThemeToken): boolean {
    return !!theme.tokens[token];
  }

  function toggleGradient(token: ThemeToken) {
    if (disabled) return;
    if (isEnabled(token)) {
      clearToken(theme.id, token, state);
    } else {
      // Set a default vertical gradient using the flat color
      const flatToken = token.replace('shell-grad-', 'shell-') as ThemeToken;
      const base = resolved[flatToken] ?? '#1a1b1e';
      updateToken(theme.id, token, `linear-gradient(180deg, ${base}, ${base})`, state);
    }
  }

  function handleGradientChange(token: ThemeToken, css: string) {
    if (disabled) return;
    updateToken(theme.id, token, css, state);
  }
</script>

<div class="section">
  <div class="section-title">Gradients</div>
  {#each SURFACES as { token, label }}
    <div class="surface-block">
      <div class="surface-header">
        <label class="toggle-label">
          <input
            type="checkbox"
            checked={isEnabled(token)}
            {disabled}
            onchange={() => toggleGradient(token)}
          />
          {label}
        </label>
      </div>
      {#if isEnabled(token)}
        <GradientPicker
          value={theme.tokens[token] ?? ''}
          {disabled}
          onchange={(css) => handleGradientChange(token, css)}
        />
      {/if}
    </div>
  {/each}
</div>

<style>
  .section {
    background: var(--shell-bg-elevated);
    border-radius: 6px;
    padding: 12px;
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    margin-bottom: 8px;
  }
  .surface-block {
    margin-bottom: 10px;
    padding: 8px;
    background: var(--shell-bg);
    border-radius: 4px;
  }
  .surface-block:last-child { margin-bottom: 0; }
  .surface-header {
    margin-bottom: 6px;
  }
  .toggle-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--shell-fg);
    cursor: pointer;
  }
  .toggle-label input[type="checkbox"] {
    cursor: pointer;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/editor/GradientSection.svelte src/editor/GradientPicker.svelte
git commit -m "feat: gradient section with per-surface toggle and mode picker"
```

---

### Task 10: Final build and smoke test

**Files:** None (verification only)

- [ ] **Step 1: Build the package**

Run: `npm run build`
Expected: Clean build. `dist/index.js` contains the bundled app and shard.

- [ ] **Step 2: Install into sh3-dev or a test host**

Register the app and shard in a host that uses `createShell`:

```ts
import { app, shard } from 'sh3-style';

createShell({
  shards: [shard],
  apps: [app],
});
```

- [ ] **Step 3: Smoke test**

1. Launch the shell → go to home → sh3-style app appears in the launcher
2. Open sh3-style → sidebar shows 5 built-in themes with lock icons
3. Click "Dark" → editor panel shows colors, typography, gradients (disabled)
4. Double-click "Neon Pulse" → shell visually changes to neon theme with gradients
5. Click "Duplicate" → "Neon Pulse (copy)" appears in User section
6. Select the copy → editor is now enabled → change accent color → shell updates live
7. Click "Export" → downloads `.sh3theme.json` file
8. Click "Delete" → copy is removed, reverts to Dark
9. Click "Import" → select the exported file → theme reappears
10. Reload the page → active theme persists
