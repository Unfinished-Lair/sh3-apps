# Changelog

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
