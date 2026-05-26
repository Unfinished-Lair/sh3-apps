<script lang="ts">
  import type { PickerDocumentSource } from 'sh3-core';
  import type { InspectorMeta, InspectorApi, HistoryCommand, WalkerCommitOverride } from '../../types';
  import Field from '../primitives/Field.svelte';
  import EditablePrimitive from '../primitives/EditablePrimitive.svelte';
  import Inspect from '../primitives/Inspect.svelte';
  import WalkerCell from '../primitives/WalkerCell.svelte';
  import { attemptCommit } from './commit';
  import { makeCoalesceState, decideCoalesce } from './coalesce';

  interface Props {
    value: unknown;    // always plain object or array (enforced by Inspect dispatch)
    meta?: InspectorMeta;
    api: InspectorApi;
    walkerOnCommit?: WalkerCommitOverride;
    basePath?: (string | number)[];
    /** Host-supplied document source; forwarded into every <Inspect> recursion. */
    documents?: PickerDocumentSource;
  }
  let { value, meta, api, walkerOnCommit, basePath = [], documents }: Props = $props();

  const coalesce = makeCoalesceState();

  function pathString(p: (string | number)[]): string {
    return p.map((s) => String(s)).join('\0');   // NUL separator → never collides
  }

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
    // Mutate before push so the inspectorValueChange emit fired downstream
    // sees post-mutation state. push() does NOT call apply() per HistoryCommand
    // contract — the caller is responsible for putting the world in the
    // post-apply state before recording.
    (container as any)[key] = next;
    api.push(cmd);
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

  function coalescedCommitForField(
    key: string | number,
  ): (next: unknown, gestureKey: string) => void {
    return (next, gestureKey) => {
      const fullPath = [...basePath, key];
      const ps = pathString(fullPath);
      const container = value as Record<string | number, unknown> | unknown[];
      const currentBefore = (container as any)[key];

      const fallback = () => {
        const decision = decideCoalesce(coalesce, ps, gestureKey, currentBefore);
        const captured = decision.before;
        const cmd: HistoryCommand = {
          apply()  { (container as any)[key] = next; },
          revert() { (container as any)[key] = captured; },
          meta: { kind: 'walker-edit-coalesced', label: String(key) },
        };
        // Mutate before push/replaceTop so the inspectorValueChange emit
        // fired downstream sees post-mutation state.
        (container as any)[key] = next;
        if (decision.action === 'push') api.push(cmd);
        else                            api.history.replaceTop(cmd);
      };

      attemptCommit(walkerOnCommit, fullPath, next, fallback);
    };
  }

  function clearGestureForField(key: string | number): void {
    coalesce.clear(pathString([...basePath, key]));
  }

  // Setter passed to WalkerCell — same path as Inspect.svelte's
  // customRendererCommit: respect walkerOnCommit when present, otherwise
  // fall through to the default per-field commit. Used to surface custom
  // inspector renderers (segmented, color, date…) as AI-controllable fields.
  function aiSetterForField(key: string | number): (next: unknown) => void {
    const fullPath = [...basePath, key];
    return (next) => {
      attemptCommit(
        walkerOnCommit,
        fullPath,
        next,
        () => {
          clearGestureForField(key);
          defaultCommitForField(key)(next);
        },
      );
    };
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
          <WalkerCell
            path={[...basePath, entry.key]}
            {label}
            value={entry.child}
            readonly={isReadOnly}
            onSet={isReadOnly ? undefined : aiSetterForField(entry.key)}
          >
            <Inspect
              value={entry.child}
              meta={entry.fieldMeta}
              {api}
              onCommit={isReadOnly ? undefined : (next: unknown) => { clearGestureForField(entry.key); defaultCommitForField(entry.key)(next); }}
              onCommitCoalesced={isReadOnly ? undefined : coalescedCommitForField(entry.key)}
              walkerOnCommit={walkerOnCommit}
              basePath={[...basePath, entry.key]}
              {documents}
            />
          </WalkerCell>
        </Field>
      {:else if isPrimitive(entry.child)}
        <Field {label} readonly={isReadOnly}>
          <EditablePrimitive
            value={entry.child as any}
            readonly={isReadOnly}
            onCommit={isReadOnly ? undefined : commitPrimitiveField(entry.key)}
            path={[...basePath, entry.key]}
            {label}
          />
        </Field>
      {:else}
        <Field {label} readonly={isReadOnly}>
          <Inspect
            value={entry.child}
            meta={entry.fieldMeta}
            {api}
            onCommit={isReadOnly ? undefined : (next: unknown) => { clearGestureForField(entry.key); defaultCommitForField(entry.key)(next); }}
            onCommitCoalesced={isReadOnly ? undefined : coalescedCommitForField(entry.key)}
            walkerOnCommit={walkerOnCommit}
            basePath={[...basePath, entry.key]}
            {documents}
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
