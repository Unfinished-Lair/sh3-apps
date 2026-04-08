# sh3-style Core Changes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gradient tokens, surface fallback pattern, token override API, and boot-time theme hydration to sh3-core so that external packages can control the shell's visual identity.

**Architecture:** Three layers of change: (1) new CSS tokens + fallback pattern in tokens.css and all surface-using components, (2) a `setTokenOverrides` / `clearTokenOverrides` / `getTokenOverrides` API on the shell runtime that applies overrides to `:root` and persists to User zone, (3) boot-time hydration in `createShell` that reads persisted overrides before mount. Plus a doc fix in `shards.md`.

**Tech Stack:** Svelte 5, CSS custom properties, localStorage (User zone backend)

**Spec:** `docs/claude-plans/2026-04-08-sh3-style-design.md`

---

### Task 1: Add gradient tokens to tokens.css

**Files:**
- Modify: `packages/sh3-core/src/tokens.css:9-54`

- [ ] **Step 1: Add gradient token declarations**

Add three new gradient tokens after the existing surface tokens (after line 13). These are empty by default — no gradient unless explicitly set:

```css
:root {
  /* Surfaces */
  --shell-bg:            #1a1b1e;
  --shell-bg-elevated:   #22232a;
  --shell-bg-sunken:     #141518;

  /* Gradient layer — empty by default, overrides surface when set */
  --shell-grad-bg:          ;
  --shell-grad-bg-elevated: ;
  --shell-grad-bg-sunken:   ;

  --shell-border:        #2e3038;
  /* ... rest unchanged */
```

- [ ] **Step 2: Update html,body background to use fallback pattern**

Change line 69 from:
```css
  background: var(--shell-bg);
```
to:
```css
  background: var(--shell-grad-bg, var(--shell-bg));
```

- [ ] **Step 3: Build and verify**

Run: `cd packages/sh3-core && npm run build`
Expected: Clean build, no errors. The built `dist/tokens.css` includes the new tokens.

- [ ] **Step 4: Commit**

```bash
git add packages/sh3-core/src/tokens.css
git commit -m "feat(tokens): add gradient layer tokens with surface fallback"
```

---

### Task 2: Update all surface background declarations to use gradient fallback

Every component that uses `background: var(--shell-bg)`, `var(--shell-bg-elevated)`, or `var(--shell-bg-sunken)` in a `background` property needs the fallback pattern. Components using these tokens in non-background contexts (e.g., `color: var(--shell-bg)` for text) stay unchanged.

**Files:**
- Modify: `packages/sh3-core/src/Shell.svelte` (lines 104, 113, 126, 135)
- Modify: `packages/sh3-core/src/overlays/ToastItem.svelte` (line 47)
- Modify: `packages/sh3-core/src/overlays/ModalFrame.svelte` (line 76)
- Modify: `packages/sh3-core/src/overlays/PopupFrame.svelte` (line 76)
- Modify: `packages/sh3-core/src/diagnostic/DiagnosticRoutes.svelte` (line 55)
- Modify: `packages/sh3-core/src/diagnostic/DiagnosticPanel.svelte` (line 81)
- Modify: `packages/sh3-core/src/shell-shard/ShellHome.svelte` (lines 139, 199, 253)
- Modify: `packages/sh3-core/src/layout/DragPreview.svelte` (line 49)
- Modify: `packages/sh3-core/src/primitives/TabbedPanel.svelte` (lines 209, 217, 246, 250)
- Modify: `packages/sh3-core/src/primitives/ResizableSplitter.svelte` (line 272)

