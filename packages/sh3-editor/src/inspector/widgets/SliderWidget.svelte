<script lang="ts">
  import { Slider, NumberInput } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumber } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit, onCommitCoalesced }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'slider' ? meta.widget : undefined,
  );
  const ok = $derived(isNumber(value) && !!widget);

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumber(value)) warnOnce(warnKey, 'slider', `expected finite number, got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'slider', 'meta.widget required (with min/max)');
  });


  // Single gestureKey shared by the slider and the companion number field.
  // Each interaction (drag or typing session) sets it on first commitLive
  // and clears it on commitFinal — so each gesture yields one undo entry.
  let gestureKey: string | null = null;

  function commitLive(next: number) {
    if (api.readonly || !onCommit) return;
    if (next === value) return;
    gestureKey ??= `slider:${crypto.randomUUID()}`;
    onCommitCoalesced?.(next, gestureKey);
  }

  function commitFinal(next: number) {
    if (api.readonly || !onCommit) return;
    if (next !== value) {
      if (gestureKey !== null) onCommitCoalesced?.(next, gestureKey);
      else                     onCommit(next);
    }
    gestureKey = null;
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <div class="slider-wrap">
      <Slider
        value={value as number}
        min={widget!.min}
        max={widget!.max}
        step={widget!.step ?? 1}
        ticks={widget!.ticks}
        orientation={widget!.orientation ?? 'horizontal'}
        disabled={api.readonly || meta?.readonly}
        oninput={commitLive}
        onchange={commitFinal}
      />
    </div>
    <div class="field-wrap">
      <NumberInput
        value={value as number}
        min={widget!.min}
        max={widget!.max}
        step={widget!.step ?? 1}
        disabled={api.readonly || meta?.readonly}
        size="sm"
        oninput={commitLive}
        onchange={commitFinal}
      />
    </div>
  </div>
{/if}

<style>
  .iw {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
  }
  .slider-wrap {
    flex: 1 1 auto;
    min-width: 0;
  }
  .slider-wrap > :global(*) {
    width: 100%;
    box-sizing: border-box;
  }
  .field-wrap {
    flex: 0 0 72px;
  }
  .field-wrap > :global(*) {
    width: 100%;
    box-sizing: border-box;
  }
</style>
