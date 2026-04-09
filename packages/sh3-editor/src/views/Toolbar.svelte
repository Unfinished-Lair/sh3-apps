<script lang="ts">
  import type { ToolbarAction } from '../types';

  interface Props {
    actions: ToolbarAction[];
    filePath?: string | null;
  }

  let { actions, filePath = null }: Props = $props();

  // Group actions by their group field. Ungrouped actions go into '_default'.
  let grouped = $derived.by(() => {
    const groups: { key: string; items: ToolbarAction[] }[] = [];
    const map = new Map<string, ToolbarAction[]>();

    for (const action of actions) {
      const key = action.group ?? '_default';
      if (!map.has(key)) {
        const items: ToolbarAction[] = [];
        map.set(key, items);
        groups.push({ key, items });
      }
      map.get(key)!.push(action);
    }

    return groups;
  });
</script>

{#if actions.length > 0 || filePath}
  <div class="toolbar">
    {#each grouped as group, gi}
      {#if gi > 0}
        <span class="toolbar-sep"></span>
      {/if}
      {#each group.items as action (action.id)}
        <button
          class="toolbar-btn"
          class:toolbar-accent={action.accent}
          disabled={action.disabled}
          title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
          onclick={action.onAction}
        >
          {#if action.icon}{action.icon} {/if}{action.label}
        </button>
      {/each}
    {/each}

    {#if filePath}
      <div class="toolbar-spacer"></div>
      <span class="toolbar-path" title={filePath}>{filePath.split(/[/\\]/).pop()}</span>
    {/if}
  </div>
{/if}

<style>
  .toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--shell-border);
    background: var(--shell-bg-raised);
    font-family: var(--shell-font-ui);
    font-size: 12px;
    flex-shrink: 0;
  }

  .toolbar-btn {
    padding: 2px 8px;
    border: 1px solid var(--shell-border);
    border-radius: 3px;
    background: var(--shell-bg);
    color: var(--shell-fg);
    font-size: 11px;
    cursor: pointer;
    white-space: nowrap;
  }

  .toolbar-btn:hover:not(:disabled) {
    background: var(--shell-bg-sunken);
  }

  .toolbar-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .toolbar-accent {
    color: var(--shell-accent);
  }

  .toolbar-spacer {
    flex: 1;
  }

  .toolbar-sep {
    width: 1px;
    height: 16px;
    background: var(--shell-border);
  }

  .toolbar-path {
    color: var(--shell-fg-muted);
    font-family: var(--shell-font-mono);
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
