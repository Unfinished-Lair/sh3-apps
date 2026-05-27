<script lang="ts">
  import {
    getActiveGraph, onActiveGraphChange, type ActiveGraphRef,
  } from '../active';
  import type { NodeTemplate } from '../domain/types';
  import { sh3 } from 'sh3-core';

  interface Props {
    /** When true, close the hosting float after a template is picked. */
    autoClose?: boolean;
    /**
     * MountContext.location snapshot used to discover the hosting float id
     * when `autoClose` is set. Passed through from the view factory.
     */
    location?: () => { kind: 'float'; floatId: string } | { kind: 'docked' } | null;
  }
  const props: Props = $props();

  // ---- Active-graph tracking -----------------------------------------------
  let active: ActiveGraphRef | null = $state(getActiveGraph());
  $effect(() => {
    const off = onActiveGraphChange((r) => { active = r; });
    return off;
  });

  // ---- Reactive template list ----------------------------------------------
  // Re-derive when the active graph swaps. Reading state.revision here is a
  // cheap defensive subscription so newly added templates show up — bridging
  // via a separate $effect that did `revision++` self-subscribed (revision++
  // reads + writes the signal) and tripped effect_update_depth_exceeded.
  const byCategory = $derived.by(() => {
    if (!active) return new Map<string, NodeTemplate[]>();
    void active.state.revision;
    return active.domain.getTemplatesByCategory();
  });

  // ---- Search filter -------------------------------------------------------
  let query = $state('');
  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    const m = new Map<string, NodeTemplate[]>();
    for (const [cat, list] of byCategory) {
      const hits = list.filter(
        (t) => t.label.toLowerCase().includes(q) || t.type.toLowerCase().includes(q),
      );
      if (hits.length > 0) m.set(cat, hits);
    }
    return m;
  });

  // ---- Insertion -----------------------------------------------------------
  const DRAG_MIME = 'application/sh3-editor.node-template';

  function onItemClick(t: NodeTemplate) {
    active?.insertNodeFromTemplate(t.type);
    if (props.autoClose) {
      const loc = props.location?.();
      if (loc?.kind === 'float') sh3.float.close(loc.floatId);
    }
  }

  function onItemDragStart(t: NodeTemplate, ev: DragEvent) {
    if (!ev.dataTransfer) return;
    ev.dataTransfer.setData(DRAG_MIME, t.type);
    ev.dataTransfer.effectAllowed = 'copy';
  }
</script>

<div class="picker">
  <input
    class="search"
    type="text"
    placeholder="Search node types…"
    bind:value={query}
  />
  {#if !active}
    <div class="empty">Focus a graph to insert nodes.</div>
  {:else if filtered.size === 0}
    <div class="empty">No matches.</div>
  {:else}
    <div class="lists">
      {#each [...filtered] as [category, templates] (category)}
        <div class="cat">
          <div class="cat-name">{category}</div>
          {#each templates as t (t.type)}
            <button
              class="item"
              type="button"
              draggable="true"
              onclick={() => onItemClick(t)}
              ondragstart={(ev) => onItemDragStart(t, ev)}
            >{t.label}</button>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .picker {
    position: relative;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    background: var(--sh3-bg-elevated, var(--sh3-surface-1, #1f1f1f));
    color: var(--sh3-fg, var(--sh3-text-primary, #ddd));
    font-family: var(--sh3-font-ui, system-ui);
    box-sizing: border-box;
    padding: 6px;
  }
  .search {
    padding: 4px 6px;
    border: 1px solid var(--sh3-border, #444);
    border-radius: 3px;
    background: var(--sh3-input-bg, var(--sh3-surface-1, #1f1f1f));
    color: inherit;
    font: inherit;
  }
  .empty {
    padding: 12px 6px;
    opacity: 0.6;
    font-size: 0.9em;
  }
  .lists {
    overflow-y: auto;
    margin-top: 6px;
    flex: 1 1 auto;
  }
  .cat-name {
    padding: 4px 6px 2px;
    font-size: 0.75em;
    text-transform: uppercase;
    opacity: 0.6;
  }
  .item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 4px 6px;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: grab;
    font: inherit;
  }
  .item:hover { background: var(--sh3-hover, #333); }
  .item:active { cursor: grabbing; }
</style>
