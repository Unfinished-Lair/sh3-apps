<script lang="ts">
  import { Select, type ShardContext } from 'sh3-core';
  import type { GraphDomainContribution } from '../graph/contributions';
  import type { GraphDomain } from '../graph/domain/types';
  import {
    getEditorPrefs, subscribeEditorPrefs, setDomainQuickAccess,
    type DomainQuickAccess,
  } from '../settings/editor-prefs';

  const GRAPH_DOMAIN_POINT = 'sh3-editor.graph-domain';

  let { ctx }: { ctx: ShardContext } = $props();

  let contributions = $state(
    ctx.contributions.list<GraphDomainContribution>(GRAPH_DOMAIN_POINT),
  );
  $effect(() =>
    ctx.contributions.onChange(GRAPH_DOMAIN_POINT, () => {
      contributions = ctx.contributions.list<GraphDomainContribution>(GRAPH_DOMAIN_POINT);
    }),
  );

  let prefs = $state(getEditorPrefs());
  $effect(() => subscribeEditorPrefs((p) => { prefs = p; }));

  let selectedDomainId: string | null = $state(null);
  $effect(() => {
    if (selectedDomainId === null && contributions.length > 0) {
      selectedDomainId = contributions[0].id;
    }
  });

  function ensureDomainEntry(id: string): DomainQuickAccess {
    return prefs.quickAccess.domains[id]
        ?? { active: 'default', variants: { default: [] } };
  }

  function instantiate(id: string): GraphDomain | null {
    const c = contributions.find((x) => x.id === id);
    if (!c) return null;
    try {
      return c.factory({ log: () => {} });
    } catch {
      return null;
    }
  }

  function addVariant(id: string) {
    const entry = ensureDomainEntry(id);
    const name = window.prompt('New variant name?')?.trim();
    if (!name) return;
    if (entry.variants[name]) return;
    setDomainQuickAccess(id, {
      ...entry,
      variants: { ...entry.variants, [name]: [] },
      active: name,
    });
  }
  function deleteVariant(id: string, name: string) {
    const entry = ensureDomainEntry(id);
    const names = Object.keys(entry.variants);
    if (names.length <= 1) return;
    if (!window.confirm(`Delete variant '${name}'?`)) return;
    const { [name]: _gone, ...rest } = entry.variants;
    const nextActive = entry.active === name ? Object.keys(rest)[0] : entry.active;
    setDomainQuickAccess(id, { ...entry, variants: rest, active: nextActive });
  }
  function setActive(id: string, name: string) {
    const entry = ensureDomainEntry(id);
    if (!entry.variants[name]) return;
    setDomainQuickAccess(id, { ...entry, active: name });
  }
  function addTemplate(id: string, type: string) {
    const entry = ensureDomainEntry(id);
    const cur = entry.variants[entry.active] ?? [];
    if (cur.includes(type)) return;
    setDomainQuickAccess(id, {
      ...entry,
      variants: { ...entry.variants, [entry.active]: [...cur, type] },
    });
  }
  function removeTemplate(id: string, index: number) {
    const entry = ensureDomainEntry(id);
    const cur = entry.variants[entry.active] ?? [];
    const next = cur.slice(0, index).concat(cur.slice(index + 1));
    setDomainQuickAccess(id, {
      ...entry,
      variants: { ...entry.variants, [entry.active]: next },
    });
  }
  function moveTemplate(id: string, from: number, to: number) {
    const entry = ensureDomainEntry(id);
    const cur = entry.variants[entry.active] ?? [];
    if (from < 0 || to < 0 || from >= cur.length || to >= cur.length) return;
    const next = cur.slice();
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setDomainQuickAccess(id, {
      ...entry,
      variants: { ...entry.variants, [entry.active]: next },
    });
  }

  const selectedDomain = $derived.by(() =>
    selectedDomainId ? instantiate(selectedDomainId) : null,
  );
  const selectedEntry = $derived.by(() =>
    selectedDomainId ? ensureDomainEntry(selectedDomainId) : null,
  );
  const activeList = $derived.by(() =>
    selectedEntry?.variants[selectedEntry.active] ?? [],
  );
  const allTemplates = $derived.by(() =>
    selectedDomain?.getTemplates() ?? [],
  );

  let search = $state('');
  const addableTemplates = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return allTemplates.filter((t) =>
      !activeList.includes(t.type)
      && (q === '' || t.label.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)),
    );
  });
