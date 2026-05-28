<script lang="ts">
  import { onMount } from 'svelte';
  import { sh3, type ActiveActionDescriptor } from 'sh3-core';
  import HotkeysTab from './help/HotkeysTab.svelte';

  let actions: ActiveActionDescriptor[] = $state([]);

  onMount(() => {
    actions = sh3.actions.listActive();
  });
</script>

<div class="help-hotkeys" data-sh3-view="sh3-editor:help-hotkeys">
  <HotkeysTab {actions} />
</div>

<style>
  .help-hotkeys { width: 100%; height: 100%; overflow: auto; }
</style>
