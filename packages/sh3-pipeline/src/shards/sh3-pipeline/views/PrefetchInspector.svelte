<script lang="ts">
  import type { PrefetchConfig } from '../domain/types';
  import { keyOf } from '../domain/prefetch-key';

  type Props = {
    cfg: PrefetchConfig;
    onCommit: (next: PrefetchConfig) => void;
    onRefresh: () => Promise<void>;
    onToggleMode: () => void;
    refreshing: boolean;
  };
  let { cfg, onCommit, onRefresh, onToggleMode, refreshing }: Props = $props();

  const rows = $derived(cfg.list?.rows ?? []);
  const fieldOptions = $derived.by(() => {
    const schemaProps = cfg.list?.schemaSnapshot?.properties;
    if (schemaProps) return Object.keys(schemaProps);
    const set = new Set<string>();
    for (const r of rows) for (const k of Object.keys(r)) set.add(k);
    return [...set];
  });

  const matchedRow = $derived(
    rows.find((r) => keyOf(r, cfg.valueField) === cfg.selectedRowKey) ?? null,
  );
  const isOrphan = $derived(cfg.selectedRowKey !== null && matchedRow === null);

  function labelOf(row: Record<string, unknown>): string {
    if (cfg.valueField && cfg.valueField in row) return String(row[cfg.valueField]);
    for (const k of Object.keys(row)) {
      if (typeof row[k] === 'string') return row[k] as string;
    }
    return JSON.stringify(row);
  }

  function selectRow(ev: Event): void {
    const v = (ev.target as HTMLSelectElement).value;
    const row = rows.find((r) => keyOf(r, cfg.valueField) === v) ?? null;
    onCommit({ ...cfg, selectedRowKey: v, lastSelectedRow: row });
  }

  function changeValueField(ev: Event): void {
    const raw = (ev.target as HTMLSelectElement).value;
    const next = raw === '' ? null : raw;
    const nextRow = cfg.lastSelectedRow ?? matchedRow;
    const nextKey = nextRow ? keyOf(nextRow, next) : null;
    onCommit({ ...cfg, valueField: next, selectedRowKey: nextKey });
  }

  function changeArg(key: string, value: unknown): void {
    onCommit({ ...cfg, args: { ...cfg.args, [key]: value } });
  }

  const fetchedAtLabel = $derived(cfg.list ? new Date(cfg.list.fetchedAt).toLocaleString() : '—');
</script>

<div class="prefetch-inspector">
  <header>
    <div class="verb-name">{cfg.name}</div>
    {#if cfg.summary}<div class="verb-summary">{cfg.summary}</div>{/if}
    <button type="button" onclick={onToggleMode} class="mode-toggle">
      Runtime mode
    </button>
  </header>

  <section class="args">
    <h4>Inputs (literals)</h4>
    {#each Object.keys(cfg.args) as key (key)}
      <label>
        <span>{key}</span>
        <input
          type="text"
          value={String(cfg.args[key] ?? '')}
          oninput={(e) => changeArg(key, (e.target as HTMLInputElement).value)}
        />
      </label>
    {/each}
    {#if Object.keys(cfg.args).length === 0}
      <p class="hint">No arguments declared by this verb.</p>
    {/if}
  </section>

  <section class="picker">
    <h4>Picker</h4>
    <label>
      Value field
      <select
        data-role="value-field"
        value={cfg.valueField ?? ''}
        onchange={changeValueField}
      >
        <option value="">(whole row)</option>
        {#each fieldOptions as f (f)}<option value={f}>{f}</option>{/each}
      </select>
    </label>

    <label>
      Selection
      <select
        data-role="selection"
        value={cfg.selectedRowKey ?? ''}
        onchange={selectRow}
        disabled={rows.length === 0}
      >
        {#if cfg.selectedRowKey === null}
          <option value="" disabled>(pick a row)</option>
        {/if}
        {#each rows as r (keyOf(r, cfg.valueField))}
          <option value={keyOf(r, cfg.valueField)}>{labelOf(r)}</option>
        {/each}
      </select>
    </label>

    {#if isOrphan}
      <p class="badge warn">⚠ Selection no longer in list — pick a new one.</p>
    {/if}

    <div class="list-meta">
      <span>{rows.length} rows · fetched {fetchedAtLabel}</span>
      <button type="button" onclick={() => { onRefresh(); }} disabled={refreshing}>
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>

    {#if cfg.lastError}
      <p class="badge error">⚠ Last refresh failed: {cfg.lastError.message}</p>
    {/if}
  </section>

  <section class="preview">
    <h4>Selected row</h4>
    <pre>{cfg.lastSelectedRow ? JSON.stringify(cfg.lastSelectedRow, null, 2) : '(no selection)'}</pre>
  </section>
</div>

<style>
  .prefetch-inspector { display: flex; flex-direction: column; gap: 12px; padding: 8px; }
  header { display: flex; flex-direction: column; gap: 4px; }
  .verb-name { font-weight: 600; }
  .verb-summary { font-size: 0.85em; opacity: 0.7; }
  .mode-toggle { align-self: flex-start; }
  section { display: flex; flex-direction: column; gap: 6px; }
  h4 { margin: 0; font-size: 0.85em; text-transform: uppercase; opacity: 0.6; }
  label { display: flex; flex-direction: column; gap: 4px; font-size: 0.9em; }
  .badge.warn { color: #f59e0b; font-size: 0.85em; }
  .badge.error { color: #ef4444; font-size: 0.85em; }
  .list-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.85em; }
  .hint { opacity: 0.6; font-size: 0.85em; margin: 0; }
  pre { background: rgba(0,0,0,0.2); padding: 6px; font-size: 0.8em; overflow: auto; max-height: 200px; }
</style>
