<script lang="ts">
  import { DocumentOpener, type OpenerValue } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';

  let { value, meta, api, onCommit, documents }: InspectorRendererProps = $props();

  // Local bindable mirror — DocumentOpener uses bind:value; we forward
  // committed changes to onCommit and drop OpenerValue.kind (the inspector
  // stores plain {shardId, path}).
  let bound = $state<OpenerValue>(null);
  $effect(() => { bound = value as OpenerValue; });

  function onPicked(next: OpenerValue) {
    if (!onCommit) return;
    onCommit(next ? { shardId: next.shardId, path: next.path } : null);
  }
</script>

{#if !documents}
  <span class="iw">(no document source)</span>
{:else}
  <DocumentOpener
    {documents}
    selectable="folder"
    bind:value={bound}
    disabled={api.readonly || meta?.readonly}
    buttonLabel="Pick folder…"
    onchange={onPicked}
  />
{/if}

<style>
  .iw {
    display: block;
    width: 100%;
    padding: 2px 6px;
    color: var(--sh3-fg-muted, #888);
    font-family: var(--sh3-font-mono);
    font-size: 0.85em;
  }
</style>
