<script lang="ts">
  import type { InspectorMeta, InspectorApi, HistoryCommand, WalkerCommitOverride } from '../../types';
  import Field from '../primitives/Field.svelte';
  import EditablePrimitive from '../primitives/EditablePrimitive.svelte';
  import Inspect from '../primitives/Inspect.svelte';
  import { attemptCommit } from './commit';

  interface Props {
    value: unknown;    // always plain object or array (enforced by Inspect dispatch)
    meta?: InspectorMeta;
    api: InspectorApi;
    walkerOnCommit?: WalkerCommitOverride;
    basePath?: (string | number)[];
  }
  let { value, meta, api, walkerOnCommit, basePath = [] }: Props = $props();

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

  // For primitives: walker is the commit site — consult override directly.
  function commitPrimitiveField(key: string | number): (next: string | number | boolean) => void {
    return (next) => {
      attemptCommit(
        walkerOnCommit,
        [...basePath, key],
        next,
        () => commitPrimitive(value as any, key, next),
      );
    };
  }

  // For non-primitives: the child <Inspect> consults override via customRendererCommit.
  // Pass only the default commit so Inspect can decide.
  function defaultCommitForField(key: string | number): (next: unknown) => void {
    return (next) => commitPrimitive(value as any, key, next as any);
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
      {#if entry.fieldMeta?.type}
        <!-- Field has an explicit type tag — go through <Inspect> so the registry
             can dispatch to a custom renderer (e.g. type: 'color' for a hex string)
             even when the value is a primitive. -->
        <Field {label} readonly={isReadOnly}>
          <Inspect
            value={entry.child}
            meta={entry.fieldMeta}
            {api}
            onCommit={isReadOnly ? undefined : defaultCommitForField(entry.key)}
            walkerOnCommit={walkerOnCommit}
            basePath={[...basePath, entry.key]}
          />
        </Field>
      {:else if isPrimitive(entry.child)}
        <Field {label} readonly={isReadOnly}>
          <EditablePrimitive
            value={entry.child as any}
            readonly={isReadOnly}
            onCommit={isReadOnly ? undefined : commitPrimitiveField(entry.key)}
          />
        </Field>
      {:else}
        <Field {label} readonly={isReadOnly}>
          <Inspect
            value={entry.child}
            meta={entry.fieldMeta}
            {api}
            onCommit={isReadOnly ? undefined : defaultCommitForField(entry.key)}
            walkerOnCommit={walkerOnCommit}
            basePath={[...basePath, entry.key]}
          />
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