**Do NOT change:**
- `packages/sh3-core/src/shell-shard/ShellHome.svelte` lines 219, 266 — these use `color: var(--shell-bg)` for text color, not background
- `packages/sh3-core/src/layout/LayoutRenderer.svelte` line 248-249 — uses tokens inside a `repeating-linear-gradient()` as color stops, not as a standalone background
- `packages/sh3-core/src/layout/SlotContainer.svelte` line 120-121 — same pattern fill, not standalone background
- `packages/sh3-core/src/primitives/TabbedPanel.svelte` line 276 — `.tab-close:hover` uses `--shell-bg-sunken` as a hover highlight, gradient would look wrong here; skip it
- `packages/sh3-core/src/diagnostic/DiagnosticPromptModal.svelte` line 81 — `button.secondary:hover` background, same reasoning

The substitution rules are:

| Original | Replacement |
|---|---|
| `background: var(--shell-bg)` | `background: var(--shell-grad-bg, var(--shell-bg))` |
| `background: var(--shell-bg-elevated)` | `background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated))` |
| `background: var(--shell-bg-sunken)` | `background: var(--shell-grad-bg-sunken, var(--shell-bg-sunken))` |

- [ ] **Step 1: Update Shell.svelte**

In `packages/sh3-core/src/Shell.svelte`, apply the substitution to lines 104, 113, 126, 135:

```css
/* line 104: .shell */
background: var(--shell-grad-bg, var(--shell-bg));

/* line 113: .shell-tabbar */
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));

/* line 126: .shell-content */
background: var(--shell-grad-bg, var(--shell-bg));

/* line 135: .shell-statusbar */
background: var(--shell-grad-bg-sunken, var(--shell-bg-sunken));
```

- [ ] **Step 2: Update overlay components**

In `packages/sh3-core/src/overlays/ToastItem.svelte` line 47:
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

In `packages/sh3-core/src/overlays/ModalFrame.svelte` line 76:
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

In `packages/sh3-core/src/overlays/PopupFrame.svelte` line 76:
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

- [ ] **Step 3: Update diagnostic components**

In `packages/sh3-core/src/diagnostic/DiagnosticRoutes.svelte` line 55:
```css
background: var(--shell-grad-bg, var(--shell-bg));
```

In `packages/sh3-core/src/diagnostic/DiagnosticPanel.svelte` line 81:
```css
background: var(--shell-grad-bg, var(--shell-bg));
```

- [ ] **Step 4: Update ShellHome**

In `packages/sh3-core/src/shell-shard/ShellHome.svelte`:

Line 139 (`.home`):
```css
background: var(--shell-grad-bg, var(--shell-bg));
```

Line 199 (`.app-item`):
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

Line 253 (`.app-search`):
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

- [ ] **Step 5: Update layout and primitive components**

In `packages/sh3-core/src/layout/DragPreview.svelte` line 49:
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

In `packages/sh3-core/src/primitives/TabbedPanel.svelte`:

Line 209 (`.panel-content`):
```css
background: var(--shell-grad-bg, var(--shell-bg));
```

Line 217 (`.tabs`):
```css
background: var(--shell-grad-bg-sunken, var(--shell-bg-sunken));
```

Line 246 (`.tab:hover`):
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

Line 250 (`.tab.active`):
```css
background: var(--shell-grad-bg, var(--shell-bg));
```

In `packages/sh3-core/src/primitives/ResizableSplitter.svelte` line 272:
```css
background: var(--shell-grad-bg-elevated, var(--shell-bg-elevated));
```

- [ ] **Step 6: Build and verify**

Run: `cd packages/sh3-core && npm run build`
Expected: Clean build. No visual change (gradient tokens are empty, so fallback to flat color is used).

- [ ] **Step 7: Commit**

```bash
git add packages/sh3-core/src/Shell.svelte \
  packages/sh3-core/src/overlays/ToastItem.svelte \
  packages/sh3-core/src/overlays/ModalFrame.svelte \
  packages/sh3-core/src/overlays/PopupFrame.svelte \
  packages/sh3-core/src/diagnostic/DiagnosticRoutes.svelte \
  packages/sh3-core/src/diagnostic/DiagnosticPanel.svelte \
  packages/sh3-core/src/shell-shard/ShellHome.svelte \
  packages/sh3-core/src/layout/DragPreview.svelte \
  packages/sh3-core/src/primitives/TabbedPanel.svelte \
  packages/sh3-core/src/primitives/ResizableSplitter.svelte
git commit -m "feat(tokens): apply gradient fallback pattern to all surface backgrounds"
```

