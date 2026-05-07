# RFC — `ctx.runtime.listVerbs()` (R1-minimal)

**Author:** @Salepate (sh3-ai 0.3.x autonomy work at `Unfinished-Lair/sh3-apps`)
**Status:** Draft — for discussion before implementation
**Targets:** sh3-core `0.15.x`
**Related:** Companion to a forthcoming RFC R1-full (verb argument schema). This RFC is the minimal subset that unblocks `sh3-ai` from picking up host verbs without forcing every shard to take a runtime dependency on sh3-ai.

## Summary

Expose two privileged additions to `ShardContext.runtime`:

1. `listVerbs()` — read-only enumeration of registered verbs, gated by `verbs:list` manifest permission. Returns `{ shardId, name, summary }[]`.
2. `runVerb(shardId, name, args, opts)` — programmatic verb dispatch, gated by `verbs:run` manifest permission. Resolves with the verb's return value (or rejects on error).

Both are flattened wrappers over sh3-core's existing per-shard verb registry. Implementation is small (~50 lines + permission gates).

## Motivation

`sh3-ai` (the shard that owns the `ai` shell mode + `AiProvider` contribution point) is becoming an autonomous action surface — the user types a prompt, the LLM picks tools from a catalog and runs them through provider-native tool-call APIs. The natural catalog is "every verb every shard has registered." Without an introspection API, `sh3-ai` either (a) sees nothing and is useless, or (b) requires every shard to register itself to a `sh3-ai`-owned contribution point — which forces a viral type-dependency on `sh3-ai` for any shard that wants to be AI-callable.

A 30-line read-only API on `ctx.runtime` removes that coupling entirely. Every verb becomes AI-discoverable by default; shards never depend on `sh3-ai`.

## Proposal

```ts
interface RuntimeApi {
  /**
   * Read-only snapshot of all registered verbs across all active shards.
   * Returns `[]` when caller's manifest does not declare `verbs:list`.
   * Order is undefined; consumers should not rely on it.
   */
  listVerbs(): Array<{
    shardId: string;
    name: string;
    summary: string | undefined;
  }>;

  /**
   * Dispatch a verb programmatically. Resolves with the verb's return
   * value; rejects on dispatcher error or verb-thrown error. Callers
   * without `verbs:run` permission get a synchronous reject.
   *
   * `args` mirrors the terminal-side string array. Higher-fidelity
   * structured dispatch is a future RFC (depends on R1-full schemas).
   */
  runVerb(
    shardId: string,
    name: string,
    args: string[],
    opts?: { signal?: AbortSignal },
  ): Promise<unknown>;
}

interface ShardContext {
  // ...existing fields...
  runtime: RuntimeApi;
}
```

### Permissions

Two manifest permissions:

- `verbs:list` — without it, `listVerbs()` returns `[]` silently.
- `verbs:run` — without it, `runVerb(...)` rejects with a clear error (`'verbs:run permission required'`).

Both are privileged because verbs can be sensitive (e.g. `internal:dump-token`). Only shards that need cross-shard reflection or dispatch should declare them. sh3-ai declares both.

### Implementation sketch

sh3-core already maintains verbs per active shard in (likely) `shards/activate.svelte.ts`. Both methods walk the active-shards map; `listVerbs()` is a flat snapshot, `runVerb()` resolves the target and invokes its existing `run()` with a synthesized verb-context.

```ts
function listVerbs() {
  if (!callerHasPermission('verbs:list')) return [];
  const out = [];
  for (const [shardId, entry] of activeShards) {
    for (const verb of entry.verbs) {
      out.push({ shardId, name: verb.name, summary: verb.summary });
    }
  }
  return out;
}

async function runVerb(shardId, name, args, opts) {
  if (!callerHasPermission('verbs:run')) {
    throw new Error('verbs:run permission required');
  }
  const entry = activeShards.get(shardId);
  if (!entry) throw new Error(`unknown shard: ${shardId}`);
  const verb = entry.verbs.find((v) => v.name === name);
  if (!verb) throw new Error(`unknown verb: ${shardId}:${name}`);
  // Synthesize a verb-context for non-terminal callers (no scrollback,
  // or a sink scrollback that captures into a buffer the caller can
  // inspect via the resolved value). Exact shape: TBD on review — but
  // a minimal { scrollback: { push: () => {} } } is enough for verbs
  // that don't depend on UI side-effects.
  const captured = []; // optional — sh3-core could return this
  const vctx = { scrollback: { push: (e) => captured.push(e) } };
  const result = await verb.run(vctx, args);
  return result;
}
```

### What this does NOT include

- Verb argument schema (separate RFC R1-full).
- Verb-registry change events (deferred — sh3-ai snapshots at activate and on prompt entry; live-update can come later).
- Output schema or first-class return-value capture (deferred to R1-full; today's verbs typically push results to scrollback rather than returning them, which limits the post-run signal `runVerb()` can hand back to the caller — see Open question below).

### Open question — synthesized verb-context shape

Today, verbs receive a `vctx` from the terminal frame (with `scrollback`, possibly more). For programmatic dispatch from another shard, sh3-core needs to synthesize one. Two options:

1. **Capturing scrollback** — sh3-core returns the captured scrollback alongside the verb's return value, so the caller can render or inspect it. Most flexible.
2. **Sink scrollback** — pass a no-op scrollback; rely on the verb's return value alone. Simpler but loses output for verbs that only push to scrollback.

Recommend option 1 — return `{ result, scrollback: ScrollbackEntry[] }` so consumers like sh3-ai can render the captured output back into their own scrollback. Open for review.

## Compatibility

Additive. No existing API changes. Shards without the permissions see `[]` from `listVerbs()` and a rejection from `runVerb()`. New shards adopting `listVerbs()` are forward-compatible with R1-full (the returned objects gain a `schema?` field when R1-full lands).

## Implementation cost estimate

~50 lines in sh3-core total: methods on the ctx-builder, two permission checks, the iteration for `listVerbs()`, and the synthesized-verb-context glue for `runVerb()`. Two unit tests: empty-permission case + populated case for each method. Plus integration test exercising a programmatic dispatch end-to-end.
