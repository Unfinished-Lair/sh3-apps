<script lang="ts">
  import { getContext } from 'svelte';
  import type { ControllableFieldDescriptor } from 'sh3-core';
  import type { NumberRangeField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';
  import { FIELDS_CONTEXT_KEY, type FieldsContext } from '../../inspector/fields-context';

  interface Props {
    field: NumberRangeField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
    descriptorShardId?: string;
  }
  let { field, value, error, onEdit, descriptorShardId }: Props = $props();

  const current = $derived(clamp(typeof value === 'number' ? value : field.min, field.min, field.max));

  function clamp(n: number, lo: number, hi: number): number {
    return Math.min(hi, Math.max(lo, n));
  }

  function handleInput(e: Event) {
    const raw = Number((e.currentTarget as HTMLInputElement).value);
    if (Number.isNaN(raw)) return;
    onEdit(clamp(raw, field.min, field.max));
  }

  let inputEl: HTMLInputElement | undefined = $state();
  const fields = getContext<FieldsContext | undefined>(FIELDS_CONTEXT_KEY);

  $effect(() => {
    if (!fields || field.disabled || !inputEl || !descriptorShardId) return;
    const descriptor: ControllableFieldDescriptor = {
      shape: 'element',
      fieldId: `${descriptorShardId}.${field.key}`,
      label: field.label,
      kind: 'number',
      element: inputEl,
    };
    return fields.ctx.contributions.register<ControllableFieldDescriptor>(
      'sh3.controllable-field',
      descriptor,
      { scope: { slotId: fields.slotId } },
    );
  });
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <input
    bind:this={inputEl}
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
    accent-color: var(--sh3-accent);
    cursor: pointer;
  }
  .slider[disabled] { cursor: not-allowed; }
  .slider.error { accent-color: var(--sh3-error, #ff7a7a); }
  .value {
    min-width: 56px;
    text-align: right;
    font-size: 12px;
    color: var(--sh3-accent);
    font-variant-numeric: tabular-nums;
  }
</style>
