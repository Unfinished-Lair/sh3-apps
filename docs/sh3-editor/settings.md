# sh3-editor — Settings View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.14.1)
**Peer:** `sh3-core` ^0.22.5 (v3 shard contract)
**View id:** `sh3-editor:settings`
**Contribution point:** `sh3-editor.settings`

> **As of sh3-editor 0.19:** the standalone view id `sh3-editor:settings` aliases
> `sh3-editor:help-settings`. The `SettingsDescriptor` contract is unchanged.
> Either view id can be referenced in `App.initialLayout`.

---

## 1. What it is

A reusable, universal settings page for SH3 apps. A shard registers a declarative `SettingsDescriptor` at the `sh3-editor.settings` contribution point; the view renders one section per descriptor with typed field primitives (toggle, text, number, slider, segmented-enum). Contributing shards never expose their state zones to `sh3-editor` — all reads go through `getValues()`, all writes go through `onEdit(key, value)`.

**Scoping is the contributor's responsibility.** The view does no filtering — it simply lists everything in `sh3-editor.settings`. To get per-app scope (the usual case — you want your section visible only while your app is the active one), register inside `onAppActivate(ctx, appId)`; the framework auto-releases the registration on `onAppDeactivate`, and the view re-lists automatically.

Registering in `register(ctx)` instead is allowed — but the descriptor then lives for the whole SH3 session and shows up in **every** app's Settings view. That is almost never what you want. Use `onAppActivate` unless you specifically want a global section.

When **only one** shard contributes, the per-section header is elided — the user sees a clean flat field list. When **two or more** contribute, each section gets an `<h3>` label so the grouping is clear.

---

## 2. The contract

Import the point id and types from the subpath module. The constant is the only runtime export; the rest is type-only and erases at compile time.

```ts
import {
  SETTINGS_POINT,
  type SettingsDescriptor,
  type SettingsField,
} from '@unfinished-lair/sh3-editor/settings/contributions';
```

### `SettingsDescriptor`

| Field | Type | Required | Meaning |
|---|---|---|---|
| `shardId` | `string` | ✓ | Shard-prefixed identifier (e.g. `'sh3-connector-r2'`). Used as section key and error scoping; must be unique per active shard. |
| `label` | `string` | ✓ | Section header text rendered in an `<h3>` when more than one contributor is present. |
| `schema` | `SettingsField[]` | ✓ | Fields rendered top-to-bottom in array order. |
| `getValues()` | `() => Record<string, unknown>` | ✓ | Called by the host on mount, after every edit, and whenever `subscribe` fires. Pure read — must not mutate. |
| `onEdit(key, value)` | `(k: string, v: unknown) => void \| Promise<void>` | ✓ | Called on user edit. Throw / reject with an `Error` to signal invalid input; the host renders `error.message` inline under the field and re-pulls values. |
| `subscribe?(cb)` | `(cb: () => void) => () => void` | — | Optional. Lets the contributor notify the host that values changed outside the host's UI (e.g., a verb mutated state). Returns an unsubscribe function. |

### `SettingsField`

A tagged union. Every variant carries `key` (unique per descriptor), `label`, and optional `description` + `disabled`.

| Variant | Extra fields | Widget |
|---|---|---|
| `{ type: 'boolean' }` | — | Pill toggle |
| `{ type: 'string' }` | `placeholder?` | Text input |
| `{ type: 'number' }` | `min?`, `max?`, `step?`, `unit?` | Numeric input with optional unit suffix |
| `{ type: 'number-range' }` | `min`, `max`, `step?`, `unit?` | Horizontal slider with live value + unit label |
| `{ type: 'enum' }` | `options: { value: string; label: string }[]` | Segmented buttons |

---

## 3. Registering a descriptor

Register inside `onAppActivate(ctx, appId)` so the section is bound to the lifetime of the active app. `ctx.state` (and any other zones the descriptor reads from) is typically declared once in `register(ctx)` and captured by closure — only the contribution registration belongs in `onAppActivate`.

