# Changelog

## 0.8.0 — 2026-04-28

### Added
- Graph Flow view (`sh3-editor:graph`).
- `GraphDomain` contribution point (`sh3-editor.graph-domain`) — register a
  domain via lazy factory; consumers ship templates, visuals, edge semantics,
  and optional connection rules.
- `GraphViewDescriptor` cross-shard binding (`sh3-editor.graph-view`) —
  consumer supplies `slotId`, `domainId`, `initial: GraphAsset`, `onChange`,
  optional `bind` callback receiving a `GraphController`.
- New subpath exports: `./graph/contributions`, `./graph/types`,
  `./graph/history`.
- Inspector reuse — selected-node config edits flow through the existing
  `INSPECTOR_RENDERER_POINT` via a `WalkerCommitOverride` that pushes
  `set-node-config` commands onto the graph's `HistoryController`.

### Notes
- No execution Runner is bundled; consumers own execution semantics.
- Domain providers must declare `autostart: true`.
- `peerDependencies.sh3-core` unchanged at `^0.11.4`.

## 0.7.0

### Added

- **Cross-shard live color panel.** New contribution point `'sh3-editor.color-panel'` lets external shards embed `sh3-editor:color-picker` as a live, bidirectionally-bound panel inside their own `App.initialLayout`. Hosts register a `ColorPanelDescriptor { slotId, initial, onChange, bind? }`; the picker emits `onChange(hex)` per user commit and history move, and the host pushes values back via the controller handed to `bind(ctrl)` (eyedropper, host-side undo). Complements `shell.color.pick()` (one-shot, §1.5). New module: `src/color-panel/` (`contributions.ts` + `select-binding.ts`). Picker mount dispatch now picks one binding source in priority order: intra-shard entry > descriptor > ad-hoc `meta`. See `docs/sh3-editor/color-picker.md` §1.6.

### Changed

- `ColorPicker.svelte` now accepts an optional `descriptorBinding` prop; the existing intra-shard `EditorApi.openColorPicker` path and ad-hoc `meta` path are unchanged. New `ColorPanelDescriptor` and `ColorPanelController` types re-exported from the package root.

## 0.6.3

### Added
- **Registers at sh3-core's `sh3.color-picker` contribution point** (sh3-core 0.11.4+). `shell.color.pick()` from any shard now routes to sh3-editor's rich picker when active, falling back to the native `<input type="color">` otherwise. New module: `src/color-picker/` (`popup-pick.ts` + `PopupPickWrapper.svelte`).

### Changed
- **`docs/sh3-editor/color-picker.md` reframed.** §2 (`getApi().openColorPicker(...)`) is now flagged as intra-shard only — external shards must use `shell.color.pick()` per the sh3-core 0.10.x+ shard runtime model. New §1.5 documents the cross-shard usage path.

### Notes
- `opts.alpha` is silently ignored in V1 — sh3-editor's picker does not yet support RGBA. Future enhancements (alpha, HDR, Linear/Gamma) will honor it without a contract change.
- Per-pick prefs are not persisted; each `shell.color.pick()` opens in HSV mode regardless of the user's last toggle in the standalone view or inspector compact mode.

## 0.6.2

