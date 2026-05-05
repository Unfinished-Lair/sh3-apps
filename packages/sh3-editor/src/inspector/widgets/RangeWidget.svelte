<script lang="ts">
  import { RangeSlider, NumberInput } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumberPair } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit, onCommitCoalesced }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'range' ? meta.widget : undefined,
  );
  const ok = $derived(isNumberPair(value) && !!widget);

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumberPair(value)) warnOnce(warnKey, 'range', `expected [number, number], got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'range', 'meta.widget required (with min/max)');
  });

  let gestureKey: string | null = null;

  function pairEq(a: [number, number], b: [number, number]): boolean {
    return a[0] === b[0] && a[1] === b[1];
  }

  function commitLive(next: [number, number]) {
    if (api.readonly || !onCommit) return;
    if (pairEq(next, value as [number, number])) return;
    gestureKey ??= `range:${crypto.randomUUID()}`;
    onCommitCoalesced?.(next, gestureKey);
  }

  function commitFinal(next: [number, number]) {
    if (api.readonly || !onCommit) return;
    if (!pairEq(next, value as [number, number])) {
      if (gestureKey !== null) onCommitCoalesced?.(next, gestureKey);
      else                     onCommit(next);
    }
    gestureKey = null;
  }

  // Companion field commits — each writes into one slot of the pair. Live
  // commits write as-typed; final commits enforce low ≤ high via swap.
  function lowLive(n: number) {
    const v = value as [number, number];
    commitLive([n, v[1]]);
  }
  function lowFinal(n: number) {
    const v = value as [number, number];
    const lo = Math.min(n, v[1]);
    const hi = Math.max(n, v[1]);
    commitFinal([lo, hi]);
  }
  function highLive(n: number) {
    const v = value as [number, number];
    commitLive([v[0], n]);
  }
  function highFinal(n: number) {
    const v = value as [number, number];
    const lo = Math.min(v[0], n);
    const hi = Math.max(v[0], n);
    commitFinal([lo, hi]);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <div class="slider-wrap">
      <RangeSlider
        value={value as [number, number]}
        min={widget!.min}
        max={widget!.max}
        step={widget!.step ?? 1}
        disabled={api.readonly || meta?.readonly}
        oninput={commitLive}
        onchange={commitFinal}
      />
    </div>
    <div class="field-wrap">
      <NumberInput
        value={(value as [number, number])[0]}
        min={widget!.min}
        max={widget!.max}
        step={widget!.step ?? 1}
        disabled={api.readonly || meta?.readonly}
        size="sm"
        oninput={lowLive}
        onchange={lowFinal}
      />
    </div>
    <div class="field-wrap">
      <NumberInput
        value={(value as [number, number])[1]}
        min={widget!.min}
        max={widget!.max}
        step={widget!.step ?? 1}
        disabled={api.readonly || meta?.readonly}
        size="sm"
        oninput={highLive}
        onchange={highFinal}
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
    flex: 0 0 64px;
  }
  .field-wrap > :global(*) {
    width: 100%;
    box-sizing: border-box;
  }
</style>
