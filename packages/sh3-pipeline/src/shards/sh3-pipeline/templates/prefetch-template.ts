import type { NodeTemplate, GraphAssetPort } from '@unfinished-lair/sh3-editor/graph/types';
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

export function buildPrefetchTemplate(v: VerbDescriptor): NodeTemplate {
  const ports: GraphAssetPort[] = [
    { id: 'value',  direction: 'output', dataType: 'unknown', label: 'value' },
    { id: 'record', direction: 'output', dataType: 'record',  label: 'record' },
  ];
  return {
    type: `verb:${v.shardId}:${v.name}:prefetch`,
    category: 'Pickers',
    label: v.name,
    ports,
    defaultConfig: {
      mode: 'prefetch',
      shardId: v.shardId,
      name: v.name,
      summary: v.summary ?? '',
      prefetch: {
        args: {},
        valueField: null,
        list: null,
        selectedRowKey: null,
        lastSelectedRow: null,
        lastError: null,
      },
    },
  };
}
