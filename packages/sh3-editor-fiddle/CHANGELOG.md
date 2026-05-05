# Changelog

## 0.3.11 — 2026-05-05

Tracks `sh3-editor` 0.13.4 → 0.13.9 patch range and gains a regression test
for the sync-to-JSON / inspector-edit interaction window.

### Fixed

- **Sync-to-JSON now suppresses the parser echo.** Previously, clicking
  Sync pushed the JSON to the editor, the editor's `onContentChange`
  fired ~150 ms later, the parser re-fed the same content, and
  `valueParser.onSuccess` reassigned `state.liveValue` and called
  `inspectorHandle.replace({ value: parsed })` — which **overwrote any
  inspector edit the user made during the debounce window with the
  snapshot Sync had just pushed**. The Sync action now sets
  `suppressNextEditorParse = true` before `valueReplace`, matching the
  live-sync path. Regression test in `shard.test.ts` mounts an echo-style
  `valueReplace` and asserts `inspectorHandle.replace` is not called.
- Slider-family meta in `starter.ts` no longer sets `showValue: true` /
  `showValues: true` (the inspector now renders companion `NumberInput`
  fields instead of sh3-core's small value indicator).
