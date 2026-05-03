<script lang="ts">
  import { RangeSlider } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumberPair } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'range' ? meta.widget : undefined,
  );
  const ok = $derived(isNumberPair(value) && !!widget);

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumberPair(value)) warnOnce(warnKey, 'range', `expected [number, number], got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'range', 'meta.widget required (with min/max)');
  });

  let local: [number, number] = $state(ok ? (value as [number, number]) : [0, 1]);
  $effect(() => { if (ok) local = value as [number, number]; });

  function commit(next: [number, number]) {
    if (api.readonly || !onCommit) return;
    const v = value as [number, number];
    if (Array.isArray(v) && next[0] === v[0] && next[1] === v[1]) return;
    onCommit(next);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <RangeSlider
      bind:value={local}
      min={widget!.min}
      max={widget!.max}
      step={widget!.step ?? 1}
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
