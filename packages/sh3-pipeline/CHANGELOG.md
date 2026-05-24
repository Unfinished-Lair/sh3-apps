# Changelog

## 0.2.1 — 2026-05-24

### Added

- `format: 'sh3-document'` short-circuits to the `doc` dataType in `dataTypeFromJsonSchema`. Verbs that return SH3 document handles via the `'sh3-document'` JSON-Schema format (sh3-core 0.25+) now show on doc-coloured ports.
- Doc-picker provider — the shard registers its `ctx.documentPicker` under sh3-editor 0.16.1's new `DOC_PICKER_POINT`. The editor's built-in `DocWidget` (record/array/doc inspector rows) uses this picker to let users seed literal document values on doc-typed input ports.
- "Pipeline Nodes" Help tab (F1) — searchable reference of every node template in the active control-graph catalog, grouped by category, with per-template summary and port-table.

### Changed

- Peer dependency `sh3-core` bumped to `^0.25.0` (was `^0.22.0`) to formalise consumption of `VerbSchema.output` and `format: 'sh3-document'`.
- Peer dependency `@unfinished-lair/sh3-editor` narrowed to `^0.16.1` (was `^0.13.0 || ^0.14.0 || ^0.16.0`). The new field-type vocabulary and `DOC_PICKER_POINT` require 0.16.1+.
