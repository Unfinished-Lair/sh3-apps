# sh3-ai changelog

## 0.8.0 — 2026-05-22 — Context-source contribution + document-browse in the AI Edit modal

### Added
- Consumes sh3-core's new `CONTEXT_SOURCE_POINT_ID` contribution point (sh3-core 0.24.0). Publisher shards register `ContextSource` descriptors against sh3-core to publish ad-hoc text / markdown / JSON context entries into the AI Edit modal's picker — no devDep on sh3-ai needed. Lifecycle is consumer-owned via the disposer returned from `ctx.contributions.register(...)`.
- AI Edit modal's context picker grows from a flat list to a three-section dropdown: FIELDS / SOURCES / DOCUMENTS. SOURCES entries are sub-grouped by descriptor `group`. The DOCUMENTS section's `» browse documents…` row opens `ctx.documentPicker` and reads the picked file via `ctx.browse.readFrom`, inferring kind from extension.
- `formatValue` now wraps `markdown` values in fenced ```` ```markdown ``` ```` blocks and `json` values in fenced ```` ```json ``` ```` blocks so the LLM sees content structure. Truncation happens inside the fence so it stays valid.
- Consumer guide at `docs/sh3-ai/context-sources.md`.

### Changed
- `ContextEntry` widened to `{ origin, originKey, label, kind, value }`. The per-entry header in the assembled prompt now reads `[<label>] (<origin>:<originKey>)`. Field-origin entries continue to behave as before, just with the `field:` prefix on the header.
- `PER_FIELD_CHAR_CAP` renamed to `PER_CONTEXT_CHAR_CAP` — value unchanged at 8000.
- `Edit.svelte` `selectedAddrs: FieldAddress[]` renamed to `selected: SelectedEntry[]` (discriminated union of field / source / document). `run()` is now async via the new `gatherContexts` helper.

### Internal
- New `assistant/gather.ts` module hosts `gatherContexts(selected, deps)`. Kept ShardContext-free for unit testing; `Edit.svelte` builds the `GatherDeps` from its own `ctx`.
- Tracks `sh3-core ^0.24.0` for `CONTEXT_SOURCE_POINT_ID` and `ContextSource`.

## 0.7.1 — 2026-05-21 — `sh3.file-handler` contribution for AI Sketch

### Added
- Registers a `sh3.file-handler` contribution for `.html` files that loads the picked file into the AI Sketch view via the shared `loadIntoSketch` helper.
- Manifest declares `documents:browse` and `documents:read` so the handler can read sketches owned by other shards.

### Changed
- `openSketchViaPicker` refactored to delegate to `loadIntoSketch`, reading through `ctx.browse.readFrom` instead of `docsStore.read`. Picker path math is unchanged.
- Tracks `sh3-core ^0.22.5` for `FileHandlerDescriptor` and `BrowseCapability.readFrom`.

## 0.5.13 — 2026-05-10 — AI Sketch open-by-path + autonomous save

`ai.sketch.show` now accepts a doc-zone `path` as an alternative to
inline `html`, letting the LLM re-open a previously-saved sketch
without round-tripping the bytes through chat. New `ai.sketch.save`
tool persists the current canvas under
`docs/<provider>/sketches/<name>.html`, so a multi-turn flow can
sketch → save → reload by name.

### Added

- `ai.sketch.show` accepts `{ path, mode? }` (mutually exclusive with
  `html`). Path is absolute under the docs root, e.g.
  `'gemini/sketches/foo.html'`; cross-provider reads are allowed.
  When `mode` is omitted, it's inferred from a `<!-- sh3:inline -->`
  marker scanned in the first ~200 chars: present ⇒ `inline`, absent
  ⇒ `isolated`. Returns `{ error: 'not-found' }` when the path is
  missing.
- `ai.sketch.save({ name, overwrite? })` writes the current snapshot
  to `<provider>/sketches/<name>.html`. Inline-mode sketches are
  prefixed with `<!-- sh3:inline -->` so reload via `ai.sketch.show`
  recovers the same mode. Refuses with `error: 'empty'` when the
  canvas is null, `error: 'exists'` when the file is present and
  `overwrite` is false. Throws when no provider is active.

### Changed

- `SaveSketchPrompt` now receives the current `mode` and embeds the
  `<!-- sh3:inline -->` marker on save when applicable, so manually
  saved sketches round-trip the same way as tool-saved ones.

## 0.5.12 — 2026-05-09 — AI Assistant + chat-mode `ai.fields.*` tools

Coalesced patch covering 0.5.10 → 0.5.12 — peer-dep bump to sh3-core
0.17, the new AI Assistant feature, and chat-mode tools that expose
controllable fields without entering assistant mode. Pair with
sh3-editor 0.13.15 (the field-provider side).

### Changed

- **Peer-dep `sh3-core` bumped to `^0.17.0`.** Migrates three call-sites
  in `shard.ts:buildCatalog`: `ctx.listVerbs` → `ctx.sh3.listVerbs`,
  `ctx.runVerb` → `ctx.sh3.runVerb`, `ctx.runAction` → `ctx.sh3.runAction`.

