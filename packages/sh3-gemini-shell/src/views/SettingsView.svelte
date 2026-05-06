<script lang="ts">
  import { Select, type SelectOption } from 'sh3-core';
  import { listModels, type ModelInfo } from '../gemini-client';

  interface Props {
    state: {
      apiKey: string;
      modelChain: string[];
      systemInstruction: string;
      temperature: number | null;
      maxOutputTokens: number | null;
    };
    session: { knownModels: ModelInfo[]; modelsLastFetchedAt: number | null };
  }

  let { state: gemini, session }: Props = $props();
  let reveal = $state(false);

  const lastFour = $derived(
    gemini.apiKey.length >= 4 ? gemini.apiKey.slice(-4) : gemini.apiKey,
  );

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...gemini.modelChain];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    gemini.modelChain = next;
  }

  function moveDown(i: number) {
    if (i >= gemini.modelChain.length - 1) return;
    const next = [...gemini.modelChain];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    gemini.modelChain = next;
  }

  function removeAt(i: number) {
    if (gemini.modelChain.length <= 1) return;
    gemini.modelChain = gemini.modelChain.filter((_, j) => j !== i);
  }

  let refreshing = $state(false);
  let refreshError = $state<string | null>(null);

  async function refresh() {
    if (refreshing || gemini.apiKey.length === 0) return;
    refreshing = true;
    refreshError = null;
    try {
      const models = await listModels(gemini.apiKey);
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
      .filter((m) => !gemini.modelChain.includes(m.id))
      .map((m) => ({ value: m.id, label: m.id })),
  );

  function onPickModel(next: string | string[]) {
    if (typeof next !== 'string' || !next) return;
    if (gemini.modelChain.includes(next)) return;
    gemini.modelChain = [...gemini.modelChain, next];
  }

  const temperatureDisplay = $derived(
    gemini.temperature == null ? '' : String(gemini.temperature),
  );
  const maxOutputTokensDisplay = $derived(
    gemini.maxOutputTokens == null ? '' : String(gemini.maxOutputTokens),
  );

  function onTemperatureChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw.trim() === '') {
      gemini.temperature = null;
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n)) gemini.temperature = n;
  }

  function onMaxOutputTokensChange(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw.trim() === '') {
      gemini.maxOutputTokens = null;
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) gemini.maxOutputTokens = Math.floor(n);
  }
</script>

<section class="gemini-settings">
  <h2>Gemini API key</h2>
  <p class="note">
    Stored locally in your user zone. Used by the <code>ai</code> shell mode and
    <code>ai:ask</code> verb to call Google's Generative Language API.
  </p>

  <label>
    <span class="visually-hidden">API key</span>
    <input
      type={reveal ? 'text' : 'password'}
      bind:value={gemini.apiKey}
      placeholder="paste your Gemini API key"
      autocomplete="off"
      spellcheck="false"
    />
  </label>
  <button type="button" onclick={() => (reveal = !reveal)}>
    {reveal ? 'Hide' : 'Show'}
  </button>

  <p class="status">
    {#if gemini.apiKey.length === 0}
      No key set.
    {:else}
      Key set (last 4: …{lastFour}).
    {/if}
  </p>

  <p class="help">
    Run <code>ai:ask hello</code> in the shell to test.
  </p>

  <hr />

  <h2>Models</h2>
  <p class="note">Tried in order. The first one that succeeds answers the prompt.</p>

  <ol class="chain">
    {#each gemini.modelChain as modelId, i (modelId)}
      <li>
        <span class="model-id">{modelId}</span>
        <button type="button" onclick={() => moveUp(i)} disabled={i === 0} aria-label="Move up">↑</button>
        <button
          type="button"
          onclick={() => moveDown(i)}
          disabled={i === gemini.modelChain.length - 1}
          aria-label="Move down"
        >↓</button>
        <button
          type="button"
          onclick={() => removeAt(i)}
          disabled={gemini.modelChain.length <= 1}
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
      disabled={refreshing || gemini.apiKey.length === 0}
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
  <p class="note">Steer how the model responds. All fields optional.</p>

  <label class="field">
    <span class="field-label">System instruction</span>
    <textarea
      bind:value={gemini.systemInstruction}
      placeholder="Optional. Steer model behavior — e.g., 'You are a concise assistant. Refuse to invent tool calls.'"
      rows="4"
      spellcheck="false"
    ></textarea>
  </label>

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
  .gemini-settings {
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
    color: var(--shell-fg-muted, inherit);
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
  code {
    font-family: var(--shell-mono, ui-monospace, monospace);
    font-size: 0.95em;
  }
  hr {
    border: 0;
    border-top: 1px solid var(--shell-border, rgba(127, 127, 127, 0.3));
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
    font-family: var(--shell-mono, ui-monospace, monospace);
    font-size: 0.95em;
  }
  .refresh-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .refresh-meta {
    color: var(--shell-fg-muted, inherit);
    font-size: 0.85em;
  }
  .refresh-error {
    margin: 0;
    color: var(--shell-error, #c33);
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
    color: var(--shell-fg-muted, inherit);
  }
  textarea {
    width: 100%;
    padding: 0.4rem 0.5rem;
    font: inherit;
    font-family: var(--shell-mono, ui-monospace, monospace);
    resize: vertical;
  }
</style>
