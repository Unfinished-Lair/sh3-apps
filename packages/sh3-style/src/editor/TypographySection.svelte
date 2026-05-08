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
        value={resolved['sh3-font-ui'] ?? ''}
        {disabled}
        onchange={(e) => handleChange('sh3-font-ui', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Mono Font</label>
      <input
        type="text"
        class="field-input mono"
        value={resolved['sh3-font-mono'] ?? ''}
        {disabled}
        onchange={(e) => handleChange('sh3-font-mono', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Size</label>
      <input
        type="text"
        class="field-input small"
        value={resolved['sh3-font-size'] ?? '13px'}
        {disabled}
        onchange={(e) => handleChange('sh3-font-size', e.currentTarget.value)}
      />
    </div>
    <div class="field">
      <label class="field-label">Line Height</label>
      <input
        type="text"
        class="field-input small"
        value={resolved['sh3-line'] ?? '1.45'}
        {disabled}
        onchange={(e) => handleChange('sh3-line', e.currentTarget.value)}
      />
    </div>
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
    color: var(--sh3-fg-muted);
  }
  .field-input {
    background: var(--sh3-bg);
    border: 1px solid var(--sh3-border);
    border-radius: 4px;
    padding: 4px 8px;
    color: var(--sh3-fg);
    font-family: var(--sh3-font-ui);
    font-size: 12px;
  }
  .field-input.mono {
    font-family: var(--sh3-font-mono);
  }
  .field-input.small {
    max-width: 80px;
  }
  .field-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
