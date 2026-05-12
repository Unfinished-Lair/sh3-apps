<script lang="ts">
  import type { ShardContext } from 'sh3-core';

  let {
    ctx,
    initialPath,
    onPick,
    close,
  }: {
    ctx: ShardContext;
    initialPath: string;
    onPick: (path: string) => void;
    close: () => void;
  } = $props();

  let entries = $state<Array<{ path: string; size: number; lastModified: number }>>([]);
  let loading = $state(true);
  let query = $state('');
  let typedPath = $state(initialPath);
  let error = $state<string | null>(null);

  $effect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!ctx.browse?.listDocuments) {
          error = 'documents:browse capability missing';
          loading = false;
          return;
        }
        const all = await ctx.browse.listDocuments();
        if (cancelled) return;
        // Show every document the shard owns, regardless of extension —
        // users may save to arbitrary paths.
        entries = all
          .filter((d) => d.shardId === 'sh3-pipeline')
          .map((d) => ({ path: d.path, size: d.size, lastModified: d.lastModified }))
          .sort((a, b) => b.lastModified - a.lastModified);
        loading = false;
      } catch (e) {
        if (cancelled) return;
        error = e instanceof Error ? e.message : String(e);
        loading = false;
      }
    })();
    return () => { cancelled = true; };
  });

  let filtered = $derived.by(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => e.path.toLowerCase().includes(q));
  });

  function pick(path: string) {
    onPick(path);
    close();
  }

  function onSubmitTyped() {
    if (!typedPath.trim()) return;
    pick(typedPath.trim());
  }

  function fmtTime(ts: number): string {
    return new Date(ts).toISOString().slice(0, 19).replace('T', ' ');
  }

  function fmtSize(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<div class="open-modal">
  <header>
    <h2>Open Pipeline</h2>
    <button class="close-btn" onclick={close} aria-label="Close">×</button>
  </header>

  <div class="search-row">
    <input
      type="text"
      placeholder="Filter…"
      bind:value={query}
      autofocus
    />
  </div>

  <div class="list-wrap">
    {#if loading}
      <div class="status">Loading…</div>
    {:else if error}
      <div class="status error">{error}</div>
    {:else if filtered.length === 0}
      <div class="status">{entries.length === 0 ? 'No saved pipelines yet.' : 'No matches.'}</div>
    {:else}
      <ul class="list">
        {#each filtered as e (e.path)}
          <li>
            <button class="row" onclick={() => pick(e.path)}>
              <span class="path">{e.path}</span>
              <span class="meta">{fmtSize(e.size)} · {fmtTime(e.lastModified)}</span>
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="typed-row">
    <input
      type="text"
      placeholder="Or type a path (e.g. pipelines/cats.pipeline.json)"
      bind:value={typedPath}
      onkeydown={(ev) => { if (ev.key === 'Enter') onSubmitTyped(); }}
    />
    <button onclick={onSubmitTyped} disabled={!typedPath.trim()}>Open</button>
  </div>
</div>

<style>
  .open-modal {
    width: 520px;
    max-width: 90vw;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    background: var(--sh3-bg, #1a1a1a);
    color: var(--sh3-fg, #eee);
    font-family: var(--sh3-font-ui);
    border: 1px solid var(--sh3-border, #333);
    border-radius: 6px;
  }
  header {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid var(--sh3-border, #333);
  }
  h2 { margin: 0; font-size: 14px; flex: 1; font-weight: 600; }
  .close-btn {
    background: transparent;
    border: 0;
    color: var(--sh3-fg, #eee);
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
  }
  .search-row { padding: 10px 14px 6px; }
  .search-row input,
  .typed-row input {
    width: 100%;
    padding: 6px 8px;
    background: var(--sh3-bg-sunken, #111);
    color: var(--sh3-fg, #eee);
    border: 1px solid var(--sh3-border, #333);
    border-radius: 3px;
    font: inherit;
    font-size: 13px;
    box-sizing: border-box;
  }
  .list-wrap {
    flex: 1;
    overflow-y: auto;
    min-height: 120px;
    padding: 4px 8px;
  }
  .status {
    padding: 24px;
    text-align: center;
    color: var(--sh3-fg-muted, #888);
    font-size: 12px;
  }
  .status.error { color: #f87171; }
  ul.list { list-style: none; margin: 0; padding: 0; }
  ul.list li { margin: 0; }
  .row {
    display: flex;
    width: 100%;
    background: transparent;
    color: var(--sh3-fg, #eee);
    border: 0;
    padding: 8px 10px;
    cursor: pointer;
    text-align: left;
    border-radius: 3px;
    align-items: center;
    gap: 12px;
  }
  .row:hover { background: var(--sh3-bg-elevated, #2a2a2a); }
  .path {
    flex: 1;
    font-family: var(--sh3-font-mono);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    font-size: 11px;
    color: var(--sh3-fg-muted, #888);
    white-space: nowrap;
  }
  .typed-row {
    display: flex;
    gap: 8px;
    padding: 10px 14px;
    border-top: 1px solid var(--sh3-border, #333);
  }
  .typed-row input { flex: 1; }
  .typed-row button {
    padding: 6px 14px;
    background: var(--sh3-accent, #3b82f6);
    color: white;
    border: 0;
    border-radius: 3px;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
  }
  .typed-row button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
