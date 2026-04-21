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

## 2. Opening a picker (standalone)

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
| `compact` | `boolean` | `false` | Inspector-renderer layout: preview + hex + popover trigger. |

---

## 3. Ad-hoc mounts

```ts
shell.float.open('sh3-editor:color-picker', {
  meta: { value: '#ff0000', readonly: false },
});
```

When no entry exists for the slot id, the view reads `context.meta.value` and `context.meta.readonly`. History still binds per `slotId`.

**Ad-hoc mounts do not emit through `onColorPickerValueChange`** — there is no registry entry for the history controller's post-mutation hook to read from. If you need to observe changes, call `openColorPicker(slotId, opts)` before mounting the view.

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
