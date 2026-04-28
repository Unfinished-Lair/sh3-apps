<script lang="ts">
  import type { NodeTemplate } from '../domain/types';

  interface Props {
    byCategory: Map<string, NodeTemplate[]>;
    x: number;
    y: number;
    onPick: (template: NodeTemplate) => void;
    onClose: () => void;
  }
  const props: Props = $props();

  let query = $state('');
  const filtered = $derived.by(() => {
    if (!query) return props.byCategory;
    const q = query.toLowerCase();
    const m = new Map<string, NodeTemplate[]>();
    for (const [cat, list] of props.byCategory) {
      const hits = list.filter((t) => t.label.toLowerCase().includes(q) || t.type.toLowerCase().includes(q));
      if (hits.length > 0) m.set(cat, hits);
    }
    return m;
  });

  function onKey(ev: KeyboardEvent) {
    if (ev.key === 'Escape') props.onClose();
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="palette" style:left="{props.x}px" style:top="{props.y}px">
  <input
    class="search"
    type="text"
    placeholder="Search node types…"
    bind:value={query}
    autofocus
  />
  <div class="lists">
    {#each [...filtered] as [category, templates] (category)}
      <div class="cat">
        <div class="cat-name">{category}</div>
        {#each templates as t (t.type)}
          <button class="item" onclick={() => props.onPick(t)}>{t.label}</button>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .palette {
    position: absolute;
    z-index: 10;
    background: var(--sh3-surface-2, #2a2a2a);
    border: 1px solid var(--sh3-border, #444);
    border-radius: 4px;
    padding: 4px;
    width: 240px;
    max-height: 320px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }
  .search { padding: 4px; border: 1px solid var(--sh3-border, #444); border-radius: 3px;
            background: var(--sh3-surface-1, #1f1f1f); color: var(--sh3-text-primary, #ddd); }
  .lists { overflow-y: auto; margin-top: 4px; }
  .cat-name { padding: 4px 6px 2px; font-size: 0.75em; text-transform: uppercase; opacity: 0.6; }
  .item { display: block; width: 100%; text-align: left; padding: 4px 6px; background: transparent; border: 0; color: var(--sh3-text-primary, #ddd); cursor: pointer; }
  .item:hover { background: var(--sh3-hover, #333); }
</style>
