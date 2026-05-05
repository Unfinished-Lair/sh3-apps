<script lang="ts">
  import { Textarea } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isString } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit, onCommitCoalesced }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'text' ? meta.widget : undefined,
  );
  const ok = $derived(isString(value));

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!ok) warnOnce(warnKey, 'text', `expected string, got ${typeof value}`);
  });

  let gestureKey: string | null = null;

  function commitLive(next: string) {
    if (api.readonly || !onCommit) return;
    if (next === value) return;
    gestureKey ??= `text:${crypto.randomUUID()}`;
    onCommitCoalesced?.(next, gestureKey);
  }

  function commitFinal(next: string) {
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
    <Textarea
      value={value as string}
      placeholder={widget?.placeholder}
      rows={widget?.rows ?? 3}
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
