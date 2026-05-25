# Pipeline Verbs

All three verbs are registered with `programmatic: true` so they appear in `ctx.sh3.listVerbs({ programmaticOnly: true })` and therefore in the Control Graph's verb catalog.

## `pipeline.run`

Run a pipeline graph document.

```ts
{ input: { docId: string, inputs?: Record<string, unknown> } }
// Resolves with { outputs: Record<string, unknown> }
```

The verb forwards `vctx.signal` so a graph stopped via the toolbar cancels in-flight sub-graph runs too. Output schema not yet typed (sh3-core's `VerbSchema` only exposes `input`); the resolution payload is returned regardless.

## `pipeline.open`

Launch the sh3-pipeline app on the given graph doc.

```ts
{ input: { docId: string } }
```

**v0.1.0 caveat**: docId is accepted but the app launches to whatever state it was last in (the app does not yet route docId through `LaunchAppOptions.args`). Tracks v0.2.0.

## `pipeline.catalog.rebuild`

Re-run the verb→template adapter against `listVerbs()` and **upsert** templates into the active domain. Useful during development when registering verbs from another shard mid-session.

```ts
{ input: {} }
// Resolves with { count: number }
```

**v0.1.0 caveat**: upsert-only. Templates for verbs that have been unregistered remain in the catalog until shard deactivation. v0.2.0 follow-up: full diff (add new, drop missing) once sh3-core exposes a verb-registry change subscription.

## Sub-graph composition recipe

Save your inner graph as `pipelines/inner.pipeline.json` (the Save As prompt accepts the bare path; the `sh3-pipeline:` shardId prefix is added internally). In an outer graph, drop the `pipeline.run` verb node from the palette. Set its `docId` input to the full docId (`sh3-pipeline:pipelines/inner.pipeline.json`). Wire the `inputs` input from a `record.build` upstream (or pass an empty object as the literal). The verb's `result` output carries `{ outputs }`; pull the inner outputs with `record.get`.

v0.1.0 ships generic `(docId, inputs) → result` ports on `pipeline.run`. Per-target port synthesis (typed inputs/outputs derived from the called graph's `meta.interface`) is a stretch goal for v0.1.1.

## Authoring enumerative verbs

To make a verb usable as a sh3-pipeline picker (Prefetch mode), declare an array-of-records output schema:

```ts
schema: {
  input: { type: 'object', properties: { tenant: { type: 'string' } } },
  output: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id:   { type: 'string' },
        name: { type: 'string' },
      },
    },
  },
}
```

sh3-pipeline will emit a `:prefetch` template for any verb matching this shape. The inspector reads `items.properties` to populate the value-field dropdown.

**Future:** sh3-core will likely add a `Verb.enumerative: true` flag so a verb can declare picker intent affirmatively (avoiding the "May yield non-deterministic results" warning modal when a future v2 context-menu toggle ships). Tracked in `<upstream-issue-link>`.
