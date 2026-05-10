<script lang="ts">
  import type { ShardContext, FieldAddress, FieldView } from 'sh3-core';
  import { addrKey, sortFields, matchesFilter, excludeAddr, type FieldLike } from './picker';

  interface Props {
    ctx: ShardContext;
    excludeAddr: FieldAddress;
    selected: FieldAddress[];
  }
  let { ctx, excludeAddr: target, selected = $bindable() }: Props = $props();

  let dropdownOpen = $state(false);
  let query = $state('');
  let expanded = $state<Set<string>>(new Set());

  let allFields = $state<FieldView[]>([]);

  function refreshList(): void {
    allFields = ctx.sh3.fields.list();
  }

  let filtered = $derived.by(() => {
    const candidates = excludeAddr(allFields as FieldLike[], target);
    return sortFields(candidates).filter((f) => matchesFilter(f, query));
  });

  function isSelected(fv: FieldLike): boolean {
    const k = addrKey(fv);
    return selected.some((a) => addrKey(a) === k);
  }

  function toAddr(fv: FieldView): FieldAddress {
    const a: FieldAddress = { shardId: fv.shardId, fieldId: fv.fieldId };
    if (fv.slotId !== undefined) a.slotId = fv.slotId;
    return a;
  }

  function add(fv: FieldView): void {
    if (isSelected(fv as FieldLike)) return;
    selected = [...selected, toAddr(fv)];
    query = '';
    dropdownOpen = false;
  }

  function remove(addr: FieldAddress): void {
    const k = addrKey(addr);
    selected = selected.filter((a) => addrKey(a) !== k);
    expanded.delete(k);
    expanded = new Set(expanded);
  }

  function toggleExpand(addr: FieldAddress): void {
    const k = addrKey(addr);
    if (expanded.has(k)) expanded.delete(k);
    else expanded.add(k);
    expanded = new Set(expanded);
  }

  function lookup(addr: FieldAddress): FieldView | undefined {
    const k = addrKey(addr);
    return allFields.find((f) => addrKey(f) === k);
  }

  function previewValue(addr: FieldAddress): string {
    try {
      const v = ctx.sh3.fields.get(addr);
      return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
    } catch {
      return '—';
    }
  }

  function chipLabel(addr: FieldAddress): string {
    const fv = lookup(addr);
    if (!fv) return `${addr.shardId}·${addr.fieldId} (unavailable)`;
    return `${fv.shardId}·${fv.label}`;
  }

  function onToggleDropdown(): void {
    dropdownOpen = !dropdownOpen;
    if (dropdownOpen) refreshList();
  }
</script>

<div class="picker-root">
  <div class="row">
    <button type="button" class="ghost add-btn" onclick={onToggleDropdown}>
      + Add context {dropdownOpen ? '▴' : '▾'}
    </button>
    {#each selected as addr (addrKey(addr))}
      {@const fv = lookup(addr)}
      <span class="chip" class:unavailable={!fv}>
        <button type="button" class="chip-x" aria-label="Remove" onclick={() => remove(addr)}>×</button>
        <button type="button" class="chip-body" onclick={() => toggleExpand(addr)}>
          {chipLabel(addr)}
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
        placeholder="search fields…"
        autofocus
      />
      <div class="results">
        {#each filtered as fv (addrKey(fv))}
          <button
            type="button"
            class="result"
            class:selected={isSelected(fv as FieldLike)}
            disabled={isSelected(fv as FieldLike)}
            onclick={() => add(fv)}
          >
            <span class="result-label">{fv.label}</span>
            <span class="result-meta">{fv.shardId}{fv.slotId ? `·${fv.slotId}` : ''}·{fv.fieldId}</span>
          </button>
        {/each}
        {#if filtered.length === 0}
          <div class="empty">no matches</div>
        {/if}
      </div>
    </div>
  {/if}

  {#each selected as addr (addrKey(addr))}
    {#if expanded.has(addrKey(addr))}
      <div class="preview">
        <div class="preview-label">{chipLabel(addr)}</div>
        <pre>{previewValue(addr)}</pre>
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
  .chip.unavailable {
    opacity: 0.55;
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
    max-height: 220px;
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
