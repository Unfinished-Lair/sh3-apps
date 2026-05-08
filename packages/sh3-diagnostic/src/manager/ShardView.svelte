<script lang="ts">
  import type { ZoneName } from 'sh3-core';
  import type { ShardGroup } from '../types';
  import EntryRow from './EntryRow.svelte';

  let {
    groups,
    onclearentry,
    onclearshard,
  }: {
    groups: ShardGroup[];
    onclearentry: (zone: ZoneName, shardId: string) => void;
    onclearshard: (shardId: string) => void;
  } = $props();

  let collapsed = $state<Record<string, boolean>>({});

  function toggle(shardId: string) {
    collapsed[shardId] = !collapsed[shardId];
  }
</script>

<div class="shard-view">
  {#if groups.length === 0}
    <div class="empty-state">(no stored data)</div>
  {:else}
    {#each groups as group}
      <div class="shard-section">
        <div class="shard-header">
          <button class="toggle-btn" onclick={() => toggle(group.shardId)}>
            <span class="caret" class:open={!collapsed[group.shardId]}>▶</span>
            <span class="shard-name">{group.shardLabel}</span>
            <span class="shard-id">{group.shardId}</span>
            <span class="zone-count">{group.entries.length} zones</span>
          </button>
          <button class="clear-shard-btn" onclick={() => onclearshard(group.shardId)}>
            Clear All
          </button>
        </div>
        {#if !collapsed[group.shardId]}
          <div class="shard-entries">
            {#each group.entries as entry}
              <EntryRow
                label={entry.zone}
                keys={entry.keys}
                onclear={() => onclearentry(entry.zone, entry.shardId)}
              />
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>

<style>
  .shard-view {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .shard-section {
    border: 1px solid var(--sh3-border);
    border-radius: 6px;
    overflow: hidden;
  }
  .shard-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: var(--sh3-bg-sunken);
  }
  .toggle-btn {
    all: unset;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex: 1;
    color: var(--sh3-fg);
  }
  .caret {
    font-size: 10px;
    transition: transform 0.15s;
    color: var(--sh3-fg-subtle);
  }
  .caret.open {
    transform: rotate(90deg);
  }
  .shard-name {
    font-weight: 600;
    font-size: 13px;
  }
  .shard-id {
    font-size: 11px;
    color: var(--sh3-fg-subtle);
    font-family: var(--sh3-font-mono);
  }
  .zone-count {
    font-size: 11px;
    color: var(--sh3-fg-subtle);
    background: var(--sh3-bg-elevated);
    padding: 1px 6px;
    border-radius: 8px;
  }
  .clear-shard-btn {
    all: unset;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;
    color: #ff6b6b;
    background: transparent;
  }
  .clear-shard-btn:hover {
    background: var(--sh3-bg-elevated);
  }
  .shard-entries {
    padding: 4px 8px 8px;
  }
  .empty-state {
    padding: 24px;
    text-align: center;
    color: var(--sh3-fg-subtle);
    font-style: italic;
  }
</style>
