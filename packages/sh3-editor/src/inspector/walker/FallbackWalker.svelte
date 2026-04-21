<script lang="ts">
  import type { InspectorMeta, InspectorApi, HistoryCommand } from '../../types';
  import Field from '../primitives/Field.svelte';
  import EditablePrimitive from '../primitives/EditablePrimitive.svelte';
  import Inspect from '../primitives/Inspect.svelte';

  interface Props {
    value: unknown;    // always plain object or array (enforced by Inspect dispatch)
    meta?: InspectorMeta;
    api: InspectorApi;
  }
  let { value, meta, api }: Props = $props();

  function isPrimitive(v: unknown): v is string | number | boolean | null | undefined {
    return v === null || v === undefined
      || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
  }

  function commitPrimitive(
    container: Record<string, unknown> | unknown[],
    key: string | number,
    next: string | number | boolean,
  ) {
    const before = (container as any)[key];
    const cmd: HistoryCommand = {
      apply() { (container as any)[key] = next; },
      revert() { (container as any)[key] = before; },
      meta: { kind: 'walker-edit', label: String(key) },
    };
    api.push(cmd);
    (container as any)[key] = next;   // caller mutates after push; push doesn't apply
  }

  let entries = $derived.by<Array<{ key: string | number; child: unknown; fieldMeta: InspectorMeta | undefined }>>(() => {
    if (Array.isArray(value)) {
      return value.map((child, i) => ({
        key: i,
        child,
        fieldMeta: meta?.item,
      }));
    }
    if (value && typeof value === 'object') {
      return Object.keys(value as object).map((k) => ({
        key: k,
        child: (value as Record<string, unknown>)[k],
        fieldMeta: meta?.fields?.[k],
      }));
    }
    return [];
  });
</script>

<div class="walker">
  {#each entries as entry (entry.key)}
    {#if !entry.fieldMeta?.hidden}
      {@const label = entry.fieldMeta?.label ?? (typeof entry.key === 'number' ? `[${entry.key}]` : String(entry.key))}
      {@const isReadOnly = (entry.fieldMeta?.readonly ?? false) || api.readonly}
      {#if isPrimitive(entry.child)}
        <Field {label} readonly={isReadOnly}>
          <EditablePrimitive
            value={entry.child as any}
            readonly={isReadOnly}
            onCommit={(next) => commitPrimitive(value as any, entry.key, next)}
          />
        </Field>
      {:else}
        <Field {label} readonly={isReadOnly}>
          <Inspect value={entry.child} meta={entry.fieldMeta} {api} />
        </Field>
      {/if}
    {/if}
  {/each}
</div>

<style>
  .walker {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
    padding: 0.25em 0;
  }
</style>
