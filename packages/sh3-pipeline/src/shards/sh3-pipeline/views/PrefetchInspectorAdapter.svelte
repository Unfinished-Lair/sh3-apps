<script lang="ts">
  import type { InspectorRendererProps } from '@unfinished-lair/sh3-editor';
  import type { PrefetchConfig } from '../domain/types';
  import PrefetchInspector from './PrefetchInspector.svelte';
  import {
    refreshSelectedPrefetchNode,
    commitSelectedPrefetchConfig,
    toggleSelectedNodeMode,
    isSelectedPrefetchRefreshing,
  } from '../runtime/prefetch-actions';

  let { value }: InspectorRendererProps = $props();

  const cfg = $derived(
    ((value as { prefetch?: PrefetchConfig } | null)?.prefetch ?? null) as PrefetchConfig | null,
  );
  // Runtime-mode pickerable verb: the entry-point that lets the user flip
  // into prefetch mode. Without it the Toggle button (which lives inside
  // PrefetchInspector below) is unreachable — chicken-and-egg.
  const isRuntimePickerable = $derived(
    (value as { mode?: string; pickerable?: boolean } | null)?.mode === 'runtime' &&
      (value as { pickerable?: boolean } | null)?.pickerable === true,
  );
  const refreshing = $derived(isSelectedPrefetchRefreshing());
</script>

{#if cfg}
  <PrefetchInspector
    cfg={cfg}
    onCommit={(next) => commitSelectedPrefetchConfig(next)}
    onRefresh={() => refreshSelectedPrefetchNode()}
    onToggleMode={() => toggleSelectedNodeMode()}
    {refreshing}
  />
{:else if isRuntimePickerable}
  <div class="enter-prefetch">
    <p class="hint">This verb returns a list. Switch to Prefetch mode to pick a row at design time.</p>
    <button type="button" onclick={() => toggleSelectedNodeMode()}>
      Switch to Prefetch mode
    </button>
  </div>
{:else}
  <p class="empty">No prefetch config on the selected node.</p>
{/if}

<style>
  .empty {
    padding: 12px;
    color: var(--shell-fg-muted);
    font-size: 0.85em;
  }
  .enter-prefetch {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .enter-prefetch .hint {
    margin: 0;
    color: var(--shell-fg-muted);
    font-size: 0.85em;
  }
  .enter-prefetch button {
    align-self: flex-start;
  }
</style>
