# Document Picker Migration — Design Spec

**Date:** 2026-05-13
**Status:** Approved (revised for ctx.documentPicker)

## Goal

Replace homemade file-picker UI and native JS prompts in `sh3-ai` and `sh3-pipeline` with the `ctx.documentPicker` programmatic API (sh3-core 0.19.6).

## Architecture

`ctx.documentPicker` is a programmatic API on `ShardContext`:
```ts
ctx.documentPicker.open()  → Promise<{ shardId, path } | null>
ctx.documentPicker.save({ suggestedName? }) → Promise<string | null>
```

SH3 core handles the popup, document browsing, and shard scoping internally. No Svelte widgets to import or embed. Both toolbar buttons and palette actions call the same API functions directly, keeping them in sync.

---

## sh3-ai: Sketch Save

### Current state
- `Sketch.svelte` toolbar "Save…" button + `sh3-ai:sketch.save` action → both trigger `openSavePrompt()`
- `openSavePrompt()` opens float view `ai:sketch.save-prompt`
- `SaveSketchPrompt.svelte`: `<input>` name field → two-phase flow (naming → overwrite check → `store.write()`)

### Target state
- `openSavePrompt()` replaced by `saveSketchViaPicker()`:
  1. Calls `ctx.documentPicker.save({ suggestedName: 'sketch-YYYY-MM-DD-HHMM' })`
  2. If result is null (cancelled), return
  3. Parse the returned path to extract provider + relPath from `ai/docs/<provider>/<relPath>`
  4. Check existence via `store.read()`
  5. If exists, confirm overwrite via `shell.conflicts()`
  6. Call `store.write(provider, relPath, bodyWithMarker)`
- Both toolbar button and action call `saveSketchViaPicker()`

### Files changed
- **Modify:** `src/shard.ts` — replace `openSavePrompt()` with `saveSketchViaPicker()`, update action, remove `savePromptFactory` and view registration
- **Modify:** `src/ai/sketch/Sketch.svelte` — update `onSave` type if needed (function signature unchanged)
- **Remove:** `src/ai/sketch/SaveSketchPrompt.svelte`
- **Modify:** shard manifest — remove `ai:sketch.save-prompt` view

---

## sh3-pipeline: Open & Save As

### Current state
- **Open:** toolbar button + `sh3-pipeline:doc.open` (Mod+O) → `openActive()` → `sh3.modal.open(OpenPipelineModal, ...)` → callback → `openActiveFromPath()` → `loadDoc()`
- **Save As:** toolbar button + `sh3-pipeline:doc.save-as` (Mod+Shift+S) → `saveAsActive()` → `window.prompt()` → `pathToDocId()` → `saveDoc()`
- `OpenPipelineModal.svelte`: 228-line custom modal

### Target state
- **Open:** toolbar button + action → `openActiveViaPicker()`:
  1. Calls `ctx.documentPicker.open()`
  2. If result is null, return
  3. `pathToDocId(result.path)` → `loadDoc()` → update state
- **Save As:** toolbar button + action → `saveAsViaPicker()`:
  1. Calls `ctx.documentPicker.save()`
  2. If result is null, return
  3. `pathToDocId(result)` → `saveDoc()` → update state

### Files changed
- **Modify:** `src/shards/sh3-pipeline/shard.svelte.ts` — replace `openActive()`, `saveAsActive()` with picker-based versions, remove `OpenPipelineModal` import, rewire actions
- **Modify:** `src/shards/sh3-pipeline/PipelineToolbar.svelte` — add `onOpen` and `onSaveAs` props, wire buttons
- **Remove:** `src/shards/sh3-pipeline/OpenPipelineModal.svelte`

---

## Shared patterns

### Both toolbar + action call the same function
```ts
function openViaPicker() {
  const picked = await ctx.documentPicker.open();
  if (!picked) return;
  // ... load logic
}
ctx.actions.register({ id: 'sh3-pipeline:doc.open', run: openViaPicker });
// Toolbar: <button onclick={openViaPicker}>Open…</button>
```

### Overwrite handling (sh3-ai only)
When save path already exists, use `shell.conflicts()` to prompt before overwriting. sh3-pipeline writes without confirmation (existing behavior, unchanged).

### Version
sh3-core peer dep stays at `^0.19.0` — resolves to 0.19.6 where `ctx.documentPicker` is available.

---

## What is NOT changed

- sh3-ai conversation save/load
- sh3-ai docs tools (`ai.docs.*`)
- sh3-pipeline Save (`Mod+S`) — already writes directly
- sh3-pipeline New (`Mod+Alt+N`) — scratch buffer
- sh3-pipeline Run/Stop
