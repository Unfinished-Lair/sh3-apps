<script lang="ts">
  import { Button } from 'sh3-core';
  import type { ThemeDefinition } from '../types';
  import type { ThemeState } from '../theme-manager';
  import { updateToken, resolveTokens } from '../theme-manager';
  import { driveOppositeColor } from '../util/contrast';
  import ContrastBadge from './ContrastBadge.svelte';

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

  const endpoints = $derived({
    light: resolved['sh3-fg']!,
    dark:  resolved['sh3-bg']!,
  });

  const drivenFg = $derived(
    driveOppositeColor(resolved['sh3-accent']!, endpoints),
  );

  // Mode is inferred: Driven iff the stored fg-on-accent equals what Algorithm A would produce.
  const mode = $derived<'driven' | 'custom'>(
    drivenFg && resolved['sh3-fg-on-accent'] === drivenFg.color ? 'driven' : 'custom',
  );

  function onAccentChange(e: Event) {
    if (disabled) return;
    const newAccent = (e.currentTarget as HTMLInputElement).value;
    const wasDriven = mode === 'driven';
    updateToken(theme.id, 'sh3-accent', newAccent, state);
    if (wasDriven) {
      const driven = driveOppositeColor(newAccent, endpoints);
      if (driven) updateToken(theme.id, 'sh3-fg-on-accent', driven.color, state);
    }
  }

  function onFgOnAccentChange(e: Event) {
    if (disabled) return;
    const value = (e.currentTarget as HTMLInputElement).value;
    updateToken(theme.id, 'sh3-fg-on-accent', value, state);
  }

  function setMode(next: 'driven' | 'custom') {
    if (disabled) return;
    if (next === 'driven') {
      if (drivenFg) updateToken(theme.id, 'sh3-fg-on-accent', drivenFg.color, state);
    } else {
      if (drivenFg && resolved['sh3-fg-on-accent'] === drivenFg.color) {
        const other = drivenFg.endpoint === 'dark' ? endpoints.light : endpoints.dark;
        updateToken(theme.id, 'sh3-fg-on-accent', other, state);
      }
    }
  }

  const caption = $derived.by(() => {
    if (!drivenFg) return '—';
    const ratio = drivenFg.ratio.toFixed(2);
    if (mode === 'driven') return `auto · ${drivenFg.endpoint} ${ratio}:1`;
    return 'custom';
  });

  // Reactive re-drive: when endpoints (fg/bg) change while in Driven mode, keep
  // the stored fg-on-accent in sync with Algorithm A's new answer.
  $effect(() => {
    if (disabled) return;
    if (mode === 'driven' && drivenFg && resolved['sh3-fg-on-accent'] !== drivenFg.color) {
      updateToken(theme.id, 'sh3-fg-on-accent', drivenFg.color, state);
    }
  });
</script>

<div class="accent-row">
  <label class="swatch">
    <input
      type="color"
      value={resolved['sh3-accent'] ?? '#000000'}
      {disabled}
      onchange={onAccentChange}
    />
    <span class="label">Accent</span>
  </label>

  <div class="mode-toggle" role="group" aria-label="fg-on-accent mode">
    <button
      type="button"
      class="chip"
      class:selected={mode === 'driven'}
      {disabled}
      onclick={() => setMode('driven')}
    >Driven</button>
    <button
      type="button"
      class="chip"
      class:selected={mode === 'custom'}
      {disabled}
      onclick={() => setMode('custom')}
    >Custom</button>
  </div>

  <label class="swatch">
    <input
      type="color"
      value={resolved['sh3-fg-on-accent'] ?? '#ffffff'}
      disabled={disabled || mode === 'driven'}
      onchange={onFgOnAccentChange}
    />
    <span class="label">Fg on accent</span>
  </label>

  <ContrastBadge
    fg={resolved['sh3-fg-on-accent']}
    bg={resolved['sh3-accent']}
    usage="text"
  />
</div>

<div class="caption">{caption}</div>

<div class="preview-pill">
  <Button disabled>Preview</Button>
</div>

<style>
  .accent-row {
    display: flex;
    align-items: center;
    gap: var(--sh3-pad-md, 8px);
    flex-wrap: wrap;
  }
  .swatch {
    display: flex;
    align-items: center;
    gap: var(--sh3-pad-sm, 4px);
    cursor: pointer;
  }
  .swatch input[type="color"] {
    width: 26px;
    height: 22px;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-radius-sm, 3px);
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
    color: var(--sh3-fg-muted);
  }
  .mode-toggle {
    display: inline-flex;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-radius-sm, 3px);
    overflow: hidden;
  }
  .chip {
    all: unset;
    padding: 2px 8px;
    font-size: 10px;
    cursor: pointer;
    color: var(--sh3-fg-muted);
    background: var(--sh3-bg-sunken);
  }
  .chip.selected {
    background: var(--sh3-accent-muted);
    color: var(--sh3-fg);
  }
  .chip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .caption {
    margin-top: var(--sh3-pad-sm, 4px);
    font-size: 10px;
    color: var(--sh3-fg-subtle);
  }
  .preview-pill {
    margin-top: var(--sh3-pad-sm, 4px);
  }
</style>
