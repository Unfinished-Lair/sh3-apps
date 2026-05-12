# Extending — v0.2.0+ placeholder

The v0.1.0 Control Graph node catalog is **verbs-only**. The following are reserved for future versions:

## Actions

Nodes synthesized from `ctx.actions` registrations — fire-and-forget; control-in only. Requires a `listActions()` snapshot at adapter time plus a node handler that calls `ctx.sh3.runAction(id)`.

## Contributions

Generic nodes that iterate descriptors at a named contribution point — read-only, typed as `array` on the output port.

## Server warnings

When server-callable verbs (or hybrid action/contribution nodes) arrive, a `target: 'client' | 'server' | 'hybrid'` flag on the template will turn on warning UI at edit time and a run-time gate that warns before execution. The flag has a reserved spot on `NodeTemplate.defaultConfig`; it just isn't read by the v0.1.0 visuals yet.

## Incremental catalog buildup

Today the catalog is snapshotted at domain instantiation. v0.2.0 will subscribe to verb-registration events from sh3-core so shards activating after sh3-pipeline get their verbs added to the catalog automatically. `pipeline.catalog.rebuild` is the v0.1.0 escape hatch — it upserts but does not remove.

## Per-target `pipeline.run` ports

`pipeline.run` ships generic in v0.1.0 (`docId, inputs → result`). v0.1.1 (or v0.2.0) may synthesize per-instance typed ports when the `docId` is bound to a resolvable graph at design time, by reading the target's `meta.interface` and adding `inputs.*` / `outputs.*` ports to the node instance.

## UI deferred items

- Multiple per-doc tabs in the same app.
- "Save log to doc" action on the Run Log panel (lift sh3-diagnostic's pattern).
- Dynamic sequence/record.build port mutation from the Inspector (today's defaults are 2 outs and a record output respectively).
