<script lang="ts">
  interface Props {
    label: string;
    showHeader: boolean;
    children: import('svelte').Snippet;
  }
  let { label, showHeader, children }: Props = $props();
</script>

<section class="section">
  {#if showHeader}
    <h3 class="section-label">{label}</h3>
  {/if}
  <div class="rows">
    {@render children()}
  </div>
</section>

<style>
  .section {
    padding-bottom: var(--shell-pad-md);
    margin-bottom: var(--shell-pad-md);
    border-bottom: 1px solid var(--shell-border);
  }
  .section:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .section-label {
    margin: 0 0 var(--shell-pad-sm);
    font-size: 11px;
    font-weight: 600;
    color: var(--shell-accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: var(--shell-font-ui);
  }
  .rows {
    display: flex;
    flex-direction: column;
  }
</style>
