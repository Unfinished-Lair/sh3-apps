<script lang="ts">
  import type { ZoneName } from 'sh3-core';
  import type { ZoneGroup } from '../types';
  import EntryRow from './EntryRow.svelte';

  let {
    groups,
    onclearentry,
    onclearzone,
  }: {
    groups: ZoneGroup[];
    onclearentry: (zone: ZoneName, shardId: string) => void;
    onclearzone: (zone: ZoneName) => void;
  } = $props();

  let collapsed = $state<Record<string, boolean>>({});

  function toggle(zone: string) {
    collapsed[zone] = !collapsed[zone];
  }
</script>

<div class="zone-view">
  {#each groups as group}
    <div class="zone-section">
      <div class="zone-header">
        <button class="toggle-btn" onclick={() => toggle(group.zone)}>
          <span class="caret" class:open={!collapsed[group.zone]}>▶</span>
          <span class="zone-name">{group.zone}</span>
          <span class="zone-count">{group.entries.length}</span>
        </button>
        {#if group.entries.length > 0}
          <button class="clear-zone-btn" onclick={() => onclearzone(group.zone)}>
            Clear All
          </button>
        {/if}
      </div>
      {#if !collapsed[group.zone]}
        <div class="zone-entries">
          {#if group.entries.length === 0}
            <div class="empty-zone">(no data)</div>
          {:else}
            {#each group.entries as entry}
              <EntryRow
                label={entry.shardLabel}
                keys={entry.keys}
                onclear={() => onclearentry(entry.zone, entry.shardId)}
              />
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .zone-view {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .zone-section {
    border: 1px solid var(--shell-border);
    border-radius: 6px;
    overflow: hidden;
  }
  .zone-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: var(--shell-bg-sunken);
  }
  .toggle-btn {
    all: unset;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex: 1;
    color: var(--shell-fg);
  }
  .caret {
    font-size: 10px;
    transition: transform 0.15s;
    color: var(--shell-fg-subtle);
  }
  .caret.open {
    transform: rotate(90deg);
  }
  .zone-name {
    font-weight: 600;
    font-size: 13px;
  }
  .zone-count {
    font-size: 11px;
    color: var(--shell-fg-subtle);
    background: var(--shell-bg-elevated);
    padding: 1px 6px;
    border-radius: 8px;
  }
  .clear-zone-btn {
    all: unset;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;
    color: #ff6b6b;
    background: transparent;
  }
  .clear-zone-btn:hover {
    background: var(--shell-bg-elevated);
  }
  .zone-entries {
    padding: 4px 8px 8px;
  }
  .empty-zone {
    padding: 8px 12px;
    color: var(--shell-fg-subtle);
    font-style: italic;
    font-size: var(--shell-font-size);
  }
</style>
