<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  import { SELECTION_ACTION_POINT, type SelectionAction } from '../contributions';

  let { store }: { store: ExplorerStore } = $props();

  let tick = $state(0);
  $effect(() => store.ctx.contributions.onChange(SELECTION_ACTION_POINT, () => { tick++; }));

  const actions = $derived.by(() => {
    void tick;
    if (!store.ready || !store.selection) return [] as SelectionAction[];
    const sel = store.selection;
    return store.ctx.contributions
      .list<SelectionAction>(SELECTION_ACTION_POINT)
      .filter((a) => !a.appliesTo || a.appliesTo(sel));
  });

  let busy = $state<Record<string, boolean>>({});

  async function invoke(id: string, onInvoke: (sel: { shardId: string; path: string }) => void | Promise<void>) {
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
</style>
