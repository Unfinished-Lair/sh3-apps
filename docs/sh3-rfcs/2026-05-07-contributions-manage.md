# RFC — `contributions:manage` permission + cross-shard introspection (R2)

**Author:** @Salepate (sh3-ai Phase 2 prereq; companion to existing contribution-points RFC)
**Status:** Draft — non-blocking for sh3-ai 0.3.x; needed for Phase 2 graph emission
**Targets:** sh3-core `0.16.x` or later
**Related:** Extends `2026-04-20-shard-contribution-points.md`.

## Summary

Add three privileged read methods to `ContributionsApi`, gated by a new `contributions:manage` manifest permission, that let a privileged shard (sh3-ai, sh3-diagnostic, etc.) enumerate every contribution point and every descriptor across every active shard. The existing per-shard `register/list/onChange` API remains unchanged.

## Motivation

The contribution-point design landed in sh3-core 0.10.x lets a shard provide its own kinds and other shards contribute to them. The reflection surface is intentionally minimal: a contributor can register; the providing shard can `list`/`onChange` its own point. **No shard can enumerate everything across the system.**

Phase 2 of sh3-ai wants to emit a `GraphDomainContribution` whose nodes include not just verbs but contribution descriptors marked AI-callable (for example, a `SelectionAction` from sh3-file-explorer or a future `MutationAction` from another shard). To do that, sh3-ai needs to discover descriptors registered against points it doesn't own. Same need exists for diagnostic-style shards that want to render an "everything wired" view.

## Proposal

```ts
interface ContributionsApi {
  // existing per-shard:
  register, list, onChange,
  
  // new privileged (gated by `contributions:manage`):
  listPoints(): string[];
  listAll<T = unknown>(pointId: string): T[];
  onAnyChange(cb: (pointId: string) => void): () => void;
}
```

### Semantics

- `listPoints()` returns ids of all known points (a point is "known" the moment any shard registers a descriptor against it). No descriptor data — lightest possible surface.
- `listAll<T>(pointId)` returns all descriptors at the named point regardless of which shard registered them. Same return shape as today's `list`. Privileged callers see across realms; non-privileged callers see only own-shard registrations (today's behavior).
- `onAnyChange(cb)` fires for register/unregister at any point. The callback receives the point id so consumers can rebuild incrementally.
- Without `contributions:manage` declared in manifest: `listPoints()` returns `[]`, `listAll()` returns own-shard registrations only, `onAnyChange()` is a no-op subscriber.

### Permission philosophy

Listing every contribution descriptor across the system is a powerful capability — it lets the privileged shard see everything wired in the host, including potentially-sensitive UI affordances or back-channel descriptors. The permission is therefore opt-in per shard manifest. Most shards don't need it.

### Implementation sketch

sh3-core's contribution-registry is already a `Map<pointId, Map<handle, descriptor>>` — this RFC just exposes a wider read API on it. ~50 lines plus the permission gate.

### Compatibility

Fully additive. Existing `register/list/onChange` API unchanged. Non-privileged shards see no behavior change.
