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

  const resolved = $derived(resolveTokens(theme));

  function handleChange(token: ThemeToken, value: string) {
    if (disabled) return;
    updateToken(theme.id, token, value, state);
  }
</script>

<div class="section">
  <div class="section-title">Typography</div>
  <div class="typo-grid">
    <div class="field">
      <label class="field-label">UI Font</label>
      <input
        type="text"
        class="field-input"
        value={resolved['shell-font-ui'] ?? ''}
        {disabled}
        onchange={(e) => handleChange('shell-font-ui', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Mono Font</label>
      <input
        type="text"
        class="field-input mono"
        value={resolved['shell-font-mono'] ?? ''}
        {disabled}
        onchange={(e) => handleChange('shell-font-mono', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Size</label>
      <input
        type="text"
        class="field-input small"
        value={resolved['shell-font-size'] ?? '13px'}
        {disabled}
        onchange={(e) => handleChange('shell-font-size', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Line Height</label>
      <input
        type="text"
        class="field-input small"
        value={resolved['shell-line'] ?? '1.45'}
        {disabled}
        onchange={(e) => handleChange('shell-line', e.currentTarget.value)}
      />
    </div>
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
  .typo-grid {
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
    color: var(--shell-fg-muted);
  }
  .field-input {
    background: var(--shell-bg);
    border: 1px solid var(--shell-border);
    border-radius: 4px;
    padding: 4px 8px;
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
    font-size: 12px;
  }
  .field-input.mono {
    font-family: var(--shell-font-mono);
  }
  .field-input.small {
    max-width: 80px;
  }
  .field-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
