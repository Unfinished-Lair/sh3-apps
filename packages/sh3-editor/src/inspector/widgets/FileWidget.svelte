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

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isFileOrFileArrayOrNull(value)) warnOnce(warnKey, 'file', 'expected File | File[] | null');
    else if (!widget) warnOnce(warnKey, 'file', 'meta.widget required');
  });

  let local: File | File[] | null = $state(ok ? (value as File | File[] | null) : null);
  $effect(() => { if (ok) local = value as File | File[] | null; });

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
      bind:value={local}
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
