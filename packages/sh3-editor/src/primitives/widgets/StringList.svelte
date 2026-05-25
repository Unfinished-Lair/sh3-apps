<script lang="ts">
  type Props = {
    value?: string[];
    label?: string;
    placeholder?: string;
    helper?: string;
    error?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: 'sm' | 'md';
    validate?: (item: string, index: number, all: string[]) => string | null | undefined;
    onchange?: (next: string[]) => void;
  };
  let {
    value = [],
    label,
    placeholder = 'new field…',
    helper,
    error,
    disabled = false,
    invalid = false,
    size = 'md',
    validate,
    onchange,
  }: Props = $props();

  // Mirror prop into a local-row state so inline edits don't propagate
  // upstream until blur (commit-on-blur semantics).
  let rows = $state<string[]>(value.slice());
  $effect(() => { rows = value.slice(); });

  function commit(next: string[]): void {
    if (disabled) return;
    // Dedupe: last occurrence of each value wins (drop earlier dupes).
    const reversed = next.slice().reverse();
    const seen = new Set<string>();
    const dedupedReversed = reversed.filter((s) => {
      if (s.length === 0) return false;
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });
    const deduped = dedupedReversed.reverse();
    onchange?.(deduped);
  }

  function onAdd(): void {
    rows = [...rows, ''];
    // Focus is best-effort; tests poll the DOM directly.
    queueMicrotask(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('input[data-string-list-row]');
      inputs[inputs.length - 1]?.focus();
    });
  }

  function onRemove(i: number): void {
    const next = rows.slice();
    next.splice(i, 1);
    rows = next;
    commit(next);
  }

  function onRowInput(i: number, v: string): void {
    rows[i] = v;
  }

  function onRowBlur(_i: number): void {
    commit(rows);
  }

  function onRowKey(e: KeyboardEvent, i: number): void {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      rows[i] = value[i] ?? '';
      (e.currentTarget as HTMLInputElement).blur();
    }
  }

  function rowError(i: number): string | undefined {
    if (!validate) return undefined;
    const r = validate(rows[i], i, rows);
    return r ?? undefined;
  }
</script>

<div class="sl" class:invalid class:disabled data-size={size}>
  {#if label}<div class="sl-label">{label}</div>{/if}
  <ul class="sl-rows">
    {#each rows as r, i (i)}
      <li class="sl-row" class:row-error={rowError(i) !== undefined} title={rowError(i) ?? ''}>
        <input
          type="text"
          data-string-list-row
          value={r}
          placeholder={placeholder}
          readonly={disabled}
          oninput={(e) => onRowInput(i, (e.currentTarget as HTMLInputElement).value)}
          onblur={() => onRowBlur(i)}
          onkeydown={(e) => onRowKey(e, i)}
        />
        {#if !disabled}
          <button
            type="button"
            class="sl-remove"
            aria-label={`Remove ${r || 'row'}`}
            data-testid={`string-list-remove-${i}`}
            onclick={() => onRemove(i)}
          >×</button>
        {/if}
      </li>
    {/each}
  </ul>
  {#if !disabled}
    <button
      type="button"
      class="sl-add"
      data-testid="string-list-add"
      onclick={onAdd}
    >+ Add</button>
  {/if}
  {#if error}<div class="sl-error">{error}</div>{:else if helper}<div class="sl-helper">{helper}</div>{/if}
</div>

<style>
  .sl { display: flex; flex-direction: column; gap: 0.25rem; }
  .sl-label { font-size: 0.85em; color: var(--sh3-fg-2, #888); }
  .sl-rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.25rem; }
  .sl-row { display: flex; gap: 0.25rem; align-items: center; }
  .sl-row > input { flex: 1; box-sizing: border-box; }
  .sl-row.row-error > input { border-color: var(--sh3-danger, #e5484d); }
  .sl-remove {
    width: 1.5em; height: 1.5em; line-height: 1; padding: 0; cursor: pointer;
  }
  .sl-add {
    align-self: flex-start;
    cursor: pointer;
    padding: 0.15em 0.5em;
  }
  .sl.invalid > .sl-rows > .sl-row > input { border-color: var(--sh3-danger, #e5484d); }
  .sl.disabled .sl-row > input { cursor: default; }
  .sl-error { color: var(--sh3-danger, #e5484d); font-size: 0.85em; }
  .sl-helper { color: var(--sh3-fg-2, #888); font-size: 0.85em; }
</style>
