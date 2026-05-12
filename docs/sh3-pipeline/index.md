# sh3-pipeline

A test-bench app + shard for fabricating programmatic pipelines as **Control Graphs**. Built on top of sh3-editor's graph view.

## Quick start

1. Install sh3-pipeline + sh3-editor in your tenant's registry.
2. Open the Pipeline app. The app shows a three-pane vertical split: toolbar (top), graph editor (middle), run log (bottom).
3. Drag a **Start**, an **End**, and one **Verb** node from the palette. Wire them control-in → control-out.
4. Hit **Run** in the toolbar. The Run Log shows trace entries; verb scrollback streams in.

## What is a Control Graph?

A Control Graph is an oriented node graph with two edge classes encoded as port `dataType`s:

- **`control`** — execution sequencing (the "white" Blueprint edge).
- **`string` / `number` / `boolean` / `record` / `array` / `doc` / `unknown`** — typed data edges.

Each verb node has one control-in, one control-out, and additional typed data ports synthesized from the verb's JSON Schema (or a `result / stdout / stderr / scrollback` fallback when no schema is declared).

## Cross-shard contract

sh3-pipeline registers exactly one `GraphDomainContribution` at the contribution point `'sh3-editor.graph-domain'`. The shard imports **types only** from sh3-editor; the point id is inlined as a string literal per the [cross-shard contribution guide](../cross-shard-contribution-guide.md).

## Documents

A Control Graph is one `.pipeline.json` document. The shard manifest declares `permissions: ['documents:browse', 'documents:read', 'documents:write']` so the shard can read/write graph documents anywhere in the tenant. See [document-format.md](./document-format.md).

## Composition

`pipeline.run` is itself a verb. Any saved pipeline appears in the catalog as a verb node, so graphs naturally call other graphs. See [verbs.md](./verbs.md) for the recipe.