```ts
import {
  SETTINGS_POINT,
  type SettingsDescriptor,
} from '@unfinished-lair/sh3-editor/settings/contributions';

export const shard: SourceShard = {
  manifest: { /* … */ },

  register(ctx) {
    // State zones live for the whole SH3 session — declare them once here.
    const state = ctx.state({
      prefs: { theme: 'dark' as 'dark' | 'light', autoSaveSec: 60, bucket: 'my-backups' },
    });
    // Stash for onAppActivate to reach.
    (this as any)._state = state;
  },

  onAppActivate(ctx, _appId) {
    const state = (this as any)._state;

    ctx.contributions.register<SettingsDescriptor>(SETTINGS_POINT, {
      shardId: 'my-shard',
      label: 'My Shard',
      schema: [
        { key: 'theme', label: 'Theme', type: 'enum', description: 'Interface color scheme',
          options: [
            { value: 'dark',  label: 'Dark' },
            { value: 'light', label: 'Light' },
          ] },
        { key: 'autoSaveSec', label: 'Auto-save interval', type: 'number-range',
          min: 10, max: 300, step: 5, unit: 's' },
        { key: 'bucket', label: 'Bucket name', type: 'string', placeholder: 'my-bucket' },
      ],
      getValues: () => ({ ...state.prefs }),
      onEdit: (key, value) => {
        if (key === 'bucket' && typeof value === 'string' && /[^a-z0-9-]/.test(value)) {
          throw new Error('Lowercase letters, digits and dashes only');
        }
        (state.prefs as any)[key] = value;
      },
    });
    // Framework auto-releases on onAppDeactivate — no need to capture the disposer.
  },
};
```

> If the same shard contributes settings for several apps with different schemas, branch on `appId` inside `onAppActivate` and register a different descriptor per app. The auto-release on `onAppDeactivate` keeps that book-keeping zero-cost.

### Consumer side — mounting the view

The view id `sh3-editor:settings` behaves like any other standalone view; consuming apps decide how to surface it. Typical patterns:

```ts
// Layout preset — a dedicated "Settings" mode the app swaps into.
const app: SourceApp = {
  id: 'my-app',
  requiredShards: ['my-shard', 'sh3-editor'],
  initialLayout: [
    { name: 'default',  variants: { default: { docked: /* normal layout */ } } },
    { name: 'settings', variants: { default: { docked: { type: 'slot', viewId: 'sh3-editor:settings' } } } },
  ],
};

// Trigger from a command / toolbar / keybinding:
shell.presets.switch('settings');
```

Or embed the view directly in a tab node, a side panel, or any other layout primitive. Same view id, any shell affordance.

---

## 4. Lifecycle

- **App activation.** When the host app becomes active, every shard in its `requiredShards` fires `onAppActivate(ctx, appId)`. Registrations made there land in `ctx.contributions`, and the Settings view (if mounted) re-lists via `ctx.contributions.onChange`. New contributors appear live; their initial values are pulled via `getValues()` and rendered.
- **App deactivation.** When the app unloads, the framework auto-releases every contribution registered in `onAppActivate`. The view re-lists and drops those sections; any inline error entries scoped to those `shardId`s are pruned. The shard itself stays alive across the unload — only the per-app registrations are torn down.
- **App switches.** Closing app A and opening app B fires `onAppDeactivate` for A's shards and `onAppActivate` for B's, which rotates the visible Settings sections automatically. No caller action required.
- **Global (non-per-app) contributions.** If a descriptor is intentionally registered in `register(ctx)` instead, it appears at SH3 boot and stays for the whole session — `ctx.contributions.onChange` still notifies the view, but no rotation happens on app switches.

---

## 5. Reading and writing — the pull model

The host is stateless with respect to settings values. For every descriptor it holds, it calls:

