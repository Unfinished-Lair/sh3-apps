# sh3-editor — Editor View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.10.0)
**Peer:** `sh3-core` ^0.11.4
**View id:** `sh3-editor:editor`
**Contribution point:** `'sh3-editor.document'` (via `@unfinished-lair/sh3-editor/contributions`)

---

## 1. What it is

`sh3-editor` is a reusable text-editor shard. It exposes a standalone
Svelte view (`sh3-editor:editor`) and binds documents to slots via the
`'sh3-editor.document'` contribution point. A single activation services
any number of editor instances — each instance is keyed by the `slotId` of
its mount and bound to one `EditorDocumentContribution` descriptor.

The editor is deliberately minimal: single-file text buffer with gutter
line numbers, syntax-highlight hook, tab/brace/indent auto-editing, and
undo/redo via a generic history bus (see §6).

---

## 2. Binding a document via contribution

In your shard's `activate(ctx)`:

```ts
import {
  EDITOR_DOCUMENT_POINT,
  type EditorDocumentContribution,
} from '@unfinished-lair/sh3-editor/contributions';

let currentNote = loadInitialNote();

const binding: EditorDocumentContribution = {
  slotId: 'scribe-main',                        // matches your initialLayout slot
  seed: {
    content: currentNote.text,
    language: 'markdown',
    filePath: currentNote.path,
    matchingConfig: { indentType: 'indent', indentUnit: 2 },
  },
  bind(replace) {
    handleToReplace = replace;                  // stash for later swaps (§2.1)
    return () => { handleToReplace = null; };
  },
  onContentChange(content) {
    currentNote.text = content;
    queueAutosave();
  },
  onSave() {
    persistNow(currentNote);
  },
};

ctx.contributions.register<EditorDocumentContribution>(
  EDITOR_DOCUMENT_POINT,
  binding,
);
```

When the editor view mounts at `slotId === 'scribe-main'` (i.e. anywhere
in the active app's layout), it walks `ctx.contributions.list(EDITOR_DOCUMENT_POINT)`,
picks the descriptor whose `slotId` matches, and:

- builds the slot's `RegistryEntry` from `seed`,
- calls `bind(replace)` once with a fresh closure scoped to that mount,
- subscribes the `onContentChange` / `onDirtyChange` / `onSave` /
  `onPrefsChange` callbacks to the matching slot's events.

On slot unmount, the editor invokes the disposer returned from `bind` and
unsubscribes every forwarder.

### 2.1 Swapping the document

Call the `replace` you stashed inside `bind`:

```ts
function openNote(next: Note) {
  currentNote = next;
  handleToReplace?.({
    content: next.text,
    filePath: next.path,
    language: detectLanguage(next.path),
  });
}
```

Behavior:

- `replace({ content })` clears the slot's history (cross-doc undo would
  be meaningless), resets cursor and dirty state, and fires
  `onContentChange` + `onDirtyChange(false)`. Same-content replaces are
  silent.
- `replace({ filePath, language, matchingConfig, prefs, fontSize,
  showSettings, toolbarActions, highlight })` updates fields on the live
  entry without mutating the buffer. No content events fire.
- The Svelte component is **not** remounted — cursor / scroll / textarea
  identity survive across swaps.

If you need to gate a swap on dirty state, mirror the dirty flag via
`onDirtyChange` and check it before calling `replace`. The editor itself
performs no "unsaved changes?" UX — that's the contributor's call.

### 2.2 `EditorDocumentSeed` fields

| Field | Type | Default | Meaning |
|---|---|---|---|
| `content` | `string` | *(required)* | Initial buffer text. |
| `filePath` | `string \| null` | `null` | Toolbar file chip; informational. |
| `language` | `string \| null` | `null` | Forwarded to `highlight(text, language)`. |
| `highlight` | `(text, language) => string` | `escapeHtml` | Syntax-highlight hook. Returns HTML rendered in the background layer. |
| `matchingConfig` | `MatchingConfig` | `{ indentType: 'none' }` | Indent + brace auto-edit config (§3). |
| `prefs` | `UserPrefs` | *(inherited from `matchingConfig`)* | User-owned overrides. Shallow-merged. |
| `fontSize` | `number` | `13` | Editor font size in px. |
| `showSettings` | `boolean` | auto | Hide the built-in settings gear when sub-options exist. |
| `toolbarActions` | `ToolbarAction[]` | `[]` | Caller-supplied actions merged with the built-in gear. |

---

## 3. `MatchingConfig` and auto-indent

```ts
interface MatchingConfig {
  brackets?: [string, string][];
  indentType?: 'none' | 'brace' | 'indent';
  indentUnit?: number;      // default 2
  braceStyle?: 'inline' | 'allman';
  /** @deprecated — use indentType */
  indentBased?: boolean;
}
```

- `indentType: 'none'` — Enter inserts a newline; Tab/Shift+Tab still indent/unindent the selection.
- `indentType: 'indent'` — Enter re-emits the current line's leading whitespace. Good for Python, YAML, whitespace-sensitive languages.
- `indentType: 'brace'` — Enter re-emits leading whitespace and adds one `indentUnit`'s worth when the line ends with an opening brace. A bare `}` on a whitespace-only line dedents to its matching opener. `braceStyle` switches between `foo() {` (inline) and Allman-style `foo()\n{`.

`indentBased` is a legacy bool kept for 0.2.x compatibility: when `indentType` is undefined and `indentBased` is `true`, it is treated as `'indent'`.

---

## 4. User prefs and the settings gear

`UserPrefs` is `Pick<MatchingConfig, 'indentUnit' | 'braceStyle'>` — the subset a user can tweak at runtime via the gear popover.

