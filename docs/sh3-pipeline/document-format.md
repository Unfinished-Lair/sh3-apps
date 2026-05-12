# .pipeline.json format

```ts
interface PipelineDocument {
  version: 1;
  domainId: 'sh3-pipeline:control-graph';
  interface: {
    inputs:  Array<{ name: string; dataType: string }>;
    outputs: Array<{ name: string; dataType: string }>;
  };
  asset: GraphAsset;   // sh3-editor's GraphAsset
}
```

- `version` — integer; bumped on breaking changes.
- `domainId` — written for forward compatibility (other domains may register against `.pipeline.json` in the future).
- `interface` — **derived from `start.params` + `end.returns` on save**. Calling graphs read this without instantiating the asset.
- `asset` — verbatim editor `GraphAsset` (`{ id, name, domain, version, nodes, edges, metadata? }`).

The shard manifest declares `permissions: ['documents:browse', 'documents:read', 'documents:write']` so the shard can browse, open, save, and create pipeline documents anywhere in the tenant.

## docId convention

`docId` is `'shardId:path'` colon-separated, e.g. `'sh3-pipeline:pipelines/cats.pipeline.json'`. The shard's `load`/`save` helpers split on the first colon and dispatch to `ctx.browse.readFrom(shardId, path)` / `ctx.browse.writeTo(shardId, path, content)`.
