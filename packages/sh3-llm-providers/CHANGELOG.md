# sh3-llm-providers changelog

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
