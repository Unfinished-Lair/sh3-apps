<script lang="ts">
  import { FilePicker } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isFileOrFileArrayOrNull } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'file' ? meta.widget : undefined,
  );
  const ok = $derived(isFileOrFileArrayOrNull(value) && !!widget);

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isFileOrFileArrayOrNull(value)) warnOnce(warnKey, 'file', 'expected File | File[] | null');
    else if (!widget) warnOnce(warnKey, 'file', 'meta.widget required');
  });

  function commit(next: File | File[] | null) {
    if (api.readonly || !onCommit) return;
    // No dedup: file pickers always surface a new File object per pick.
    onCommit(next);
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <FilePicker
      value={value as File | File[] | null}
      accept={widget!.accept}
      multiple={widget!.multiple}
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
