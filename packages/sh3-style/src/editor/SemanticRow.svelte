<script lang="ts">
  import type { ThemeDefinition, ThemeToken } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';
  import ContrastBadge from './ContrastBadge.svelte';

  let {
    theme,
    state,
    disabled,
    surfaceToken,
    fgOnToken,
    label,
  }: {
    theme: ThemeDefinition;
    state: ThemeState;
    disabled: boolean;
    surfaceToken: ThemeToken;
    fgOnToken: ThemeToken;
    label: string;
  } = $props();

  const resolved = $derived(resolveTokens(theme));

  function onChange(e: Event) {
    if (disabled) return;
    const value = (e.currentTarget as HTMLInputElement).value;
    updateToken(theme.id, surfaceToken, value, state);
  }
</script>

<div class="semantic-row">
  <label class="swatch">
    <input
      type="color"
      value={resolved[surfaceToken] ?? '#000000'}
      {disabled}
      onchange={onChange}
    />
    <span class="label">{label}</span>
  </label>
  <ContrastBadge
    fg={resolved[fgOnToken]}
    bg={resolved[surfaceToken]}
    usage="text"
  />
</div>

<style>
  .semantic-row {
    display: flex;
    align-items: center;
    gap: var(--shell-pad-md, 8px);
  }
  .swatch {
    display: flex;
    align-items: center;
    gap: var(--shell-pad-sm, 4px);
    cursor: pointer;
  }
  .swatch input[type="color"] {
    width: 26px;
    height: 22px;
    border: 1px solid var(--shell-border);
    border-radius: var(--shell-radius-sm, 3px);
    padding: 2px;
    cursor: pointer;
    background: none;
  }
  .swatch input[type="color"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .label {
    font-size: 11px;
    color: var(--shell-fg-muted);
  }
</style>
