# sh3-llm-providers changelog

## 0.1.3 — 2026-05-09 — Streaming idle watchdog replaces hard 60s overall cap

Both the Gemini and DeepSeek streaming clients used to compose a fixed
`AbortSignal.timeout(60_000)` on top of the caller-supplied signal.
Long-thinking turns that produced output in bursts often blew up
mid-stream with `BodyStreamBuffer was aborted` even though the request
was perfectly healthy.

- New shared `makeIdleTimer(external, idleTimeoutMs)` helper
  (`src/providers/idle-timer.ts`). When `idleTimeoutMs` is `0` /
  `undefined` it's a passthrough: the returned signal is the caller's
  signal and `bump`/`clear` are no-ops. When set, it composes the
  external signal with an internal `AbortController` whose timer fires
  after that many ms of inactivity.
- `chatStream` in both providers now reads `options?.idleTimeoutMs` and
  calls `idle.bump()` per SSE event so the timer resets on every token,
  reasoning chunk, or tool-call delta.
- The 30s `AbortSignal.timeout` on key validation / non-streaming
  endpoints is unchanged — it covers the API handshake, not chat
  duration.

The setting itself is owned by sh3-ai (`state.user.idleTimeoutMs`,
default 60_000) and forwarded through `ChatOptions` on every `chat()`
call.

## 0.1.1 — 2026-05-08 — SettingsView: rename `state` prop on destructure

Provider settings views failed to load with `e.subscribe is not a function`
because the parametric `SettingsView.svelte` destructured the bindable
`state` prop using the same local name. In Svelte 5, a local variable named
`state` collides with `$state` rune detection when the prop is also
bind-mutated through nested keys (e.g. `bind:value={state.apiKey}`).
Rename to `user` on destructure; matches the pattern the old per-provider
shells already used (`let { state: gemini } = $props()`).

## 0.1.0 — 2026-05-08 — Initial release; consolidates DeepSeek + Gemini

Single shard (`manifest.id: 'llm-providers'`) that registers both DeepSeek and
Gemini as `sh3-ai.provider` contributions plus per-provider settings views,
deduping the two near-identical predecessor packages.

### Replaces

- **`sh3-deepseek-shell`** (last version 0.2.5) — deleted; this shard
  registers `deepseek` provider + `deepseek:settings` view with the same ids,
  so deep links and palette muscle memory carry over.
- **`sh3-gemini-shell`** (last version 0.6.2) — deleted; this shard registers
  `gemini` provider + `gemini:settings` view with the same ids.

### Highlights

- **Single shard, N providers.** `providers/registry.ts` is the source of
  truth; adding a third provider is one folder + one entry.
- **Parametric `SettingsView.svelte`.** Both providers share one view
  (~250 lines) instead of two near-identical copies (~340 lines each).
- **Shared utilities.** `redact.ts`, `tool-name-codec.ts`, `error-envelope.ts`,
  and a generic SSE event splitter (`sse.ts`) live under `src/shared/` and
  back both clients.
- **System instruction lives in sh3-ai.** Per the sh3-ai 0.5.0 promotion,
  providers no longer carry their own per-provider system-instruction state;
  the SettingsView links out to the new "AI Defaults" view.
- **DeepSeek/Gemini wire formats unchanged.** Tool-call round-trip, error
  redaction, the Gemini SSE Content-Type fallback — all preserved verbatim.
  Existing API keys keep working under the same provider ids.

### Peer dependencies

- `sh3-ai ^0.5.0` (required for `ChatOptions.systemInstruction`)
- `sh3-core ^0.15.0`
