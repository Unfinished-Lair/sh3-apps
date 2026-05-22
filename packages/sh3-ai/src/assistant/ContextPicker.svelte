<script lang="ts">
  import type { ShardContext, FieldView } from 'sh3-core';
  import { sh3 } from 'sh3-core';
  import type { ContextSource } from 'sh3-core';
  import { CONTEXT_SOURCE_POINT_ID } from 'sh3-core';
  import {
    addrKey,
    entryKey,
    excludeAddr,
    groupSources,
    matchesFilter,
    sortFields,
    type AddrLike,
    type FieldLike,
    type SelectedEntry,
    type SourceGroup,
  } from './picker';

  interface Props {
    ctx: ShardContext;
    excludeAddr: AddrLike;
    selected: SelectedEntry[];
  }
  let { ctx, excludeAddr: target, selected = $bindable() }: Props = $props();

  let dropdownOpen = $state(false);
  let query = $state('');
  let expanded = $state<Set<string>>(new Set());

  let allFields = $state<FieldView[]>([]);
  let allSources = $state<ContextSource[]>([]);

  const browseAvailable = typeof ctx.browse?.readFrom === 'function';

  function refreshFields(): void {
    allFields = ctx.sh3.fields.list();
  }
  function refreshSources(): void {
    allSources = ctx.contributions.list<ContextSource>(CONTEXT_SOURCE_POINT_ID);
  }

  refreshSources();
  const offSources = ctx.contributions.onChange(
    CONTEXT_SOURCE_POINT_ID,
    refreshSources,
  );
  $effect(() => () => offSources());

  let filteredFields = $derived.by(() => {
    const candidates = excludeAddr(allFields as FieldLike[], target);
    return sortFields(candidates).filter((f) => matchesFilter(f, query));
  });

  let filteredSourceGroups = $derived.by<SourceGroup[]>(() => {
    const filtered = allSources.filter((s) => matchesFilter(s, query));
    return groupSources(filtered);
  });

  let showDocumentsRow = $derived(browseAvailable && (query === '' || 'browse documents'.includes(query.toLowerCase())));

  function isSelected(key: string): boolean {
    return selected.some((entry) => entryKey(entry) === key);
  }

  function addField(fv: FieldView): void {
    const addr = { shardId: fv.shardId, fieldId: fv.fieldId };
    if (fv.slotId !== undefined) (addr as { slotId?: string }).slotId = fv.slotId;
    const entry: SelectedEntry = { kind: 'field', addr };
    if (isSelected(entryKey(entry))) return;
    selected = [...selected, entry];
    query = '';
    dropdownOpen = false;
  }

  function addSource(src: ContextSource): void {
    const entry: SelectedEntry = { kind: 'source', id: src.id };
    if (isSelected(entryKey(entry))) return;
    selected = [...selected, entry];
    query = '';
    dropdownOpen = false;
  }

  async function addDocument(): Promise<void> {
    dropdownOpen = false;
    if (!ctx.browse?.readFrom) {
      sh3.toast.notify('AI context: documents:read not granted.', { level: 'warn' });
      return;
    }
    const picked = await ctx.documentPicker.open();
    if (!picked) return;
    if (picked.kind === 'folder') {
      sh3.toast.notify('AI context: pick a file, not a folder.', { level: 'warn' });
      return;
    }
    const entry: SelectedEntry = {
      kind: 'document',
      shardId: picked.shardId,
      path: picked.path,
    };
    if (isSelected(entryKey(entry))) return;
    selected = [...selected, entry];
    query = '';
  }

  function remove(key: string): void {
    selected = selected.filter((entry) => entryKey(entry) !== key);
    if (expanded.has(key)) {
      expanded.delete(key);
      expanded = new Set(expanded);
    }
  }

  function toggleExpand(key: string): void {
    if (expanded.has(key)) expanded.delete(key);
    else expanded.add(key);
    expanded = new Set(expanded);
  }

  function lookupFieldByKey(key: string): FieldView | undefined {
    const stripped = key.slice('field:'.length);
    return allFields.find((f) => {
      return `${f.shardId}␟${f.slotId ?? ''}␟${f.fieldId}` === stripped;
    });
  }

  function chipLabel(entry: SelectedEntry): string {
    if (entry.kind === 'field') {
      const fv = lookupFieldByKey(entryKey(entry));
      if (!fv) return `${entry.addr.shardId}·${entry.addr.fieldId} (unavailable)`;
      return `${fv.shardId}·${fv.label}`;
    }
    if (entry.kind === 'source') {
      const src = allSources.find((s) => s.id === entry.id);
      if (!src) return `${entry.id} (unavailable)`;
      const prefix = src.group ?? entry.id.split(':')[0];
      return `${prefix}·${src.label}`;
    }
    return docChipLabel(entry.shardId, entry.path);
  }

  function docChipLabel(shardId: string, path: string): string {
    const full = `${shardId}/${path}`;
    if (full.length <= 50) return full;
    return `${full.slice(0, 24)}…${full.slice(full.length - 24)}`;
  }

  function kindOf(entry: SelectedEntry): string {
    if (entry.kind === 'field') {
      const fv = lookupFieldByKey(entryKey(entry));
      return fv?.kind ?? '';
    }
    if (entry.kind === 'source') {
      const src = allSources.find((s) => s.id === entry.id);
      return src?.kind ?? 'text';
    }
    if (entry.path.toLowerCase().endsWith('.md') || entry.path.toLowerCase().endsWith('.markdown')) return 'markdown';
    if (entry.path.toLowerCase().endsWith('.json')) return 'json';
    return 'text';
  }

  function onToggleDropdown(): void {
    dropdownOpen = !dropdownOpen;
    if (dropdownOpen) {
      refreshFields();
      refreshSources();
    }
  }

  // Per-instance async preview cache for source / document chips.
  const previewCache = new Map<string, { state: 'loading' | 'ready' | 'error'; text?: string; message?: string }>();

  function previewBody(entry: SelectedEntry): string {
    const key = entryKey(entry);
    if (entry.kind === 'field') {
      try {
        const v = ctx.sh3.fields.get(entry.addr);
        return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
      } catch {
        return '—';
      }
    }
    const cached = previewCache.get(key);
    if (cached?.state === 'ready') return cached.text ?? '';
    if (cached?.state === 'error') return `(error: ${cached.message ?? 'unknown'})`;
    if (!cached) {
      previewCache.set(key, { state: 'loading' });
      void loadPreview(entry, key);
    }
    return '(loading…)';
  }

  async function loadPreview(entry: SelectedEntry, key: string): Promise<void> {
    try {
      let value: unknown;
      if (entry.kind === 'source') {
        const src = allSources.find((s) => s.id === entry.id);
        if (!src) {
          previewCache.set(key, { state: 'error', message: 'source unregistered' });
          expanded = new Set(expanded);
          return;
        }
        value = await src.get();
      } else if (entry.kind === 'document') {
        if (!ctx.browse?.readFrom) {
          previewCache.set(key, { state: 'error', message: 'documents:read not granted' });
          expanded = new Set(expanded);
          return;
        }
        value = await ctx.browse.readFrom(entry.shardId, entry.path);
      } else {
        return; // fields handled synchronously above
      }
      const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      previewCache.set(key, { state: 'ready', text });
      expanded = new Set(expanded);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      previewCache.set(key, { state: 'error', message });
      expanded = new Set(expanded);
    }
  }