- On open, the editor resolves its runtime prefs as `{ ...defaults, ...matchingConfig, ...opts.prefs }`.
- When the user changes a pref via the gear, `onPrefsChange(id, prefs)` fires so the consumer can persist the new value. The editor does not persist prefs itself — storage is the consumer's responsibility.
- The gear hides itself when no sub-options are available (i.e. `indentType === 'none'`) or when `opts.showSettings === false`.

---

## 5. Per-slot callbacks

Every callback on `EditorDocumentContribution` runs only for events
targeting the descriptor's `slotId`. There is no cross-instance leakage
to filter for. Multi-pane editors register one descriptor per pane.

| Callback | Fires when |
|---|---|
| `onContentChange(content)` | An edit (or a `replace({ content })`) commits a new buffer value. |
| `onDirtyChange(dirty)` | Dirty flag flips after a user edit or after `replace({ content })` resets it. |
| `onSave()` | User presses Ctrl/Cmd+S with focus on the editor textarea. The editor does no I/O. |
| `onPrefsChange(prefs)` | User changes an indent or brace-style pref via the settings gear. |

The legacy `EditorApi.onContentChange / onDirtyChange / onSave /
onPrefsChange` global subscribers continue to fire alongside these
callbacks — see "Legacy" at the bottom.

---

## 6. History

Every editor instance carries a per-instance history surface, reachable as `api.history(instanceId)` and returning a `HistoryController`:

```ts
interface HistoryController {
  push(cmd: HistoryCommand): void;
  undo(): boolean;
  redo(): boolean;
  peek(): HistoryCommand | null;
  replaceTop(cmd: HistoryCommand): boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  clear(): void;
  onChange(cb: () => void): () => void;
}
```

Text edits are recorded as `kind: 'text-swap'` commands via an internal `createTextSwapCommand` helper. Consecutive single-character edits within 300 ms are **coalesced** into a single undoable step via `replaceTop` — so typing a word yields one undo step, not N.

External callers can issue `api.history(id).undo()` / `.redo()` programmatically from any shard that holds the `EditorApi` reference; the effect is identical to Ctrl+Z / Ctrl+Y at the keyboard. Use `onChange` to observe undo-stack mutations (dirty flags, button enable/disable, telemetry).

History engines are released automatically when the document is closed via `closeDocument(id)`.

---

## 7. Keyboard shortcuts

| Keys | Effect |
|---|---|
| Ctrl/Cmd+S | Emits `onSave`. Consumer handles the actual write. |
| Ctrl/Cmd+Z | Undo (history-backed). |
| Ctrl/Cmd+Y, Ctrl/Cmd+Shift+Z | Redo. |
| Tab / Shift+Tab | Indent / outdent selection by `indentUnit` spaces. |
| Enter | Auto-indent per `indentType` (see §3). |
| `}` | In brace mode on a whitespace-only line, dedents to the matching opener's indent. |

All shortcuts fire only when the editor textarea holds keyboard focus; the editor never installs global listeners.

---

## 8. Toolbar actions

`toolbarActions` on the descriptor's `seed` (or replaced via
`replace({ toolbarActions })`) render as buttons above the gutter. The
editor automatically appends a built-in settings gear (id
`sh3-editor:settings`, group `_editor_builtin`) when `showSettings` is
truthy and `MatchingConfig` exposes sub-options.

```ts
const binding: EditorDocumentContribution = {
  slotId: 'scribe-main',
  seed: {
    content: loadedText,
    language: 'javascript',
    matchingConfig: { indentType: 'brace', indentUnit: 2 },
    toolbarActions: [
      { id: 'scribe:save', label: 'Save', onAction: () => persist(currentNote) },
    ],
  },
  onSave: () => persist(currentNote),
};
```

---

## Type-only subpath

Public types ship at `@unfinished-lair/sh3-editor/contributions`:

```ts
import type {
  EditorDocumentContribution,
  EditorDocumentSeed,
} from '@unfinished-lair/sh3-editor/contributions';

import { EDITOR_DOCUMENT_POINT } from '@unfinished-lair/sh3-editor/contributions';
```

The runtime file ships exactly one symbol — the `EDITOR_DOCUMENT_POINT`
string constant. Bare specifiers from other shards do not reach the SH3
runtime rewriter, so always `import type` for the descriptor types — see
[Shard Authoring → Type exports](https://github.com/Unfinished-Lair/sh3/blob/main/docs/shard-authoring.md#type-exports)
for the rationale.

---

## 9. See also

- [inspector.md](./inspector.md) — object inspector view shipped by the same shard.

---

## Legacy: imperative `EditorApi.openDocument` (deprecated, ≥ 0.10.0)

> Deprecated since 0.10.0; kept for in-tree shards that have not migrated.
> New consumers should bind via the contribution point above.

```ts
import { getApi } from '@unfinished-lair/sh3-editor';

const api = getApi();
api?.openDocument('my-slot-id', {
  content: 'fn main() {\n  println!("hello");\n}',
  language: 'rust',
});
```

The imperative path is a `getApi()` accessor on the shard plus
`EditorApi.openDocument(id, opts)`. It populates the same internal
`InstanceRegistry` the contribution path uses — so behavior at the slot
is identical. Deprecated methods: `openDocument`, `closeDocument`,
`updateContent`, `onContentChange`, `onDirtyChange`, `onSave`,
`onPrefsChange`. Reads (`getContent`, `isDirty`, `getDocument`,
`listInstances`) and `markClean` / `history(id)` remain on `EditorApi`
as the canonical surface.