---

### Task 3: Implement token override API

**Files:**
- Create: `packages/sh3-core/src/theme.ts`
- Modify: `packages/sh3-core/src/api.ts:24-27`

- [ ] **Step 1: Create theme.ts**

Create `packages/sh3-core/src/theme.ts`:

```ts
/*
 * Token override API — allows external packages (like sh3-style) to
 * dynamically change shell CSS tokens and persist the selection to
 * the User zone.
 *
 * The shell reads persisted overrides at boot (see createShell.ts) so
 * themes survive page reloads. This module provides the write path.
 */

const STORAGE_KEY = 'sh3:user:__shell__:theme';

/** Keys currently set on :root by setTokenOverrides, tracked for clearTokenOverrides. */
let appliedKeys: string[] = [];

/**
 * Apply CSS token overrides to :root and persist to User zone.
 *
 * Keys are token names without the `--` prefix (e.g. `'shell-accent'`).
 * Values are any valid CSS value string.
 *
 * Calling this replaces ALL previous overrides — tokens not present in
 * the new map are removed from :root.
 */
export function setTokenOverrides(overrides: Record<string, string>): void {
  // Remove previously applied keys that are not in the new set
  const newKeys = Object.keys(overrides);
  for (const key of appliedKeys) {
    if (!newKeys.includes(key)) {
      document.documentElement.style.removeProperty(`--${key}`);
    }
  }

  // Apply new overrides
  for (const [key, value] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
  appliedKeys = newKeys;

  // Persist
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Storage full or unavailable — theme applies for this session only
  }
}

/**
 * Remove all token overrides from :root and clear persisted state.
 * The shell reverts to the default tokens defined in tokens.css.
 */
export function clearTokenOverrides(): void {
  for (const key of appliedKeys) {
    document.documentElement.style.removeProperty(`--${key}`);
  }
  appliedKeys = [];

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Read the currently persisted token overrides.
 * Returns an empty object if no overrides are stored.
 */
export function getTokenOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Apply persisted token overrides to :root. Called once during shell boot
 * before any component mounts, so the themed colors are visible from the
 * first frame.
 *
 * This is framework-internal — not part of the shard-facing API.
 */
export function hydrateTokenOverrides(): void {
  const overrides = getTokenOverrides();
  if (Object.keys(overrides).length === 0) return;
  for (const [key, value] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(`--${key}`, value);
  }
  appliedKeys = Object.keys(overrides);
}
```

- [ ] **Step 2: Export from api.ts**

Add to the end of `packages/sh3-core/src/api.ts`:

```ts
// Theme token override API (shell-level theming support).
export {
  setTokenOverrides,
  clearTokenOverrides,
  getTokenOverrides,
} from './theme';
```

- [ ] **Step 3: Build and verify**

Run: `cd packages/sh3-core && npm run build`
Expected: Clean build. The three functions are now importable from `'sh3-core'`.

- [ ] **Step 4: Commit**

```bash
git add packages/sh3-core/src/theme.ts packages/sh3-core/src/api.ts
git commit -m "feat: add setTokenOverrides/clearTokenOverrides/getTokenOverrides API"
```

---

### Task 4: Add boot-time theme hydration

**Files:**
- Modify: `packages/sh3-core/src/createShell.ts:10-11,50-57`

- [ ] **Step 1: Add hydration call to createShell**

In `packages/sh3-core/src/createShell.ts`, add the import at the top (after line 11):

```ts
import { hydrateTokenOverrides } from './theme';
```

Then add the hydration call after platform detection (after line 57, before the discovered packages block):

```ts
  // 1c. Apply persisted theme token overrides before any component mounts,
  //     so the first frame renders with the user's chosen theme.
  hydrateTokenOverrides();
```