</script>

<div class="qa-editor" data-sh3-view="sh3-editor:help-quick-access">
  <aside class="left">
    <h3>Domains</h3>
    {#each contributions as c (c.id)}
      <button
        type="button"
        class="domain-row"
        class:active={c.id === selectedDomainId}
        onclick={() => { selectedDomainId = c.id; }}
      >{c.id}</button>
    {/each}
    {#if contributions.length === 0}
      <p class="empty">No graph domains registered.</p>
    {/if}
  </aside>

  <section class="right">
    {#if selectedDomainId && selectedEntry}
      <header class="variant-bar">
        <Select
          value={selectedEntry.active}
          options={Object.keys(selectedEntry.variants).map((v) => ({ value: v, label: v }))}
          onchange={(v) => setActive(selectedDomainId!, v as string)}
          size="sm"
        />
        <button type="button" onclick={() => addVariant(selectedDomainId!)}>+ New</button>
        <button
          type="button"
          disabled={Object.keys(selectedEntry.variants).length <= 1}
          onclick={() => deleteVariant(selectedDomainId!, selectedEntry.active)}
        >× Delete</button>
      </header>

      <h4>Entries</h4>
      <ol class="entries">
        {#each activeList as type, i (type)}
          <li>
            <span class="ent-type">{type}</span>
            <button type="button" disabled={i === 0}
                    onclick={() => moveTemplate(selectedDomainId!, i, i - 1)}>↑</button>
            <button type="button" disabled={i === activeList.length - 1}
                    onclick={() => moveTemplate(selectedDomainId!, i, i + 1)}>↓</button>
            <button type="button" onclick={() => removeTemplate(selectedDomainId!, i)}>×</button>
          </li>
        {/each}
        {#if activeList.length === 0}
          <li class="empty">No entries — pick from the list below.</li>
        {/if}
      </ol>

      <h4>Add from…</h4>
      <input
        class="search"
        type="text"
        placeholder="Search templates…"
        bind:value={search}
      />
      <ul class="addable">
        {#each addableTemplates as t (t.type)}
          <li>
            <span class="ent-type">{t.label}</span>
            <span class="ent-meta">({t.type})</span>
            <button type="button" onclick={() => addTemplate(selectedDomainId!, t.type)}>+</button>
          </li>
        {/each}
        {#if addableTemplates.length === 0}
          <li class="empty">Nothing to add.</li>
        {/if}
      </ul>
    {:else}
      <p class="empty">Select a domain on the left.</p>
    {/if}
  </section>
</div>

<style>
  .qa-editor { display: grid; grid-template-columns: 200px 1fr; gap: 12px;
               width: 100%; height: 100%; padding: 12px; box-sizing: border-box;
               background: var(--sh3-bg); color: var(--sh3-fg); }
  .left { border-right: 1px solid var(--sh3-border, #444); padding-right: 12px; }
  .right { overflow: auto; }
  .domain-row { display: block; width: 100%; text-align: left; padding: 4px 6px;
                background: transparent; color: inherit; border: 0; cursor: pointer;
                border-radius: 3px; font: inherit; }
  .domain-row.active { background: var(--sh3-hover, #333); }
  .variant-bar { display: flex; gap: 6px; align-items: center; margin-bottom: 12px; }
  .entries, .addable { list-style: none; padding: 0; margin: 0 0 16px; }
  .entries li, .addable li { display: flex; gap: 6px; align-items: center; padding: 4px 0; }
  .ent-type { flex: 1; }
  .ent-meta { color: var(--sh3-fg-muted, #888); font-size: 0.85em; }
  .empty { color: var(--sh3-fg-muted, #888); font-style: italic; }
  .search { padding: 4px 6px; border: 1px solid var(--sh3-border, #444);
            border-radius: 3px; background: var(--sh3-input-bg, var(--sh3-surface-1, #1f1f1f));
            color: inherit; font: inherit; width: 100%; box-sizing: border-box;
            margin-bottom: 6px; }
</style>
