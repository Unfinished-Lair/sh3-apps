<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { ControllableFieldDescriptor, FieldKind } from 'sh3-core';
  import { FIELDS_CONTEXT_KEY, type FieldsContext } from '../fields-context';

  interface Props {
    /** Path from the inspected root to this row — joined to form a stable fieldId. */
    path: (string | number)[];
    /** Display label rendered by the parent <Field> wrapper. */
    label: string;
    /** Current row value; controls whether and how the field is registered. */
    value: unknown;
    /** Setter; absent → field registers as readonly visual locator only. */
    onSet?: (next: unknown) => void;
    /** Optional readonly flag (skips registration entirely). */
    readonly?: boolean;
    /** Inspector cell content (rendered widget). */
    children: Snippet;
  }
  let { path, label, value, onSet, readonly = false, children }: Props = $props();

  let cellEl: HTMLSpanElement | undefined = $state();
  const fields = getContext<FieldsContext | undefined>(FIELDS_CONTEXT_KEY);

  function inferKind(v: unknown): FieldKind | null {
    if (typeof v === 'string') return 'string';
    if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
    if (typeof v === 'boolean') return 'boolean';
    return null;
  }

  $effect(() => {
    if (!fields || readonly || !onSet || !cellEl || path.length === 0) return;
    const kind = inferKind(value);
    if (!kind) return;
    const descriptor: ControllableFieldDescriptor = {
      shape: 'imperative',
      fieldId: path.map(String).join('.'),
      label,
      kind,
      get: () => value,
      set: (v) => onSet(v),
      element: cellEl,
    };
    return fields.ctx.contributions.register<ControllableFieldDescriptor>(
      'sh3.controllable-field',
      descriptor,
      { scope: { slotId: fields.slotId } },
    );
  });
</script>

<span class="walker-cell" bind:this={cellEl}>
  {@render children()}
</span>

<style>
  .walker-cell {
    display: block;
    position: relative;
    width: 100%;
  }
</style>
