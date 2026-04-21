# sh3-editor — Editor View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.3.0)
**Peer:** `sh3-core` ^0.10.4
**View id:** `sh3-editor:editor`

---

## 1. What it is

`sh3-editor` is a reusable text-editor shard. It exposes a standalone Svelte view (`sh3-editor:editor`) and a programmatic `EditorApi` consumers reach via `getApi()` on the shard, or via `registeredShards` lookup. A single activation services any number of editor instances — each instance is keyed by the `slotId` of its mount.

The editor is deliberately minimal: single-file text buffer with gutter line numbers, syntax-highlight hook, tab/brace/indent auto-editing, and undo/redo via a generic history bus (see §6).

---

## 2. Opening a document

```ts
import { getApi } from '@unfinished-lair/sh3-editor';

const api = getApi();
api?.openDocument('my-slot-id', {
  content: 'fn main() {\n  println!("hello");\n}',
  language: 'rust',
  filePath: 'src/main.rs',
  matchingConfig: { indentType: 'brace', indentUnit: 2, braceStyle: 'inline' },
  toolbarActions: [
    { id: 'my:save', label: 'Save', onAction: () => { /* ... */ } },
  ],
});
```

The `id` argument MUST match the `slotId` the view is mounted at; the view's `mount` callback looks the entry up via `registry.get(slotId)`. If the slot is mounted before `openDocument` is called, the view falls back to an internal default (`"Hello, World"`), so production usage should always open first.

### `OpenDocumentOptions`

| Field | Type | Default | Meaning |
|---|---|---|---|
| `content` | `string` | *(required)* | Initial buffer text. |
| `filePath` | `string` | `null` | Shown in the toolbar as the file chip; informational only — the editor does not read or write this path. |
| `language` | `string` | `null` | Forwarded to `highlight(text, language)`. |
| `highlight` | `(text, language) => string` | `escapeHtml` | Syntax-highlight hook. Returns HTML which is rendered in the background layer. The textarea stays transparent and sits on top. |
| `matchingConfig` | `MatchingConfig` | `{ indentType: 'none' }` | Indent + brace auto-edit config (see §3). |
| `toolbarActions` | `ToolbarAction[]` | `[]` | Caller-supplied actions that merge with the built-in settings gear (see §8). |
| `fontSize` | `number` | `13` | Editor font size in px. |
| `prefs` | `UserPrefs` | *(inherited from `matchingConfig`)* | User-owned overrides loaded from a prior session. Shallow-merged over `matchingConfig`. |
| `showSettings` | `boolean` | `true` when sub-options exist | Hides the built-in settings gear entirely when `false`. |

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

## 5. Events

All event subscribers return a `() => void` unsubscriber. Subscribers observe all instances; filter by `id` in the callback.

| Event | Fires when |
|---|---|
| `onContentChange((id, content) => …)` | `updateContent` commits a new buffer value, including undo/redo paths. |
| `onDirtyChange((id, dirty) => …)` | Dirty flag flips after a user edit or after `markClean(id)`. |
| `onSave((id) => …)` | User presses Ctrl+S with focus on the editor textarea. The editor does NOT do I/O — consumers handle persistence. |
| `onPrefsChange((id, prefs) => …)` | User changes an indent or brace-style pref via the settings gear. |

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

`ToolbarAction[]` supplied in `OpenDocumentOptions.toolbarActions` render as buttons above the gutter. The editor automatically appends a built-in settings gear (id `sh3-editor:settings`, group `_editor_builtin`) when `showSettings` is truthy and `MatchingConfig` exposes sub-options. Actions are grouped by their `group` field; adjacent actions with different groups get a separator.

Example — opening a doc and subscribing to save:

```ts
activate(ctx: ShardContext) {
  const editor = ctx.registeredShards['sh3-editor']?.api as EditorApi | undefined;
  if (!editor) return;

  editor.openDocument('my-slot', {
    content: loadedText,
    language: 'javascript',
    matchingConfig: { indentType: 'brace', indentUnit: 2 },
  });

  const off = editor.onSave(async (id) => {
    if (id !== 'my-slot') return;
    const text = editor.getContent(id);
    await persist(text);
    editor.markClean(id);
  });

  // Remember to call `off()` on deactivate.
}
```

---

## 9. See also

- [inspector.md](./inspector.md) — object inspector view shipped by the same shard.
