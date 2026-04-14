<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  import DocumentTree from './DocumentTree.svelte';
  import SelectionPanel from './SelectionPanel.svelte';

  let { store }: { store: ExplorerStore } = $props();
</script>

<div class="sh3-fe-browser">
  <div class="sh3-fe-browser__tree">
    <DocumentTree {store} />
  </div>
  <div class="sh3-fe-browser__panel">
    <SelectionPanel {store} />
  </div>
</div>

<style>
  .sh3-fe-browser { display: grid; grid-template-columns: minmax(240px, 1fr) minmax(260px, 1fr); height: 100%; gap: 1px; background: var(--sh3-border, #2a2a2a); }
  .sh3-fe-browser__tree, .sh3-fe-browser__panel { background: var(--sh3-bg, #111); overflow: auto; padding: 8px; }
</style>
