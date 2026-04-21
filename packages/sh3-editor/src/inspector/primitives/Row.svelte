<script lang="ts">
  interface Props {
    children: import('svelte').Snippet;
  }
  let { children }: Props = $props();
</script>

<div class="row">{@render children()}</div>

<style>
  .row {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }
</style>
