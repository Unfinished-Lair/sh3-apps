<script lang="ts">
  interface Props {
    label: string;
    collapsed?: boolean;
    children: import('svelte').Snippet;
  }
  let { label, collapsed = false, children }: Props = $props();
  let open = $state(!collapsed);
</script>

<section class="group">
  <button class="header" onclick={() => { open = !open; }} type="button">
    <span class="caret">{open ? '▾' : '▸'}</span>
    <span class="label">{label}</span>
  </button>
  {#if open}
    <div class="body">{@render children()}</div>
  {/if}
</section>

<style>
  .group {
    border-top: 1px solid var(--shell-border);
  }
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.35em;
    background: transparent;
    border: none;
    padding: 0.25em 0.5em;
    text-align: left;
    cursor: pointer;
    color: var(--shell-fg);
    font-family: var(--shell-font-mono);
    font-size: 13px;
  }
  .header:hover {
    background: var(--shell-bg-hover, rgba(255, 255, 255, 0.03));
  }
  .caret {
    color: var(--shell-fg-muted);
    font-size: 0.85em;
  }
  .label {
    font-weight: 600;
  }
  .body {
    padding-left: 0.75em;
  }
</style>
