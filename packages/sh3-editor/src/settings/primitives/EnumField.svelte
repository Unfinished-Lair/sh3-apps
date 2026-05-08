<script lang="ts">
  import type { EnumField } from '../contributions';
  import SettingsRow from './SettingsRow.svelte';

  interface Props {
    field: EnumField;
    value: unknown;
    error?: string;
    onEdit: (value: unknown) => void;
  }
  let { field, value, error, onEdit }: Props = $props();

  const current = $derived(typeof value === 'string' ? value : '');
</script>

<SettingsRow label={field.label} description={field.description} disabled={field.disabled} {error}>
  <div class="seg" class:error={!!error}>
    {#each field.options as opt (opt.value)}
      <button
        type="button"
        class:active={current === opt.value}
        disabled={field.disabled}
        onclick={() => onEdit(opt.value)}
      >{opt.label}</button>
    {/each}
  </div>
</SettingsRow>

<style>
  .seg {
    display: inline-flex;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-radius-sm);
    overflow: hidden;
  }
  .seg.error { border-color: var(--sh3-error, #ff7a7a); }
  .seg button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: 4px 10px;
    background: var(--sh3-bg-sunken);
    color: var(--sh3-fg);
    border: none;
    cursor: pointer;
  }
  .seg button + button {
    border-left: 1px solid var(--sh3-border);
  }
  .seg button.active {
    background: var(--sh3-accent);
    color: var(--sh3-bg);
  }
  .seg button:hover:not(.active):not([disabled]) {
    background: var(--sh3-bg);
  }
  .seg button[disabled] { cursor: not-allowed; }
</style>
