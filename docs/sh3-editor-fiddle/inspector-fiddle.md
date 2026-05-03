# Inspector Fiddle

A test environment for `sh3-editor`'s inspector view. Type a JSON value and an `InspectorMeta` JSON; see the inspector render the result on the right.

## Layout

```
┌─────────────────────┬─────────────────┐
│ value editor (json) │                 │
├─────────────────────┤    inspector    │
│ meta editor (json)  │                 │
└─────────────────────┴─────────────────┘
```

- **Value editor** (top-left) — any JSON.
- **Meta editor** (bottom-left) — `InspectorMeta` JSON. See [`docs/sh3-editor/inspector.md` §4](../sh3-editor/inspector.md#4-the-meta-tree) for the full schema (`type`, `label`, `hidden`, `readonly`, `fields`, `item`).
- **Inspector** (right) — renders `value` using `meta`. The bundled walker handles primitives, read-only leaves, hidden fields, arrays with `item` meta, and nested objects. Renderer dispatch follows [`inspector.md` §5](../sh3-editor/inspector.md#5-dispatch-precedence).

## Toolbar reference

**Inspector toolbar:**
- `← Sync to JSON` — disabled until you make an inspector edit. Click to overwrite the value JSON with the current inspector state. **Clears the value editor's text-undo history** (`replace({ content })` semantics).
- `Live sync` — toggle. When on, every walker commit immediately overwrites the value JSON with the new state. Convenient for "see how the object evolves," at the cost of a fresh undo wipe per commit.
- `Available types →` — opens a closable, draggable floating editor in markdown-preview mode listing every renderer dispatch tag the runtime currently knows (the bundled `color` renderer plus anything any other shard has registered at `INSPECTOR_RENDERER_POINT`). Use it to discover what `meta.type` values are valid in your install. Non-destructive — your value/meta editors are untouched.

**Value/meta editor toolbars:**
- `⚠ <error>` — appears when the JSON in that editor fails to parse. Disabled (the label IS the error). The inspector keeps showing the last successful parse, so transient mid-typing errors do not blank the panel. Clears automatically when you fix the JSON.

## Testing custom renderers

Any shard registering an `InspectorRenderer` at `INSPECTOR_RENDERER_POINT` is dispatched automatically. Set `meta.type` to the renderer's type tag and the inspector picks it up — no fiddle-side wiring.

Worked example: a chat-message renderer registered as `{ id: 'sh3-chat:chat-message', type: 'chat-message', component: ChatMessageRenderer }` fires when you type:

```json
{ "value": { "role": "user", "content": "hi", "at": 0 }, "meta": { "type": "chat-message" } }
```

(Note the inspector accepts `value` and `meta` separately — drop the wrapper and put `{ "role": "user", … }` in the value editor and `{ "type": "chat-message" }` in the meta editor.)

## Known limits

The inspector itself has caveats — circular references, `Map`/`Set` rendered as leaves, no per-index array meta. See [`docs/sh3-editor/inspector.md` §9](../sh3-editor/inspector.md#9-known-limitations).

The fiddle adds none of its own except: the value text and meta text persist via a workspace state zone — they do **not** save as tenant documents in v1. Reload the app, you get the last text you typed; switch tenants, you start fresh.
