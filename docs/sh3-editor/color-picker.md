# sh3-editor — Color Picker View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.4.0)
**Peer:** `sh3-core` ^0.10.4
**View id:** `sh3-editor:color-picker`

---

## 1. What it is

A color picker shard view. It exposes:

- A standalone view (`sh3-editor:color-picker`) with a programmatic `openColorPicker(id, opts)` API.
- A default inspector renderer for `meta: { type: 'color' }`. Tag a hex-string field in an inspector meta tree and the picker renders inline — no registration boilerplate.

The picker surface is an SV (saturation × value) square plus a vertical hue strip, rendered directly at the current hue so the color under the cursor is the color you get. Below the square are three numeric sliders — H/S/V by default, toggleable to R/G/B — a hex input, a palette selector, and in-picker controls to save or delete user palettes. Edits push through the same per-instance history bus as the text editor, so Ctrl+Z / Ctrl+Y work out of the box.

---

## 1.5 Cross-shard usage (external shards)

External shards do **not** import sh3-editor's `getApi()` directly — bare cross-shard imports fail at install time under sh3-core 0.10.x+. Use sh3-core's `shell.color.pick()`, which transparently routes to sh3-editor when active and falls back to a native `<input type="color">` when not.

```ts
import { shell } from 'sh3-core';

const hex = await shell.color.pick({
  initial: '#ff8800',
  anchor: triggerElement,    // optional; viewport-center if omitted
  title: 'Background color', // optional
});
if (hex !== null) {
  // user committed — hex is '#rrggbb'
} else {
  // user dismissed (Escape) or never interacted with the picker
}
```

**Caveats:**

- Always returns `#rrggbb` even when `alpha: true` is requested — sh3-editor V1 does not support alpha. Future versions (RGBA, HDR, Linear/Gamma control) will honor `opts.alpha`.
- Outside-click commits the current value; Escape resolves `null`.
- Promise resolves `null` if the user dismisses (Escape) or never interacts with the picker. If another popup supersedes ours mid-interaction, the promise resolves with the last touched color (or `null` if the user never touched it).
- User palettes saved in this flow share storage with the inspector compact-mode picker.

---

## 1.6 Cross-shard live panel (external shards, ≥ 0.7.0)

`shell.color.pick()` (§1.5) is one-shot — Promise resolves on commit/dismiss and the popup goes away. For use cases that need the picker to *live in the host's UI* with continuous bidirectional binding (a paint app's brush-color sidebar, a theme editor's foreground/background panes, etc.), sh3-editor publishes a contribution point that hosts register a descriptor at. The picker view, mounted by the host's layout at a matching `slotId`, binds to the descriptor for the lifetime of the slot.

### Embedding the picker in the host's layout

Use `App.initialLayout` to drop the picker into the host's tree. Either as a leaf slot:

```ts
{ type: 'slot', slotId: 'brush-color', viewId: 'sh3-editor:color-picker' }
```

…or as a `TabEntry` inside a `TabsNode` if the host wants a tabbed pane. Same wiring either way — `slotId` is the key.

### Wiring contract

Contribution point id: `'sh3-editor.color-panel'`.

```ts
export interface ColorPanelDescriptor {
  /** Must match the slotId of the SlotNode / TabEntry that mounts the picker. */
  slotId: string;
  /** Seed hex; invalid → '#000000' (same rule as §1.5). */
  initial: string;
  /** Fires on every user commit (drag end, slider, hex Enter/blur, swatch click, palette save). */
  onChange: (hex: string) => void;
  /** Called once after the picker mounts and is ready to accept setValue. */
  bind?: (ctrl: ColorPanelController) => void;
}

export interface ColorPanelController {
  /** Push a new value into the panel (e.g. eyedropper, host-side undo). No-op after unmount. */
  setValue(hex: string): void;
}
```

External shards consume via **type-only import + inline string-literal id** (per `docs/cross-shard-contribution-guide.md` §3) — never a bare runtime import:

