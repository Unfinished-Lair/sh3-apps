<script lang="ts">
  import { Select } from 'sh3-core';
  import type { GraphDomain, NodeVisuals } from '../domain/types';

  interface Props {
    domain: GraphDomain;
    /** Template types — pre-resolved via resolveActiveEntries. */
    entries: string[];
    /** Names of all variants for this domain. If only ['default'], the chevron is hidden. */
    variantNames: string[];
    activeVariant: string;
    /** Show the dedicated "add block" entry on the right side of the toolbar. */
    showAddBlock?: boolean;
    onInsert: (templateType: string) => void;
    onSwitchVariant: (name: string) => void;
    onOpenEditor: () => void;
    onAddBlock?: () => void;
  }
  let props: Props = $props();

  const DRAG_MIME = 'application/sh3-editor.node-template';
  const BLOCK_DRAG_MIME = 'application/sh3-editor.block';

  const variantOptions = $derived(props.variantNames.map((v) => ({ value: v, label: v })));

  function visualsFor(type: string): NodeVisuals {
    return props.domain.getNodeVisuals(type);
  }
  function labelFor(type: string): string {
    const v = visualsFor(type);
    return typeof v.label === 'string' ? v.label : type;
  }
  function badgeFor(type: string): string {
    const v = visualsFor(type);
    if (v.icon) return v.icon;
    return labelFor(type).slice(0, 2);
  }

  function onItemClick(type: string) {
    props.onInsert(type);
  }
  function onItemDragStart(type: string, ev: DragEvent) {
    if (!ev.dataTransfer) return;
    ev.dataTransfer.setData(DRAG_MIME, type);
    ev.dataTransfer.effectAllowed = 'copy';
  }
  function onBlockDragStart(ev: DragEvent) {
    if (!ev.dataTransfer) return;
    ev.dataTransfer.setData(BLOCK_DRAG_MIME, '1');
    ev.dataTransfer.effectAllowed = 'copy';
  }
</script>

{#if props.entries.length > 0 || props.showAddBlock}
  <div class="qa-toolbar" role="toolbar" aria-label="Quick access">
    {#each props.entries as type (type)}
      <button
        type="button"
        class="qa-btn"
        title={labelFor(type)}
        draggable="true"
        onclick={() => onItemClick(type)}
        ondragstart={(ev) => onItemDragStart(type, ev)}
      >{badgeFor(type)}</button>
    {/each}
    {#if props.showAddBlock && props.onAddBlock}
      {#if props.entries.length > 0}<div class="sep"></div>{/if}
      <button
        type="button"
        class="qa-btn"
        title="Add block — click to place at center, drag to drop"
        draggable="true"
        onclick={() => props.onAddBlock?.()}
        ondragstart={onBlockDragStart}
      >▭</button>
    {/if}
    {#if props.variantNames.length > 1}
      <div class="sep"></div>
      <div class="variant-select">
        <Select
          value={props.activeVariant}
          options={variantOptions}
          onchange={(v) => props.onSwitchVariant(v as string)}
          size="sm"
        />
      </div>
    {/if}
    <button
      type="button"
      class="qa-btn edit"
      title="Edit Quick Access"
      aria-label="Edit Quick Access"
      onclick={() => props.onOpenEditor()}
    >⚙</button>
  </div>
{/if}

<style>
  .qa-toolbar {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 2px;
    background: var(--sh3-surface-1, #1f1f1f);
    border: 1px solid var(--sh3-border, #444);
    border-radius: 4px;
    padding: 2px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  }
  .qa-btn {
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    background: transparent;
    color: var(--sh3-text-primary, #ddd);
    border: 0;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1;
  }
  .qa-btn:hover { background: var(--sh3-hover, #333); }
  .sep {
    width: 1px;
    align-self: stretch;
    margin: 2px 2px;
    background: var(--sh3-border, #444);
    opacity: 0.6;
  }
  .variant-select :global(button.select-trigger) {
    /* Compact the themed select so it fits the toolbar bar. */
    min-width: 120px;
  }
  .qa-btn.edit { color: var(--sh3-fg-muted, #888); }
</style>
