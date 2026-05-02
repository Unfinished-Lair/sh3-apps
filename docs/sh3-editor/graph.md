# sh3-editor — Graph View

**Package:** `@unfinished-lair/sh3-editor` (≥ 0.8.0)
**Peer:** `sh3-core` ^0.11.4
**View id:** `sh3-editor:graph`

---

## 1. What it is

A contributable node-graph view shipped by `sh3-editor`. It exposes:

- A standalone view (`sh3-editor:graph`) that, with no descriptor, renders a read-only list of registered graph domains as discoverability scaffolding.
- A **`GraphDomain`** contribution point (`'sh3-editor.graph-domain'`) — consumer shards register a behavior pack of templates, visuals, edge semantics, and optional connection rules. Domains are pluggable; sh3-editor instantiates them on demand.
- A **`GraphViewDescriptor`** contribution point (`'sh3-editor.graph-view'`) — consumer shards bind a graph asset to a slot in their `App.initialLayout`, get a `GraphController` back, and persist the asset via an `onChange` callback.
- Reuse of the existing `INSPECTOR_RENDERER_POINT` for selected-node config edits — the graph view hands the consumer a `{ value, meta, onCommit }` binding the consumer plumbs into their own inspector slot. Edits route through the graph's history, so Ctrl+Z / Ctrl+Y unify the canvas and inspector undo stacks.

`sh3-editor` ships **no execution Runner** — what counts as "running" the graph (compiling a shader, ticking a behaviour tree, evaluating a decision flow) is the consumer's concern. The view is the editor surface only.

---

## 2. Vocabulary

| Term | Meaning |
|---|---|
| **GraphAsset** | Persisted, serializable graph definition. Source of truth on disk; the value a consumer hands to sh3-editor via `GraphViewDescriptor.initial` and receives back from `onChange`. |
| **GraphState** | Editable in-memory mirror used by the canvas and inspector. Constructed once at mount; mutated thereafter via history commands. |
| **Node** | A unit of content with an immutable `type` (template key), mutable `config`, fixed-shape `ports`, and a position. |
| **Port** | A typed input or output slot on a node. |
| **Edge** | Directed connection from an output port to an input port (`oriented` semantics) or an undirected adjacency (`adjacency`). |
| **Domain** | Pluggable behavior pack: edge semantics, available templates, visuals, connection rules. Every graph belongs to exactly one domain. |
| **Template** | The blueprint for a node type within a domain: ports, default config, optional config schema. |

---

## 3. Quick start

A consumer shard wires three things: a domain registration, a graph slot in `App.initialLayout`, and a `GraphViewDescriptor` keyed by the slot id.

```ts
import type {
  GraphDomainContribution,
  GraphViewDescriptor,
  GraphController,
} from '@unfinished-lair/sh3-editor/graph/contributions';
import {
  createGraphDomain,
  type GraphAsset,
} from '@unfinished-lair/sh3-editor/graph/types';

// Cross-shard string-literal rule (§13). NEVER import the runtime constants.
const GRAPH_DOMAIN_POINT = 'sh3-editor.graph-domain';
const GRAPH_VIEW_POINT   = 'sh3-editor.graph-view';

export const app: SourceApp = {
  manifest: {
    id: 'shader-app',
    label: 'Shader',
    layoutVersion: 1,
    requiredShards: ['sh3-editor'],
    autostart: true,                 // domain providers MUST be autostart
  },
  initialLayout: {
    docked: {
      type: 'split', direction: 'horizontal', sizes: [3, 1],
      children: [
        { type: 'slot', slotId: 'shader-graph',     viewId: 'sh3-editor:graph' },
        { type: 'slot', slotId: 'shader-inspector', viewId: 'sh3-editor:inspector' },
      ],
    },
    floats: [],
  },
  activate(ctx) {
    // 1. Register the domain.
    const domain: GraphDomainContribution = {
      id: 'shader-app:shader-graph',
      factory: (host) => createGraphDomain({
        id: 'shader-app:shader-graph',
        label: 'Shader Graph',
        templates: [/* see §6 */],
        visuals:   {/* see §6 */},
      }),
    };
    const offDomain = ctx.contributions.register(GRAPH_DOMAIN_POINT, domain);

    // 2. Bind the graph slot.
    let initial: GraphAsset = loadOrEmpty();
    let controller: GraphController | null = null;

    const view: GraphViewDescriptor = {
      slotId: 'shader-graph',
      domainId: 'shader-app:shader-graph',
      initial,
      onChange: (asset) => persist(asset),
      bind: (ctrl) => { controller = ctrl; },
    };
    const offView = ctx.contributions.register(GRAPH_VIEW_POINT, view);

    return () => { offView(); offDomain(); };
  },
};
```

