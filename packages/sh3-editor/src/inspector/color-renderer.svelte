<script lang="ts">
  import type { InspectorRendererProps } from '../types';
  import ColorPicker from '../views/ColorPicker.svelte';
  import { getColorRendererDeps } from './color-renderer-deps';

  let { value, api, onCommit }: InspectorRendererProps = $props();

  const deps = getColorRendererDeps();

  let stringValue = $derived(typeof value === 'string' ? value : null);
</script>

{#if stringValue === null}
  <span class="cp-leaf-fallback">{String(value)}</span>
{:else if !deps}
  <span class="cp-leaf-fallback">{stringValue}</span>
{:else}
  <ColorPicker
    instanceId="inspector-color"
    internals={deps.internals}
    compact={true}
    adHocValue={stringValue}
    adHocReadonly={api.readonly}
    userPalettes={deps.userPalettes}
    onSaveUserPalette={deps.onSaveUserPalette}
    onDeleteUserPalette={deps.onDeleteUserPalette}
    onExternalCommit={(hex) => onCommit?.(hex)}
  />
{/if}

<style>
  .cp-leaf-fallback {
    font-family: var(--shell-font-mono, monospace);
    color: var(--shell-text-dim);
  }
</style>
