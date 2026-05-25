import type { GraphAssetPort } from '@unfinished-lair/sh3-editor/graph/types';
import type { VerbDescriptor } from './verb-adapter';

/**
 * A verb is pickerable when its output schema is an array of objects.
 * (The upstream `enumerative` flag is orthogonal — it gates the WARNING
 * modal, not eligibility.)
 */
export function isPickerableVerb(v: VerbDescriptor): boolean {
  const out = v.schema?.output as { type?: string; items?: { type?: string } } | undefined;
  if (!out || out.type !== 'array') return false;
  const items = out.items;
  if (!items || items.type !== 'object') return false;
  return true;
}

/**
 * Port shape for a verb node in prefetch mode. Used by verb-adapter's
 * computePorts when config.mode === 'prefetch'. Returns value + record
 * outputs only — no control or schema-derived input ports.
 */
export function buildPrefetchPorts(_v: VerbDescriptor): GraphAssetPort[] {
  return [
    { id: 'value',  direction: 'output', dataType: 'unknown', label: 'value' },
    { id: 'record', direction: 'output', dataType: 'record',  label: 'record' },
  ];
}

/**
 * Default `prefetch` config block for a verb node forced into prefetch mode
 * (used by Toggle Prefetch when activating mode for the first time).
 */
export function defaultPrefetchConfig(): Record<string, unknown> {
  return {
    args: {},
    valueField: null,
    list: null,
    selectedRowKey: null,
    lastSelectedRow: null,
    lastError: null,
  };
}
