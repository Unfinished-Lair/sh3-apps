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

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isStringOrStringArray(value))
      warnOnce(warnKey, 'select', `expected string or string[], got ${typeof value}`);
    else if (!widget) warnOnce(warnKey, 'select', 'meta.widget required (with options)');
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
  <Select
    bind:value={local}
    options={widget!.options}
    multiple={multiple}
    searchable={widget!.searchable}
    disabled={api.readonly || meta?.readonly}
    onchange={commit}
  />
{/if}
