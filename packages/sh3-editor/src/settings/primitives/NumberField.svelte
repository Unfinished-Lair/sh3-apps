<script lang="ts">
  import type { NumberField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';

  interface Props {
    field: NumberField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
  }
  let { field, value, error, onEdit }: Props = $props();

  const current = $derived(typeof value === 'number' ? String(value) : '');

  function handleChange(e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).value;
    const n = Number(raw);
    if (raw === '' || Number.isNaN(n)) return;
    onEdit(n);
  }
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <input
    type="number"
    class="input"
    class:error={!!error}
    min={field.min}
    max={field.max}
    step={field.step ?? 1}
    disabled={field.disabled}
    value={current}
    onchange={handleChange}
  />
  {#if field.unit}
    <span class="unit">{field.unit}</span>
  {/if}
</SettingsRow>

<style>
  .input {
    background: var(--shell-bg-sunken);
    border: 1px solid var(--shell-border);
    color: var(--shell-fg);
    padding: 5px 8px;
    border-radius: var(--shell-radius-sm);
    font: inherit;
    font-size: 12px;
    width: 90px;
    box-sizing: border-box;
  }
  .input:focus {
    outline: none;
    border-color: var(--shell-accent);
  }
  .input.error { border-color: var(--shell-error, #ff7a7a); }
  .input[disabled] { cursor: not-allowed; }
  .unit { font-size: 11px; color: var(--shell-fg-muted); }
</style>
