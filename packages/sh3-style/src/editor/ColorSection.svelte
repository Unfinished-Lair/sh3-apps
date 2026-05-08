<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';
  import AccentPairRow from './AccentPairRow.svelte';
  import SemanticRow from './SemanticRow.svelte';
  import ContrastMatrix from './ContrastMatrix.svelte';

  let {
    theme,
    state,
    disabled,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
  } = $props();

  const resolved = $derived(resolveTokens(theme));

  const SURFACES: { token: ThemeToken; label: string }[] = [
    { token: 'sh3-bg',             label: 'Background' },
    { token: 'sh3-bg-elevated',    label: 'Elevated' },
    { token: 'sh3-bg-sunken',      label: 'Sunken' },
    { token: 'sh3-input-bg',       label: 'Input' },
    { token: 'sh3-border',         label: 'Border' },
    { token: 'sh3-border-strong',  label: 'Border Strong' },
  ];

  const FOREGROUNDS: { token: ThemeToken; label: string }[] = [
    { token: 'sh3-fg',         label: 'Text' },
    { token: 'sh3-fg-muted',   label: 'Text Muted' },
    { token: 'sh3-fg-subtle',  label: 'Text Subtle' },
  ];

  function handleChange(token: ThemeToken, value: string) {
    if (disabled) return;
    updateToken(theme.id, token, value, state);
  }
</script>

<div class="section">
  <div class="section-title">Colors</div>

  <div class="group">
    <div class="group-title">Surfaces</div>
    <div class="rows">
      {#each SURFACES as { token, label }}
        <label class="swatch-row">
          <input
            type="color"
            value={resolved[token] ?? '#000000'}
            {disabled}
            onchange={(e) => handleChange(token, e.currentTarget.value)}
          />
          <span class="swatch-label">{label}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="group">
    <div class="group-title">Foregrounds</div>
    <div class="rows">
      {#each FOREGROUNDS as { token, label }}
        <label class="swatch-row">
          <input
            type="color"
            value={resolved[token] ?? '#000000'}
            {disabled}
            onchange={(e) => handleChange(token, e.currentTarget.value)}
          />
          <span class="swatch-label">{label}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="group">
    <div class="group-title">Accent</div>
    <AccentPairRow {theme} {state} {disabled} />
    <label class="swatch-row accent-muted-row">
      <input
        type="color"
        value={resolved['sh3-accent-muted'] ?? '#000000'}
        {disabled}
        onchange={(e) => handleChange('sh3-accent-muted', e.currentTarget.value)}
      />
      <span class="swatch-label">Accent Muted</span>
    </label>
  </div>

  <div class="group">
    <div class="group-title">Semantic</div>
    <div class="semantic-rows">
      <SemanticRow
        {theme} {state} {disabled}
        surfaceToken="sh3-error"
        fgOnToken="sh3-fg-on-error"
        label="Error"
      />
      <SemanticRow
        {theme} {state} {disabled}
        surfaceToken="sh3-warning"
        fgOnToken="sh3-fg-on-warning"
        label="Warning"
      />
      <SemanticRow
        {theme} {state} {disabled}
        surfaceToken="sh3-success"
        fgOnToken="sh3-fg-on-success"
        label="Success"
      />
    </div>
  </div>

  <div class="group">
    <div class="group-title">Contrast</div>
    <ContrastMatrix {theme} />
  </div>
</div>

<style>
  .section {
    background: var(--sh3-bg-elevated);
    border-radius: var(--sh3-radius-md, 6px);
    padding: var(--sh3-pad-lg, 12px);
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--sh3-fg-subtle);
    margin-bottom: var(--sh3-pad-md, 8px);
  }
  .group {
    margin-bottom: var(--sh3-pad-lg, 12px);
  }
  .group:last-child {
    margin-bottom: 0;
  }
  .group-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--sh3-fg-subtle);
    margin-bottom: var(--sh3-pad-sm, 4px);
  }
  .rows {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--sh3-pad-sm, 4px) var(--sh3-pad-md, 8px);
  }
  .swatch-row {
    display: flex;
    align-items: center;
    gap: var(--sh3-pad-sm, 4px);
    cursor: pointer;
  }
  .swatch-row input[type="color"] {
    width: 26px;
    height: 22px;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-radius-sm, 3px);
    padding: 2px;
    cursor: pointer;
    background: none;
  }
  .swatch-row input[type="color"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .swatch-label {
    font-size: 11px;
    color: var(--sh3-fg-muted);
  }
  .accent-muted-row {
    margin-top: var(--sh3-pad-sm, 4px);
  }
  .semantic-rows {
    display: flex;
    flex-direction: column;
    gap: var(--sh3-pad-sm, 4px);
  }
</style>
