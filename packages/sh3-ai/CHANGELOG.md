# sh3-ai changelog

## 0.4.0 — 2026-05-07 — Durable conversations + browser view

**Headline:** conversations now persist across reloads via `ctx.documents()`, and a dockable Conversations browser (palette-launchable as `AI Conversations`) lets users juggle multiple conversations.

### New capabilities

- **Conversation persistence**: every conversation is autosaved as `conversations/{id}.json` in the shard's document namespace. Reloading the host re-binds the previously active conversation, restoring the original provider + model when both are still registered.
- **Conversations browser view** (`ai:conversations`): standalone, dockable view summonable from the Command Palette or via the new `ai:browse` verb. Lists every conversation sorted by recency; per-row activate / rename / delete; `+ New` button. Live-updates via `handle.watch()` so cross-tab/window edits stay in sync.
- **Lifecycle rotation**: `ai:reset` now starts a fresh conversation (the old one stays browseable). Provider switches and scope switches rotate the same way — no more silent history loss.
- **Auto-titling**: first user prompt becomes the conversation title (truncated to 60 chars). Configurable to `llm-summarize` via `ai:config titleStrategy llm-summarize` for higher-quality titles at the cost of one extra API call per new conversation.

### New verbs

- `ai:browse` — open the Conversations browser into the current layout
- `ai:config titleStrategy <first-message|llm-summarize>` — set the title strategy
- `ai:reset` — rewired to rotate (was: clear in place)

All other CRUD (new / open / rename / delete) is driven through the view, not verbs.

### Default behavior

- First boot of 0.4.x with no docs: a fresh conversation is lazy-created on the first prompt. Same UX as 0.3.x for the first turn.
- `ai:reset` status text changes from `"ai: thread cleared"` to `"ai: new conversation started"`.

### Upstream

Still requires sh3-core ^0.15.0. Uses `ctx.documents({ format: 'text', extensions: ['.json'] })` and `vctx.shell.openViewInCurrentLayout(viewId)`. No new permissions required.

### Companion design

- Spec: `docs/claude-plans/sh3-ai/2026-05-07-sh3-ai-conversations-design.md`
- Plan: `docs/claude-plans/sh3-ai/2026-05-07-sh3-ai-conversations-plan.md`

## 0.3.0 — 2026-05-07 — Autonomous tool-call surface

**Headline:** the `ai` shell mode can now pilot SH3 by calling host verbs through provider-native LLM tool-calls, gated by user-authored permission scopes.

### New capabilities

- **Tool catalog**: every host verb is discovered via `ctx.listVerbs()` (sh3-core 0.15) and exposed as an LLM tool. Verbs that declare `programmatic: true` are dispatched via `ctx.runVerb()`. Verbs without a JSON Schema fall back to a single-string `args` parameter the dispatcher splits before invoking; verbs with `schema.input` get typed dispatch via `opts.structured`.
- **Permission scopes**: blacklist-authoritative + whitelist patterns; named/reusable; user-authored via `ai:scope save`. Built-ins: `sh3-ai:none` (default; chat-only), `sh3-ai:read-only` (convention-matched), `sh3-ai:everything`.
- **Tool-call dispatch loop**: streams tokens and tool calls from the active provider, evaluates each call against the active scope, dispatches verbs, feeds results back, bounded by `maxRounds` (default 16). Tool errors and denials surface as model-visible error results without breaking the loop.
- **Provider contract extension** (additive): `AiProvider.capabilities.tools`, `chat(... , { tools, toolResults })`, `ChatChunk { type: 'tool-call' }`, optional `finishReason` on `done`. Existing 4-argument `chat()` calls keep working.

### New verbs

- `ai:scope` — list / switch / clear / save / delete permission scopes
- `ai:catalog` — list / describe tools available under the active scope

### New contribution points (defined by sh3-ai)

- `sh3-ai.tool` — escape hatch for callables that aren't verbs
- `sh3-ai.scope` — optional surface for shipping reusable scopes (most users author scopes via `ai:scope save`)

### Public subpath export

`sh3-ai/contributions` — type-only entry point for shards that want to register tools without taking a runtime dependency on sh3-ai.

### Default behavior unchanged

The default scope is `sh3-ai:none` (empty whitelist). Users in `ai` mode get text-only chat — identical to 0.2.x — until they opt into a scope.

### Upstream

Requires sh3-core 0.15.0. The runtime API exposed: `ctx.listVerbs()` returns `{ shardId, name, summary, schema? }[]`; `ctx.runVerb(shardId, name, args, opts?)` returns `{ result, scrollback }` and rejects when the target verb has not opted in via `programmatic: true`. No permission gating in this version.

### Companion design and plan

- Spec: `docs/claude-plans/sh3-ai/2026-05-07-sh3-ai-autonomy-design.md`
- Plan: `docs/claude-plans/sh3-ai/2026-05-07-sh3-ai-autonomy-plan.md`