```ts
import type { ColorPanelDescriptor, ColorPanelController } from '@unfinished-lair/sh3-editor';
const COLOR_PANEL_POINT = 'sh3-editor.color-panel';

export const app: SourceApp = {
  manifest: {
    id: 'paint-app',
    label: 'Paint',
    layoutVersion: 1,
    requiredShards: ['sh3-editor'],
  },
  initialLayout: {
    docked: {
      type: 'split', direction: 'horizontal', sizes: [3, 1],
      children: [
        { type: 'slot', slotId: 'canvas', viewId: 'paint-app:canvas' },
        { type: 'slot', slotId: 'brush-color', viewId: 'sh3-editor:color-picker' },
      ],
    },
    floats: [],
  },
  activate(ctx) {
    let brushCtrl: ColorPanelController | null = null;

    const off = ctx.contributions.register<ColorPanelDescriptor>(COLOR_PANEL_POINT, {
      slotId: 'brush-color',
      initial: '#ff8800',
      onChange: (hex) => { paintState.brush.color = hex; },
      bind: (ctrl) => { brushCtrl = ctrl; },
    });

    // Host-side eyedropper sample → push into picker:
    canvas.on('eyedropper', (hex) => brushCtrl?.setValue(hex));

    return () => off();
  },
};
```

### Picker mount dispatch

The picker view's mount factory picks **one** binding source per mount, in priority order:

1. **Intra-shard entry** — `internals.colorPickers.get(slotId)` exists → today's inspector / `EditorApi.openColorPicker` path (§2). Unchanged.
2. **Cross-shard descriptor** — a `ColorPanelDescriptor` is registered at `'sh3-editor.color-panel'` with matching `slotId` → live panel path. Picker emits `onChange(hex)` per commit; calls `bind(controller)` once after mount.
3. **Ad-hoc** — neither matches → reads `context.meta.value` / `readonly` (§3). No event channel.

Same view component, three wiring sources. Per-instance history (Ctrl+Z / Ctrl+Y) and HSV/RGB prefs work identically across all three.

### Lifecycle

- Register the descriptor in `App.activate(ctx)`; call the returned unregister fn from `App.deactivate()`.
- The picker calls `bind(controller)` once after its `mount(container, context)` factory completes. Until then, `setValue` is unavailable.
- After the slot unmounts (layout edit, preset switch), `setValue` becomes a no-op. Null your controller ref when you tear down the slot.
- Re-mounting the same `slotId` (e.g. preset switch back) re-runs dispatch and `bind`s a fresh controller.

### Caveats

- Single source of truth: only one binding source applies per mount, picked by the priority above. Don't register both an intra-shard `EditorApi.openColorPicker(slotId, …)` entry and a `ColorPanelDescriptor` at the same `slotId` — the descriptor will be ignored.
- `setValue` is normalized through the same `#rrggbb` validator as `initial`; invalid hex is silently coerced to `#000000`.
- Controller is per-mount: rebinding via re-mount hands you a *new* controller instance. Don't cache across remounts.
- User palettes share storage with `shell.color.pick` and the inspector compact-mode picker (§6). Saving from the live panel is visible everywhere.
- Alpha is still V1-not-supported; descriptors take a `#rrggbb` `initial` and emit `#rrggbb` from `onChange`.

---

## 2. Internal API (intra-shard only)

> ⚠️ **Intra-shard only.** This API is exposed for sh3-editor's own internal use — the inspector renderer mounts the picker through this surface. External shards reach the picker via `shell.color.pick()` (one-shot popup, §1.5) or the `'sh3-editor.color-panel'` contribution point (live in-layout panel, §1.6). Calling `getApi()` from another shard requires a bare cross-shard import that violates sh3-core's 0.10.x+ runtime model.

```ts
import { getApi } from '@unfinished-lair/sh3-editor';

const api = getApi();
api?.openColorPicker('my-color-slot', {
  value: '#ff0000',
  prefs: { mode: 'hsv' },
});

const off = api?.onColorPickerValueChange((id, hex) => {
  console.log(id, 'changed to', hex);
});

api?.getColorPickerValue('my-color-slot');    // '#ff0000'
api?.listColorPickerInstances();              // ['my-color-slot', …]
api?.closeColorPicker('my-color-slot');       // releases entry + history
off?.();
```

The `id` MUST match the `slotId` the view is mounted at.

### `OpenColorPickerOptions`

| Field | Type | Default | Meaning |
|---|---|---|---|
| `value` | `string` | *(required)* | Initial hex. Invalid hex falls back to `#000000` without throwing. |
| `readonly` | `boolean` | `false` | Freezes interactions; UI dims to 0.5 opacity. |
| `toolbarActions` | `ToolbarAction[]` | `[]` | Optional toolbar above the body. |
| `prefs` | `ColorPickerPrefs` | `{ mode: 'hsv' }` | Consumer-restored prefs from a prior session. |
| `compact` | `boolean` | `false` | Inspector-renderer layout: preview swatch + hex input. The preview itself opens the full picker as a `shell.popup` anchored below it (viewport-aware, dismisses on outside click / Escape). |

