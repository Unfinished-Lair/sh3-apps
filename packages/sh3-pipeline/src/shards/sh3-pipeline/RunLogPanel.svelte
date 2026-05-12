<script lang="ts">
  import type { RunLog } from './runtime/run-log.svelte';

  let { log }: { log: RunLog } = $props();

  function fmt(ts: number) {
    return new Date(ts).toISOString().slice(11, 23);
  }
</script>

<div class="run-log">
  <header>Run Log ({log.entries.length})</header>
  <ul>
    {#each log.entries as e}
      <li class={e.level}>
        <span class="ts">{fmt(e.ts)}</span>
        <span class="node">{e.nodeId ?? '—'}</span>
        <span class="level">{e.level}</span>
        <span class="msg">{e.message}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .run-log {
    width: 100%;
    height: 100%;
    background: var(--shell-bg, #1a1a1a);
    color: var(--shell-fg, #eee);
    font-family: var(--shell-font-mono);
    font-size: 11px;
    overflow: auto;
    border-top: 1px solid var(--shell-fg-subtle, #333);
  }
  header {
    padding: 4px 8px;
    color: var(--shell-fg-muted, #888);
    font-family: var(--shell-font-ui);
    background: var(--shell-bg-elevated, #222);
    position: sticky;
    top: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: grid;
    grid-template-columns: 90px 100px 56px 1fr;
    gap: 8px;
    padding: 2px 8px;
  }
  li.error { color: #f87171; }
  li.warn  { color: #fbbf24; }
  li.debug { color: var(--shell-fg-muted, #888); }
  .ts   { color: var(--shell-fg-muted, #888); }
  .node { color: var(--shell-accent, #22d3ee); }
</style>
