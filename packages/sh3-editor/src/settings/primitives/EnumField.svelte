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
    border: 1px solid var(--shell-border);
    border-radius: var(--shell-radius-sm);
    overflow: hidden;
  }
  .seg.error { border-color: var(--shell-error, #ff7a7a); }
  .seg button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: 4px 10px;
    background: var(--shell-bg-sunken);
    color: var(--shell-fg);
    border: none;
    cursor: pointer;
  }
  .seg button + button {
    border-left: 1px solid var(--shell-border);
  }
  .seg button.active {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }
  .seg button:hover:not(.active):not([disabled]) {
    background: var(--shell-bg);
  }
  .seg button[disabled] { cursor: not-allowed; }
</style>
