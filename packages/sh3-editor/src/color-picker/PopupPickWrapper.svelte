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
    /** Injected by shell.popup.show; not used directly — the popup manager owns close. */
    close: () => void;
  }

  let {
    initial,
    title,
    userPalettes,
    onSaveUserPalette,
    onDeleteUserPalette,
    onResolve,
    close: _close,
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

  // Capture-phase: registered synchronously in onMount, which runs inside the
  // mount() call that shell.popup.show invokes BEFORE its own queueMicrotask
  // listener install. So our handler sees Escape first, sets the flag without
  // preventDefault, then the popup manager's handler closes the popup. Our
  // onDestroy then resolves null.
  function onKeydownCapture(e: KeyboardEvent) {
    if (e.key === 'Escape') escapePressed = true;
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
    font: var(--shell-font-ui);
    color: var(--shell-text-dim);
    padding: 4px 8px;
    border-bottom: 1px solid var(--shell-border-subtle, rgba(255, 255, 255, 0.1));
  }
</style>
