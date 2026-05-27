<script lang="ts">
  import type { InspectorRendererProps } from '@unfinished-lair/sh3-editor/inspector/contributions';

  // We bind to `key: 'prefetch'` so the body bridge passes the whole prefetch
  // config block as `value` and a writeback hook in `onCommit`. The select's
  // change handler merges only `selectedRowKey` and pushes the merged block.
  let { value, onCommit }: InspectorRendererProps = $props();

  type Prefetch = {
    list?: { rows: Record<string, unknown>[] } | null;
    valueField: string | null;
    selectedRowKey: string | null;
  };

  const pf = $derived(value as Prefetch | undefined);
  const rows = $derived(pf?.list?.rows ?? []);

  function keyOf(row: Record<string, unknown>, valueField: string | null): string {
    if (valueField && row[valueField] != null) return String(row[valueField]);
    return JSON.stringify(row);
  }

  function labelOf(row: Record<string, unknown>, valueField: string | null): string {
    if (valueField && row[valueField] != null) return String(row[valueField]);
    for (const [, v] of Object.entries(row)) if (typeof v === 'string') return v;
    return JSON.stringify(row);
  }

  function onChange(ev: Event) {
    const next = (ev.target as HTMLSelectElement).value;
    const merged: Prefetch = {
      ...(pf ?? { valueField: null, selectedRowKey: null }),
      selectedRowKey: next || null,
    };
    onCommit?.(merged);
  }
</script>

<select class="prefetch-body-select"
        value={pf?.selectedRowKey ?? ''}
        onchange={onChange}
        disabled={rows.length === 0}>
  {#if rows.length === 0}
    <option value="">(empty)</option>
  {:else}
    <option value="">— pick —</option>
    {#each rows as row}
      {@const k = keyOf(row, pf?.valueField ?? null)}
      <option value={k}>{labelOf(row, pf?.valueField ?? null)}</option>
    {/each}
  {/if}
</select>

<style>
  .prefetch-body-select {
    width: 100%;
    background: var(--sh3-input-bg, #161616);
    color: var(--sh3-fg, #ddd);
    border: 1px solid var(--sh3-border, #444);
    border-radius: 3px;
    padding: 2px 4px;
    font-family: var(--sh3-font-mono);
    font-size: 0.85em;
  }
</style>
