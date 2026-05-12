<script lang="ts">
  import type { MountContext } from 'sh3-core';

  interface Dims {
    width: number;
    height: number;
  }

  let {
    context,
    dims,
  }: {
    context: MountContext;
    dims: Dims;
  } = $props();
</script>

<div class="main-view">
  <h1>sh3-pipeline</h1>
  <p class="meta">{context.viewId} &middot; {context.slotId}</p>
  <p class="dims">{dims.width} &times; {dims.height}</p>
</div>

<style>
  .main-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 8px;
    font-family: var(--shell-font-ui);
    color: var(--shell-fg);
  }
  h1 {
    margin: 0;
    font-size: 24px;
    color: var(--shell-accent);
  }
  .meta {
    margin: 0;
    font-family: var(--shell-font-mono);
    font-size: 11px;
    color: var(--shell-fg-muted);
  }
  .dims {
    margin: 0;
    font-family: var(--shell-font-mono);
    font-size: 10px;
    color: var(--shell-fg-subtle);
  }
</style>
