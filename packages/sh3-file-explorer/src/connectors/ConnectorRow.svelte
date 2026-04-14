<script module lang="ts">
  import type { ExplorerStore as Store } from '../explorerShard.svelte';

  export type SetupRegistration = { viewId: string; label?: string };

  /*
   * Deferred: cross-shard setup-view registration.
   * Spec §"Extension point for connector-contributed setup views" keeps this
   * an explorer-owned convention (key: 'sh3-file-explorer:connector-views').
   * Until the storage/read mechanism is finalized, this returns null so the
   * "Open setup…" button stays hidden — exactly the MVP behavior agreed in
   * brainstorming.
   */
  export function readSetupView(_store: Store, _connectorId: string): SetupRegistration | null {
    return null;
  }
</script>

<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  import type { GrantRecord, SyncScope } from 'sh3-core';
  import { describeScope } from '../browser/SelectionPanel.svelte';

  let { store, connectorId }: { store: ExplorerStore; connectorId: string } = $props();

  let expanded = $state(false);
  let busy = $state(false);

  const grants = $derived<GrantRecord[]>(
    store.ready ? store.grants.filter((g) => g.connectorId === connectorId) : [],
  );

  const setupView = $derived(readSetupView(store, connectorId));

  async function revokeOne(scope: SyncScope) {
    if (!store.ready || busy) return;
    busy = true;
    try {
      await store.registry.revoke(connectorId, scope);
      await store.refreshGrants();
    } finally {
      busy = false;
    }
  }

  async function revokeAll() {
    if (!store.ready || busy) return;
    if (!confirm(`Revoke all ${grants.length} scopes for ${connectorId}?`)) return;
    busy = true;
    try {
      for (const g of grants) await store.registry.revoke(connectorId, g.scope);
      await store.refreshGrants();
    } finally {
      busy = false;
    }
  }

  function openSetup() {
    if (!setupView) return;
    // Cross-shard view navigation mechanism is a deferred item (spec §"Open items").
    console.warn('[sh3-file-explorer] Open setup… not wired yet', setupView);
  }
</script>

<div class="sh3-fe-row">
  <div class="sh3-fe-row__head">
    <strong>{connectorId}</strong>
    <span>{grants.length} scope{grants.length === 1 ? '' : 's'} granted</span>
    <button onclick={() => (expanded = !expanded)} disabled={grants.length === 0}>
      {expanded ? 'Hide' : 'Manage'}
    </button>
    <button onclick={revokeAll} disabled={grants.length === 0 || busy}>Revoke all</button>
    {#if setupView}
      <button onclick={openSetup}>Open setup…</button>
    {/if}
  </div>
  {#if expanded && grants.length > 0}
    <ul class="sh3-fe-row__scopes">
      {#each grants as g (describeScope(g.scope))}
        <li>
          <code>{describeScope(g.scope)}</code>
          <button onclick={() => revokeOne(g.scope)} disabled={busy}>Revoke</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .sh3-fe-row { border: 1px solid var(--sh3-border, #2a2a2a); border-radius: 4px; padding: 8px; }
  .sh3-fe-row__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .sh3-fe-row__head span { color: var(--sh3-muted, #888); font-size: 0.9em; }
  .sh3-fe-row__scopes { list-style: none; padding: 8px 0 0 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
  .sh3-fe-row__scopes li { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .sh3-fe-row__scopes code { font-size: 0.9em; }
</style>
