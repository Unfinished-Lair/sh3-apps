<script lang="ts">
  import { Select } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isStringOrStringArray } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'select' ? meta.widget : undefined,
  );
  const multiple = $derived(widget?.multiple ?? false);
  const ok = $derived(isStringOrStringArray(value) && !!widget);

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isStringOrStringArray(value))
      warnOnce(warnKey, 'select', `expected string or string[], got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'select', 'meta.widget required (with options)');
  });

  function commit(next: string | string[]) {
    if (api.readonly || !onCommit) return;
    if (!multiple && next === value) return;
    onCommit(next);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <Select
      value={value as string | string[]}
      options={widget!.options}
      multiple={multiple}
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
