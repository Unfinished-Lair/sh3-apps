<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import ColorPickerSurface from '../views/ColorPickerSurface.svelte';
  import type { ColorPalette } from '../types';
  import { decideSettleValue } from './popup-pick';

  interface Props {
    initial: string;
    title?: string;
    userPalettes: ColorPalette[];
    onSaveUserPalette: (palette: ColorPalette) => void;
    onDeleteUserPalette: (paletteId: string) => void;
    /** Called exactly once with the chosen hex (or null on Escape / never-interacted). */
    onResolve: (hex: string | null) => void;
    /** Closes the host overlay (float). Called on Escape. */
    close: () => void;
  }

  let {
    initial,
    title,
    userPalettes,
    onSaveUserPalette,
    onDeleteUserPalette,
    onResolve,
    close,
  }: Props = $props();

  let currentValue = $state(initial);
  let escapePressed = false;
  let userTouched = false;
  let resolved = false;

  function settle(value: string | null) {
    if (resolved) return;
    resolved = true;
    onResolve(value);
  }

  // The float manager only dismisses on outside-pointerdown (see
  // overlays/floatDismiss.ts) — Escape never reaches it. We own that gesture
  // here: capture-phase so we run before in-content focused inputs swallow
  // the key, mark escapePressed (so settle resolves null), then ask the host
  // float to close. Closing unmounts the view, which fires onDestroy below.
  function onKeydownCapture(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      escapePressed = true;
      close();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', onKeydownCapture, true);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', onKeydownCapture, true);
    settle(decideSettleValue({ escapePressed, userTouched, currentValue }));
  });

  function handleChange(hex: string) {
    userTouched = true;
    currentValue = hex;
  }
</script>

{#if title}
  <div class="cp-pick-title">{title}</div>
{/if}
<ColorPickerSurface
  value={currentValue}
  initialMode="hsv"
  {userPalettes}
  onChange={handleChange}
  onModeChange={() => { /* prefs not persisted in pick() flow */ }}
  {onSaveUserPalette}
  {onDeleteUserPalette}
/>

<style>
  .cp-pick-title {
    font: var(--sh3-font-ui);
    color: var(--sh3-text-dim);
    padding: 4px 8px;
    border-bottom: 1px solid var(--sh3-border-subtle, rgba(255, 255, 255, 0.1));
  }
</style>
