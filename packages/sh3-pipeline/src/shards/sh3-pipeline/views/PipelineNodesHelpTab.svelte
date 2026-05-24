<script lang="ts">
  import type { HelpTabContext } from '@unfinished-lair/sh3-editor/help/contributions';
  import type { NodeTemplate } from '@unfinished-lair/sh3-editor/graph/types';

  interface DomainLike { getTemplates(): NodeTemplate[]; }

  let { tabCtx: _tabCtx, domain }: { tabCtx: HelpTabContext; domain: DomainLike } = $props();

  let query = $state('');

  const templates = $derived(domain.getTemplates());

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => {
      const summary = String(t.defaultConfig?.summary ?? '').toLowerCase();
      return t.label.toLowerCase().includes(q)
        || t.type.toLowerCase().includes(q)
        || summary.includes(q);
    });
  });

  const grouped = $derived.by(() => {
    const map = new Map<string, NodeTemplate[]>();
    for (const t of filtered) {
      const cat = t.category ?? 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(t);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });
</script>

<div class="help-tab">
  <input type="search" placeholder="Search nodes…" bind:value={query} class="search" />
  {#if grouped.length === 0}
    <p class="empty">No node templates yet — open the pipeline app and run "Rebuild Catalog" from the Tools menu.</p>
  {/if}
  {#each grouped as [category, items] (category)}
    <section class="cat">
      <h3>{category}</h3>
      {#each items as t (t.type)}
        <article class="tpl">
          <header>
            <strong>{t.label}</strong>
            <code class="type">{t.type}</code>
          </header>
          {#if t.defaultConfig?.summary}
            <p class="summary">{t.defaultConfig.summary}</p>
          {/if}
          {#if t.ports.length > 0}
            <table class="ports">
              <thead><tr><th>Port</th><th>Direction</th><th>Type</th></tr></thead>
              <tbody>
                {#each t.ports as p}
                  <tr data-port-row>
                    <td>{p.label ?? p.id}</td>
                    <td>{p.direction}</td>
                    <td>{p.dataType ?? '—'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </article>
      {/each}
    </section>
  {/each}
</div>

<style>
  .help-tab { padding: 8px 12px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; height: 100%; }
  .search { padding: 4px 8px; font-size: 0.95em; }
  .empty { color: var(--sh3-muted, #888); font-style: italic; }
  .cat h3 { margin: 0 0 6px 0; font-size: 0.95em; color: var(--sh3-muted, #888); text-transform: uppercase; letter-spacing: 0.05em; }
  .tpl { padding: 8px; border: 1px solid var(--sh3-border, #333); border-radius: 4px; margin-bottom: 6px; }
  .tpl header { display: flex; gap: 8px; align-items: baseline; }
  .tpl .type { font-size: 0.8em; color: var(--sh3-muted, #888); }
  .tpl .summary { margin: 4px 0; font-size: 0.9em; }
  .ports { width: 100%; font-size: 0.85em; }
  .ports th, .ports td { text-align: left; padding: 2px 6px; border-bottom: 1px solid var(--sh3-border-subtle, #222); }
  .ports th { color: var(--sh3-muted, #888); font-weight: normal; }
</style>
