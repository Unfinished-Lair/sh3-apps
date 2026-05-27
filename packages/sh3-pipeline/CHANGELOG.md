# Changelog

## 0.5.0 — 2026-05-27 — Comment node body + prefetch in-node select

### Added

- **Comment node body.** The Flow → Comment node now renders an editable textarea inline and is resizable on both axes (minW 80, minH 40). Default size grows from 200×60 to 200×100 to give the textarea breathing room.
- **Prefetch in-node selection.** Prefetch verb nodes (`config.mode === 'prefetch'`) now expose the row picker directly in the node body via a new `sh3-pipeline:prefetch-node-body` inspector renderer. Error and orphan badges render conditionally next to the select. The renderer is only mounted while the node is in prefetch mode (via `bodySchema[].show`).

Requires `@unfinished-lair/sh3-editor` ≥ 0.18.0 for the body slot and `badge` widget contributions.

## Unreleased

### Fixed

- Toggle Prefetch entry-point. After the 0.3.1 dual-template collapse there was no way to flip a runtime-mode verb node into prefetch mode: the only Toggle lived inside `PrefetchInspector`, which renders only when the node is *already* in prefetch mode — chicken-and-egg. `PrefetchInspectorAdapter` now renders a `Switch to Prefetch mode` button when the selected node is a pickerable verb in runtime mode, and `syncInspector` routes pickerable runtime values through the adapter so the button is reachable.

### Changed

- Verb templates emit `defaultConfig.pickerable: boolean` (sourced from `isPickerableVerb`). The flag is consumed by the inspector dispatch in `shard.svelte.ts` to decide whether to route a runtime-mode verb selection through the prefetch adapter.

## 0.3.1 — 2026-05-25 — record.build dynamic ports + prefetch dual-template collapse

### Fixed

- `record.build` now has editable input ports. The node's template gained a `configSchema` row of type `'string-list'` for its `keys` config, plus a `computePorts` hook that produces one input port per key. Previously the template declared only the `record` output port and `defaultConfig.keys: []` was dead config — users could place the node but never feed it any data.

### Changed

- Prefetch templates are no longer emitted as a second `verb:<shard>:<name>:prefetch` template alongside the runtime template. The verb's catalog entry is a single template whose `computePorts(config.mode)` returns the runtime port shape (default) or the prefetch port shape (`value` + `record` outputs only) depending on `config.mode`. Toggle Prefetch flips `config.mode` only; the node's `type` no longer changes.
- Load-time fixup converts any pre-existing pipeline doc that saved with `:prefetch`-suffixed node types back to the base type + `config.mode: 'prefetch'`. Idempotent on normalized docs.

### Internal

- Peer-dep range tightened to `@unfinished-lair/sh3-editor ^0.16.2` (uses `NodeTemplate.computePorts`).
- `buildPrefetchTemplate` removed; `buildPrefetchPorts(verb)` returns the port list only. `defaultPrefetchConfig()` exported for callers that need the default `prefetch` config block.

## 0.3.0 — 2026-05-25

### Added

- **Prefetch mode for verb nodes.** Verbs with `schema.output` shaped as an array of objects now produce a second `:prefetch` template (category "Pickers"). A Prefetch node runs its verb eagerly at instantiation and on inspector Refresh, caches the result list in node config, and exposes `value` + `record` output ports driven by the user's selection.
- Inspector hosts the picker surface: value-field mapping, selection dropdown, refresh button, orphan/error badges, selected-row JSON preview, and a `Runtime mode` toggle button. Dispatched via sh3-editor's `INSPECTOR_RENDERER_POINT` keyed on `meta.type === 'sh3-pipeline:prefetch-node'`.
- Auto-refresh on node instantiation and debounced refresh (~300ms) on inspector `args` edits.

### Notes

- The in-node `<select>` and right-click context-menu toggle described in the design RFC are deferred to v2, gated on upstream sh3-editor extension points (custom node body slot, node-context-menu contribution point).
- Selection survives Refresh even when the underlying row vanishes (soft-orphan state with a warning badge).

## 0.2.1 — 2026-05-24

### Added

- `format: 'sh3-document'` short-circuits to the `doc` dataType in `dataTypeFromJsonSchema`. Verbs that return SH3 document handles via the `'sh3-document'` JSON-Schema format (sh3-core 0.25+) now show on doc-coloured ports.
- Doc-picker provider — the shard registers its `ctx.documentPicker` under sh3-editor 0.16.1's new `DOC_PICKER_POINT`. The editor's built-in `DocWidget` (record/array/doc inspector rows) uses this picker to let users seed literal document values on doc-typed input ports.
- "Pipeline Nodes" Help tab (F1) — searchable reference of every node template in the active control-graph catalog, grouped by category, with per-template summary and port-table.

### Changed

- Peer dependency `sh3-core` bumped to `^0.25.0` (was `^0.22.0`) to formalise consumption of `VerbSchema.output` and `format: 'sh3-document'`.
- Peer dependency `@unfinished-lair/sh3-editor` narrowed to `^0.16.1` (was `^0.13.0 || ^0.14.0 || ^0.16.0`). The new field-type vocabulary and `DOC_PICKER_POINT` require 0.16.1+.
