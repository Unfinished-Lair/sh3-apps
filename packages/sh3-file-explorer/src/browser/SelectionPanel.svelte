<script module lang="ts">
  import type { SyncScope as Scope } from 'sh3-core';
  export function describeScope(s: Scope): string {
    if (s.kind === 'tenant') return 'tenant';
    if (s.kind === 'shard') return `shard: ${s.shardId}`;
    return `path: ${s.shardId}/${s.prefix}`;
  }
</script>

<script lang="ts">
  import type { ExplorerStore } from '../explorerShard.svelte';
  import type { SyncScope } from 'sh3-core';
  import { SyncGrantPicker } from 'sh3-core';

  let { store }: { store: ExplorerStore } = $props();

  let picking = $state(false);
  let connectorChoice = $state<string | null>(null);

  const coverage = $derived(store.ready ? store.coverageFor(store.selection) : []);
  const proposedScope = $derived<SyncScope | null>(
    store.ready && store.selection
      ? { kind: 'path', shardId: store.selection.shardId, prefix: store.selection.path }
      : null,
  );
  const connectorIds = $derived(store.ready ? store.connectorIds : []);

  function openPicker() {
    connectorChoice = connectorIds[0] ?? null;
    picking = true;
  }
  function closePicker() { picking = false; }
  async function onGranted() {
    if (store.ready) await store.refreshGrants();
    picking = false;
  }
</script>

{#if !store.ready}
  <p class="sh3-fe-panel__empty">{store.error.message}</p>
{:else if !store.selection}
  <p class="sh3-fe-panel__empty">Select a file or folder to see actions.</p>
{:else}
  <header class="sh3-fe-panel__header">
    <div class="sh3-fe-panel__path">{store.selection.path || '(shard root)'}</div>
    <div class="sh3-fe-panel__shard">{store.selection.shardId}</div>
  </header>

  <section class="sh3-fe-panel__section">
    <h4>Sync coverage</h4>
    {#if coverage.length === 0}
      <p class="sh3-fe-panel__muted">Not synced</p>
    {:else}
      <ul>
        {#each coverage as grant}
          <li>{grant.connectorId} ({describeScope(grant.scope)})</li>
        {/each}
      </ul>
    {/if}
  </section>

  <section class="sh3-fe-panel__section">
    <h4>Actions</h4>
    <button onclick={openPicker} disabled={connectorIds.length === 0}>Sync this path…</button>
    {#if connectorIds.length === 0}
      <p class="sh3-fe-panel__muted">No sync connectors installed.</p>
    {/if}
  </section>

  {#if picking && proposedScope && connectorChoice}
    <div class="sh3-fe-panel__picker">
      <label>
        Connector:
        <select bind:value={connectorChoice}>
          {#each connectorIds as id}<option value={id}>{id}</option>{/each}
        </select>
      </label>
      <SyncGrantPicker
        connectorId={connectorChoice}
        {proposedScope}
        onGranted={onGranted}
        onCancel={closePicker}
      >
        {#snippet rationale()}
          Grant <code>{connectorChoice}</code> access to
          <code>{store.selection.shardId}:{store.selection.path || '/'}</code>.
        {/snippet}
      </SyncGrantPicker>
    </div>
  {/if}
{/if}

<style>
  .sh3-fe-panel__empty, .sh3-fe-panel__muted { color: var(--sh3-muted, #888); }
  .sh3-fe-panel__header { border-bottom: 1px solid var(--sh3-border, #2a2a2a); padding-bottom: 6px; margin-bottom: 8px; }
  .sh3-fe-panel__path { font-weight: 600; }
  .sh3-fe-panel__shard { font-size: 0.85em; color: var(--sh3-muted, #888); }
  .sh3-fe-panel__section { margin-top: 12px; }
  .sh3-fe-panel__section h4 { margin: 0 0 4px 0; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.5px; color: var(--sh3-muted, #888); }
  .sh3-fe-panel__picker { margin-top: 12px; padding: 8px; border: 1px solid var(--sh3-border, #2a2a2a); border-radius: 4px; }
</style>
