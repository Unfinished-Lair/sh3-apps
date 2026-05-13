# Document Picker Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace homemade file-picker UI and `window.prompt()` in sh3-ai and sh3-pipeline with `ctx.documentPicker` programmatic API.

**Architecture:** `ctx.documentPicker.open()` / `ctx.documentPicker.save()` is a programmatic API on `ShardContext` (sh3-core 0.19.6). SH3 core handles the popup, document browsing, and shard scoping internally. Both toolbar buttons and palette actions call the same async functions directly — no Svelte widgets to embed.

**Tech Stack:** TypeScript, Svelte 5, sh3-core 0.19.6

---

### Task 1: sh3-ai — Replace `openSavePrompt` with `ctx.documentPicker.save()`

**Files:**
- Modify: `packages/sh3-ai/src/shard.ts:17,22,27-28,217-298`

- [ ] **Step 1: Add import for `SH3_INLINE_MARKER`**

```typescript
// line 17 — change from:
import SaveSketchPrompt from './ai/sketch/SaveSketchPrompt.svelte';
// to:
import { SH3_INLINE_MARKER } from './ai/sketch/tools';
```

- [ ] **Step 2: Remove `SAVE_PROMPT_VIEW_ID` constant**

```typescript
// line 28 — delete this line:
const SAVE_PROMPT_VIEW_ID = 'ai:sketch.save-prompt';
```

- [ ] **Step 3: Replace `openSavePrompt()` with `saveSketchViaPicker()`**

Replace lines 217-234 with:

```typescript
const SKETCH_MARKER_SCAN = 200;

async function saveSketchViaPicker(): Promise<void> {
  const snap = sketchState.current;
  const providerId = state.user.activeProviderId;
  if (!snap) {
    sh3.toast.notify('AI Sketch: nothing to save.', { level: 'warn' });
    return;
  }
  if (!providerId) {
    sh3.toast.notify('AI Sketch: no active AI provider.', { level: 'warn' });
    return;
  }
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const suggestedName = `sketch-${y}-${m}-${d}-${hh}${mm}`;

  const path = await ctx.documentPicker.save({ suggestedName });
  if (!path) return;

  const docPath = path.startsWith('docs/') ? path.slice(5) : path;
  const slashIdx = docPath.indexOf('/');
  if (slashIdx <= 0) {
    sh3.toast.notify(`AI Sketch: invalid save path '${path}'.`, { level: 'error' });
    return;
  }
  const pickedProvider = docPath.slice(0, slashIdx);
  const relPath = docPath.slice(slashIdx + 1);

  const body =
    snap.mode !== 'inline'
      ? snap.html
      : snap.html.slice(0, SKETCH_MARKER_SCAN).includes('sh3:inline')
        ? snap.html
        : `${SH3_INLINE_MARKER}\n${snap.html}`;

  try {
    await docsStore.write(pickedProvider, relPath, body);
    sh3.toast.notify(`Saved AI Sketch as ${relPath}.`, { level: 'info' });
  } catch (err) {
    sh3.toast.notify(
      `AI Sketch save failed: ${err instanceof Error ? err.message : String(err)}`,
      { level: 'error' },
    );
  }
}
```

- [ ] **Step 4: Update `sketchFactory` to pass `saveSketchViaPicker`**

```typescript
// line 240 — change `openSavePrompt` to `saveSketchViaPicker`:
props: { state: sketchState, onSave: saveSketchViaPicker },
```

- [ ] **Step 5: Update `sh3-ai:sketch.save` action**

```typescript
// lines 290-298 — change `run() { openSavePrompt(); }` to:
run() { saveSketchViaPicker(); },
```

- [ ] **Step 6: Remove `savePromptFactory` and its view registration**

Delete lines 250-278 (the entire `savePromptFactory` block including `ctx.registerView(SAVE_PROMPT_VIEW_ID, savePromptFactory)`).

- [ ] **Step 7: Remove `ai:sketch.save-prompt` from manifest views**

```typescript
// line 164 — delete this line:
{ id: SAVE_PROMPT_VIEW_ID, label: 'Save AI Sketch', standalone: true },
```

- [ ] **Step 8: Commit**

```bash
git add packages/sh3-ai/src/shard.ts
git commit -m "feat(sh3-ai): replace sketch save prompt with ctx.documentPicker API"
```

