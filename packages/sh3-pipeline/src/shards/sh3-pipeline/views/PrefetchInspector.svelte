<script lang="ts">
  import { Select, Field, type SelectOption } from 'sh3-core';
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
  const fieldOptions = $derived.by<string[]>(() => {
    const schemaProps = cfg.list?.schemaSnapshot?.properties;
    if (schemaProps) return Object.keys(schemaProps);
    const set = new Set<string>();
    for (const r of rows) for (const k of Object.keys(r)) set.add(k);
    return [...set];
  });

  const valueFieldOptions = $derived<SelectOption[]>([
    { value: '', label: '(whole row)' },
    ...fieldOptions.map((f) => ({ value: f, label: f })),
  ]);

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

  const selectionOptions = $derived<SelectOption[]>(
    rows.map((r) => ({ value: keyOf(r, cfg.valueField), label: labelOf(r) })),
  );

  function selectRow(v: string | string[]): void {
    const next = Array.isArray(v) ? v[0] ?? '' : v;
    const row = rows.find((r) => keyOf(r, cfg.valueField) === next) ?? null;
    onCommit({ ...cfg, selectedRowKey: next, lastSelectedRow: row });
  }

  function changeValueField(v: string | string[]): void {
    const raw = Array.isArray(v) ? v[0] ?? '' : v;
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
      <Field
        label={key}
        value={String(cfg.args[key] ?? '')}
        size="sm"
        oninput={(v: string) => changeArg(key, v)}
      />
    {/each}
    {#if Object.keys(cfg.args).length === 0}
      <p class="hint">No arguments declared by this verb.</p>
    {/if}
  </section>

  <section class="picker">
    <h4>Picker</h4>
    <Select
      label="Value field"
      options={valueFieldOptions}
      value={cfg.valueField ?? ''}
      size="sm"
      onchange={changeValueField}
    />

    <Select
      label="Selection"
      options={selectionOptions}
      value={cfg.selectedRowKey ?? ''}
      placeholder="(pick a row)"
      disabled={rows.length === 0}
      size="sm"
      onchange={selectRow}
    />

    {#if isOrphan}
      <p class="badge warn">⚠ Selection no longer in list — pick a new one.</p>
    {/if}

    <div class="list-meta">
      <span>{rows.length} rows · fetched {fetchedAtLabel}</span>
      <button type="button" class="ghost" onclick={() => { onRefresh(); }} disabled={refreshing}>
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
  .prefetch-inspector {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;
    font-family: var(--sh3-font-ui);
    color: var(--sh3-fg);
  }
  header { display: flex; flex-direction: column; gap: 4px; }
  .verb-name { font-weight: 600; color: var(--sh3-fg); }
  .verb-summary { font-size: 0.85em; color: var(--sh3-fg-muted); }
  .mode-toggle {
    align-self: flex-start;
    padding: 4px 10px;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-widget-radius);
    background: var(--sh3-input-bg);
    color: var(--sh3-fg);
    font: inherit;
    cursor: pointer;
  }
  .mode-toggle:hover { border-color: var(--sh3-input-border-focus); }
  section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  /* Sh3 Field/Select default to inline-flex which prevents the full-width
     stretch we want inside a vertical inspector column. */
  section :global(.sh3-field),
  section :global(.sh3-select) {
    display: flex;
    width: 100%;
  }
  section :global(.sh3-select__btn) { min-width: 0; width: 100%; }
  h4 {
    margin: 0;
    font-size: 0.75em;
    text-transform: uppercase;
    color: var(--sh3-fg-muted);
  }
  .badge.warn { color: var(--sh3-warn, #f59e0b); font-size: 0.85em; }
  .badge.error { color: var(--sh3-error, #ef4444); font-size: 0.85em; }
  .list-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85em;
    color: var(--sh3-fg-muted);
  }
  .ghost {
    padding: 3px 10px;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-widget-radius);
    background: var(--sh3-input-bg);
    color: var(--sh3-fg);
    font: inherit;
    cursor: pointer;
  }
  .ghost:hover:not(:disabled) { border-color: var(--sh3-input-border-focus); }
  .ghost:disabled { opacity: 0.5; cursor: not-allowed; }
  .hint {
    margin: 0;
    color: var(--sh3-fg-muted);
    font-size: 0.85em;
  }
  pre {
    background: var(--sh3-bg-sunken, rgba(0,0,0,0.2));
    padding: 6px;
    border-radius: var(--sh3-widget-radius);
    font-family: var(--sh3-font-mono);
    font-size: 0.8em;
    overflow: auto;
    max-height: 200px;
    margin: 0;
  }
</style>
