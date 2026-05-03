<script lang="ts">
  import { SliderGroup } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumberRecord } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'slider-group' ? meta.widget : undefined,
  );
  const ok = $derived(isNumberRecord(value) && !!widget);

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumberRecord(value)) warnOnce(warnKey, 'slider-group', 'expected Record<string, number>');
    else if (!widget) warnOnce(warnKey, 'slider-group', 'meta.widget required (with channels)');
  });

  let local: Record<string, number> = $state(ok ? { ...(value as Record<string, number>) } : {});
  $effect(() => { if (ok) local = { ...(value as Record<string, number>) }; });

  function commit(next: Record<string, number>) {
    if (api.readonly || !onCommit) return;
    const v = value as Record<string, number>;
    if (v && typeof v === 'object'
        && Object.keys(next).length === Object.keys(v).length
        && Object.keys(next).every(k => next[k] === v[k])) return;
    onCommit(next);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <SliderGroup
      bind:values={local}
      channels={widget!.channels}
      orientation={widget!.orientation ?? 'horizontal'}
      showValues={widget!.showValues ?? false}
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
