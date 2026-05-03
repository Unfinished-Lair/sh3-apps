<script lang="ts">
  import { Field } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isString } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'string' ? meta.widget : undefined,
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
    if (!ok) warnOnce(warnKey, 'string', `expected string, got ${typeof value}`);
  });
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw">
    <!-- TODO(0.13.1): wire prefix/suffix snippets -->
    <Field
      bind:value={local}
      placeholder={widget?.placeholder}
      helper={widget?.helper}
      size={widget?.size ?? 'sm'}
      disabled={api.readonly || meta?.readonly}
      onblur={commit}
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