### Added: AI Assistant

`AI: Start Assistant` palette action attaches small **AI** badges to
every controllable field reachable in the current Sh3 instance; clicking
a badge opens a per-field rewrite float anchored to it. `AI: Stop
Assistant` tears the badges and any open float down. Stateless one-shots:
each Accept writes the field and closes; nothing is appended to the
active conversation.

- New module `assistant/`: `mode.ts` (lifecycle: start/stop, attachment
  map keyed by `{shardId, slotId, fieldId}`, rebuild on
  `ctx.sh3.fields.onChange`), `Edit.svelte` (the float view), `badge.ts`
  (DOM badge factory + injected stylesheet),
  `runOneShotStream.ts` (token-streaming twin of `runOneShot` from
  `shard.ts`).
- Float opens via `sh3.float.open('ai:assistant.edit', { anchor: badgeEl,
  dismissable: true, meta: { addr, fv } })`. Phase machine:
  `idle → streaming → validate-2pane | validate-3pane | error`. The
  3-pane fork triggers when the field value changed during the AI
  request (Accept-time concurrency check) — Original / Your edit / AI
  proposal radios with a single Accept button.
- New view `ai:assistant.edit` (non-standalone, mounted only by the
  badge-click path). New palette actions `sh3-ai:assistant.start` and
  `sh3-ai:assistant.stop` (group `AI`, `home`/`app` scope).
- Shard `deactivate()` now exists and calls `assistant.stop()` so a
  reload during an active session tears the overlay layer down cleanly.

### Added: `ai.fields.*` chat-mode tools

Three new tools surface the same controllable-field set to the chat
dispatcher; the LLM can answer "what's in my text editor right now?"
without anyone starting the assistant.

- `ai.fields.list` — `{shardId?, slotId?, kind?}` filters → JSON array
  of `FieldView` entries (DOM `element` stripped). Discovery primitive.
- `ai.fields.get` — `{shardId, slotId?, fieldId}` → `{value}`. Throws
  on unknown address (e.g. slot just unmounted).
- `ai.fields.set` — `{shardId, slotId?, fieldId, value}` → `{ok: true}`.
  Tool description warns the model to confirm intent and points at the
  AI Assistant float for prose rewrites that benefit from the
  accept/discard step this tool skips.

Wired into the catalog under `sh3-ai.tool` source. The read entries
(`ai.fields.list` / `ai.fields.get`) are added to `SCOPE_READ_ONLY`'s
whitelist alongside the existing `ai.docs.*` reads; `ai.fields.set` is
gated under `sh3-ai:everything` or a custom scope.

## 0.5.9 — 2026-05-09 — AI Sketch tool + configurable streaming idle timeout

### AI Sketch

New `ai.sketch.show` tool renders an arbitrary HTML composite into a
shared, sh3-ai-owned standalone view (`ai:sketch`). Use case: AI sketches
a UI design, the user reviews it inline, comments in chat, AI iterates.

- `mode: 'inline'` renders the HTML under the host's DOM and inherits SH3
  styles. `<style>` blocks are stripped before injection — they would
  otherwise attach globally and hijack the host layout — so inline
  sketches must use SH3 host classes / CSS variables. `mode: 'isolated'`
  renders into a sandboxed iframe with scripts disabled and is the right
  pick when the sketch needs its own stylesheet. Defaults to `inline`.
- Single shared canvas: each `ai.sketch.show` call replaces the prior
  sketch. Tool result `{ ok, viewOpen }` lets the LLM ask the user to
  open the view when it isn't visible.
- New palette actions `AI Sketch: Open` and `AI Sketch: Save…` (group
  `AI`). Both are AI-invocable as `sh3-ai.sketch.open` and
  `sh3-ai.sketch.save`.
- Save flow writes to `docs/<active-provider>/sketches/<name>.html`
  through the existing AI docs zone. The naming float prompts for a
  filesystem-safe name (default `sketch-YYYY-MM-DD-HHMM`, no colons),
  validates `^[a-zA-Z0-9._-]+$`, and confirms before overwriting.

### Streaming idle timeout

The Gemini and DeepSeek streaming clients used to compose a hard 60-second
overall `AbortSignal.timeout` on top of the caller-supplied signal — long
thinking turns blew up mid-stream with `BodyStreamBuffer was aborted`.
Replaced with a per-chunk idle watchdog (re-armed on every token,
reasoning chunk, or tool call) and exposed it as a user setting.

- `ChatOptions.idleTimeoutMs`: `0` / `undefined` disables the watchdog,
  `>0` aborts the stream if no chunk arrives within that window.
- `state.user.idleTimeoutMs` (default `60_000`) plumbed through
  `runOneShot`, `AiModeDeps.getIdleTimeoutMs`, `runChatTurn`,
  `runToolDispatch`, and `dispatchLoop`.
- AI Defaults view: new "Streaming idle timeout" range slider snapping to
  30s / 1m / 2m / 5m / 10m / No limit, with a live value label and a
  per-tick legend.

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
