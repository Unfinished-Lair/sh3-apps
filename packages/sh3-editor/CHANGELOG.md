# Changelog

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
