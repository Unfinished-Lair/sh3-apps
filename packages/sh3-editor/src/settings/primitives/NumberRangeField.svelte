<script lang="ts">
  import type { NumberRangeField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';

  interface Props {
    field: NumberRangeField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
  }
  let { field, value, error, onEdit }: Props = $props();

  const current = $derived(clamp(typeof value === 'number' ? value : field.min, field.min, field.max));

  function clamp(n: number, lo: number, hi: number): number {
    return Math.min(hi, Math.max(lo, n));
  }

  function handleInput(e: Event) {
    const raw = Number((e.currentTarget as HTMLInputElement).value);
    if (Number.isNaN(raw)) return;
    onEdit(clamp(raw, field.min, field.max));
  }
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <input
    type="range"
    class="slider"
    class:error={!!error}
    min={field.min}
    max={field.max}
    step={field.step ?? 1}
    disabled={field.disabled}
    value={current}
    oninput={handleInput}
  />
  <span class="value">{current}{field.unit ? ` ${field.unit}` : ''}</span>
</SettingsRow>

<style>
  .slider {
    flex: 1;
    accent-color: var(--shell-accent);
    cursor: pointer;
  }
  .slider[disabled] { cursor: not-allowed; }
  .slider.error { accent-color: var(--shell-error, #ff7a7a); }
  .value {
    min-width: 56px;
    text-align: right;
    font-size: 12px;
    color: var(--shell-accent);
    font-variant-numeric: tabular-nums;
  }
</style>