### Changed
- **Hotkeys tab now calls `shell.actions.listActive()`** from sh3-core (0.11.4+), replacing the local scope-activation shim. The upstream API returns the same shape plus `bindingSource`; the shim (`src/views/help/listActiveShim.ts` and its test) has been removed. Peer bumped from `^0.11.1` to `^0.11.4`. See [Unfinished-Lair/sh3#24](https://github.com/Unfinished-Lair/sh3/issues/24) and `docs/shard-authoring.md` §"Inspecting the active action set".

## 0.6.1

### Fixed
- **Help modal no longer shows an unnecessary horizontal scrollbar.** `.tab-body` now scrolls only vertically (`overflow-x: hidden`), and hotkey rows clamp the label column to the available track (`minmax(0, 1fr)` + `min-width: 0` on the label with ellipsis for overflowing text), so long action labels or scope badges don't push the tab wider than the modal.

## 0.6.0

### Added
- **Help view (F1).** New registered view `sh3-editor:help` showing active hotkeys grouped by scope tier. Opens as a modal on **F1** (`sh3-editor:help.open` action, scope `['home', 'app']`, `allowInInputs: true`, `dismissOnBackdrop: true`); also mountable as a persistent view in a layout.
- **Help tab contribution point.** New contribution point `sh3-editor:help.tabs` lets any shard add tabs to the Help modal. Descriptor + id constant exported from `@unfinished-lair/sh3-editor/help/contributions`. See `docs/authoring-help-tabs.md`.
- **`sh3-editor:settings.open` action.** Palette-discoverable entry for the editor settings view.

### Changed
- **`sh3-core` peer bumped** from `^0.10.4` to `^0.11.1` to pick up the Actions / Context / Dispatch framework (needed for F1 and the hotkey registry).

### Notes
- Hotkeys tab currently uses a local scope-activation shim until the upstream `shell.actions.listActive()` API lands (RFC filed at [Unfinished-Lair/sh3#24](https://github.com/Unfinished-Lair/sh3/issues/24)). The shim and the public call return the same shape; swap is a one-line change in `Help.svelte`.

## 0.5.1

### Fixed
- `sh3-editor:settings` no longer spins in an infinite reactive loop on mount. The descriptor-snapshot `$effect` in `Settings.svelte` reads `errors` (to hand it to `pruneErrors`) and writes back `errors = pruneErrors(...)`, but `pruneErrors` was returning a new object reference unconditionally — every run scheduled the next. `pruneErrors` is now referentially stable in the no-change case (empty map, or every existing shard still active → returns `prev` unchanged), which Svelte's `$state` treats as a no-op assignment and the effect settles.

### Notes
- Peer `sh3-core` remains `^0.10.4`.

## 0.5.0

### Added
- Universal settings view. New subpath export `@unfinished-lair/sh3-editor/settings/contributions` publishes `SETTINGS_POINT` plus `SettingsDescriptor` / `SettingsField` types. Any active shard registers a descriptor at `sh3-editor.settings` via `ctx.contributions.register(...)` and the new `sh3-editor:settings` view renders it — one section per contributor (section header auto-elides when only one contributor is registered). Field types in v1: `boolean`, `string`, `number`, `number-range` (slider), `enum`. Inline validation: `onEdit` throws / rejects → host shows `error.message` under the field and re-pulls values.

### Changed
- Housekeeping renames to free the `:settings` id for the universal view: `EditorSettings.svelte` → `TextEditorSettings.svelte`; the editor toolbar gear action id moved from `sh3-editor:settings` to `sh3-editor:toolbar`. No behavior change to the per-document text-editor prefs modal.

### Notes
- Peer `sh3-core` remains `^0.10.4`.
- No pre-wired preset ships with sh3-editor; consumer apps wire their own trigger (layout preset, toolbar button, menu item). Persistence is entirely the contributor's concern.

## 0.4.7

### Fixed
- Color-picker styling now uses CSS tokens that actually exist. The pre-refactor code (and therefore the extracted `ColorPickerSurface.svelte`) referenced `--shell-bg-lighter`, `--shell-text`, `--shell-text-bright`, `--shell-text-dim`, `--shell-border-light`, `--shell-bg-light`, `--shell-bg-toolbar` — none of which are defined in `sh3-core/tokens.css`. Slider thumbs had `background: var(--shell-text-bright)` → undefined → transparent → invisible. RGB slider tracks had `background: var(--shell-bg-lighter)` → same story. Tokens are now mapped to real ones: `--shell-input-bg`, `--shell-bg-elevated`, `--shell-bg-sunken`, `--shell-fg`, `--shell-fg-muted`, `--shell-border`.
- Vendor prefixes on `<input type="range">` (`-webkit-appearance: none`, `-moz-appearance: none`) and `::-webkit-slider-thumb` — Chromium silently ignores custom thumb styling without the `-webkit-` prefix.
- Compact popup color-picker no longer reverted to the old color right after the user committed a new one. The Surface's `lastSyncedHex` was `$state`, so writing to it inside `emit()` re-triggered the value-sync `$effect`, which then found that the (unchanged) `value` prop differed from the new marker and clobbered `hsv` back to the old color. `lastSyncedHex` is now a plain `let` — the sync effect only re-runs when `value` actually changes.
- Hue strip no longer degrades to a brownish flat bar. The previous code only called `drawStripIndicator()` on hue change, which painted a white+black line over the existing canvas without clearing; successive drags accumulated lines across the rainbow. The strip now re-renders in full on every h change (canvas.width reset clears, rainbow + single indicator drawn fresh).

### Notes
- All fixes land in `ColorPickerSurface.svelte` and `ColorPicker.svelte`. Public API unchanged.
- The standalone `sh3-editor:color-picker` view incidentally gets the token fixes too — previously its styling was also using undefined tokens, so surfaces rendered with partial theming.
- Peer `sh3-core` remains `^0.10.4`.

## 0.4.4

### Changed
- `sh3-editor:color-picker`'s compact layout (the inspector-renderer path for `meta: { type: 'color' }`) now opens its full picker surface via `shell.popup.show` from sh3-core overlays instead of a hand-rolled inline popover. Dismisses on outside click and Escape, positions with viewport-aware clamp + flip-above when near the bottom edge. The preview swatch itself is the trigger — the separate `…` button is gone.
- Internal refactor: extracted `ColorPickerSurface.svelte` (the square + strip + sliders + palette UI). The standalone `sh3-editor:color-picker` view embeds the Surface directly; the compact variant hands the Surface to `shell.popup.show`.

### Notes
- No public API changes. `EditorApi.openColorPicker`, `ColorPalette`, `ColorPickerPrefs`, `OpenColorPickerOptions` — all unchanged.
- `prefs.mode` is now forwarded to the Surface via `initialMode`, and the Surface emits `onModeChange` back up to the standalone ColorPicker which re-emits `colorPickerPrefsChange` (behavior identical to 0.4.3).
- Peer `sh3-core` remains `^0.10.4`.

## 0.4.3

### Fixed
- Walker now routes fields with an explicit `meta.type` through the renderer registry **before** checking whether the value is a primitive. Previously a primitive value (e.g. a hex string) with `meta: { type: 'color' }` rendered as an `EditablePrimitive` text input instead of dispatching to the color-picker renderer. Now any field with `fieldMeta.type` flows through `<Inspect>`, regardless of primitive-ness.
- Registry reactivity no longer ships a second signal graph. Earlier 0.4.2 used `SvelteMap` from `svelte/reactivity`, which rollup bundled alongside its own inlined copy of svelte's internal `state()` / `source()` primitives — components kept using the host's external `svelte/internal/client`, so the two graphs never talked to each other and `$derived` didn't re-fire in the live shell. Registries now use a plain `Map` + a `$state(0)` version counter (files renamed to `.svelte.ts`), so the reactive primitives compile to the host-shared runtime and the graph is one.

### Notes
- No breaking changes. Public `EditorApi` surface is unchanged.
- Artifact size is back to pre-0.4.2 (~67kB) since SvelteMap is no longer in the bundle.

## 0.4.2

### Fixed
- `sh3-editor:inspector` and `sh3-editor:color-picker` views now re-render when their registry entry changes. Previously the view captured the entry reference once at mount; consumers doing `closeInspector(id)` + `openInspector(id, newOpts)` (or the color-picker equivalent) observed the view stuck on the original value. The registries now use `SvelteMap` from `svelte/reactivity`, and both views derive their entry via `$derived(internals.<registry>.get(instanceId))`. Resolves [sh3-apps#2](https://github.com/Unfinished-Lair/sh3-apps/issues/2).

### Notes
- No breaking changes. Public `EditorApi` surface is unchanged.
- Consumer code that was already calling `close + open` to swap the inspected value now just works. `open` on an already-open id still returns the existing entry without replacing it; callers that want to rebind must `close + open`.
- `ColorPicker.svelte`'s `prefs` and `compact` are still read once at mount (pre-existing behavior); rebinding with different `prefs.mode` keeps the original mode.
- Peer `sh3-core` remains `^0.10.4`.

## 0.4.1

### Added
- `OpenInspectorOptions.onCommit?: (path, next) => boolean | void` — consumer-supplied hook to route walker-dispatched field commits (primitives and custom renderers mounted at field sites) through the caller's own editor history instead of the inspector's built-in per-slot history. Enables coalesce, autosave, and unified undo/redo across consumer-owned scene ops and inspector edits. Resolves [sh3-apps#1](https://github.com/Unfinished-Lair/sh3-apps/issues/1). See `docs/sh3-editor/inspector.md` §8.1.
- New public type: `WalkerCommitOverride`.

### Notes
- No breaking changes. Existing consumers that omit `onCommit` see identical behavior.
- Peer `sh3-core` remains `^0.10.4`.

## 0.4.0

### Added
- Color picker view `sh3-editor:color-picker` with SV square + vertical hue strip (canvas, no darkening overlay), HSV/RGB numeric slider mode toggle, hex input, palette selector with swatches, and in-picker save/delete for user palettes.
- `EditorApi` methods: `openColorPicker` / `closeColorPicker` / `getColorPickerValue` / `listColorPickerInstances` / `onColorPickerValueChange` / `onColorPickerPrefsChange`.
- New types: `ColorPalette`, `ColorPickerPrefs`, `OpenColorPickerOptions`.
- Default inspector renderer for `meta: { type: 'color' }` — auto-registered on activate at priority 10. Consumers override at `priority > 10`.
- Ad-hoc mount path via `context.meta` for inspect-a-color-right-now flows.
- User-palette persistence via sh3-core's User zone (`ctx.state`). Eight built-in palettes (pastel, neon, earth, web1, mono, ocean, sunset, jewel) plus any the user saves from the in-picker UI.
- Runtime JS export for `@unfinished-lair/sh3-editor/inspector/contributions`. Previously types-only; `INSPECTOR_RENDERER_POINT` now resolves at runtime too.
- Walker extension: `InspectorRendererProps` gains an optional `onCommit`; `FallbackWalker` now supplies a parent-write closure when recursing into non-primitive children, so custom renderers at field sites commit through the walker rather than having to build their own apply/revert.

### Notes
- Peer `sh3-core` remains `^0.10.4`.
- No breaking changes. Existing inspector consumers that do not use `type: 'color'` are unaffected.

## 0.3.1

- Re-export `getApi` from the package entry so consumers can `import { getApi } from '@unfinished-lair/sh3-editor'`.

## 0.3.0

- New view `sh3-editor:inspector` — renders arbitrary objects with a fallback walker for plain objects/arrays and editable leaves for primitives.
- Per-instance generic history bus on `EditorApi.history(instanceId)`: `push` / `undo` / `redo` / `peek` / `replaceTop` / `clear` / `onChange`. Custom `HistoryCommand`s from external shards interleave with the editor's text-swap commands in the same stack.
- Inspector renderer contributions — register custom renderers for a type tag via `ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, …)`. Subpath: `@unfinished-lair/sh3-editor/inspector/contributions`.
- New `EditorApi` surface: `openInspector` / `closeInspector` / `getInspectorValue` / `listInspectorInstances` / `onInspectorValueChange` / `history(id)`.
- Peer bump: `sh3-core` `^0.10.4` (required for `ctx.contributions`).
- Retroactive documentation under `docs/sh3-editor/{editor,inspector}.md`.
- Primitives subpath d.ts emission deferred — workspace-local consumers can import `<Inspect>` / `<Field>` / `<EditablePrimitive>` by direct path; published subpath is a follow-up.

## 0.2.0

- Auto-indent on Enter: new `MatchingConfig.indentType` — `'none' | 'brace' | 'indent'`.
- Brace-aware behavior when `indentType === 'brace'`:
  - Enter after `{` adds one indent unit.
  - Enter between `{|}` splits into three lines (inline) or four (allman).
  - Typing `}` on a whitespace-only line dedents to the matching `{`.
- User preferences (`indentUnit`, `braceStyle`) exposed via a built-in settings popover.
  - Gear button appears in the toolbar when the active `indentType` has user-editable options.
  - Can be hidden via `OpenDocumentOptions.showSettings: false`.
- New API: `onPrefsChange(id, prefs)` — fires when the user toggles prefs; consumers own persistence.
- Seed prior prefs via `OpenDocumentOptions.prefs`.
- `MatchingConfig.indentBased` is deprecated; treat as `indentType: 'indent'` when `indentType` is absent.

## 0.1.0

- Initial release
- Multi-instance document management
- Layered textarea editor with syntax highlight overlay
- Custom undo/redo with keystroke coalescing
- Bracket matching (configurable pairs)
- Indent-level matching (for indent-based languages)
- Configurable toolbar via action descriptors
- Public API: openDocument, closeDocument, getContent, isDirty, events
- Tab/Shift+Tab indent/dedent
- Line numbers with scroll sync
