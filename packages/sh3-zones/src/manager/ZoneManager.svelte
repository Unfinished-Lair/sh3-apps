<script lang="ts">
  import 'sh3-core/tokens.css';
  import type { ZoneManager as ZoneManagerAPI } from 'sh3-core';
  import {
    getZoneGroups,
    getShardGroups,
    clearEntry,
    clearEntireZone,
    clearAllCaches,
    ZONES,
  } from '../zone-service';
  import type { ZoneGroup, ShardGroup } from '../types';
  import TopBar from './TopBar.svelte';
  import ZoneView from './ZoneView.svelte';
  import ShardView from './ShardView.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';

  let { zones }: { zones: ZoneManagerAPI } = $props();

  let activeView = $state<'zone' | 'shard'>('zone');
  let zoneGroups = $state<ZoneGroup[]>(getZoneGroups(zones));
  let shardGroups = $state<ShardGroup[]>(getShardGroups(zones));

  // Confirmation dialog state
  let dialogOpen = $state(false);
  let dialogTitle = $state('');
  let dialogMessage = $state('');
  let dialogAction = $state<() => void>(() => {});

  function refresh() {
    zoneGroups = getZoneGroups(zones);
    shardGroups = getShardGroups(zones);
  }

  function confirm(title: string, message: string, action: () => void) {
    dialogTitle = title;
    dialogMessage = message;
    dialogAction = () => {
      action();
      refresh();
      dialogOpen = false;
    };
    dialogOpen = true;
  }

  function handleClearEntry(zone: string, shardId: string) {
    const label = zoneGroups
      .flatMap((g) => g.entries)
      .find((e) => e.zone === zone && e.shardId === shardId)?.shardLabel ?? shardId;
    confirm(
      'Clear entry',
      `Clear ${zone} data for ${label}?`,
      () => clearEntry(zones, zone as any, shardId),
    );
  }

  function handleClearZone(zone: string) {
    const group = zoneGroups.find((g) => g.zone === zone);
    const count = group?.entries.length ?? 0;
    confirm(
      'Clear zone',
      `Clear all ${zone} data? This affects ${count} shard${count !== 1 ? 's' : ''}.`,
      () => clearEntireZone(zones, zone as any),
    );
  }

  function handleClearShard(shardId: string) {
    const group = shardGroups.find((g) => g.shardId === shardId);
    const label = group?.shardLabel ?? shardId;
    confirm(
      'Clear shard',
      `Clear all data for ${label} across all zones?`,
      () => {
        for (const zone of ZONES) {
          clearEntry(zones, zone, shardId);
        }
      },
    );
  }

  function handleClearAll() {
    confirm(
      'Clear all caches',
      'Clear all cached data across all zones? This cannot be undone.',
      () => clearAllCaches(zones),
    );
  }
</script>

<div class="zone-manager">
  <TopBar
    {activeView}
    ontoggleview={(v) => { activeView = v; }}
    onclearall={handleClearAll}
  />
  <div class="content">
    {#if activeView === 'zone'}
      <ZoneView
        groups={zoneGroups}
        onclearentry={handleClearEntry}
        onclearzone={handleClearZone}
      />
    {:else}
      <ShardView
        groups={shardGroups}
        onclearentry={handleClearEntry}
        onclearshard={handleClearShard}
      />
    {/if}
  </div>
  <ConfirmDialog
    open={dialogOpen}
    title={dialogTitle}
    message={dialogMessage}
    onconfirm={dialogAction}
    oncancel={() => { dialogOpen = false; }}
  />
</div>

<style>
  .zone-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
    font-size: var(--shell-font-size);
  }
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
</style>