---

## 4. Domain registration — `GRAPH_DOMAIN_POINT`

### 4.1 `GraphDomainContribution`

```ts
export interface GraphDomainContribution {
  /** Stable, shard-prefixed id, e.g. 'shader-app:shader-graph'. */
  id: string;
  /** Lazy factory; called when sh3-editor first mounts a graph that
   *  references this domain. Runs at most once per editor activation. */
  factory: (host: GraphDomainHost) => GraphDomain;
}

export interface GraphDomainHost {
  log: (level: 'debug' | 'info' | 'warn' | 'error', msg: string, ...args: unknown[]) => void;
}
```

### 4.2 `createGraphDomain(spec)` helper

A `GraphDomain` backed by internal `Map`s for templates and visuals. Sufficient for most domains; implement the `GraphDomain` interface directly if you need anything custom.

```ts
export function createGraphDomain(spec: GraphDomainSpec): GraphDomain;

export interface GraphDomainSpec {
  id: string;
  label: string;
  edgeSemantics?: EdgeSemantics;          // default 'oriented'
  useNodePalette?: boolean;               // default true
  showMeta?: boolean;                     // default true
  defaultNodeWidth?: number;              // default 180
  defaultNodeHeight?: number;             // default 80
  templates?: NodeTemplate[];
  visuals?: Record<string, NodeVisuals>;
  canConnect?(src: PortRef, tgt: PortRef): boolean;
  resolveLabel?(type: string, config: Record<string, unknown>): string;
}
```

### 4.3 Lifecycle

