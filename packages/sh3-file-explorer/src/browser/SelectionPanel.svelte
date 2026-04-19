<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';

  let { store }: { store: ExplorerStore } = $props();
</script>

{#if !store.ready}
  <p class="sh3-fe-panel__empty">{store.error.message}</p>
{:else if !store.selection}
  <p class="sh3-fe-panel__empty">Select a file or folder to see details.</p>
{:else}
  <header class="sh3-fe-panel__header">
    <div class="sh3-fe-panel__path">{store.selection.path || '(shard root)'}</div>
    <div class="sh3-fe-panel__shard">{store.selection.shardId}</div>
  </header>
{/if}

<style>
  .sh3-fe-panel__empty { color: var(--sh3-muted, #888); }
  .sh3-fe-panel__header { border-bottom: 1px solid var(--sh3-border, #2a2a2a); padding-bottom: 6px; margin-bottom: 8px; }
  .sh3-fe-panel__path { font-weight: 600; }
  .sh3-fe-panel__shard { font-size: 0.85em; color: var(--sh3-muted, #888); }
</style>
