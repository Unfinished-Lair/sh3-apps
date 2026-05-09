/*
 * Public helper for custom inspector renderers that want their inputs to
 * surface as AI-controllable fields (sh3-core 0.17 `'sh3.controllable-field'`
 * contribution point). Built-in walker rows (EditablePrimitive + custom-typed
 * primitive cells via WalkerCell) self-register; this is the opt-in path for
 * custom renderers that own their own native inputs (e.g. an "object editor"
 * widget that synthesizes one row per user-defined field).
 *
 * Usage from a custom inspector renderer:
 *
 *   import {
 *     useInspectorFields,
 *     registerInspectorField,
 *   } from '@unfinished-lair/sh3-editor/inspector/fields';
 *
 *   const fields = useInspectorFields();   // call at component init
 *
 *   $effect(() => {
 *     if (!fields || !rowEl) return;
 *     return registerInspectorField(fields, {
 *       fieldId: `${sectionId}.${field.key}`,
 *       label: field.label,
 *       kind: 'string',
 *       get: () => values[field.key],
 *       set: (v) => onCommit({ ...values, [field.key]: v }),
 *       element: rowEl,
 *     });
 *   });
 */

import { getContext } from 'svelte';
import type { ControllableFieldDescriptor, FieldKind } from 'sh3-core';
import { FIELDS_CONTEXT_KEY, type FieldsContext } from './fields-context';

export type { FieldKind, FieldsContext };

export interface RegisterFieldOpts {
  /** Stable id within the inspector slot — must be unique across other
   *  registrations from the same slot. Convention: dot-join the path from
   *  the inspected root (e.g. `'fields.House'`). */
  fieldId: string;
  label: string;
  kind: FieldKind;
  get: () => unknown;
  set: (value: unknown) => void;
  /** DOM element used as the visual locator for the AI badge. Should
   *  represent the row's bounding rect — typically the cell wrapper or the
   *  underlying input. */
  element: HTMLElement;
  /** Required when `kind: 'enum'`; ignored otherwise. */
  enumValues?: readonly unknown[];
}

/** Pull the inspector's `(ctx, slotId)` pair off Svelte context. Returns
 *  `null` when the renderer is mounted outside an inspector slot — e.g.
 *  ad-hoc mounts or unit tests. Call once at component initialization. */
export function useInspectorFields(): FieldsContext | null {
  return getContext<FieldsContext | undefined>(FIELDS_CONTEXT_KEY) ?? null;
}

/** Register one editable cell as an AI-controllable field. Returns the
 *  unregister function — wire it as a `$effect` cleanup so re-runs and
 *  unmount tear it down idempotently. */
export function registerInspectorField(
  fields: FieldsContext,
  opts: RegisterFieldOpts,
): () => void {
  const base = {
    shape: 'imperative' as const,
    fieldId: opts.fieldId,
    label: opts.label,
    get: opts.get,
    set: opts.set,
    element: opts.element,
  };
  const descriptor: ControllableFieldDescriptor =
    opts.kind === 'enum'
      ? { ...base, kind: 'enum', enumValues: opts.enumValues }
      : { ...base, kind: opts.kind };
  return fields.ctx.contributions.register<ControllableFieldDescriptor>(
    'sh3.controllable-field',
    descriptor,
    { scope: { slotId: fields.slotId } },
  );
}
