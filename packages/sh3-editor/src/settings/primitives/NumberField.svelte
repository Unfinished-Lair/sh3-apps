<script lang="ts">
  import { getContext } from 'svelte';
  import type { ControllableFieldDescriptor } from 'sh3-core';
  import type { NumberField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';
  import { FIELDS_CONTEXT_KEY, type FieldsContext } from '../../inspector/fields-context';

  interface Props {
    field: NumberField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
    descriptorShardId?: string;
  }
  let { field, value, error, onEdit, descriptorShardId }: Props = $props();

  const current = $derived(typeof value === 'number' ? String(value) : '');

  function handleChange(e: Event) {
    const raw = (e.currentTarget as HTMLInputElement).value;
    const n = Number(raw);
    if (raw === '' || Number.isNaN(n)) return;
    onEdit(n);
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
    background: var(--sh3-bg-sunken);
    border: 1px solid var(--sh3-border);
    color: var(--sh3-fg);
    padding: 5px 8px;
    border-radius: var(--sh3-radius-sm);
    font: inherit;
    font-size: 12px;
    width: 90px;
    box-sizing: border-box;
  }
  .input:focus {
    outline: none;
    border-color: var(--sh3-accent);
  }
  .input.error { border-color: var(--sh3-error, #ff7a7a); }
  .input[disabled] { cursor: not-allowed; }
  .unit { font-size: 11px; color: var(--sh3-fg-muted); }
</style>
