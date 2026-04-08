# sh3-style — Theme Management System

## Overview

A theming system for SH3 that lets users control the shell's visual identity: accent colors, surface colors, typography, and gradients. Themes are manageable (create, duplicate, edit, delete) and shareable via JSON export/import.

The system splits into two parts:
1. **sh3-core changes** — a thin token override API and boot-time hydration
2. **sh3-style** — an external app+shard package (consumed via npm) that owns all theme intelligence

## Architecture

### Principle: theming is a shell-level concern

Theming affects the entire SH3 ecosystem regardless of which app is running. Other apps and shards never need to react to or know about theming — they consume `var(--shell-*)` tokens as always.

### Data flow

```
sh3-style shard                    sh3-core
─────────────────                  ────────────────
User picks theme ──► resolve tokens ──► setTokenOverrides()
                                        ├─ apply to :root
                                        └─ persist to User zone

                                   Shell boot
                                   ──────────
                                   read User zone ──► apply to :root
```

### sh3-core (the thin layer)

**1. New gradient tokens in `tokens.css`**

Three new CSS custom properties, unset by default:

```css
:root {
  /* existing flat tokens unchanged */
  --shell-bg: #1a1b1e;
  --shell-bg-elevated: #22232a;
  --shell-bg-sunken: #141518;

  /* new: gradient layer (empty = no gradient) */
  --shell-grad-bg: ;
  --shell-grad-bg-elevated: ;
  --shell-grad-bg-sunken: ;
}
```

**2. Surface fallback pattern**

Anywhere sh3-core uses `background: var(--shell-bg)` (or elevated/sunken), switch to:

```css
background: var(--shell-grad-bg, var(--shell-bg));
```

Gradient wins if set; flat color is the fallback. This is a small grep-and-replace across Shell.svelte and any core components that reference these three surface tokens.

**3. Token override API**

Exported from `sh3-core`:

```ts
/** Apply token overrides to :root and persist to User zone. */
function setTokenOverrides(overrides: Record<string, string>): void;

/** Remove all overrides from :root and clear persisted state. */
function clearTokenOverrides(): void;

/** Read current overrides (returns empty object if none set). */
function getTokenOverrides(): Record<string, string>;
```

- `setTokenOverrides` calls `document.documentElement.style.setProperty('--' + key, value)` for each entry and writes the full map to `sh3:user:__shell__:theme` in the User zone (localStorage on web, Tauri FS on desktop).
- `clearTokenOverrides` calls `removeProperty()` for each previously-set key and deletes the persisted entry.
- `getTokenOverrides` reads from the persisted User zone key.

**4. Boot-time hydration**

During shell boot (in `createShell` or `Shell.svelte` initialization), before any app or shard activates:

1. Read `sh3:user:__shell__:theme` from User zone
2. If a valid `Record<string, string>` exists, apply each entry via `setProperty()`
3. If missing or invalid, do nothing (default tokens apply)

This ensures the theme is visible from the first frame — no flash of default colors.

**5. Documentation fix**

`docs/design/shards.md` is misleading about shard independence. The passages about "pure background-service shard" (line 20) and "a shard can be active with zero views" (line 39-42) read as if shards are self-sufficient. They need a clarification that shards require an app (or framework registration) to be activated. The lifecycle diagram should note who triggers `activate()`.

### sh3-style (external package)

**Package structure:**
- Published to npm
- Imports `sh3-core` and `sh3-core/tokens.css`
- Exports an App and a Shard

**App manifest:**
```ts
{
  id: 'sh3-style',
  label: 'Style',
  version: '0.1.0',
  requiredShards: ['sh3-style'],
  layoutVersion: 1
}
```

**Shard manifest:**
```ts
{
  id: 'sh3-style',
  label: 'Style',
  version: '0.1.0',
  views: [{ id: 'sh3-style-editor', label: 'Style Editor' }]
}
```

**Shard behavior:**
- On `activate()`: reads User zone state to hydrate its internal theme list and active selection. Does NOT apply the theme — sh3-core already did that at boot.
- Registers one view: the theme editor.

## Token Surface

### Scope: colors + typography + gradients

17 total tokens that sh3-style can override:

**Colors (10):**

| Token | Purpose |
|---|---|
| `shell-bg` | Base surface color |
| `shell-bg-elevated` | Raised panels, active tabs |
| `shell-bg-sunken` | Recessed areas |
| `shell-border` | Default border color |
| `shell-border-strong` | Emphasized border color |
| `shell-fg` | Primary text color |
| `shell-fg-muted` | Secondary text color |
| `shell-fg-subtle` | Tertiary text color |
| `shell-accent` | Primary accent color |
| `shell-accent-muted` | Subdued accent color |

**Typography (4):**

