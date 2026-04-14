<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  let { store, connectorId }: { store: ExplorerStore; connectorId: string } = $props();
</script>

<div>{connectorId} (stub)</div>
