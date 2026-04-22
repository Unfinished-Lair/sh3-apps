<script lang="ts">
  import type { BooleanField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';

  interface Props {
    field: BooleanField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
  }
  let { field, value, error, onEdit }: Props = $props();

  const checked = $derived(Boolean(value));
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <button
    type="button"
    class="toggle"
    class:on={checked}
    disabled={field.disabled}
    aria-pressed={checked}
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
    background: var(--shell-border);
    border: none;
    border-radius: 9px;
    position: relative;
    cursor: pointer;
    padding: 0;
    transition: background 0.1s;
  }
  .toggle.on { background: var(--shell-accent); }
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
