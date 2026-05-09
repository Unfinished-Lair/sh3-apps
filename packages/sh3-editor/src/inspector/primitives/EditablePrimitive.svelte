<script lang="ts">
  import { getContext } from 'svelte';
  import type { ControllableFieldDescriptor } from 'sh3-core';
  import { FIELDS_CONTEXT_KEY, type FieldsContext } from '../fields-context';

  interface Props {
    value: string | number | boolean | null | undefined;
    readonly?: boolean;
    onCommit?: (next: string | number | boolean) => void;
    /** Path from the inspected root to this leaf — joined to form a stable fieldId. */
    path?: (string | number)[];
    /** Display label for the field; falls back to the last path segment. */
    label?: string;
  }
  let { value, readonly = false, onCommit, path, label }: Props = $props();

  let local = $state(stringify(value));

  $effect(() => { local = stringify(value); });

  function stringify(v: unknown): string {
    if (v === null) return 'null';
    if (v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    return String(v);
  }

  function parse(raw: string, kind: 'string' | 'number' | 'boolean'): string | number | boolean | null {
    if (kind === 'boolean') return raw === 'true';
    if (kind === 'number') {
      const n = Number(raw);
      return Number.isFinite(n) ? n : (value as number);
    }
    return raw;
  }

  let kind = $derived(typeof value === 'number'
    ? 'number'
    : typeof value === 'boolean'
      ? 'boolean'
      : 'string');

  function commit() {
    if (readonly || !onCommit) return;
    const parsed = parse(local, kind as 'string' | 'number' | 'boolean');
    if (parsed === null) return;
    if (parsed === value) return;
    onCommit(parsed);
  }

  function onBooleanChange(e: Event) {
    if (readonly || !onCommit) return;
    const next = (e.target as HTMLInputElement).checked;
    if (next !== value) onCommit(next);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      local = stringify(value);
      (e.currentTarget as HTMLInputElement).blur();
    }
  }

  let inputEl: HTMLInputElement | undefined = $state();
  const fields = getContext<FieldsContext | undefined>(FIELDS_CONTEXT_KEY);

  $effect(() => {
    if (!fields || readonly || !onCommit || !inputEl || !path || path.length === 0) return;
    const fieldKind = kind as 'string' | 'number' | 'boolean';
    const descriptor: ControllableFieldDescriptor = {
      shape: 'imperative',
      fieldId: path.map(String).join('.'),
      label: label ?? String(path[path.length - 1]),
      kind: fieldKind,
      get: () => value,
      set: (v) => {
        const parsed = parse(String(v), fieldKind);
        if (parsed === null) return;
        onCommit(parsed);
      },
      element: inputEl,
    };
    return fields.ctx.contributions.register<ControllableFieldDescriptor>(
      'sh3.controllable-field',
      descriptor,
      { scope: { slotId: fields.slotId } },
    );
  });
</script>

{#if kind === 'boolean'}
  <input
    bind:this={inputEl}
    type="checkbox"
    checked={Boolean(value)}
    disabled={readonly}
    onchange={onBooleanChange}
  />
{:else}
  <input
    bind:this={inputEl}
    class="primitive"
    type={kind === 'number' ? 'number' : 'text'}
    bind:value={local}
    disabled={readonly}
    onblur={commit}
    onkeydown={onKey}
  />
{/if}

<style>
  .primitive {
    background: var(--sh3-bg-sunken);
    color: var(--sh3-fg);
    border: 1px solid var(--sh3-border);
    border-radius: 2px;
    padding: 0.1em 0.3em;
    font-family: var(--sh3-font-mono);
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
  }
  .primitive:focus {
    outline: 1px solid var(--sh3-accent, #61afef);
  }
  .primitive:disabled {
    color: var(--sh3-fg-muted);
    cursor: default;
  }
</style>
