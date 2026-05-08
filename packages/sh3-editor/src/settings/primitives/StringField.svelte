<script lang="ts">
  import type { StringField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';

  interface Props {
    field: StringField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
  }
  let { field, value, error, onEdit }: Props = $props();

  const current = $derived(value == null ? '' : String(value));
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <input
    type="text"
    class="input"
    class:error={!!error}
    placeholder={field.placeholder ?? ''}
    disabled={field.disabled}
    value={current}
    onchange={(e) => onEdit((e.currentTarget as HTMLInputElement).value)}
  />
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
    width: 100%;
    box-sizing: border-box;
  }
  .input:focus {
    outline: none;
    border-color: var(--sh3-accent);
  }
  .input.error { border-color: var(--sh3-error, #ff7a7a); }
  .input[disabled] { cursor: not-allowed; }
</style>
