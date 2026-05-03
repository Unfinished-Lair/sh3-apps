<script lang="ts">
  import { Textarea } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isString } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'text' ? meta.widget : undefined,
  );
  const ok = $derived(isString(value));

  let local = $state(ok ? (value as string) : '');
  $effect(() => { if (ok) local = value as string; });

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!ok) warnOnce(warnKey, 'text', `expected string, got ${typeof value}`);
  });

  function commit(next: string) {
    if (api.readonly || !onCommit) return;
    if (next === value) return;
    onCommit(next);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <Textarea
      bind:value={local}
      placeholder={widget?.placeholder}
      rows={widget?.rows ?? 3}
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
