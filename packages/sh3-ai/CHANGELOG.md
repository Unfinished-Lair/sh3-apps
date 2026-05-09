# sh3-ai changelog

## 0.5.6 — 2026-05-09 — Palette actions in the AI catalog

Currently-active palette actions now appear as tools in the AI catalog,
refreshed per turn so the LLM sees the same context-filtered set the user
does. Action ids are mapped to tool names by rewriting the leading `:` to
`.` (`sh3-ai:open-config.defaults` → `sh3-ai.open-config.defaults`),
which matches the `*.*.*` glob used by the `everything` scope.

- New `actionsToTools` adapter (`src/ai/catalog/action-adapter.ts`) wired
  into `buildCatalog()` against `sh3.actions.listActive()` +
  `ctx.runAction(id, opts)` (sh3-core 0.16 surface).
- `Tool['source']` gains `'action'`; `ai:catalog` formats matching entries
  as `(action)` without further plumbing.
- `assembleCatalog` accepts an optional `actionTools` bucket; precedence
  is verb > contribution > action on name collision.
- The adapter defensively skips `submenu: true` and `aiInvocable: false`
  descriptors. sh3-core 0.16's `listActive()` already filters submenu
  parents (no `run`); the `aiInvocable` opt-out is a forward-compatible
  hook for an upstream addition that hasn't landed yet.
- Tool names with more than 3 dot-segments emit a `console.warn` — they
  fall outside the everything scope's glob until the matcher relaxes or
  the action id is shortened.

## 0.5.2 — 2026-05-08 — AI Defaults: rename `state` prop on destructure

The `Defaults.svelte` view destructured the bindable `state` prop with the
same local name. In Svelte 5, a local variable named `state` collides with
`$state` rune detection when the prop is also bind-mutated through nested
keys, breaking the runtime with `e.subscribe is not a function` when the
view loaded. Rename to `user` on destructure; matches the pattern the old
per-provider shells already used (`let { state: gemini } = $props()`).

## 0.5.1 — 2026-05-08 — AI Defaults radios use shell-base-radio

The titleStrategy `<input type="radio">` elements in the AI Defaults view now
carry the `shell-base-radio` class so they pick up sh3-core's themed styling
(accent fill, focus ring, disabled state) from `primitives/base.css`.

## 0.5.0 — 2026-05-08 — System instruction promoted; AI Defaults view; ai:config retired

**Headline:** the system instruction is now an sh3-ai-owned setting, shared
across every provider, edited from a new "AI Defaults" view. The `ai:config`
verb is gone — its only knob (`titleStrategy`) lives in the new view too.

### Breaking

- **`ChatOptions` gains `systemInstruction?: string`.** The dispatcher reads
  sh3-ai's user state and forwards it on every `provider.chat()` call.
  Providers must read `options.systemInstruction` instead of carrying their
  own per-provider state slot. Providers older than sh3-ai 0.5.0 (DeepSeek
  ≤ 0.2.5, Gemini ≤ 0.6.2) keep working with sh3-ai ≤ 0.4.x but will receive
  no system message under sh3-ai 0.5.0 — bump the provider package.
- **`ai:config` verb removed.** The only setting it exposed (`titleStrategy`)
  is now editable in the AI Defaults view. No deprecation cycle; pre-release.

### New

- **AI Defaults view (`ai:defaults`).** Standalone view registered by sh3-ai
  with two fields: shared system instruction (textarea) and conversation
  title strategy (radio group, bound to the existing `state.user.titleStrategy`).
  Reachable via the palette under `AI Configuration...` → `AI Defaults`.
- **`AiModeDeps.getSystemInstruction`.** Optional getter consumed by
  `makeAiModeDescriptor`; sh3-ai's shard wires it from
  `state.user.systemInstruction`.
- **`DispatchLoopOptions.systemInstruction`.** Forwarded through every
  `provider.chat()` call inside the tool-dispatch loop.

## 0.4.11 — 2026-05-08 — Clickable scope listing

`ai:scope` (no-args) now renders as a `kind:'rich'` entry with clickable scope IDs — switching takes one click instead of typing `ai:scope <id>`. The active row's button is disabled. CLI subpaths (`clear`, `save`, `delete`, switch-by-id, errors) are unchanged. Click handler re-dispatches `ai:scope <id>`, so all the existing rotate/status logic runs unchanged.

## 0.4.10 — 2026-05-08 — LLM tool-call round-trip actually works

**Headline:** an LLM that calls a verb under the `ai` shell mode now (a) sees useful output, (b) can keep talking after a tool round, and (c) gives up cleanly when the verb fails — instead of getting `undefined`, hitting an OpenAI API rejection on round 2, or retrying in a loop.

