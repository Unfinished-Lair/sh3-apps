<script lang="ts">
  import { Slider } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumber } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'slider' ? meta.widget : undefined,
  );
  const ok = $derived(isNumber(value) && !!widget);

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumber(value)) warnOnce(warnKey, 'slider', `expected finite number, got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'slider', 'meta.widget required (with min/max)');
  });

  let local: number = $state(ok ? (value as number) : 0);
  $effect(() => { if (ok) local = value as number; });

  function commit(next: number) {
    if (api.readonly || !onCommit) return;
    if (next === value) return;
    onCommit(next);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <Slider
      bind:value={local}
      min={widget!.min}
      max={widget!.max}
      step={widget!.step ?? 1}
      ticks={widget!.ticks}
      orientation={widget!.orientation ?? 'horizontal'}
      showValue={widget!.showValue ?? false}
      disabled={api.readonly || meta?.readonly}
      onchange={commit}
    />
  </div>
{/if}

<style>
  .iw {
    display: block;
    width: 100%;
  }
  .iw > :global(*) {
    width: 100%;
    box-sizing: border-box;
  }
</style>
