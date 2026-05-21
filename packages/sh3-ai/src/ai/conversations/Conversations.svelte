<script lang="ts">
  import { onMount } from 'svelte';
  import type { ConversationStore } from './store';
  import type { ConversationSummary } from './types';

  interface Props {
    store: ConversationStore;
    getActiveId: () => string | null;
    onActivate: (id: string) => Promise<void> | void;
    onNew: () => Promise<void> | void;
    onRename: (id: string, newTitle: string) => Promise<void> | void;
    onDelete: (id: string) => Promise<void> | void;
  }

  let { store, getActiveId, onActivate, onNew, onRename, onDelete }: Props = $props();

  let summaries = $state<ConversationSummary[]>([]);
  let activeId = $state<string | null>(null);
  let renamingId = $state<string | null>(null);
  let renamingDraft = $state('');
  let busy = $state(false);
  let error = $state<string | null>(null);

  async function refresh() {
    try {
      summaries = await store.list();
      activeId = getActiveId();
      error = null;
    } catch (err) {
      error = (err as Error).message;
    }
  }

  // Debounced refresh used by the watch subscription so a burst of writes
  // (e.g. a multi-turn dispatch hitting autosave repeatedly) doesn't
  // re-list on every keystroke.
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  function scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      void refresh();
    }, 150);
  }

  onMount(() => {
    void refresh();
    const off = store.watch(() => scheduleRefresh());
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      off();
    };
  });

  async function handleActivate(id: string) {
    if (busy || id === activeId) return;
    busy = true;
    try {
      await onActivate(id);
      await refresh();
    } finally {
      busy = false;
    }
  }

  async function handleNew() {
    if (busy) return;
    busy = true;
    try {
      await onNew();
      await refresh();
    } finally {
      busy = false;
    }
  }

  function startRename(s: ConversationSummary) {
    renamingId = s.id;
    renamingDraft = s.title;
  }

  async function commitRename() {
    if (!renamingId) return;
    const id = renamingId;
    const title = renamingDraft.trim();
    renamingId = null;
    if (!title) return;
    busy = true;
    try {
      await onRename(id, title);
      await refresh();
    } finally {
      busy = false;
    }
  }

  function cancelRename() {
    renamingId = null;
    renamingDraft = '';
  }

  async function handleDelete(id: string) {
    if (busy) return;
    if (id === activeId) return; // active deletion blocked at view level
    busy = true;
    try {
      await onDelete(id);
      await refresh();
    } finally {
      busy = false;
    }
  }

  function relativeTime(ts: number): string {
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return new Date(ts).toISOString().slice(0, 10);
  }
</script>

<div class="conversations-view">
  <header>
    <span class="title">AI Conversations</span>
    <button class="new-btn" onclick={handleNew} disabled={busy}>+ New</button>
  </header>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if summaries.length === 0}
    <div class="empty">No conversations yet. Type something in the AI mode or click + New.</div>
  {:else}
    <ul class="rows">
      {#each summaries as s (s.id)}
        <li class="row" class:active={s.id === activeId}>
          <button
            class="row-body"
            onclick={() => handleActivate(s.id)}
            disabled={busy && s.id !== activeId}
          >
            {#if renamingId === s.id}
              <input
                class="rename-input"
                bind:value={renamingDraft}
                onkeydown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); void commitRename(); }
                  else if (e.key === 'Escape') { e.preventDefault(); cancelRename(); }
                }}
                onblur={() => void commitRename()}
                onclick={(e) => e.stopPropagation()}
                autofocus
              />
            {:else}
              <span class="row-title">{s.title || '(untitled)'}</span>
            {/if}
            <span class="row-meta">
              <span class="badge">{s.providerId ?? '?'}</span>
              <span class="msgs">{s.messageCount} msg{s.messageCount === 1 ? '' : 's'}</span>
              <span class="time">{relativeTime(s.updatedAt)}</span>
            </span>
          </button>
          <div class="row-actions">
            <button
              title="Rename"
              onclick={() => startRename(s)}
              disabled={busy || renamingId !== null}
            >✎</button>
            <button
              title={s.id === activeId ? 'Cannot delete active conversation' : 'Delete'}
              onclick={() => handleDelete(s.id)}
              disabled={busy || s.id === activeId}
            >🗑</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .conversations-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    color: var(--sh3-fg, #ddd);
    background: var(--sh3-bg, #181818);
    font-family: var(--sh3-mono, monospace);
    font-size: 0.92em;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 0.75em;
    border-bottom: 1px solid var(--sh3-fg-dim, #333);
    flex: 0 0 auto;
  }
  .title { font-weight: 600; opacity: 0.9; }
  .new-btn {
    padding: 0.25em 0.6em;
    background: var(--sh3-accent, #4a90e2);
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font: inherit;
  }
  .new-btn:disabled { opacity: 0.5; cursor: default; }
  .error {
    padding: 0.5em 0.75em;
    color: var(--sh3-error, #c66);
  }
  .empty {
    padding: 1em 0.75em;
    opacity: 0.6;
    font-style: italic;
  }
  ul.rows {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    flex: 1 1 auto;
  }
  .row {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--sh3-fg-dim, #2a2a2a);
  }
  .row.active {
    background: var(--sh3-bg-active, rgba(74, 144, 226, 0.15));
    border-left: 2px solid var(--sh3-accent, #4a90e2);
  }
  .row-body {
    flex: 1 1 auto;
    text-align: left;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    padding: 0.5em 0.75em;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.15em;
    overflow: hidden;
  }
  .row-body:hover { background: var(--sh3-bg-hover, rgba(255,255,255,0.04)); }
  .row-body:disabled { cursor: default; }
  .row-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row-meta {
    display: flex;
    gap: 0.5em;
    font-size: 0.85em;
    opacity: 0.65;
    align-items: center;
  }
  .badge {
    padding: 0 0.4em;
    border-radius: var(--sh3-radius-sm, 3px);
    background: var(--sh3-bg-elevated);
    font-size: 0.85em;
  }
  .row-actions {
    display: flex;
    align-items: center;
    padding: 0 0.4em;
    gap: 0.15em;
    opacity: 0;
    transition: opacity 0.1s;
  }
  .row:hover .row-actions { opacity: 1; }
  .row-actions button {
    background: none;
    border: none;
    color: inherit;
    padding: 0.2em 0.4em;
    cursor: pointer;
    border-radius: 3px;
  }
  .row-actions button:hover:not(:disabled) {
    background: var(--sh3-bg-hover, rgba(255,255,255,0.08));
  }
  .row-actions button:disabled { opacity: 0.3; cursor: default; }
  .rename-input {
    width: 100%;
    background: var(--sh3-bg, #181818);
    color: inherit;
    font: inherit;
    border: 1px solid var(--sh3-accent, #4a90e2);
    padding: 0.15em 0.4em;
    border-radius: 2px;
  }
</style>
