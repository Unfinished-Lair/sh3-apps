<script lang="ts">
  import { Select, sh3, type SelectOption } from 'sh3-core';
  import type { ProviderDef, ProviderUserState, ProviderSessionState } from '../providers/types';

  interface Props {
    def: ProviderDef;
    state: ProviderUserState;
    session: ProviderSessionState;
  }

  // Rename `state` → `user` on destructure: a local variable named `state`
  // collides with Svelte 5's `$state` rune detection when the prop is also
  // bind-mutated through nested keys, breaking the runtime with
  // `e.subscribe is not a function`.
  let { def, state: user, session }: Props = $props();
  let reveal = $state(false);

  const lastFour = $derived(
    user.apiKey.length >= 4 ? user.apiKey.slice(-4) : user.apiKey,
  );

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...user.modelChain];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    user.modelChain = next;
  }

  function moveDown(i: number) {
    if (i >= user.modelChain.length - 1) return;
    const next = [...user.modelChain];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    user.modelChain = next;
  }

  function removeAt(i: number) {
    if (user.modelChain.length <= 1) return;
    user.modelChain = user.modelChain.filter((_, j) => j !== i);
  }

  let refreshing = $state(false);
  let refreshError = $state<string | null>(null);

  async function refresh() {
    if (refreshing || user.apiKey.length === 0) return;
    refreshing = true;
    refreshError = null;
    try {
      const models = await def.listModels(user.apiKey);
      session.knownModels = models;
      session.modelsLastFetchedAt = Date.now();
    } catch (err) {
      refreshError = err instanceof Error ? err.message : String(err);
    } finally {
      refreshing = false;
    }
  }

  const lastRefreshed = $derived(
    session.modelsLastFetchedAt == null
      ? 'never'
      : new Date(session.modelsLastFetchedAt).toLocaleTimeString(),
  );

  const addableOptions = $derived<SelectOption[]>(
    session.knownModels
      .filter((m) => !user.modelChain.includes(m.id))
      .map((m) => ({ value: m.id, label: m.id })),
  );

  function onPickModel(next: string | string[]) {
    if (typeof next !== 'string' || !next) return;
    if (user.modelChain.includes(next)) return;
    user.modelChain = [...user.modelChain, next];
  }

  const temperatureDisplay = $derived(
    user.temperature == null ? '' : String(user.temperature),
  );
  const maxOutputTokensDisplay = $derived(
    user.maxOutputTokens == null ? '' : String(user.maxOutputTokens),
  );

  function onTemperatureChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw.trim() === '') {
      user.temperature = null;
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n)) user.temperature = n;
  }

  function onMaxOutputTokensChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw.trim() === '') {
      user.maxOutputTokens = null;
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) user.maxOutputTokens = Math.floor(n);
  }

  // Cross-shard deep-link to sh3-ai's AI Defaults view (where the shared
  // system instruction lives). View id is sh3-ai's contract — it's a
  // registered standalone view, so opening by id via sh3.float works
  // without a runtime dep.
  function openAiDefaults() {
    sh3.float.open('ai:defaults', {
      title: 'AI Defaults',
      size: { w: 520, h: 520 },
    });
  }
</script>

