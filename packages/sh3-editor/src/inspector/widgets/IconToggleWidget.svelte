<script lang="ts">
  import { IconToggleGroup } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isStringOrStringArray } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'icon-toggle' ? meta.widget : undefined,
  );
  const multiple = $derived(widget?.multiple ?? false);
  const ok = $derived(isStringOrStringArray(value) && !!widget);

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isStringOrStringArray(value))
      warnOnce(warnKey, 'icon-toggle', `expected string or string[], got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'icon-toggle', 'meta.widget required (with options)');
  });

  let local: string | string[] = $state(ok ? (value as string | string[]) : (multiple ? [] : ''));
  $effect(() => { if (ok) local = value as string | string[]; });

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
    <IconToggleGroup
      bind:value={local}
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
