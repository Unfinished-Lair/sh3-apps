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

  // Only renders for prefetch-mode nodes (syncInspector routes them here via
  // meta.type). Runtime-mode verbs — pickerable or not — use the default
  // inspector walker; the "Switch to Prefetch mode" entry-point is surfaced
  // as a toolbar action above the walker body, no view swap needed.
  const cfg = $derived(
    ((value as { prefetch?: PrefetchConfig } | null)?.prefetch ?? null) as PrefetchConfig | null,
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
{:else}
  <p class="empty">No prefetch config on the selected node.</p>
{/if}

<style>
  .empty {
    padding: 12px;
    color: var(--shell-fg-muted);
    font-size: 0.85em;
  }
</style>
