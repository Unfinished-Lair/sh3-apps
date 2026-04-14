<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  let { store }: { store: ExplorerStore } = $props();
</script>

<p>Selection: {store.ready && store.selection ? `${store.selection.shardId}:${store.selection.path}` : '(none)'}</p>
