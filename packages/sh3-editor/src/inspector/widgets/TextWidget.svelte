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

  function commit() {
    if (api.readonly || !onCommit) return;
    if (local === value) return;
    onCommit(local);
  }

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!ok) warnOnce(warnKey, 'text', `expected string, got ${typeof value}`);
  });
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <Textarea
    bind:value={local}
    placeholder={widget?.placeholder}
    rows={widget?.rows ?? 3}
    disabled={api.readonly || meta?.readonly}
    onblur={commit}
  />
{/if}