| Token | Purpose |
|---|---|
| `shell-font-ui` | UI font family stack |
| `shell-font-mono` | Monospace font family stack |
| `shell-font-size` | Base font size (e.g. `13px`) |
| `shell-line` | Line height (e.g. `1.45`) |

**Gradients (3, optional):**

| Token | Purpose |
|---|---|
| `shell-grad-bg` | CSS gradient for base surface |
| `shell-grad-bg-elevated` | CSS gradient for elevated panels |
| `shell-grad-bg-sunken` | CSS gradient for sunken areas |

Tokens outside this list (spacing, z-indices, chrome metrics) are not overridable by sh3-style. This prevents users from breaking layout geometry.

## Theme Definition

### Internal model

```ts
interface ThemeDefinition {
  id: string;
  name: string;
  builtin: boolean;
  base?: string;                    // preset ID this was duplicated from
  tokens: Partial<Record<ThemeToken, string>>;
}

type ThemeToken =
  | 'shell-bg' | 'shell-bg-elevated' | 'shell-bg-sunken'
  | 'shell-border' | 'shell-border-strong'
  | 'shell-fg' | 'shell-fg-muted' | 'shell-fg-subtle'
  | 'shell-accent' | 'shell-accent-muted'
  | 'shell-font-ui' | 'shell-font-mono' | 'shell-font-size' | 'shell-line'
  | 'shell-grad-bg' | 'shell-grad-bg-elevated' | 'shell-grad-bg-sunken';
```

Only overridden tokens appear in `tokens`. Missing tokens fall through to `tokens.css` defaults.

### Export format (`.sh3theme.json`)

```json
{
  "name": "Neon Pulse",
  "tokens": {
    "shell-bg": "#0d0b1a",
    "shell-accent": "#bf7aff",
    "shell-grad-bg": "linear-gradient(135deg, #0d0b1a, #1a1035)",
    "shell-font-ui": "Inter, system-ui, sans-serif"
  }
}
```

On import, sh3-style merges the token map over the Dark preset defaults. Unknown token keys are silently ignored.

### Shard state (User zone)

```ts
{
  activeThemeId: string;
  userThemes: ThemeDefinition[];
}
```

Built-in presets are hardcoded in shard code, not stored in state. The User zone only holds user-created themes and the active selection.

## Built-in Presets

5 presets ship with sh3-style:

1. **Dark** — current SH3 default. Black/dark gray surfaces, blue accent. No gradients.
2. **Light** — white/light gray surfaces, blue accent. No gradients.
3. **Neon Pulse** — deep purple-to-navy gradient surfaces. Electric purple + cyan accents with subtle glow.
4. **Jade Garden** — warm off-white to pale sage gradients. Muted green accents. Serif UI font. Quiet editorial feel.
5. **Matcha Ink** — dark forest green gradient surfaces. Soft green text and accents.

Built-in presets are undeletable and uneditable. Users can duplicate them to create an editable copy.

## Editor UI

### Layout: sidebar + editor panel

**Sidebar (theme list):**
- Built-in section: 5 presets with lock icon, undeletable
- User themes section: user-created/duplicated/imported themes
- Active theme has a highlight indicator
- Click to switch (applies live immediately)
- Bottom: "New Theme" button, "Import" button

**Editor panel:**
- **Header**: theme name, badge (BUILTIN / USER), action buttons (Duplicate, Export, Delete). Delete disabled for builtins.
- **Colors section**: swatch grid for all 10 color tokens. Click opens color picker. Disabled for builtins.
- **Typography section**: font family text inputs (UI + mono), font size slider, line height slider. Disabled for builtins.
- **Gradients section**: per-surface toggle (bg, elevated, sunken). When enabled: gradient mode picker + color stops. Disabled for builtins.
- All edits apply live via `setTokenOverrides()`. No save button — changes persist immediately.

### Gradient editor

3 gradient modes per surface:
- **Vertical**: top-to-bottom, 2 color stops → `linear-gradient(180deg, color1, color2)`
- **Horizontal**: left-to-right, 2 color stops → `linear-gradient(90deg, color1, color2)`
- **4-corner**: one color per corner → approximated with CSS (e.g., layered radial gradients or conic gradient)

Each surface (bg, elevated, sunken) can independently enable/disable gradient and choose its own mode and colors.

## Error Handling

- **Invalid import**: validate JSON shape, show inline error if malformed. Don't crash.
- **Missing font**: browser font stack fallback handles it natively. No special handling.
- **Corrupt persisted state**: sh3-core skips invalid data silently — default tokens apply. sh3-style can detect mismatch and reset.
- **Unknown token keys in import**: silently ignored. Only the 17 known token names are applied.

## Out of Scope (v1)

- Spacing/chrome metric overrides (tab bar height, padding scale, etc.)
- Drop shadows as a token
- Per-shard theme overrides
- Theme sharing via URL or registry
- Clipboard-based import/export (file-based only for v1)
- Animations or transitions on theme switch
