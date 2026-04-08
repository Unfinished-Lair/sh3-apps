<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';

  let {
    theme,
    state,
    disabled,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
  } = $props();

  const COLOR_TOKENS: { token: ThemeToken; label: string }[] = [
    { token: 'shell-accent', label: 'Accent' },
    { token: 'shell-accent-muted', label: 'Accent Muted' },
    { token: 'shell-bg', label: 'Background' },
    { token: 'shell-bg-elevated', label: 'Elevated' },
    { token: 'shell-bg-sunken', label: 'Sunken' },
    { token: 'shell-input-bg', label: 'Input' },
    { token: 'shell-border', label: 'Border' },
    { token: 'shell-border-strong', label: 'Border Strong' },
    { token: 'shell-fg', label: 'Text' },
    { token: 'shell-fg-muted', label: 'Text Muted' },
    { token: 'shell-fg-subtle', label: 'Text Subtle' },
    { token: 'shell-error', label: 'Error' },
    { token: 'shell-warning', label: 'Warning' },
    { token: 'shell-success', label: 'Success' },
  ];

  const resolved = $derived(resolveTokens(theme));

  function handleChange(token: ThemeToken, value: string) {
    if (disabled) return;
    updateToken(theme.id, token, value, state);
  }
</script>

<div class="section">
  <div class="section-title">Colors</div>
  <div class="swatch-grid">
    {#each COLOR_TOKENS as { token, label }}
      <label class="swatch-item">
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
  .swatch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }
  .swatch-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .swatch-item input[type="color"] {
    width: 36px;
    height: 36px;
    border: 1px solid var(--shell-border);
    border-radius: 6px;
    padding: 2px;
    cursor: pointer;
    background: none;
  }
  .swatch-item input[type="color"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .swatch-label {
    font-size: 10px;
    color: var(--shell-fg-muted);
  }
</style>
