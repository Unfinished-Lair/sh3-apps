# RFC — Verb argument schema (R1-full)

**Author:** @Salepate (sh3-ai 0.3.x autonomy work)
**Status:** Draft — for discussion after R1-minimal lands
**Targets:** sh3-core `0.16.x` or later
**Related:** Builds on R1-minimal (`ctx.runtime.listVerbs()`). Also relates to the forthcoming sh3-ai contribution-tool wrapper.

## Summary

Add an optional `schema` field to verb registration so `listVerbs()` can return typed input/output schemas. Backwards-compatible: verbs without `schema` keep working with the current `string[]` args. When present, the verb's `run` receives parsed structured args alongside the positional `args[]` array via an optional third parameter.

## Motivation

Today verbs receive `args: string[]` — whatever the user typed in the terminal, split on whitespace. That is fine for terminal-flavored use, but two consumers want richer typing:

1. **`sh3-ai`'s tool-call dispatcher.** LLMs call tools with structured arguments (per their tool-call API). Without a schema, `sh3-ai` falls back to a single-string `args` field that the LLM fills with whitespace-joined positional args, then sh3-ai splits on whitespace before invoking the verb. Workable but degrades on multi-arg verbs and any non-string types.
2. **`sh3-editor`'s graph view (Phase 2 of sh3-ai).** Graph nodes need typed input ports and (ideally) output ports. The same `schema` field powers both.

R1-minimal exposed `listVerbs()` returning `{ shardId, name, summary }`. R1-full extends each entry with an optional `schema` field.

## Proposal

```ts
ctx.registerVerb({
  name: 'backup',
  summary: 'Back up a path to R2 storage',
  schema: {                                          // ← new, optional
    input: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
    output: { type: 'object', properties: { bytes: { type: 'number' }, key: { type: 'string' } } },
  },
  async run(vctx, args, structuredArgs?: { path: string }) {
    const path = structuredArgs?.path ?? args[0];
    // ...
  },
});
```

### Semantics

- `schema.input` is **JSON Schema** (the format every modern LLM tool-call API consumes natively — Gemini `functionDeclarations`, OpenAI/DeepSeek/Anthropic `tools`). No new schema language.
- `schema.output` is optional metadata — not used to validate the return value at runtime; consumed by graph-view-like surfaces that want to wire output ports.
- `structuredArgs` is the third parameter on `run`. When the caller dispatches with structured args (not yet possible from terminal input — needs a separate "structured dispatch" entry point on ctx, which is a future RFC), it's populated; for terminal dispatch, it's `undefined` and the verb falls back to `args[]`.
- `listVerbs()` returns `schema` verbatim when present.

### Compatibility

Fully additive. Verbs without `schema` keep their current behavior. Existing `run(vctx, args)` signatures work because the third parameter is optional.

### Out of scope

- A new "structured dispatch" entry point — that's a future RFC for whatever consumer needs to dispatch verbs with already-structured args (sh3-ai is one; graph executors will be others).
- Runtime validation of args against the schema — verb authors validate themselves; sh3-ai pre-validates LLM-provided args against the schema before dispatch.