### Fixes

- **Verb output reaches the LLM.** `verb-adapter` now folds the scrollback returned by `ctx.runVerb` into the tool result. Verbs that publish via `vctx.scrollback.push(...)` (most SH3 built-ins) used to surface as `undefined` to the model. Empty `result` values (`''`, `[]`, `{}`, `null`) also fall back to scrollback now, so verbs that return placeholder values while emitting their real output as scrollback entries work too.
- **Rich scrollback entries surface as JSON.** Anything that isn't a plain `kind:'status'` or `kind:'text'` entry — tables, lists, custom kinds emitted by sh3-core or other shards — gets JSON-stringified (minus the transient `ts` field) so the model sees structured data rather than nothing.
- **Error-level scrollback entries become tool errors.** When the verb's `result` is empty and scrollback contains a `level:'error'` status (or a `stream:'stderr'` text stream), the adapter throws — and the dispatch loop's catch turns that into a `{ error }` tool-result. The LLM treats `{ error }` as terminal; without this, error-shaped text was being read as informational and the model kept retrying.
- **OpenAI-style providers accept the second round.** `ChatOptions` gained `toolCalls` and `reasoningContent`; `ChatChunk` gained a `reasoning` variant. The dispatch loop accumulates reasoning across a round and forwards both fields on the next provider call, so providers like DeepSeek can rebuild the assistant turn that spawned the tools. Fixes the API rejections "Messages with role 'tool' must be a response to a preceding message with 'tool_calls'" and "The `reasoning_content` in the thinking mode must be passed back to the API" — the latter only on `deepseek-reasoner`.

### New exports

- `ToolCallSpec` from `sh3-ai` — the shape providers receive on `ChatOptions.toolCalls`.
- `'reasoning'` ChatChunk variant — providers emit one of these per chain-of-thought delta on reasoning models.
- `ChatOptions.reasoningContent` — the prior round's reasoning, to be echoed back on the assistant turn.

### Companion provider work

- `sh3-deepseek-shell` 0.2.5 reattaches `tool_calls` (and `reasoning_content` on `deepseek-reasoner`) when building the request body. Earlier `sh3-deepseek-shell` versions are not compatible with sh3-ai 0.4.5+ — the peer dep is now `^0.4.5`.
- Gemini does not need this treatment (its `functionCall`/`functionResponse` parts work without explicit re-attachment).

## 0.4.6 — 2026-05-08 — AI Configuration palette submenu

Provider shards now register settings entries under a shared `AI Configuration...` submenu instead of owning their own top-level palette actions.

- New contribution point: `SH3_AI_CONFIG_MENU_CONTRIBUTION` (`'sh3-ai.configMenu'`). Shards register `AiConfigMenuItem { id, label, run() }` against it; sh3-ai reconciles the children dynamically as registrations come and go.
- Parent palette label changed from `Open Config: AI` to `AI Configuration...`.
- The built-in `Conversations` entry is unchanged; it lives under the same submenu.
- Companion: `sh3-deepseek-shell` 0.2.5 and `sh3-gemini-shell` 0.6.1 drop their own `Open Settings: …` actions and register against the new contribution point.

## 0.4.0 — 2026-05-07 — Durable conversations + browser view

**Headline:** conversations now persist across reloads via `ctx.documents()`, and a dockable Conversations browser (palette-launchable as `AI Conversations`) lets users juggle multiple conversations.

### New capabilities

- **Conversation persistence**: every conversation is autosaved as `conversations/{id}.json` in the shard's document namespace. Reloading the host re-binds the previously active conversation, restoring the original provider + model when both are still registered.
- **Conversations browser view** (`ai:conversations`): standalone view, summoned via the Command Palette under `Open Config: AI > Conversations`. Opens as a float (matching the gemini/deepseek settings UX) and is dockable from there. Lists every conversation sorted by recency; per-row activate / rename / delete; `+ New` button. Live-updates via `handle.watch()` so cross-tab/window edits stay in sync.
- **Lifecycle rotation**: `ai:reset` now starts a fresh conversation (the old one stays browseable). Provider switches and scope switches rotate the same way — no more silent history loss.
- **Auto-titling**: first user prompt becomes the conversation title (truncated to 60 chars). Configurable to `llm-summarize` via `ai:config titleStrategy llm-summarize` for higher-quality titles at the cost of one extra API call per new conversation.

### New verbs

- `ai:config titleStrategy <first-message|llm-summarize>` — set the title strategy
- `ai:reset` — rewired to rotate (was: clear in place)

All other CRUD (new / open / rename / delete) is driven through the view, not verbs. The browser is reached via the Command Palette (`Open Config: AI > Conversations`).

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
