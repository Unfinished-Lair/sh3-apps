# RFC — Expose `GestureRegistry` to shard views

**Author:** @Salepate (sh3-editor swipe-arbitration work at `Unfinished-Lair/sh3-apps`)
**Status:** Draft — for discussion before implementation
**Targets:** sh3-core `0.20.x`
**Blocks:** sh3-editor graph-view edge-reservation work (see "Motivation" below).

## Summary

`sh3-core@0.19.0` added the `GestureRegistry` arbitration system, exposed on `AppContext.gestures`. **It is not reachable from `ShardContext` or `MountContext`.** This RFC asks for shard-side access — either via `ShardContext.gestures`, `MountContext.gestures`, or a `ctx.app.gestures` accessor — so shard views can participate in pointer arbitration.

## Motivation

sh3-editor's graph view (`packages/sh3-editor/src/graph/views/Graph.svelte`) wants to do two things on horizontal pointer drags:

1. **Block carousel swipe over the graph interior** so a graph-pan gesture doesn't double-fire as a tab-swipe.
2. **Reserve the left/right edge strips for the shell carousel** so users can still navigate between tabs without zooming/panning the graph by accident.

Both are textbook uses of `ctx.gestures.register({ type: 'pan', container: interiorEl, … })` — a `'normal'` priority claim on the interior preempts the carousel's `'edge'` claim everywhere it overlaps, while leaving the edge strips uncontested.

But the graph is a shard view. `MountContext` (`shards/types.d.ts:54`) carries `slotId`, `viewId`, `label`, `meta`, `setDirty`, `location` — no `gestures`. `ShardContext` is also missing it. The factory has no path to the owning app's registry.

The only workaround we found is CSS that piggybacks on the carousel's internal `hasNativeHorizontalScroll` heuristic (`layout/compact/CarouselTabs.svelte:83-91`) — wrap the pan-eligible area in `overflow-x: auto` and add transparent edge-zone overlay siblings. That works but couples sh3-editor to an arbitration heuristic the shell could legitimately change at any time, and forces every shard that wants edge-reservation behavior to invent its own edge-zone width, ramp, and DOM shape — exactly the cross-shard inconsistency the new arbitration system was meant to fix.

## Proposal

Add one of (preference order):

### Option A — `MountContext.gestures`

```ts
export interface MountContext {
  slotId: string;
  viewId: string;
  label: string;
  meta?: Record<string, unknown>;
  setDirty(dirty: boolean): void;
  location(): TreeRootRef | null;
  /** Per-app gesture registry. Same instance as the owning AppContext.gestures. */
  gestures: GestureRegistry;
}
```

Best fit: a view is mounted into an app, the app already owns a `GestureRegistry`, the view should reach it through the per-mount context it's already handed.

### Option B — `ShardContext.gestures`

Same registry instance, available from `activate()`. Less precise (a shard isn't tied to one app's gesture lifetime), but acceptable if MountContext changes feel too invasive.

### Option C — `getActiveApp().gestures` (or similar app-handle accessor)

Status-quo `getActiveApp()` returns just `AppManifest`. Extending it (or adding `getActiveAppContext()`) to expose the gesture registry would also work, at the cost of a global lookup vs. a passed-in handle.

## Non-goals

- **Edge-zone DSL.** This RFC asks only for access to the existing primitive. Standardizing edge-strip width / ramp / data attributes can ride a follow-up RFC once 2+ shards need it.
- **Cross-app arbitration.** The carousel's `'edge'` priority is enough. Shards using this API will always claim `'normal'` and preempt edge cleanly.

## Migration

Pure addition. Existing `AppContext.gestures` stays where it is; option A/B/C just makes the same instance reachable from one more surface. No breaking change.

## Test plan

- Unit test: `ctx.gestures` on MountContext returns the same registry instance as the owning `AppContext.gestures` (object-identity check via app lifecycle).
- Integration test: a shard view registers a pan-x claim with priority `'normal'` and confirms a concurrent carousel `'edge'` claim is preempted on the same pointer-down.

## Local follow-up

Once landed, sh3-editor:
- Removes the CSS workaround from `Preview.svelte` (once arbitration is proper, the `overflow-y: auto` constraint is no longer needed for swipe-safety — only for aesthetic reasons).
- Adds gesture-registry-based edge reservation to `Graph.svelte` (interior pan claim only — shell defines edge-zone geometry).