- [ ] **Step 2: Build and verify**

Run: `cd packages/sh3-core && npm run build`
Expected: Clean build. On shell boot, any persisted theme overrides are applied before mount.

- [ ] **Step 3: Verify with dev server**

Run: `cd packages/sh3-dev && npm run build && npm run dev`

Open the browser. Open DevTools console. Run:
```js
// Manually test the API
const { setTokenOverrides, getTokenOverrides, clearTokenOverrides } = await import('sh3-core');
setTokenOverrides({ 'shell-accent': '#ff0000', 'shell-bg': '#220000' });
// Shell accent and background should visibly change.
// Reload the page — theme should persist.
clearTokenOverrides();
// Shell reverts to default tokens.
```

Expected: Token overrides apply live, persist across reload, and clear correctly.

- [ ] **Step 4: Commit**

```bash
git add packages/sh3-core/src/createShell.ts
git commit -m "feat: hydrate persisted theme overrides at shell boot"
```

---

### Task 5: Fix shards.md documentation

**Files:**
- Modify: `docs/design/shards.md`

- [ ] **Step 1: Add activation trigger clarification**

The current doc implies shards are self-sufficient. Add a clarification after line 57 ("Activation timing" section), replacing the existing paragraph:

Current text (lines 55-57):
```
## Activation timing

For v1, **all shards activate eagerly** when their host app loads. Lazy activation (VSCode-style activation events: "activate when file X opens", "activate when command Y runs") is a future addition for memory and startup performance. The design accommodates it but v1 does not need it.
```

Replace with:
```
## Activation timing

**Shards do not activate on their own.** A shard activates when an app that lists it in `requiredShards` is launched, or when the framework itself registers it as a built-in (e.g. `__shell__`, `diagnostic`). There is no mechanism for a shard to self-start independently of an app.

For v1, all shards listed in an app's `requiredShards` activate eagerly when that app loads. Lazy activation (VSCode-style activation events: "activate when file X opens", "activate when command Y runs") is a future addition for memory and startup performance. The design accommodates it but v1 does not need it.
```

- [ ] **Step 2: Add clarification to lifecycle diagram**

After the lifecycle diagram (after line 78), add a note:

```
**Who triggers `activate()`?** The shell framework, when an app is launched that lists this shard in its `requiredShards`. Shards cannot activate themselves or each other.
```

- [ ] **Step 3: Commit**

```bash
git add docs/design/shards.md
git commit -m "docs: clarify that shards require an app to activate"
```

---

### Task 6: Final build and smoke test

**Files:** None (verification only)

- [ ] **Step 1: Full rebuild**

Run: `cd packages/sh3-core && npm run build`
Expected: Clean build, zero warnings, zero errors.

- [ ] **Step 2: Dev server smoke test**

Run: `cd packages/sh3-dev && npm run build && npm run dev`

Verify in browser:
1. Shell loads with default dark theme (no visual change from before)
2. DevTools → Elements → `:root` shows the three new `--shell-grad-*` properties (empty)
3. Console: `setTokenOverrides({ 'shell-accent': '#ff0000' })` changes accent color live
4. Reload → accent stays red
5. Console: `clearTokenOverrides()` → reverts to blue
6. Console: `getTokenOverrides()` → returns `{}`

- [ ] **Step 3: Verify gradient fallback works**

In DevTools console:
```js
const { setTokenOverrides } = await import('sh3-core');
setTokenOverrides({
  'shell-grad-bg': 'linear-gradient(135deg, #0d0b1a, #1a1035)',
  'shell-grad-bg-elevated': 'linear-gradient(180deg, #2a1a4a, #1a1035)',
});
```
Expected: Shell background and elevated surfaces show gradients. Tab bar, modal frames, etc. all pick up the gradient.

```js
const { clearTokenOverrides } = await import('sh3-core');
clearTokenOverrides();
```
Expected: Reverts to flat dark theme.
