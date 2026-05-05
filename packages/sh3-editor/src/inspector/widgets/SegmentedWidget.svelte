<script lang="ts">
  import { Segmented } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isString } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'segmented' ? meta.widget : undefined,
  );
  const ok = $derived(isString(value) && !!widget);

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isString(value)) warnOnce(warnKey, 'segmented', `expected string, got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'segmented', 'meta.widget required (with options)');
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
    <Segmented
      value={value as string}
      options={widget!.options}
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
