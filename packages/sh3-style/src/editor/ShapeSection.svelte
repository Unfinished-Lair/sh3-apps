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

  const RADIUS_TOKENS: { token: ThemeToken; label: string }[] = [
    { token: 'sh3-radius-sm', label: 'Small' },
    { token: 'sh3-radius', label: 'Default' },
    { token: 'sh3-radius-md', label: 'Medium' },
    { token: 'sh3-radius-lg', label: 'Large' },
  ];

  const resolved = $derived(resolveTokens(theme));

  function handleChange(token: ThemeToken, value: string) {
    if (disabled) return;
    updateToken(theme.id, token, value, state);
  }
</script>

<div class="section">
  <div class="section-title">Shape</div>
  <div class="radius-grid">
    {#each RADIUS_TOKENS as { token, label }}
      <div class="field">
        <label class="field-label">{label}</label>
        <div class="radius-row">
          <input
            type="text"
            class="field-input"
            value={resolved[token] ?? '4px'}
            {disabled}
            onchange={(e) => handleChange(token, e.currentTarget.value)}
          />
          <div
            class="radius-preview"
            style="border-radius: {resolved[token] ?? '4px'};"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .section {
    background: var(--sh3-bg-elevated);
    border-radius: 6px;
    padding: 12px;
  }
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--sh3-fg-subtle);
    margin-bottom: 8px;
  }
  .radius-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .field-label {
    font-size: 10px;
    color: var(--sh3-fg-muted);
  }
  .radius-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .field-input {
    background: var(--sh3-bg);
    border: 1px solid var(--sh3-border);
    border-radius: 4px;
    padding: 4px 8px;
    color: var(--sh3-fg);
    font-family: var(--sh3-font-ui);
    font-size: 12px;
    max-width: 80px;
  }
  .field-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .radius-preview {
    width: 28px;
    height: 28px;
    background: var(--sh3-accent);
    flex-shrink: 0;
  }
</style>
