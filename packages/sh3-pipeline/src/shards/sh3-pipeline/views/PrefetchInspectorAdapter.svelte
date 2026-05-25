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
