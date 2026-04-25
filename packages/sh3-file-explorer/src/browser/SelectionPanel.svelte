<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  import { SELECTION_ACTION_POINT, type SelectionAction, type BadgeDoc } from '../contributions';

  let { store }: { store: ExplorerStore } = $props();

  let actionTick = $state(0);
  $effect(() => store.ctx.contributions.onChange(SELECTION_ACTION_POINT, () => { actionTick++; }));

  const actions = $derived.by(() => {
    void actionTick;
    if (!store.ready || !store.selection) return [] as SelectionAction[];
    const sel = store.selection;
    return store.ctx.contributions
      .list<SelectionAction>(SELECTION_ACTION_POINT)
      .filter((a) => !a.appliesTo || a.appliesTo(sel));
  });

  const badgeDoc = $derived.by((): BadgeDoc | null => {
    if (!store.ready || !store.selection) return null;
    const sel = store.selection;
    if (sel.kind === 'file') {
      const meta = store.documents.find((d) => d.shardId === sel.shardId && d.path === sel.path);
      return { shardId: sel.shardId, path: sel.path, kind: 'file', lastModified: meta?.lastModified };
    }
    const prefix = sel.path ? `${sel.path}/` : '';
    let n = 0;
    for (const d of store.documents) {
      if (d.shardId !== sel.shardId) continue;
      if (sel.path === '' || d.path.startsWith(prefix)) n++;
    }
    return { shardId: sel.shardId, path: sel.path, kind: 'folder', descendantCount: n };
  });

  const badges = $derived(store.ready && badgeDoc ? store.getBadgesFor(badgeDoc) : []);

  let busy = $state<Record<string, boolean>>({});

  async function invoke(id: string, onInvoke: (sel: { shardId: string; path: string; kind: 'file' | 'folder' }) => void | Promise<void>) {
    if (!store.ready || !store.selection) return;
    const sel = store.selection;
    busy[id] = true;
    try {
      await onInvoke(sel);
    } catch (err) {
      console.error(`[sh3-file-explorer] action "${id}" threw:`, err);
      alert(`Action "${id}" failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      busy[id] = false;
    }
  }
</script>

{#if !store.ready}
  <p class="sh3-fe-panel__empty">{store.error.message}</p>
{:else if !store.selection}
  <p class="sh3-fe-panel__empty">Select a file or folder to see details.</p>
{:else}
  <header class="sh3-fe-panel__header">
    <div class="sh3-fe-panel__path">{store.selection.path || '(shard root)'}</div>
    <div class="sh3-fe-panel__shard">{store.selection.shardId}</div>
  </header>
  {#if badges.length > 0}
    <ul class="sh3-fe-panel__badges">
      {#each badges as { providerId, badge } (providerId)}
        <li class="sh3-fe-panel__badge sh3-fe-panel__badge--{badge.tone ?? 'ok'}">
          <span class="sh3-fe-panel__badge-icon">{badge.icon}</span>
          <span class="sh3-fe-panel__badge-text">
            <span class="sh3-fe-panel__badge-label">{badge.label ?? badge.tooltip ?? ''}</span>
            {#if badge.detail}<span class="sh3-fe-panel__badge-detail">{badge.detail}</span>{/if}
          </span>
        </li>
      {/each}
    </ul>
  {/if}
  {#if actions.length > 0}
    <div class="sh3-fe-panel__actions">
      {#each actions as action (action.id)}
        <button
          class="sh3-fe-panel__action"
          class:primary={action.kind === 'primary'}
          disabled={busy[action.id]}
          onclick={() => invoke(action.id, action.onInvoke)}
        >
          {busy[action.id] ? '…' : action.label}
        </button>
      {/each}
    </div>
  {/if}
{/if}

<style>
  .sh3-fe-panel__empty { color: var(--shell-fg-muted); }
  .sh3-fe-panel__header { border-bottom: 1px solid var(--shell-border); padding-bottom: 6px; margin-bottom: 8px; color: var(--shell-fg); }
  .sh3-fe-panel__path { font-weight: 600; }
  .sh3-fe-panel__shard { font-size: 0.85em; color: var(--shell-fg-muted); }
  .sh3-fe-panel__actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .sh3-fe-panel__action {
    background: var(--shell-bg-elevated);
    color: var(--shell-fg);
    border: 1px solid var(--shell-border);
    padding: 4px 10px;
    font: inherit;
    cursor: pointer;
    border-radius: var(--shell-radius-sm);
  }
  .sh3-fe-panel__action:hover { background: var(--shell-accent-muted); }
  .sh3-fe-panel__action.primary { border-color: var(--shell-accent); }
  .sh3-fe-panel__action[disabled] { opacity: 0.5; cursor: progress; }
  .sh3-fe-panel__badges { list-style: none; padding: 0; margin: 8px 0 0; display: flex; flex-direction: column; gap: 4px; }
  .sh3-fe-panel__badge { display: flex; gap: 8px; padding: 4px 8px; background: var(--shell-bg-elevated, #2a2a2a); border-radius: var(--shell-radius-sm, 3px); }
  .sh3-fe-panel__badge--ok { color: var(--shell-accent, #4a90e2); }
  .sh3-fe-panel__badge--warn { color: #e6a23c; }
  .sh3-fe-panel__badge--muted { color: var(--shell-fg-muted, #888); }
  .sh3-fe-panel__badge-icon { flex: 0 0 auto; }
  .sh3-fe-panel__badge-text { display: flex; flex-direction: column; }
  .sh3-fe-panel__badge-label { color: var(--shell-fg); font-weight: 500; }
  .sh3-fe-panel__badge-detail { color: var(--shell-fg-muted, #888); font-size: 0.85em; }
</style>
