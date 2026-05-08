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
    padding-bottom: var(--sh3-pad-md);
    margin-bottom: var(--sh3-pad-md);
    border-bottom: 1px solid var(--sh3-border);
  }
  .section:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .section-label {
    margin: 0 0 var(--sh3-pad-sm);
    font-size: 11px;
    font-weight: 600;
    color: var(--sh3-accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: var(--sh3-font-ui);
  }
  .rows {
    display: flex;
    flex-direction: column;
  }
</style>
