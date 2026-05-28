<script lang="ts">
  import type { ShardContext } from 'sh3-core';
  import Settings from '../settings/Settings.svelte';

  let { ctx, slotId }: { ctx: ShardContext; slotId?: string } = $props();
</script>

<div class="help-settings" data-sh3-view="sh3-editor:help-settings">
  <Settings {ctx} {slotId} />
</div>

<style>
  .help-settings { width: 100%; height: 100%; overflow: auto; }
</style>
