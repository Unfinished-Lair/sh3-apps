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
  // Any runtime-mode verb node gets the entry-point button. No pickerable
  // gating — users decide whether prefetch makes sense for a given verb.
  const isRuntimeVerb = $derived(
    (value as { mode?: string } | null)?.mode === 'runtime',
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
{:else if isRuntimeVerb}
  <div class="enter-prefetch">
    <p class="hint">Switch to Prefetch mode to pick a row from this verb at design time.</p>
    <button type="button" class="primary" onclick={() => toggleSelectedNodeMode()}>
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
  .enter-prefetch button.primary {
    align-self: flex-start;
    padding: 6px 12px;
    border: none;
    border-radius: 3px;
    background: var(--sh3-accent, #4a9eff);
    color: var(--sh3-fg-on-accent, #fff);
    font: inherit;
    cursor: pointer;
  }
  .enter-prefetch button.primary:hover {
    filter: brightness(1.1);
  }
</style>