<section class="provider-settings">
  <h2>{def.label} API key</h2>
  <p class="note">{def.copy.apiKeyHelp}</p>

  <label>
    <span class="visually-hidden">API key</span>
    <input
      type={reveal ? 'text' : 'password'}
      bind:value={user.apiKey}
      placeholder={def.copy.apiKeyPlaceholder}
      autocomplete="off"
      spellcheck="false"
    />
  </label>
  <button type="button" onclick={() => (reveal = !reveal)}>
    {reveal ? 'Hide' : 'Show'}
  </button>

  <p class="status">
    {#if user.apiKey.length === 0}
      No key set.
    {:else}
      Key set (last 4: …{lastFour}).
    {/if}
  </p>

  {#if def.copy.apiKeyTestHint}
    <p class="help">{def.copy.apiKeyTestHint}</p>
  {/if}

  <hr />

  <h2>Models</h2>
  <p class="note">Tried in order. The first one that succeeds answers the prompt.</p>

  <ol class="chain">
    {#each user.modelChain as modelId, i (modelId)}
      <li>
        <span class="model-id">{modelId}</span>
        <button type="button" onclick={() => moveUp(i)} disabled={i === 0} aria-label="Move up">↑</button>
        <button
          type="button"
          onclick={() => moveDown(i)}
          disabled={i === user.modelChain.length - 1}
          aria-label="Move down"
        >↓</button>
        <button
          type="button"
          onclick={() => removeAt(i)}
          disabled={user.modelChain.length <= 1}
          aria-label="Remove"
        >×</button>
      </li>
    {/each}
  </ol>

  <div class="add-row">
    <Select
      value=""
      options={addableOptions}
      placeholder={addableOptions.length === 0 ? 'Refresh to load models' : 'Add a model…'}
      disabled={addableOptions.length === 0}
      onchange={onPickModel}
    />
  </div>

  <div class="refresh-row">
    <button
      type="button"
      onclick={refresh}
      disabled={refreshing || user.apiKey.length === 0}
    >
      {refreshing ? 'Refreshing…' : 'Refresh list'}
    </button>
    <span class="refresh-meta">
      Last refreshed: {lastRefreshed}
      {#if session.knownModels.length > 0}
        ({session.knownModels.length} models)
      {/if}
    </span>
  </div>
  {#if refreshError}
    <p class="refresh-error">Refresh failed: {refreshError}</p>
  {/if}

  <hr />

  <h2>Generation</h2>
  <p class="note">
    Steer how the model responds. All fields optional. The system instruction is shared
    across providers — edit it in
    <button type="button" class="link" onclick={openAiDefaults}>AI Defaults</button>.
  </p>

  <label class="field">
    <span class="field-label">Temperature</span>
    <input
      type="number"
      min="0"
      max="2"
      step="0.1"
      value={temperatureDisplay}
      oninput={onTemperatureChange}
      placeholder="(API default)"
    />
    <span class="help">Blank = use API default. Lower is more deterministic.</span>
  </label>

  <label class="field">
    <span class="field-label">Max output tokens</span>
    <input
      type="number"
      min="1"
      step="1"
      value={maxOutputTokensDisplay}
      oninput={onMaxOutputTokensChange}
      placeholder="(API default)"
    />
    <span class="help">Blank = use API default.</span>
  </label>
</section>

<style>
  .provider-settings {
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 36rem;
  }
  .note,
  .status,
  .help {
    margin: 0;
    color: var(--sh3-fg-muted, inherit);
    font-size: 0.9em;
  }
  input {
    width: 100%;
    padding: 0.4rem 0.5rem;
    font: inherit;
  }
  button {
    align-self: flex-start;
    font: inherit;
    cursor: pointer;
  }
  button.link {
    background: none;
    border: none;
    color: var(--sh3-accent, #4a90e2);
    padding: 0;
    cursor: pointer;
    text-decoration: underline;
    font: inherit;
    align-self: auto;
    display: inline;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  hr {
    border: 0;
    border-top: 1px solid var(--sh3-border, rgba(127, 127, 127, 0.3));
    margin: 0.5rem 0;
  }
  .chain {
    list-style: decimal inside;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .chain li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .model-id {
    flex: 1;
    font-family: var(--sh3-mono, ui-monospace, monospace);
    font-size: 0.95em;
  }
  .refresh-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .refresh-meta {
    color: var(--sh3-fg-muted, inherit);
    font-size: 0.85em;
  }
  .refresh-error {
    margin: 0;
    color: var(--sh3-error, #c33);
    font-size: 0.85em;
  }
  .add-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .add-row > :global(*) {
    flex: 1;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .field-label {
    font-size: 0.9em;
    color: var(--sh3-fg-muted, inherit);
  }
</style>