</script>

<div class="picker-root">
  <div class="row">
    <button type="button" class="ghost add-btn" onclick={onToggleDropdown}>
      + Add context {dropdownOpen ? '▴' : '▾'}
    </button>
    {#each selected as entry (entryKey(entry))}
      <span class="chip">
        <button type="button" class="chip-x" aria-label="Remove" onclick={() => remove(entryKey(entry))}>×</button>
        <button type="button" class="chip-body" onclick={() => toggleExpand(entryKey(entry))}>
          {chipLabel(entry)}
        </button>
      </span>
    {/each}
  </div>

  {#if dropdownOpen}
    <div class="dropdown">
      <input
        type="text"
        class="search"
        bind:value={query}
        placeholder="search fields, sources, documents…"
        autofocus
      />
      <div class="results">
        {#if filteredFields.length > 0}
          <div class="section-label">FIELDS</div>
          {#each filteredFields as fv (addrKey(fv))}
            {@const key = `field:${fv.shardId}␟${fv.slotId ?? ''}␟${fv.fieldId}`}
            <button
              type="button"
              class="result"
              class:selected={isSelected(key)}
              disabled={isSelected(key)}
              onclick={() => addField(fv)}
            >
              <span class="result-label">{fv.label}</span>
              <span class="result-meta">{fv.shardId}{fv.slotId ? `·${fv.slotId}` : ''}·{fv.fieldId}</span>
            </button>
          {/each}
        {/if}

        {#if filteredSourceGroups.length > 0}
          <div class="section-label">SOURCES</div>
          {#each filteredSourceGroups as group (group.group)}
            <div class="group-label">{group.group}</div>
            {#each group.items as src (src.id)}
              {@const key = `source:${src.id}`}
              <button
                type="button"
                class="result"
                class:selected={isSelected(key)}
                disabled={isSelected(key)}
                onclick={() => addSource(src)}
              >
                <span class="result-label">{src.label}</span>
                <span class="result-meta">{src.kind ?? 'text'}</span>
              </button>
            {/each}
          {/each}
        {/if}

        {#if showDocumentsRow}
          <div class="section-label">DOCUMENTS</div>
          <button type="button" class="result" onclick={addDocument}>
            <span class="result-label">» browse documents…</span>
            <span class="result-meta">picker</span>
          </button>
        {/if}

        {#if filteredFields.length === 0 && filteredSourceGroups.length === 0 && !showDocumentsRow}
          <div class="empty">no matches</div>
        {/if}
      </div>
    </div>
  {/if}

  {#each selected as entry (entryKey(entry))}
    {#if expanded.has(entryKey(entry))}
      <div class="preview">
        <div class="preview-label">{chipLabel(entry)} <span class="preview-kind">{kindOf(entry)}</span></div>
        <pre>{previewBody(entry)}</pre>
      </div>
    {/if}
  {/each}
</div>

<style>
  .picker-root {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
  }
  .add-btn {
    font-size: 11px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    background: var(--sh3-bg-sunken, #161616);
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 3px;
    font-size: 11px;
  }
  .chip-x, .chip-body {
    appearance: none;
    background: transparent;
    color: var(--sh3-fg, #e0e0e0);
    border: none;
    padding: 2px 6px;
    cursor: pointer;
    font: inherit;
  }
  .chip-x {
    padding-right: 2px;
    color: var(--sh3-fg-muted, #888);
  }
  .chip-x:hover { color: var(--sh3-error, #ff7a7a); }
  .dropdown {
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 3px;
    background: var(--sh3-bg-sunken, #161616);
    padding: 4px;
    max-height: 320px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .search {
    width: 100%;
    box-sizing: border-box;
    background: var(--sh3-bg, #1e1e1e);
    color: var(--sh3-fg, #e0e0e0);
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 3px;
    padding: 3px 6px;
    font: inherit;
  }
  .results {
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  .section-label {
    font-size: 10px;
    color: var(--sh3-fg-muted, #888);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 6px 6px 2px;
  }
  .group-label {
    font-size: 10px;
    color: var(--sh3-fg-subtle, #666);
    margin: 2px 12px;
  }
  .result {
    appearance: none;
    background: transparent;
    color: var(--sh3-fg, #e0e0e0);
    border: none;
    text-align: left;
    padding: 4px 6px;
    cursor: pointer;
    font: inherit;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    border-radius: 2px;
  }
  .result:hover:not(:disabled) {
    background: var(--sh3-bg, #1e1e1e);
  }
  .result.selected {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .result-meta {
    color: var(--sh3-fg-muted, #888);
    font-family: var(--sh3-font-mono, monospace);
    font-size: 10px;
  }
  .empty {
    color: var(--sh3-fg-muted, #888);
    font-size: 11px;
    padding: 4px 6px;
  }
  .preview {
    background: var(--sh3-bg-sunken, #161616);
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 3px;
    padding: 4px 6px;
  }
  .preview-label {
    font-size: 10px;
    color: var(--sh3-fg-muted, #888);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .preview-kind {
    color: var(--sh3-fg-subtle, #666);
    font-family: var(--sh3-font-mono, monospace);
    letter-spacing: 0;
    text-transform: none;
  }
  .preview pre {
    margin: 0;
    font-family: var(--sh3-font-mono, monospace);
    font-size: 11px;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 120px;
    overflow: auto;
  }
</style>
