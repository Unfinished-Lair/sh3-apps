<script lang="ts">
  import { getContext } from 'svelte';
  import type { ControllableFieldDescriptor } from 'sh3-core';
  import type { BooleanField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';
  import { FIELDS_CONTEXT_KEY, type FieldsContext } from '../../inspector/fields-context';

  interface Props {
    field: BooleanField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
    descriptorShardId?: string;
  }
  let { field, value, error, onEdit, descriptorShardId }: Props = $props();

  const checked = $derived(Boolean(value));

  let toggleEl: HTMLButtonElement | undefined = $state();
  const fields = getContext<FieldsContext | undefined>(FIELDS_CONTEXT_KEY);

  $effect(() => {
    if (!fields || field.disabled || !toggleEl || !descriptorShardId) return;
    const descriptor: ControllableFieldDescriptor = {
      shape: 'imperative',
      fieldId: `${descriptorShardId}.${field.key}`,
      label: field.label,
      kind: 'boolean',
      get: () => Boolean(value),
      set: (v) => onEdit(Boolean(v)),
      element: toggleEl,
    };
    return fields.ctx.contributions.register<ControllableFieldDescriptor>(
      'sh3.controllable-field',
      descriptor,
      { scope: { slotId: fields.slotId } },
    );
  });
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <button
    bind:this={toggleEl}
    type="button"
    class="toggle"
    class:on={checked}
    disabled={field.disabled}
    aria-pressed={checked}
    aria-label={field.label}
    onclick={() => onEdit(!checked)}
  >
    <span class="knob"></span>
  </button>
</SettingsRow>

<style>
  .toggle {
    appearance: none;
    width: 34px;
    height: 18px;
    background: var(--sh3-border);
    border: none;
    border-radius: 9px;
    position: relative;
    cursor: pointer;
    padding: 0;
    transition: background 0.1s;
  }
  .toggle.on { background: var(--sh3-accent); }
  .toggle[disabled] { cursor: not-allowed; }
  .knob {
    position: absolute;
    top: 2px; left: 2px;
    width: 14px; height: 14px;
    background: #fff;
    border-radius: 50%;
    transition: left 0.1s;
  }
  .toggle.on .knob { left: 18px; }
</style>
