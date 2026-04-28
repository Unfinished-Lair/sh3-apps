# sh3-editor — Graph Flow

A node-graph view contributed by `@unfinished-lair/sh3-editor`. Mountable
standalone (informational empty state) or via a cross-shard descriptor that
binds the view to your domain + asset + save handler.

## Architecture overview

- **GraphAsset** — the persisted serializable graph definition you own.
- **GraphState** — the editable in-memory mirror sh3-editor maintains.
- **GraphDomain** — your pluggable behavior pack: templates, visuals,
  edge semantics. You register a domain, sh3-editor instantiates it on
  demand.

sh3-editor ships **no execution Runner**; what counts as "running" the graph
(compiling a shader, ticking a behaviour tree, evaluating a decision flow) is
your code's concern.

## Quick start (cross-shard)

```ts
import type {
  GraphDomainContribution,
  GraphViewDescriptor,
  GraphController,
} from '@unfinished-lair/sh3-editor/graph/contributions';
import { createGraphDomain } from '@unfinished-lair/sh3-editor/graph/types';
import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';

// String-literal ids — never import the runtime constants across shards.
const GRAPH_DOMAIN_POINT = 'sh3-editor.graph-domain';
const GRAPH_VIEW_POINT   = 'sh3-editor.graph-view';

export function activate(ctx) {
  // 1. Register your domain.
  const domain: GraphDomainContribution = {
    id: 'my-app:my-graph',
    factory: (host) => createGraphDomain({
      id: 'my-app:my-graph',
      label: 'My Graph',
      templates: [/* ... */],
      visuals: { /* type → NodeVisuals */ },
    }),
  };
  ctx.contributions.register(GRAPH_DOMAIN_POINT, domain);

  // 2. Bind a graph to a slot in your App.initialLayout.
  let initialAsset: GraphAsset = loadOrEmpty('my-app:my-graph');
  let controller: GraphController | null = null;

  const view: GraphViewDescriptor = {
    slotId: 'my-app:graph-slot',
    domainId: 'my-app:my-graph',
    initial: initialAsset,
    onChange: (asset) => persist(asset),
    bind: (ctrl) => { controller = ctrl; },
  };
  ctx.contributions.register(GRAPH_VIEW_POINT, view);
}
```

The shard providing the domain MUST declare `autostart: true` — otherwise the
domain contribution disappears whenever the providing app is closed and any
graph that references it stops working.

## Cross-shard string-literal rule

The constants `GRAPH_DOMAIN_POINT` and `GRAPH_VIEW_POINT` are exported for
use in TypeScript types, but external consumers MUST inline them as string
literals at runtime. Bare cross-shard imports fail at install time per the
sh3-core 0.10.x runtime model.

## Inspector wiring

Selecting a node fills `controller.getSelectedInspectorBinding()` with
`{ value, meta, onCommit }`. Mount your inspector slot and forward the
binding:

```ts
controller.onSelectionChange(() => {
  const b = controller.getSelectedInspectorBinding();
  if (b) editor.openInspector('my-app:inspector-slot', { ...b });
  else   editor.closeInspector('my-app:inspector-slot');
});
```

The override returned by `getSelectedInspectorBinding` routes config edits
through the graph's history, so Ctrl+Z over the canvas and over the inspector
share one undo stack.

## Standalone view

`sh3-editor:graph` opened with no descriptor and no `meta` shows a read-only
list of registered domains. Users won't typically open this view themselves —
it's discoverability scaffolding for consumers.

## Reference

- Spec: `docs/claude-plans/sh3-editor/2026-04-28-sh3-editor-graph-flow-design.md`
- Source doc: GraphLive `docs/graph-architecture.md`
