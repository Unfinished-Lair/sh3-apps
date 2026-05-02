# sh3-editor — Inspector View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.3.0; instance contribution since 0.12.0)
**Peer:** `sh3-core` ^0.11.4
**View id:** `sh3-editor:inspector`

---

## 1. What it is

A generic object inspector shipped by `sh3-editor`. The view renders any JavaScript value and dispatches on a type tag to consumer-supplied renderers; when no renderer matches, a fallback walker descends into plain objects and arrays and exposes primitive leaves as editable `<input>`s. Edits are reversible through the same per-instance history bus used by the text editor (see [editor.md §6](./editor.md#6-history)), so Ctrl+Z / Ctrl+Y work out of the box.

Cross-shard consumers seed inspector slots and observe edits via the
**`INSPECTOR_INSTANCE_POINT`** contribution (since 0.12.0). The legacy
`EditorApi.openInspector` / `closeInspector` / `getInspectorValue` /
`listInspectorInstances` / `onInspectorValueChange` surface remains for
in-tree shards but is `@deprecated` — see §11.

---

## 2. Binding an inspector via contribution

The canonical cross-shard path. A host shard registers an
`InspectorInstanceContribution` against the slot id of the inspector view it
mounts in its app's `initialLayout`:

```ts
import {
  INSPECTOR_INSTANCE_POINT,
  type InspectorInstanceContribution,
} from '@unfinished-lair/sh3-editor/inspector/contributions';

activate(ctx) {
  const state = $state({ name: 'Salepate', count: 0, fg: '#ff0000' });

  let bindHandle: { replace: (next: any) => void; history: any } | null = null;

  ctx.contributions.register<InspectorInstanceContribution>(
    INSPECTOR_INSTANCE_POINT,
    {
      slotId: 'my-app:inspector',
      seed: {
        value: state,
        meta: { fields: { fg: { type: 'color' } } },
        readonly: false,
        toolbarActions: [],
      },
      bind(handle) {
        bindHandle = handle;
        return () => { bindHandle = null; };
      },
      onValueChange(value) {
        // fires on walker commits, custom-renderer push, undo/redo
        console.log('inspector edited', value);
      },
    },
  );
}
```

The descriptor's `slotId` field matches at mount time. The first matching
descriptor wins; a second descriptor for the same `slotId` logs a
`console.warn` and is ignored.

### Swapping the inspected value

`bind` is the push channel. The inspector calls it once at mount with a
handle scoped to that mount; the contributor stashes it and calls
`handle.replace({ value: nextRef })` to swap the inspected object without
remounting the view.

```ts
// Later, when the user selects a different node:
bindHandle?.replace({ value: nextNode });
```

**Semantics:**

- `replace({ value: nextRef })` — value-swap. Clears the slot's history
  (commands captured against the previous object hold dead references),
  fires `onValueChange`. No-op when `nextRef === entry.value`.
- `replace({ meta })`, `replace({ readonly })`, `replace({ toolbarActions })`
  — field-only swaps. Silent (no events, no history clear). Property-presence
  semantics (`'value' in next`) so passing `undefined` or `null` is treated
  as an explicit clear, not as "skip this field."

### Outside-the-slot undo / redo

`handle.history` is a `HistoryController` keyed to the slot — the same
controller `EditorApi.history(slotId)` returns. Contributors call
`.undo()` / `.redo()` / `.onChange(...)` / `.peek()` from anywhere without
needing the editor's `getApi()`:

```ts
bindHandle?.history.undo();
bindHandle?.history.onChange(() => { /* re-render some external mirror */ });
```

### Routing field commits through your own editor

`onCommit` on the descriptor (top-level — set at register time, NOT
swappable via `replace`) intercepts walker field commits before the default
in-place mutation + history push. Useful when the host owns its own editor
with its own undo stack and wants walker edits to join that stack:

```ts
ctx.contributions.register<InspectorInstanceContribution>(
  INSPECTOR_INSTANCE_POINT,
  {
    slotId: 'my-app:inspector',
    seed: { value: selectedNode, meta: { fields: { fill: { type: 'color' } } } },
    onCommit(path, next) {
      // path: ['fill'] | ['children', 3, 'opacity']
      myEditor.dispatch({ type: 'updateNode', id: selectedNode.id, path, value: next });
      return true;   // "I handled it — don't mutate, don't push to inspector history"
    },
  },
);
```

Return `true` to suppress the default commit; return `false` / `undefined`
to let the walker commit as usual (useful for observe-only). Throwing is
propagated to the caller. Not invoked when a custom renderer is mounted at
the **root** (no walker path).

---

## 3. Ad-hoc mounts

> When both a contribution and an ad-hoc `meta.value` apply at the same
> slot id, the contribution wins. Ad-hoc mounts are the third fallback —
> after contribution lookup and registry lookup — useful when no
> contribution is registered for the slot.

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

### Built-in renderer for `type: 'color'`

`sh3-editor` (≥ 0.4.0) auto-registers a color-picker renderer on activate. Any field tagged `meta: { type: 'color' }` with a hex-string value renders the full picker inline; non-string values fall through to a read-only leaf. Consumers can override by registering their own renderer for the `color` type tag with `priority > 10` (the built-in's priority).

```ts
api.openInspector('my-slot', {
  value: $state({ fg: '#ff0000', bg: '#000000' }),
  meta: { fields: { fg: { type: 'color' }, bg: { type: 'color' } } },
});
```

See [`color-picker.md`](./color-picker.md) for the full picker API.

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

### 8.1. Routing field commits through your own editor (`onCommit`, 0.4.1+)

By default the fallback walker commits each field edit by (a) mutating the inspected object in place and (b) pushing a `HistoryCommand` onto the inspector instance's own history stack. Consumers who own an editor with its own history — and want walker edits to join that history for coalesce, autosave, or unified undo/redo — can supply an `onCommit` callback on `OpenInspectorOptions`:

```ts
api.openInspector('node-inspector', {
  value: selectedNode,
  meta: { fields: { fill: { type: 'color' }, stroke: { type: 'color' } } },
  onCommit: (path, next) => {
    // path: ['fill'] | ['stroke'] | ['children', 3, 'opacity']
    myEditor.dispatch({ type: 'updateNode', id: selectedNode.id, path, value: next });
    return true;   // "I handled it — don't mutate, don't push to inspector history"
  },
});
```

**Semantics:**

- Called **before** the walker's default mutation + push, for every walker-dispatched field commit — both primitives (via `EditablePrimitive`) and custom renderers mounted at field sites (e.g. `type: 'color'`).
- `path` is the sequence of keys/indices from the root inspected value to the edited field (string for object fields, number for array indices).
- Return `true` to suppress the walker's default commit.
- Return `false` or `undefined` to let the walker commit as usual — useful if you want to observe edits without replacing the commit path.
- **Not** invoked when a custom renderer is mounted at the **root** (no walker path).
- Throwing from the callback is propagated to the caller; prefer returning `false` if your dispatch can fail and you want the walker to take the edit anyway.

The callback signature:

```ts
type WalkerCommitOverride =
  (path: (string | number)[], next: unknown) => boolean | void;
```

---

## 9. Known limitations

- **Circular references** are not handled — a walker recursion into a cycle will overflow. Expose `__type` + a custom renderer for anything with back-pointers.
- **`Map`, `Set`, class instances** without a registered renderer render as read-only stringified leaves. Add a renderer keyed on `__type` (or shim `__type` into the class) to edit them.
- **Per-index array meta** is deferred in V1. Use `meta.item` for a uniform override across all indices; switch to a custom renderer if you need heterogeneous array editing.
- The **primitives subpath d.ts** export is deferred in 0.3.0 — workspace-local consumers can still import by direct path; external npm consumers wait on the subpath publication. See CHANGELOG follow-ups.

---

## 10. See also

- [editor.md](./editor.md) — the text editor shipped by the same shard.

---

## 11. Legacy: imperative `openInspector` API

> **Deprecated since 0.12.0.** New cross-shard consumers should register an
> `InspectorInstanceContribution` (see §2). The imperative methods continue
> to work for in-tree shards and will be removed in a future major. Both
> paths share the same `InspectorRegistry` and `internals` event buses, so
> coexistence is transparent.

```ts
api.openInspector('my-inspector-slot', {
  value: myState,
  meta: { label: 'My Config', fields: { secret: { hidden: true } } },
  readonly: false,
  toolbarActions: [],
  onCommit: (path, next) => { /* see §2 'Routing field commits' */ },
});

api.getInspectorValue('my-inspector-slot');    // the same `value` reference
api.listInspectorInstances();                  // ['my-inspector-slot', …]
api.closeInspector('my-inspector-slot');       // releases the entry + its history

const off = api.onInspectorValueChange((id, value) => { /* … */ });
```

Migration:

| Imperative call | Contribution replacement |
|---|---|
| `openInspector(id, opts)` | Register `InspectorInstanceContribution` with `seed: { value, meta, readonly, toolbarActions }`. |
| `closeInspector(id)` | Stop registering / call disposer returned from `ctx.contributions.register`. |
| `getInspectorValue(id)` | Contributor already holds `seed.value`; observes mutations via `onValueChange`. |
| `listInspectorInstances()` | Contributors only know their own slots; no replacement (intra-shard reads only). |
| `onInspectorValueChange(cb)` | `InspectorInstanceContribution.onValueChange` (per-slot, no id-filter). |
| `OpenInspectorOptions.onCommit` | Top-level `onCommit` on the descriptor. |
