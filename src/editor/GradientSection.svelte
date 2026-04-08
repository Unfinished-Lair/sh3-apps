<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, clearToken, resolveTokens } from '../theme-manager';
  import GradientPicker from './GradientPicker.svelte';

  let {
    theme,
    state,
    disabled,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
  } = $props();

  const SURFACES: { token: ThemeToken; label: string }[] = [
    { token: 'shell-grad-bg', label: 'Background' },
    { token: 'shell-grad-bg-elevated', label: 'Elevated' },
    { token: 'shell-grad-bg-sunken', label: 'Sunken' },
  ];

  const resolved = $derived(resolveTokens(theme));

  function isEnabled(token: ThemeToken): boolean {
    return !!theme.tokens[token];
  }

  function toggleGradient(token: ThemeToken) {
    if (disabled) return;
    if (isEnabled(token)) {
      clearToken(theme.id, token, state);
    } else {
      const flatToken = token.replace('shell-grad-', 'shell-') as ThemeToken;
      const base = resolved[flatToken] ?? '#1a1b1e';
      updateToken(theme.id, token, `linear-gradient(180deg, ${base}, ${base})`, state);
    }
  }

  function handleGradientChange(token: ThemeToken, css: string) {
    if (disabled) return;
    updateToken(theme.id, token, css, state);
  }
</script>

<div class="section">
  <div class="section-title">Gradients</div>
  {#each SURFACES as { token, label }}
    <div class="surface-block">
      <div class="surface-header">
        <label class="toggle-label">
          <input
            type="checkbox"
            checked={isEnabled(token)}
            {disabled}
            onchange={() => toggleGradient(token)}
          />
          {label}
        </label>
      </div>
      {#if isEnabled(token)}
        <GradientPicker
          value={theme.tokens[token] ?? ''}
          {disabled}
          onchange={(css) => handleGradientChange(token, css)}
        />
      {/if}
    </div>
  {/each}
</div>

<style>
  .section {
    background: var(--shell-bg-elevated);
    border-radius: 6px;
    padding: 12px;
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--shell-fg-subtle);
    margin-bottom: 8px;
  }
  .surface-block {
    margin-bottom: 10px;
    padding: 8px;
    background: var(--shell-bg);
    border-radius: 4px;
  }
  .surface-block:last-child { margin-bottom: 0; }
  .surface-header {
    margin-bottom: 6px;
  }
  .toggle-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--shell-fg);
    cursor: pointer;
  }
  .toggle-label input[type="checkbox"] {
    cursor: pointer;
  }
</style>
