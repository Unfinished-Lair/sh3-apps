<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';
  import AccentPairRow from './AccentPairRow.svelte';
  import SemanticRow from './SemanticRow.svelte';

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
    { token: 'shell-bg',             label: 'Background' },
    { token: 'shell-bg-elevated',    label: 'Elevated' },
    { token: 'shell-bg-sunken',      label: 'Sunken' },
    { token: 'shell-input-bg',       label: 'Input' },
    { token: 'shell-border',         label: 'Border' },
    { token: 'shell-border-strong',  label: 'Border Strong' },
  ];

  const FOREGROUNDS: { token: ThemeToken; label: string }[] = [
    { token: 'shell-fg',         label: 'Text' },
    { token: 'shell-fg-muted',   label: 'Text Muted' },
    { token: 'shell-fg-subtle',  label: 'Text Subtle' },
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
        value={resolved['shell-accent-muted'] ?? '#000000'}
        {disabled}
        onchange={(e) => handleChange('shell-accent-muted', e.currentTarget.value)}
      />
      <span class="swatch-label">Accent Muted</span>
    </label>
  </div>

  <div class="group">
    <div class="group-title">Semantic</div>
    <div class="semantic-rows">
      <SemanticRow
        {theme} {state} {disabled}
        surfaceToken="shell-error"
        fgOnToken="shell-fg-on-error"
        label="Error"
      />
      <SemanticRow
        {theme} {state} {disabled}
        surfaceToken="shell-warning"
        fgOnToken="shell-fg-on-warning"
        label="Warning"
      />
      <SemanticRow
        {theme} {state} {disabled}
        surfaceToken="shell-success"
        fgOnToken="shell-fg-on-success"
        label="Success"
      />
    </div>
  </div>
</div>

<style>
  .section {
    background: var(--shell-bg-elevated);
    border-radius: var(--shell-radius-md, 6px);
    padding: var(--shell-pad-lg, 12px);
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    margin-bottom: var(--shell-pad-md, 8px);
  }
  .group {
    margin-bottom: var(--shell-pad-lg, 12px);
  }
  .group:last-child {
    margin-bottom: 0;
  }
  .group-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    margin-bottom: var(--shell-pad-sm, 4px);
  }
  .rows {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--shell-pad-sm, 4px) var(--shell-pad-md, 8px);
  }
  .swatch-row {
    display: flex;
    align-items: center;
    gap: var(--shell-pad-sm, 4px);
    cursor: pointer;
  }
  .swatch-row input[type="color"] {
    width: 26px;
    height: 22px;
    border: 1px solid var(--shell-border);
    border-radius: var(--shell-radius-sm, 3px);
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
    color: var(--shell-fg-muted);
  }
  .accent-muted-row {
    margin-top: var(--shell-pad-sm, 4px);
  }
  .semantic-rows {
    display: flex;
    flex-direction: column;
    gap: var(--shell-pad-sm, 4px);
  }
</style>
