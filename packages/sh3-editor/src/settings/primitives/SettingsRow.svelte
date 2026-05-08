<script lang="ts">
  interface Props {
    label: string;
    description?: string;
    disabled?: boolean;
    error?: string;
    children: import('svelte').Snippet;
  }
  let { label, description, disabled = false, error, children }: Props = $props();
</script>

<div class="row" class:disabled>
  <div class="label-col">
    <div class="label">{label}</div>
    {#if description}
      <div class="desc">{description}</div>
    {/if}
  </div>
  <div class="control">
    {@render children()}
  </div>
  {#if error}
    <div class="error">{error}</div>
  {/if}
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 200px 1fr;
    column-gap: var(--sh3-pad-md);
    align-items: center;
    padding: var(--sh3-pad-sm) 0;
    font-family: var(--sh3-font-ui);
    font-size: 13px;
    color: var(--sh3-fg);
  }
  .row.disabled { opacity: 0.5; pointer-events: none; }
  .label { color: var(--sh3-fg); }
  .desc { font-size: 11px; color: var(--sh3-fg-muted); margin-top: 2px; }
  .control { display: flex; align-items: center; gap: var(--sh3-pad-sm); }
  .error {
    grid-column: 2;
    font-size: 11px;
    color: var(--sh3-error, #ff7a7a);
    margin-top: 4px;
  }
</style>