---

### Task 2: sh3-ai — Remove dead `SaveSketchPrompt.svelte`

**Files:**
- Remove: `packages/sh3-ai/src/ai/sketch/SaveSketchPrompt.svelte`

- [ ] **Step 1: Delete the file**

```bash
git rm packages/sh3-ai/src/ai/sketch/SaveSketchPrompt.svelte
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore(sh3-ai): remove SaveSketchPrompt (replaced by ctx.documentPicker)"
```

---

### Task 3: sh3-pipeline — Replace `openActive` with `ctx.documentPicker.open()`

**Files:**
- Modify: `packages/sh3-pipeline/src/shards/sh3-pipeline/shard.svelte.ts`

- [ ] **Step 1: Remove `OpenPipelineModal` import**

```typescript
// line 24 — delete this line:
import OpenPipelineModal from './OpenPipelineModal.svelte';
```

- [ ] **Step 2: Replace `openActive()` with `openActiveViaPicker()`**

Replace lines 143-153 with:

```typescript
async function openActiveViaPicker(): Promise<void> {
  const picked = await ctx.documentPicker.open();
  if (!picked) return;
  await openActiveFromPath(ctx, state, picked.path);
}
```

- [ ] **Step 3: Update action registration**

```typescript
// lines 397-403 — change `run: () => openActive(ctx, state)` to:
run: () => { openActiveViaPicker(); },
```

- [ ] **Step 4: Commit**

```bash
git add packages/sh3-pipeline/src/shards/sh3-pipeline/shard.svelte.ts
git commit -m "feat(sh3-pipeline): replace open modal with ctx.documentPicker API"
```

---

### Task 4: sh3-pipeline — Replace `saveAsActive` with `ctx.documentPicker.save()`

**Files:**
- Modify: `packages/sh3-pipeline/src/shards/sh3-pipeline/shard.svelte.ts`

- [ ] **Step 1: Replace `saveAsActive()` with `saveAsViaPicker()`**

Replace lines 115-125 with:

```typescript
async function saveAsViaPicker(): Promise<void> {
  const path = await ctx.documentPicker.save();
  if (!path) return;
  const docId = pathToDocId(path.trim());
  await saveDoc(ctx, docId, { ...emptyDocument(), asset: state.asset });
  state.docId = docId;
  state.log.push({ ts: Date.now(), nodeId: null, level: 'info', message: `Saved as ${docId}` });
}
```

- [ ] **Step 2: Update action registration**

```typescript
// lines 411-417 — change `run: () => saveAsActive(ctx, state)` to:
run: () => { saveAsViaPicker(); },
```

- [ ] **Step 3: Commit**

```bash
git add packages/sh3-pipeline/src/shards/sh3-pipeline/shard.svelte.ts
git commit -m "feat(sh3-pipeline): replace save-as prompt with ctx.documentPicker API"
```

---

### Task 5: sh3-pipeline — Remove dead `OpenPipelineModal.svelte`

**Files:**
- Remove: `packages/sh3-pipeline/src/shards/sh3-pipeline/OpenPipelineModal.svelte`

- [ ] **Step 1: Delete the file**

```bash
git rm packages/sh3-pipeline/src/shards/sh3-pipeline/OpenPipelineModal.svelte
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore(sh3-pipeline): remove OpenPipelineModal (replaced by ctx.documentPicker)"
```

---

### Task 6: Build verify

- [ ] **Step 1: Build sh3-ai artifact**

```bash
npm run build:artifact --workspace=sh3-ai
```
Expected: Build succeeds with no errors.

- [ ] **Step 2: Build sh3-pipeline artifact**

```bash
npm run build:artifact --workspace=sh3-pipeline
```
Expected: Build succeeds with no errors.

- [ ] **Step 3: Run sh3-ai tests**

```bash
npm test --workspace=sh3-ai
```
Expected: All existing tests pass (no new tests added).

- [ ] **Step 4: Run sh3-pipeline tests**

```bash
npm test --workspace=sh3-pipeline
```
Expected: All existing tests pass (no new tests added).

- [ ] **Step 5: Commit final verification**

```bash
git add -A
git commit -m "chore: build verify after document picker migration"
```