- **Factory cache.** sh3-editor maintains an `id → GraphDomain` cache. `factory` runs **at most once per domain id per editor activation** — re-mounts of the graph view reuse the cached instance. The cache clears on `sh3-editor` deactivate.
- **Autostart.** A shard providing a `GraphDomainContribution` MUST declare `autostart: true`. Otherwise the contribution disappears whenever the providing app is closed and any open graph that references it stops working. (See [SH3 shard autostart rule](https://github.com/Unfinished-Lair/sh3/blob/main/docs/index.md).)
- **Refresh on register/unregister.** sh3-editor subscribes to `ctx.contributions.onChange(GRAPH_DOMAIN_POINT, …)`; the standalone view's domain list and any pending graph mounts pick up newly registered domains automatically.

### 4.4 Missing-domain error state

Loading a graph whose `domain` id is not registered: the view mounts in an **error state** showing `Domain '<id>' is not registered. Install or activate the shard that provides it.` There is no silent fallback — the corruption-on-save trap (a missing domain producing a degraded asset round-trip) is intentional, not a bug.

---

## 5. Cross-shard view binding — `GRAPH_VIEW_POINT`

Mirrors `ColorPanelDescriptor` ([color-picker.md §1.6](./color-picker.md#16-cross-shard-live-panel-external-shards--070)). A consumer registers a descriptor keyed by the `slotId` where the graph view will mount.

### 5.1 `GraphViewDescriptor`

```ts
export interface GraphViewDescriptor {
  /** Must match the slotId of the SlotNode / TabEntry that mounts the graph. */
  slotId: string;

  /** Domain id; must be registered at GRAPH_DOMAIN_POINT before this descriptor
   *  is consumed. The view fails loudly with an error state if not. */
  domainId: string;

  /** Initial asset. Pass an empty asset for a fresh graph. Consumed once at
   *  mount; later updates from the consumer go through GraphController.setAsset. */
  initial: GraphAsset;

  /** Fires after every committed mutation (move, add, remove, config edit).
   *  The argument is a fresh GraphAsset (from graphStateToAsset). The consumer
   *  is responsible for any persistence (writeTo, in-memory state update, etc.).
   *  NOT fired by GraphController.setAsset (no echo). */
  onChange: (asset: GraphAsset) => void;

  /** Called exactly once after the graph mounts and is ready to accept setAsset. */
  bind?: (ctrl: GraphController) => void;

  /** Read-only mode. View suppresses palette, drag, edge-creation, and config
   *  edits; selection is still allowed. */
  readonly?: boolean;

  /** Inspector commit override — called BEFORE the graph history command runs.
   *  Returning true means the consumer routed the edit elsewhere; the graph's
   *  set-node-config command is skipped. Mirrors WalkerCommitOverride from the
   *  inspector (see inspector.md §8.1). */
  onCommit?: (
    nodeId: string,
    path: (string | number)[],
    next: unknown,
  ) => boolean | void;
}
```

### 5.2 `GraphController`

```ts
export interface GraphController {
  /** Replace the entire asset. No `onChange` echo. Pushes a single
   *  `replace-asset` history command so undo restores the previous asset. */
  setAsset(asset: GraphAsset): void;

  /** Snapshot of the current state as an asset. Cheap (O(n)). */
  getAsset(): GraphAsset;

  /** Programmatic selection. */
  select(ids: (NodeId | EdgeId)[]): void;
  clearSelection(): void;

  /** Pan/zoom controls. */
  focus(target: { nodeId: NodeId } | { rect: { x: number; y: number; w: number; h: number } }): void;
  fitToContent(): void;

  /** Per-graph history surface. Stable across the lifetime of the slot. */
  readonly history: HistoryController;

  /** Subscribe to selection changes. Returns an unsubscribe function. */
  onSelectionChange(cb: (selected: (NodeId | EdgeId)[]) => void): () => void;

  /** Build an InspectorRenderer-compatible binding for the currently
   *  selected single node. Returns null when selection is empty, multi-node,
   *  or an edge. Re-call from inside an `onSelectionChange` callback. */
  getSelectedInspectorBinding(): GraphInspectorBinding | null;
}

export interface GraphInspectorBinding {
  value: Record<string, unknown>;
  meta: InspectorMeta;
  onCommit: WalkerCommitOverride;
}
```

The controller becomes a no-op after the slot unmounts; cached references are silently ignored (same convention as `ColorPanelController`).

### 5.3 Mount precedence

Inside the graph view's `mount`, exactly **one** binding source is selected, in this order:

1. **Cross-shard descriptor** — `ctx.contributions.list(GRAPH_VIEW_POINT)` filtered by `slotId`. Multiple matches log a warning and use the first; one match wins.
2. **Ad-hoc `MountContext.meta`** — if `meta` carries `{ asset, domainId, onChange?, readonly? }`, use it. (See §8.)
3. **Standalone empty state** — render the read-only domain list (§7).

The view also subscribes to `ctx.contributions.onChange(GRAPH_VIEW_POINT, …)`: a descriptor registered after mount triggers a re-mount that picks up the new binding. There is **no** intra-shard imperative `openGraph(...)` API — all callers (internal or external) go through descriptor or `meta`.

---

## 6. Authoring a domain

### 6.1 Edge semantics

| Choice | When |
|---|---|
| `'oriented'` | Inputs/outputs distinguished. Arrowheads drawn at target end. Default. |
| `'adjacency'` | Bidirectional. No arrowheads. Use for sketching / relationship domains. |

Validation at edge-drop time: the target must be an `input` port; for `'oriented'` the source must be an `output`. `domain.canConnect`, if defined, gates the rest.

### 6.2 Palette vs freeform

- `useNodePalette: true` (default) — empty-click on the canvas opens a category-grouped popover; the user picks a template. Push: `add-node` at click position.
- `useNodePalette: false` — empty-click adds a freeform node sized to `defaultNodeWidth × defaultNodeHeight`. Useful for sketching domains.

### 6.3 Templates and ports

```ts
const domain = createGraphDomain({
  id: 'shader-app:shader-graph',
  label: 'Shader Graph',
  templates: [
    {
      type: 'math.add',
      category: 'Math',
      label: 'Add',
      ports: [
        { id: 'a',   label: 'A',   direction: 'input',  dataType: 'number' },
        { id: 'b',   label: 'B',   direction: 'input',  dataType: 'number' },
        { id: 'out', label: 'Out', direction: 'output', dataType: 'number' },
      ],
      defaultConfig: {},
    },
  ],
  visuals: {
    'math.add': {
      label: 'Add',
      borderColor: '#7eb',
      portColors: { number: '#7eb' },
    },
  },
});
```

**Port-id rules:**

- Inside a template, port ids are **short names** (`a`, `b`, `out`).
- When a node is instantiated, sh3-editor materializes port ids as `${nodeId}_${shortName}` in the persisted `GraphAsset`. The bridge restores the short form in `NodeState.ports[].shortId` for handler dispatch and inspector wiring.
- Ports are stored on the node (not derived from the template at load time), so assets survive template evolution.

### 6.4 Connection rules

```ts
createGraphDomain({
  // ...
  canConnect(src, tgt) {
    return src.dataType === tgt.dataType;   // dataType compatibility
  },
});
```

Default rule (when `canConnect` is omitted): any output → any input on a different node, regardless of `dataType`.

### 6.5 Dynamic labels

For nodes whose display name is derived from `config`:

```ts
createGraphDomain({
  // ...
  resolveLabel(type, config) {
    if (type === 'math.expression') return String(config.expr ?? '∅');
    return type;
  },
});
```

`resolveLabel` is called at mount and re-called after every `set-node-config` history command, so the node header re-renders automatically.

### 6.6 Inspector hints (`configSchema`)

`configSchema` declares fields that don't correspond to an input port (or that need a renderer hint beyond the auto-generated mapping):

```ts
{
  type: 'material.color',
  category: 'Material',
  label: 'Color',
  ports: [{ id: 'out', label: 'Out', direction: 'output', dataType: 'color' }],
  defaultConfig: { color: '#ff0000' },
  configSchema: [
    { key: 'color', label: 'Color', type: 'string', rendererHint: 'color' },
  ],
}
```

`rendererHint: 'color'` is mapped by the bridge to `InspectorMeta.type = 'color'` and dispatches to the color renderer registered at `INSPECTOR_RENDERER_POINT` ([color-picker.md §4](./color-picker.md#4-using-as-an-inspector-renderer)).

### 6.7 `addTemplate` / `addVisuals` — late-binding registration

Both `addTemplate` and `addVisuals` upsert by `type`. A future contribution-surface RFC may let other shards extend an existing domain post-registration; the API is stable today for intra-domain use.

`getNodeVisuals(type)` returns a value, never throws — missing visuals fall back to a default with the type as label, so unknown node types still render.

---

## 7. Standalone view

`sh3-editor:graph` opened with no descriptor and no `meta` shows:

- Title: **"No graph open"**
- Subtitle: A `GraphViewDescriptor` is required to bind a graph to this slot.
- A **read-only** list of registered domains (`<id> — <label>`). No click action.
- Empty domain list: `No graph domains registered. Install or activate a shard that provides one.`

This view is informative scaffolding for consumers and shard authors — end users won't typically open it on its own.

---

## 8. Ad-hoc mounts

For internal sh3-editor flows or one-shot mounts, pass the binding through `MountContext.meta`:

```ts
shell.float.open('sh3-editor:graph', {
  meta: {
    asset: someGraphAsset,
    domainId: 'shader-app:shader-graph',
    onChange: (a) => console.log('changed', a),
    readonly: false,
  },
});
```

`meta` requires both `asset` and `domainId` to be valid — otherwise the view falls through to the empty state. There is no `bind` callback on this path; if you need a controller, use `GraphViewDescriptor`.

---

## 9. Data model

### 9.1 `GraphAsset` (persisted)

```ts
export interface GraphAsset {
  id: string;
  name: string;
  domain: string;                      // domain identifier; required
  version: number;                     // schema version; v1 = 1
  nodes: GraphAssetNode[];
  edges: GraphAssetEdge[];
  metadata?: Record<string, unknown>;
}

export interface GraphAssetNode {
  id: string;                          // unique within asset
  type: string;                        // template key, e.g. "math.add"
  ports: GraphAssetPort[];             // materialized at write-time
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface GraphAssetPort {
  id: string;                          // unique within asset; convention: `${nodeId}_${shortName}`
  label: string;
  direction: 'input' | 'output';
  dataType?: string;                   // type tag for visuals + connection rules
}

export interface GraphAssetEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}
```

### 9.2 `GraphState` (in-memory)

```ts
export interface GraphState {
  id: GraphId;
  domainId: string;
  name: string;
  version: number;
  nodes: Map<NodeId, NodeState>;
  edges: Map<EdgeId, EdgeState>;
  metadata: Record<string, unknown>;
  // editor-only
  readonly: boolean;
  selection: Set<NodeId | EdgeId>;
}

export interface NodeState {
  id: NodeId;
  type: string;
  label: string;                       // resolved from domain.resolveLabel(type, config)
  ports: PortDefinition[];             // includes shortId
  config: Record<string, unknown>;
  configFields: FieldDescriptor[];     // cached inspector schema
  position: { x: number; y: number };
  width: number;
  height: number;
}
```

`GraphState` is constructed once at mount via `graphAssetToState(asset, domain)` and mutated thereafter via history commands. It is never re-derived from the asset mid-session — the bridge runs only at mount (asset → state) and on `getAsset()` (state → asset).

### 9.3 Bridge

Internal but observable through controller behavior:

- `graphAssetToState(asset, domain)` — runs at mount and inside `replace-asset` revert.
- `graphStateToAsset(state)` — runs on every `controller.getAsset()` call and immediately before each `descriptor.onChange(asset)` fire.
- `buildConfigFields(template, config, connectedShortIds)` — merges (a) entries from `template.configSchema` whose key doesn't collide with an input port id, and (b) auto-generated fields for input ports whose `dataType` is recognized (`number`, `boolean`, `string`). Re-runs after every `set-node-config`, `add-edge`, and `remove-edge`.

When an input port has an incoming edge, its corresponding field is marked `disabled: true`; the inspector renders it as read-only so the user sees that the edge is the source of truth.

---

## 10. Inspector integration

The graph view does **not** mount the inspector itself. The consumer composes the layout (e.g. graph slot beside an inspector slot) and forwards the binding:

```ts
controller.onSelectionChange(() => {
  const b = controller.getSelectedInspectorBinding();
  if (b) editor.openInspector('shader-inspector', { ...b });
  else   editor.closeInspector('shader-inspector');
});
```

`getSelectedInspectorBinding()` returns `null` when:

- selection is empty;
- selection is multi-node (single-node inspectors only in V1);
- selection is an edge (no edge-config inspector in V1).

The returned `onCommit` is a `WalkerCommitOverride` ([inspector.md §8.1](./inspector.md#81-routing-field-commits-through-your-own-editor-oncommit-041)) that:

1. Calls `descriptor.onCommit?.(nodeId, path, next)`. If that returns `true`, the override returns `true` (walker skips its in-place write; consumer routed the edit elsewhere).
2. Otherwise pushes a `set-node-config` command onto the graph's `HistoryController` and returns `true` (the graph-level command is the single source of truth — the inspector's walker MUST NOT also write).

This guarantees a **single history stack**: Ctrl+Z over the canvas and Ctrl+Z over the inspector both consult `controller.history`.

For the **standalone** graph view (no descriptor), inspector wiring is N/A — the empty state has no selection.

---

## 11. History

### 11.1 Per-graph `HistoryController`

The graph view owns a `HistoryController` exposed through `controller.history`. Stack persists across selection changes; cleared only on `setAsset` (which pushes a single `replace-asset` command capturing the previous state).

### 11.2 Command kinds

```ts
export type GraphCommandKind =
  | 'add-node'
  | 'add-many'              // multi-node paste/duplicate
  | 'remove-node'
  | 'move-node'
  | 'set-node-config'
  | 'add-edge'
  | 'remove-edge'
  | 'remove-selection'      // delete with mixed nodes + edges
  | 'replace-asset';
```

Each command's `apply` / `revert` mutate `GraphState` directly. After every applied command, the view fires `descriptor.onChange(graphStateToAsset(state))` so the consumer sees a new asset snapshot.

### 11.3 Coalescing

- `move-node` during drag: not pushed per pointermove. One command on `pointerup` with `before/after` positions.
- `set-node-config` during text edit: handled by the inspector walker's existing coalesce window — graph respects its output (one command per "edit session" closed by blur/Enter).

### 11.4 Grain rules

- Selecting all + Delete = **one** `remove-selection` command (multi-undo surprises users).
- Pasting/duplicating multiple nodes = one `add-many` command.
- `replace-asset` is intentionally heavy; consumers that frequently call `setAsset` should accept that mid-stack undo from a `replace-asset` discards prior history.

### 11.5 Subscribing externally

```ts
controller.history.onChange(() => updateUiButtons());
controller.history.canUndo;       // boolean
controller.history.undo();        // programmatic — works regardless of focus
controller.history.redo();
```

Keyboard shortcuts (Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z) trigger only when the graph view holds focus, the same as the editor and inspector.

---

## 12. Canvas behavior

### 12.1 Nodes

HTML+CSS nodes absolutely positioned inside a pannable/zoomable inner container. A node is a flex column: header (label from `domain.resolveLabel`), body (slot — defaulted from visuals), and a port row.

- Selection toggles a CSS class. Multi-select: `Ctrl/Cmd+click` and shift-rectangle-drag.
- Drag-to-move: `pointerdown` on header initiates a move; `pointermove` updates `position` directly on node-state (no history push during drag); `pointerup` pushes one `move-node` command.

### 12.2 Edges

A single absolutely-positioned `<svg>` overlay. Each edge is a `<path>` whose `d` attribute is recomputed from the source/target port DOM positions on every state change — a cubic Bézier with horizontal control offset proportional to the source-target horizontal distance.

- `stroke` derives from the source port's `dataType` via `domain.getNodeVisuals(...).portColors` (defaulted from a small built-in palette if absent).
- `oriented` semantics draw an arrowhead at the target end; `adjacency` semantics omit the arrowhead.
- Selected edges get a thicker stroke + outline halo.

### 12.3 Edge drag-create

- `pointerdown` on a port marker starts edge-drag mode; a temporary `<path>` follows the cursor.
- `pointerup` over a target port: validate per §6.1, push `add-edge` if valid, otherwise discard.

### 12.4 Pan / zoom

- Middle-mouse-drag or space-hold + left-drag pans.
- Wheel zooms around cursor, clamped to `[0.2, 4]`.
- View transform is editor-state, **not** part of `GraphAsset`.

### 12.5 Keyboard

- `Ctrl/Cmd+A` selects all visible nodes (not edges).
- `Delete` removes selected nodes (with their incident edges) and edges as a single `remove-selection` history command.
- Click on background clears selection.

---

## 13. Cross-shard string-literal rule

`GRAPH_DOMAIN_POINT` and `GRAPH_VIEW_POINT` are exported for use within sh3-editor and for type-companion authoring. **External consumers MUST inline them as string literals at runtime** — bare cross-shard imports fail at install time per the sh3-core 0.10.x runtime model (shards share a JS realm but cross-shard import resolution is gated, so contribution-point ids are looked up by string).

```ts
// ✅ correct
import type {
  GraphDomainContribution,
  GraphViewDescriptor,
} from '@unfinished-lair/sh3-editor/graph/contributions';
const GRAPH_DOMAIN_POINT = 'sh3-editor.graph-domain';

// ❌ breaks at install time in a separate shard
import { GRAPH_DOMAIN_POINT } from '@unfinished-lair/sh3-editor/graph/contributions';
```

The same rule governs `INSPECTOR_RENDERER_POINT`, `'sh3-editor.color-panel'`, etc.

---

## 14. Subpath exports

| Subpath | What it exports |
|---|---|
| `@unfinished-lair/sh3-editor/graph/contributions` | `GRAPH_DOMAIN_POINT`, `GRAPH_VIEW_POINT`, `GraphDomainContribution`, `GraphViewDescriptor`, `GraphController`, `GraphInspectorBinding`. |
| `@unfinished-lair/sh3-editor/graph/types` | `GraphAsset`, `GraphAssetNode`, `GraphAssetPort`, `GraphAssetEdge`, `GraphState`, `NodeState`, `EdgeState`, `PortDefinition`, `FieldDescriptor`, `NodeId`, `EdgeId`, `PortShortId`, `GraphId`, `GraphDomain`, `GraphDomainHost`, `NodeTemplate`, `ConfigFieldDef`, `NodeVisuals`, `EdgeSemantics`, `PortRef`, `createGraphDomain`, `GraphDomainSpec`. |
| `@unfinished-lair/sh3-editor/graph/history` | `GraphCommand`, `GraphCommandKind` (read-only — commands are constructed by the view, not by consumers). |

---

## 15. Error / failure modes

| Situation | Behavior |
|---|---|
| Asset references a missing domain id | Mount renders error state with the missing id; no silent substitution. |
| Asset references an unknown node `type` | Render the node with default visuals fallback (`getNodeVisuals` never throws); inspector shows raw config. |
| Edge endpoint references a missing port | Drop the edge silently with a `console.warn`; do not block mount. |
| `descriptor.onChange` throws | Caught by the view; logged. State mutation already committed; the next `onChange` retries. |
| `descriptor.bind` throws | Caught; logged. Controller is still live. |
| Cycle detection | NOT done in V1 — domain semantics decide whether cycles are valid. The view accepts any topology. |
| Multiple `GraphViewDescriptor` matches for one `slotId` | Console warning; the first descriptor wins. |

---

## 16. Non-goals (V1)

- **Bundled execution Runner.** Out of scope at any version of sh3-editor — execution belongs with the consuming domain. If/when a Runner ships, it does so as a separate package (`@unfinished-lair/sh3-graph-runner`), not bundled.
- **Imperative cross-shard API** (e.g. `editor.openGraph(...)` from another shard). SH3's cross-shard surface is contributions-only.
- **File-backed Open/Save toolbar inside the view** — consumers wire persistence through their own `ctx.browse` flows.
- **Asset migration tooling.** `GraphAsset.version: 1` is the hook; `migrate(asset, fromVersion, domain)` is a future entry point.
- **Method / event / component contribution surfaces.** Tracked as a follow-up RFC once a second domain wants to extend a third-party domain.
- **Multi-graph runners; cross-asset references.**
- **Edge inspectors.** Selecting an edge does not open an inspector in V1.
- **Per-index node-array meta on the inspector.** Same constraint as `inspector.md` §9.

---

## 17. See also

- [editor.md](./editor.md) — the text editor shipped by the same shard.
- [inspector.md](./inspector.md) — the generic object inspector and `INSPECTOR_RENDERER_POINT`. The graph view reuses this surface for selected-node config edits.
- [color-picker.md](./color-picker.md) — companion view; analogous descriptor + controller pattern at `'sh3-editor.color-panel'`.
- [`./graph/flow.md`](./graph/flow.md) — quick-start mirror of this doc.
- [`./graph/authoring-domains.md`](./graph/authoring-domains.md) — recipe-style guide for domain authors.

---

## 18. Version history

See `CHANGELOG.md`.
