# sh3-pipeline

A SH3 app + shard for fabricating programmatic pipelines as **Control Graphs**, built on top of sh3-editor's graph view.

## Quick start

1. Install sh3-pipeline + sh3-editor in your tenant's registry.
2. Open the Pipeline app. Layout:
   - **Toolbar** (top, 40px): Run / Stop / New / Save buttons.
   - **Graph** (1fr): the editor's graph canvas. Click an empty area to pop the node palette.
   - **Inspector** (right, 300px, role: `inspector`): node config editor for the current selection.
   - **Tabs row** (bottom, 140px): empty by default — drop views here, or read run output via the browser console.
3. Drag a **Start**, an **End**, and one **Verb** node from the palette. Wire them control → control-in.
4. Hit **Run** (or press F5). Run log entries are mirrored to the browser console with `[pipeline:<level>]` prefixes.

## What is a Control Graph?

A directed node graph with two edge classes encoded as port `dataType`s:

- **`control`** — execution sequencing (Blueprint-style).
- **`string` / `number` / `boolean` / `record` / `array` / `doc` / `unknown`** — typed data edges.

Each verb node has a `control-in`, a `control-out`, and additional typed ports synthesized from the verb's JSON Schema (or a `result / stdout / stderr / scrollback` fallback for unschemed verbs). See [control-graph-domain.md](./control-graph-domain.md).

## Menus, actions, shortcuts

The app declares two menu containers — **File** and **Pipeline** — and registers six actions, all palette-discoverable:

| Action | Shortcut | Menu |
|---|---|---|
| New Pipeline | `Mod+Alt+N` | File |
| Open… | `Mod+O` | File |
| Save | `Mod+S` | File |
| Save As… | `Mod+Shift+S` | File |
| Run | `F5` | Pipeline |
| Stop | `Shift+F5` | Pipeline |
| Rebuild Catalog | — | Pipeline |

**Open** pops a modal listing every document in the sh3-pipeline namespace (newest first), with a filter input and a free-text path field. **Save As** prompts for a bare path; the `sh3-pipeline:` shardId prefix is added automatically. Save defaults to `sh3-pipeline:scratch.pipeline.json` if no doc is bound.

## Cross-shard contract

sh3-pipeline registers exactly three contribution points on sh3-editor's surfaces:

| Point | What we register | What it does |
|---|---|---|
| `'sh3-editor.graph-domain'` | `GraphDomainContribution` (Control Graph factory) | Provides node templates + visuals + connect rules |
| `'sh3-editor.graph-view'` | `GraphViewDescriptor` for slot `graph` | Binds the editor's graph view to our asset + handles its change events |
| `'sh3-editor.inspectorInstance'` | `InspectorInstanceContribution` for slot `inspector` | Pushes the selected node's config into the inspector and routes edits back through the graph history |

All type imports are type-only; runtime point IDs are inlined as string literals (sh3-core's loader only rewrites `sh3-core` and `svelte` bare specifiers, so any other runtime import fails at install). No value imports from sh3-editor.

## Verbs

Three verbs registered at boot (`programmatic: true`, callable from the shell and from other graphs):

- `pipeline.run` — execute a graph document.
- `pipeline.open` — open a doc in the Pipeline app.
- `pipeline.catalog.rebuild` — refresh the verb-node catalog.

See [verbs.md](./verbs.md).

## Documents

Each Control Graph is one `.pipeline.json` document. The shard manifest declares `permissions: ['documents:browse', 'documents:read', 'documents:write']` so it can read/write graph documents anywhere in the tenant. Format: [document-format.md](./document-format.md).

## Composition

Because `pipeline.run` is itself a verb, every saved pipeline appears in the catalog as a verb node — so graphs naturally call other graphs. See [verbs.md](./verbs.md#sub-graph-composition-recipe).

## Where to go next

- [control-graph-domain.md](./control-graph-domain.md) — node taxonomy, edge classes, port rules, verb adapter.
- [runtime.md](./runtime.md) — `RunContext`, execution algorithm, sub-graph fork, error model, console logging.
- [document-format.md](./document-format.md) — `.pipeline.json` schema and docId convention.
- [verbs.md](./verbs.md) — `pipeline.*` verb reference + sub-graph composition recipe.
- [extending.md](./extending.md) — v0.2.0+ surfaces (actions, contributions, server warnings, incremental catalog).
