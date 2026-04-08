<script lang="ts">
  import type { GradientMode } from '../types';
  import { buildGradient, parseGradient, isValidHex } from '../util/color';

  let {
    value,
    disabled,
    onchange,
  }: {
    value: string;
    disabled: boolean;
    onchange: (css: string) => void;
  } = $props();

  let mode: GradientMode = $state('vertical');
  let colors: string[] = $state(['#1a1b1e', '#22232a', '#141518', '#1a1b1e']);

  $effect(() => {
    const p = parseGradient(value);
    if (p) {
      mode = p.mode;
      colors = p.colors;
    }
  });

  const colorCount = $derived(mode === '4-corner' ? 4 : 2);

  function handleModeChange(newMode: GradientMode) {
    if (disabled) return;
    mode = newMode;
    while (colors.length < (newMode === '4-corner' ? 4 : 2)) {
      colors.push(colors[colors.length - 1] ?? '#1a1b1e');
    }
    onchange(buildGradient(mode, colors));
  }

  function handleColorChange(index: number, hex: string) {
    if (disabled || !isValidHex(hex)) return;
    colors[index] = hex;
    onchange(buildGradient(mode, colors));
  }

  const MODE_LABELS: Record<GradientMode, string> = {
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    '4-corner': '4-Corner',
  };
</script>

<div class="gradient-picker">
  <div class="mode-selector">
    {#each (['vertical', 'horizontal', '4-corner'] as GradientMode[]) as m}
      <button
        class="mode-btn"
        class:active={mode === m}
        {disabled}
        onclick={() => handleModeChange(m)}
      >{MODE_LABELS[m]}</button>
    {/each}
  </div>
  <div class="color-stops">
    {#each { length: colorCount } as _, i}
      <label class="stop">
        <input
          type="color"
          value={colors[i] ?? '#1a1b1e'}
          {disabled}
          onchange={(e) => handleColorChange(i, e.currentTarget.value)}
        />
        <span class="stop-label">
          {#if mode === '4-corner'}
            {['TL', 'TR', 'BL', 'BR'][i]}
          {:else}
            {i === 0 ? 'Start' : 'End'}
          {/if}
        </span>
      </label>
    {/each}
  </div>
  <div class="preview" style:background={buildGradient(mode, colors)}></div>
</div>

<style>
  .gradient-picker {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mode-selector {
    display: flex;
    gap: 4px;
  }
  .mode-btn {
    all: unset;
    padding: 3px 8px;
    font-size: 10px;
    border-radius: 3px;
    background: var(--shell-bg);
    color: var(--shell-fg-muted);
    cursor: pointer;
  }
  .mode-btn.active {
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
  }
  .mode-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .color-stops {
    display: flex;
    gap: 8px;
  }
  .stop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
  }
  .stop input[type="color"] {
    width: 28px;
    height: 28px;
    border: 1px solid var(--shell-border);
    border-radius: 4px;
    padding: 2px;
    cursor: pointer;
    background: none;
  }
  .stop-label {
    font-size: 9px;
    color: var(--shell-fg-subtle);
  }
  .preview {
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--shell-border);
  }
</style>