- `getValues()` once on mount (and again on every edit and every `subscribe` fire) to snapshot the current values
- `onEdit(key, value)` when the user interacts with a control

After `onEdit` settles — whether it resolved or rejected — the host unconditionally re-pulls `getValues()`. This gives the user visible confirmation of what the contributor actually stored:

- **Successful edit.** The contributor's `onEdit` updated its own state; `getValues()` now reflects the new value; the UI displays it.
- **Rejected edit.** `onEdit` threw / rejected without mutating; `getValues()` still returns the prior value; the UI snaps back.

This is why `onEdit` never needs to return anything — success vs. failure is expressed by whether the contributor persisted the change and reflected it through `getValues()`.

### The `subscribe` hook

If values can change *outside* of the host's UI (e.g., a verb mutated the shard's state), expose a `subscribe(cb)` on the descriptor. The host calls `cb()` as the trigger to re-pull. Typical implementation wraps Svelte's `$effect.root` or a store subscription:

```ts
subscribe: (cb) => {
  const off = state.on('change', cb);
  return () => off();
},
```

`subscribe` is optional — without it, the host re-pulls only on its own edits. For many shards that's sufficient.

---

## 6. Validation and error surfacing

`onEdit` signals invalid input by throwing synchronously or rejecting its returned Promise. The host:

1. Catches the error and extracts `error.message` (falling back to `'Invalid value'` if the message is empty).
2. Renders a red inline message under the field and marks the control with an error border.
3. Re-pulls `getValues()` — which, because the contributor didn't persist the invalid value, naturally reverts the UI.

```ts
onEdit: (key, value) => {
  if (key === 'maxConnections' && typeof value === 'number' && value > 100) {
    throw new Error('Max 100 connections');
  }
  (state.prefs as any)[key] = value;
}
```

Errors clear automatically on the next successful edit of the same field, and on descriptor unregister.

---

## 7. Visual layout

- **Two-column rows.** Label (+ optional description) on the left (fixed width); control on the right. Error message appears inline below, aligned to the control column.
- **Disabled rows** dim to 50% opacity and become non-interactive.
- **Section header** uses an uppercase, accent-tinted `<h3>` with a thin divider between sections. Header hidden when `descriptors.length === 1`.
- **Empty state.** When no descriptors are registered, the view renders `No settings available.`
- **Styling** follows SH3 design tokens (`--sh3-bg`, `--sh3-fg`, `--sh3-accent`, `--sh3-border`, etc.), so the view inherits the host's theme.

---

## 8. Non-goals

Deferred for v1; revisit when a concrete need appears:

- **Extra field types** (multiline-string, password, color, file-picker, keybind-capture, tag-list). Add to the `SettingsField` union non-breakingly.
- **Sub-sections / categories** within a single shard's contribution. Flatten into `schema` for now.
- **Ordering / priority hints** on descriptors. Display order is registration order.
- **Reset to default** (per-field or per-shard). The contributor owns defaults and can expose a reset verb separately if needed.
- **Search / filter** across fields.
- **Custom field renderers** contributed by other shards. A second contribution point (`sh3-editor.settingsFieldRenderer`) can be added non-breakingly later.
- **Pre-wired preset** in `sh3-editor`. Consumer apps wire their own trigger (layout preset, toolbar button, menu item).
- **Persistence.** Entirely the contributor's concern — the view never touches storage.
- **Cross-shard broadcast** of setting changes. No bus in the framework yet; if another shard needs to react, it polls the owning shard or the owner invokes a known contribution point of its own.

---

## 9. See also

- [editor.md](./editor.md) — the text editor shipped by the same shard (including the per-document `TextEditorSettings` modal, which is unrelated to the universal view above).
- [inspector.md](./inspector.md) — the object inspector (same shard, same `ctx.contributions` style of extensibility).
- [color-picker.md](./color-picker.md) — the color picker shard view.
