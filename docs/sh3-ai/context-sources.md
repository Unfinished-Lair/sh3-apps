# AI Context Sources

The AI Edit modal (the float opened by clicking any `[AI]` pill after
`AI: Start Assistant`) lets the user attach extra context to a rewrite
request. Three origins feed the picker:

| Origin | Source | Owner |
| --- | --- | --- |
| **Field** | Any shard's controllable fields via `ctx.sh3.fields.register` | sh3-core |
| **Source** | This shard's `CONTEXT_SOURCE_POINT_ID` registrations | sh3-ai (this doc) |
| **Document** | Any sh3-readable file via `ctx.browse.readFrom` | sh3-ai (built-in) |

Fields show up automatically when registered with sh3-core. Documents
are reachable from the modal's built-in "browse documents…" affordance
without any contribution. This doc covers the third source kind:
**context sources** that your shard publishes for inclusion in the
picker. Publishers register the descriptor against sh3-core's
`CONTEXT_SOURCE_POINT_ID` — no devDep on sh3-ai required.

## When to use a context source

A controllable field is the right home for editable values the user
can also interact with directly (textareas, sliders, color pickers).
A context source is the right home for read-only material that
informs an AI rewrite but isn't itself the target of any UI control:

- the markdown body of a note the user is browsing,
- the JSON definition of the entity selected in a list,
- the current text-selection range inside an editor,
- a derived "project summary" that aggregates several values.

If the value is editable from the UI and registered as a controllable
field, use that — the picker already shows it. Don't double-publish.

## Descriptor shape

```ts
import {
  CONTEXT_SOURCE_POINT_ID,
  type ContextSource,
} from 'sh3-core';

ctx.contributions.register<ContextSource>(CONTEXT_SOURCE_POINT_ID, {
  id: 'my-app:current-notes',          // globally unique; shardId-prefixed
  label: 'Current notes',              // shown in the picker row + chip
  description: 'The markdown body of the focused note.',
  kind: 'markdown',                    // 'text' (default) | 'markdown' | 'json'
  group: 'My App',                     // optional sub-header under SOURCES
  get: () => state.notesMarkdown,      // sync OR async; lazy fetch
});
```

- `id` must be globally unique. Convention: `<shardId>:<slug>`.
  Re-registering the same id silently replaces — dispose first if you
  intend to swap content.
- `kind` drives how the value is formatted into the assembled prompt:
  - `'text'` (default) — value coerced to string, dumped raw.
  - `'markdown'` — value coerced to string, wrapped in fenced
    ` ```markdown ` block.
  - `'json'` — value `JSON.stringify`-ed with 2-space indent, wrapped
    in fenced ` ```json ` block.
- `group` sub-headers entries inside the SOURCES section. Entries
  without a group fall under "Other".
- `get()` is called when the user picks the chip (to populate the
  expand-to-preview pane) and again at prompt-build time. May be sync
  or async. Returning `null`/`undefined` silently omits the entry from
  the assembled prompt; throwing surfaces a toast and skips it.

## Lifecycle patterns

The contribution mechanism is the standard `ctx.contributions.register(...)`
that returns a disposer. Consumers control the lifetime:

### App-scoped

Register inside `onAppActivate`; the disposer is automatically called
on `onAppDeactivate`:

```ts
export const shard: SourceShard = {
  manifest: { /* … */ },
  register(ctx) { /* … */ },
  onAppActivate(ctx, appId) {
    ctx.contributions.register<ContextSource>(CONTEXT_SOURCE_POINT_ID, {
      id: `${appId}:active-project`,
      label: 'Active project',
      kind: 'json',
      group: 'My App',
      get: () => projectState.snapshot,
    });
  },
};
```

### Sub-project / sub-document scoped

Hold the disposer alongside whatever owns the data:

```ts
function openProject(p: ProjectState): void {
  const dispose = ctx.contributions.register<ContextSource>(
    CONTEXT_SOURCE_POINT_ID,
    {
      id: `my-app:project:${p.id}`,
      label: p.name,
      kind: 'markdown',
      group: 'My App',
      get: () => p.summaryMarkdown,
    },
  );
  p.onClose(() => dispose());
}
```

### Selection-driven

Two patterns work:

**(a) Single stable registration, lazy `get()` tracks the current selection.**
The chip always exists; the assembled prompt simply skips it (via
`get()` returning `null`) when nothing is selected:

```ts
ctx.contributions.register<ContextSource>(CONTEXT_SOURCE_POINT_ID, {
  id: 'my-app:selection',
  label: 'Selection',
  kind: 'text',
  group: 'My App',
  get: () => editor.selectedText ?? null,
});
```

**(b) Register on select, dispose on deselect.** The chip appears
only when there's something to attach:

```ts
let disposeSelection: (() => void) | null = null;

editor.onSelectionChange((sel) => {
  disposeSelection?.();
  disposeSelection = null;
  if (!sel) return;
  disposeSelection = ctx.contributions.register<ContextSource>(
    CONTEXT_SOURCE_POINT_ID,
    {
      id: 'my-app:selection',
      label: `Selection (${sel.range})`,
      kind: 'text',
      group: 'My App',
      get: () => sel.text,
    },
  );
});
```

Pick (a) when the picker should reflect a stable mental model
("there's a 'Selection' chip; sometimes it's empty"). Pick (b) when
chip presence itself is informative ("a 'Selection' chip means there
IS a selection right now").

## Picker layout

The dropdown groups entries into three sections:

```
[ + Add context ▾ ] [chip] [chip]

┌─ dropdown ────────────────────────────┐
│ search…                              │
│                                      │
│ FIELDS                               │
│   editor·body                        │
│   inspector·title                    │
│ SOURCES                              │
│ ─ My App                             │
│     Notes              [markdown]    │
│     Selection          [text]        │
│ ─ Other                              │
│     scratch buffer     [text]        │
│ DOCUMENTS                            │
│   » browse documents…                │
└──────────────────────────────────────┘
```

- FIELDS section is unchanged from prior versions.
- SOURCES entries are alphabetized within each group; groups themselves
  are alphabetized, with "Other" pinned to the bottom.
- DOCUMENTS row opens `ctx.documentPicker`; the resulting file is read
  via `ctx.browse.readFrom` and attached as a chip. The kind is
  inferred from extension (`.md`/`.markdown` → markdown,
  `.json` → json, else text). The DOCUMENTS row is hidden when
  `documents:read` was not granted.

## What gets sent to the LLM

The assembled prompt for an entry looks like:

```
[Current notes] (source:my-app:current-notes)
```markdown
# Today's notes

- task 1
```
```

- Each entry contributes its own labeled block.
- Values are truncated to 8000 characters with a `\n…[truncated]`
  marker (the truncation happens inside the fence for markdown/json so
  the fence stays valid).
- Order in the prompt matches selection order in the picker.

## Forward-compat with chat tools

The descriptor's `id`, `description`, `kind`, and lazy `get` are also
exactly what a future `ai.context.list` / `ai.context.read` LLM-tool
pair will need. That adapter ships in a separate update; the
contribution shape will not change.
