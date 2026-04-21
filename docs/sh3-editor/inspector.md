# sh3-editor — Inspector View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.3.0)
**Peer:** `sh3-core` ^0.10.4
**View id:** `sh3-editor:inspector`

---

## 1. What it is

A generic object inspector shipped by `sh3-editor`. The view renders any JavaScript value and dispatches on a type tag to consumer-supplied renderers; when no renderer matches, a fallback walker descends into plain objects and arrays and exposes primitive leaves as editable `<input>`s. Edits are reversible through the same per-instance history bus used by the text editor (see [editor.md §6](./editor.md#6-history)), so Ctrl+Z / Ctrl+Y work out of the box and external shards can call `api.history(instanceId).undo()` programmatically.

---

## 2. Open API

Programmatic use mirrors `openDocument`:

```ts
api.openInspector('my-inspector-slot', {
  value: myState,
  meta: { label: 'My Config', fields: { secret: { hidden: true } } },
  readonly: false,
  toolbarActions: [],
});

api.getInspectorValue('my-inspector-slot');    // the same `value` reference
api.listInspectorInstances();                  // ['my-inspector-slot', …]
api.closeInspector('my-inspector-slot');       // releases the entry + its history

const off = api.onInspectorValueChange((id, value) => { /* … */ });
```

### `OpenInspectorOptions`

| Field | Type | Default | Meaning |
|---|---|---|---|
| `value` | `unknown` | *(required)* | The value to inspect. Most use cases wrap this in `$state(…)` so that walker mutations re-render the view. Non-reactive values still render, but you must subscribe to `onInspectorValueChange` to observe edits. |
| `meta` | `InspectorMeta` | — | Per-field hint tree (see §4). |
| `readonly` | `boolean` | `false` | Forces all fields read-only regardless of per-field meta. |
| `toolbarActions` | `ToolbarAction[]` | `[]` | Optional toolbar rendered above the body. |

---

## 3. Ad-hoc mounts

The inspector view also supports ephemeral mounts with no prior `openInspector` call — useful for "inspect this right now" affordances. Pass the value through `MountContext.meta`:

```ts
shell.float.open('sh3-editor:inspector', {
  meta: { value: someObject, meta: { readonly: true } },
});
```

`InspectorRegistry.get(slotId)` returns `undefined`, so the view falls back to reading `context.meta.value` / `context.meta.meta` / `context.meta.readonly` as `adHocValue` / `adHocMeta` / `adHocReadonly` props. History still binds per `slotId`, so two ad-hoc mounts with distinct slot ids get independent undo stacks.

---

## 4. The meta tree

```ts
interface InspectorMeta {
  type?: string;                              // renderer dispatch tag
  label?: string;                             // override the auto-derived field label
  hidden?: boolean;                           // skip this field in the walker
  readonly?: boolean;                         // render as read-only leaf
  fields?: { [key: string]: InspectorMeta };  // per-field meta for object values
  item?: InspectorMeta;                       // default meta for every array element
}
```

Example applied to a nested shape:

```ts
const meta: InspectorMeta = {
  label: 'Settings',
  fields: {
    name:   { label: 'Name' },
    count:  { readonly: true },
    tags:   { item: { label: 'Tag' } },
    secret: { hidden: true },
    nested: {
      fields: {
        x: { label: 'X' },
        y: { label: 'Y' },
      },
    },
  },
};
```

`hidden: true` removes the row entirely (no empty wrapper). `readonly: true` renders primitives as read-only leaves and dims the field label. Per-index array meta is not supported in V1 — use `item` for a uniform override.

---

## 5. Dispatch precedence

For every value the walker encounters, `<Inspect>` resolves a renderer in this order:

1. **`meta.type`** — if set and a renderer is registered for that tag → custom renderer wins.
2. **`value.__type`** — if `value` is an object with a string `__type`, and a renderer is registered for that tag → custom renderer wins.
3. **walker** — plain objects and arrays recurse.
4. **leaf** — everything else (primitives at the top level, class instances, `Map`, `Set`, …) renders as a read-only stringified leaf.

An **unmatched** `meta.type` falls through to step 2 rather than forcing a leaf — so specifying a render-hint that is not yet contributed does not break display.

Top-level primitives are read-only by design: a raw string or number has no container the inspector can mutate on the caller's behalf. Wrap primitives in an object (`{ value: 42 }`) if you need editability.

---

## 6. Writing a custom renderer

Custom renderers are contributed via `ctx.contributions` from any source shard active in the tenant. The type import is a subpath export of `sh3-editor`:

```ts
// In the renderer-authoring shard's `shard.ts`
import { INSPECTOR_RENDERER_POINT, type InspectorRenderer } from '@unfinished-lair/sh3-editor/inspector/contributions';
import ChatMessageRenderer from './renderers/ChatMessageRenderer.svelte';

activate(ctx) {
  ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, {
    id: 'sh3-chat:chat-message',
    type: 'chat-message',
    component: ChatMessageRenderer,
    priority: 20,   // optional; higher wins on ties, default 10
  });
  // auto-unregistered on deactivate — the shard never has to track the handle
}
```

### `InspectorRendererProps`

```ts
interface InspectorRendererProps {
  value: unknown;
  meta?: InspectorMeta;
  api: InspectorApi;
}

interface InspectorApi {
  push(cmd: HistoryCommand): void;   // records a reversible edit on this instance's history
  readonly readonly: boolean;         // surface of the opt-in read-only mode
  readonly history: HistoryController;
}
```

A renderer has full control over its DOM — it is not required to use the bundled primitives, though doing so gives a consistent look-and-feel and correct read-only handling. Typical skeleton:

```svelte
<!-- ChatMessageRenderer.svelte -->
<script lang="ts">
  import type { InspectorRendererProps, HistoryCommand } from '@unfinished-lair/sh3-editor/inspector/contributions';
  // Workspace-local consumers can also import primitives by direct path:
  //   import Field from '@unfinished-lair/sh3-editor/src/inspector/primitives/Field.svelte';
  // (Published primitives subpath pending — see follow-ups in CHANGELOG.)

  let { value, meta, api }: InspectorRendererProps = $props();
  let msg = $derived(value as { role: string; content: string; at: number });

  function editContent(next: string) {
    const before = msg.content;
    const cmd: HistoryCommand = {
      apply()  { (value as any).content = next; },
      revert() { (value as any).content = before; },
      meta: { kind: 'chat-message:content' },
    };
    api.push(cmd);
    (value as any).content = next;   // push does NOT apply; caller mutates
  }
</script>

<div class="chat-message" class:you={msg.role === 'user'}>
  <div class="role">{msg.role}</div>
  <textarea
    readonly={api.readonly}
    value={msg.content}
    onchange={(e) => editContent((e.currentTarget as HTMLTextAreaElement).value)}
  ></textarea>
  <time>{new Date(msg.at).toLocaleString()}</time>
</div>
```

Renderers see the same `api` for the lifetime of the inspector instance — recording a reversible edit is always `api.push(cmd)` followed by the in-place mutation.

---

## 7. Primitives subpath

The following building blocks ship under the inspector's `primitives/` folder. They are used internally by the fallback walker and are available to renderer authors who want a consistent look-and-feel (the published subpath d.ts is pending — workspace consumers can import them by direct path today).

| Component | Props | Purpose |
|---|---|---|
| `<Inspect>` | `{ value, meta?, api }` | Top-level dispatcher. Delegates to a registered renderer, the walker, or a leaf. Renderers can recurse into nested data by rendering `<Inspect>` on child values. |
| `<Field>` | `{ label, readonly?, children }` | Row with a left-column label and a right-column value slot. |
| `<Row>` | `{ children }` | Horizontal flex container; used for composed leaves. |
| `<Group>` | `{ label, collapsed?, children }` | Collapsible section with a header. |
| `<EditablePrimitive>` | `{ value, readonly?, onCommit }` | Auto-typed leaf editor: checkbox for booleans, numeric input for numbers, text input otherwise. Commits on Enter / blur; Escape cancels. |

Renderers are free to use arbitrary DOM — the primitives are optional helpers, not a required vocabulary.

---

## 8. Mutation and history model

The fallback walker mutates `value` in place and then pushes a reversible command via `api.push`. Custom renderers are expected to do the same — mutate first (via the `apply` body or directly) and push the command — or push a command whose `apply` does the mutation and invoke it manually.

- `push()` does NOT call `apply()` by itself. The contract is: the world is already in the post-apply state by the time the command is recorded. `undo()` calls `revert()`; `redo()` calls `apply()`.
- Consumers whose `value` is `$state(…)` get reactive re-renders automatically. Non-reactive consumers subscribe to `onInspectorValueChange(id, value)` to observe undo/redo movements and re-render from the outside.
- Text-swap style coalescing is specific to the editor's content flow — the inspector does not coalesce walker edits. Each commit is one undoable step.
- External shards can observe the history controller via `api.history(instanceId).onChange(() => …)` or drive it via `.undo()` / `.redo()` / `.clear()`.

Undo/redo shortcuts (Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z) trigger only when the inspector's root element holds focus. Programmatic undo via `getApi().history(id).undo()` works regardless of focus.

---

## 9. Known limitations

- **Circular references** are not handled — a walker recursion into a cycle will overflow. Expose `__type` + a custom renderer for anything with back-pointers.
- **`Map`, `Set`, class instances** without a registered renderer render as read-only stringified leaves. Add a renderer keyed on `__type` (or shim `__type` into the class) to edit them.
- **Per-index array meta** is deferred in V1. Use `meta.item` for a uniform override across all indices; switch to a custom renderer if you need heterogeneous array editing.
- The **primitives subpath d.ts** export is deferred in 0.3.0 — workspace-local consumers can still import by direct path; external npm consumers wait on the subpath publication. See CHANGELOG follow-ups.

---

## 10. See also

- [editor.md](./editor.md) — the text editor shipped by the same shard.
