<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  import ConnectorRow from './ConnectorRow.svelte';

  let { store }: { store: ExplorerStore } = $props();

  const connectorIds = $derived(store.ready ? store.connectorIds : []);
</script>

{#if !store.ready}
  <p class="sh3-fe-empty">{store.error.message}</p>
{:else if connectorIds.length === 0}
  <p class="sh3-fe-empty">No sync connectors installed.</p>
{:else}
  <ul class="sh3-fe-connectors">
    {#each connectorIds as id (id)}
      <li><ConnectorRow {store} connectorId={id} /></li>
    {/each}
  </ul>
{/if}

<style>
  .sh3-fe-connectors { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .sh3-fe-empty { color: var(--sh3-muted, #888); padding: 8px; }
</style>
