<script lang="ts">
  import { NumberInput } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumber } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit, onCommitCoalesced }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'number' ? meta.widget : undefined,
  );
  const ok = $derived(isNumber(value));

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!ok) warnOnce(warnKey, 'number', `expected finite number, got ${typeof value}`);
  });

  let gestureKey: string | null = null;

  function commitLive(next: number) {
    if (api.readonly || !onCommit) return;
    if (next === value) return;
    gestureKey ??= `number:${crypto.randomUUID()}`;
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
    <NumberInput
      value={value as number}
      min={widget?.min}
      max={widget?.max}
      step={widget?.step ?? 1}
      precision={widget?.precision}
      disabled={api.readonly || meta?.readonly}
      oninput={commitLive}
      onchange={commitFinal}
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