> **Rebinding a mounted color-picker (0.4.2+).** `ColorPicker.svelte` tracks the registry reactively — `closeColorPicker(id)` + `openColorPicker(id, newOpts)` rebinds the live view. Note: `prefs` and `compact` are snapshotted at the **initial** mount and are not re-read on rebind; a rebind with a different `prefs.mode` keeps the original mode.

---

## 3. Ad-hoc mounts

```ts
shell.float.open('sh3-editor:color-picker', {
  meta: { value: '#ff0000', readonly: false },
});
```

When no entry exists for the slot id, the view reads `context.meta.value` and `context.meta.readonly`. History still binds per `slotId`.

**Ad-hoc mounts do not emit through `onColorPickerValueChange`** — there is no registry entry for the history controller's post-mutation hook to read from. If you need to observe changes, call `openColorPicker(slotId, opts)` before mounting the view (intra-shard) or register a `ColorPanelDescriptor` at `'sh3-editor.color-panel'` for the same `slotId` (cross-shard, §1.6).

---

## 4. Using as an inspector renderer

The shard auto-registers a default renderer on activate. Tag a hex-string field with `type: 'color'`:

```ts
const config = $state({
  name: 'Heading',
  fg: '#FF0000',
  bg: '#000000',
});

api.openInspector('my-slot', {
  value: config,
  meta: {
    fields: {
      fg: { type: 'color', label: 'Foreground' },
      bg: { type: 'color', label: 'Background' },
    },
  },
});
```

The `fg` and `bg` rows render the color picker in compact mode (preview swatch + hex input + `…` trigger that opens the full surface in a popover). Edits push history commands through the inspector's existing per-instance bus, so Ctrl+Z / Ctrl+Y work.

**Dispatch rules:**

- Non-string value → renders a read-only leaf `String(value)`.
- Invalid-hex string → picker initializes to `#000000`; hex input shows the raw consumer value until the user edits.
- **Override:** register your own renderer for `type: 'color'` with `priority > 10` to take precedence. See [`inspector.md` §5](./inspector.md#5-dispatch-precedence).

---

## 5. Prefs and the HSV/RGB toggle

`ColorPickerPrefs.mode` controls which numeric slider triple is visible:
- `'hsv'` — H (0–360°) / S (0–100%) / V (0–100%).
- `'rgb'` — R / G / B (0–255 each).

The SV square and hue strip remain the same regardless of mode — only the numeric sliders change.

When the user toggles the mode, `onColorPickerPrefsChange(id, { mode })` fires. The picker **does not** persist prefs itself; the consumer persists and passes `prefs` back on the next `openColorPicker`, matching the editor's existing `onPrefsChange` pattern.

---

## 6. User palettes

Eight palettes ship as built-ins (`pastel`, `neon`, `earth`, `web1`, `mono`, `ocean`, `sunset`, `jewel`). The picker also lets users save and delete custom palettes from the in-picker UI.

User palettes are stored in the sh3-core User zone via `ctx.state`:

```ts
ctx.state<{ user: { colorPickerPalettes: ColorPalette[] } }>({
  user: { colorPickerPalettes: [] },
});
```

sh3-core persists this automatically across sessions. Built-in palettes cannot be modified or deleted — the Delete button is disabled while a built-in palette is selected.

**Palette IDs:** built-ins use their published ids (`pastel`, etc.); user palettes use `user-<uuid>`.

**In-picker flow:**
- **`+ Save`** — if a built-in is selected, prompts for a new palette name and creates one containing the current color. If a user palette is selected, appends the current color to that palette.
- **`Delete`** — removes the selected user palette (disabled on built-ins). Selection falls back to the first built-in palette.

---

## 7. Keyboard

- SV square (focused): `ArrowLeft/Right` = ∓1 S. `ArrowUp/Down` = ±1 V (up brightens). `Shift` = ±10.
- Hue strip (focused): `ArrowUp/Down` = ∓1 H. `Shift` = ±10.
- Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z: undo / redo / redo — focus-gated, same dispatch as editor and inspector.

---

## 8. Non-goals (V1)

- Alpha / RGBA.
- Screen eyedropper.
- Color history / recent picks.
- RGB 2D plane (no canonical projection — SV square stays in both modes).
- Named-color tokens (`"rebeccapurple"`).
- Per-instance prefs (prefs are a single consumer-owned object, not per-`slotId`).

---

## 9. Version history

See `CHANGELOG.md`.
