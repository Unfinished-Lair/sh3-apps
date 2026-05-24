import type { NodeTemplate, GraphAssetPort } from '@unfinished-lair/sh3-editor/graph/types';
import type { DataType } from '../domain/data-types';

function port(
  id: string,
  direction: 'input' | 'output',
  dataType: DataType,
  label?: string,
): GraphAssetPort {
  return { id, direction, dataType, label: label ?? id };
}

export const documentTemplates: NodeTemplate[] = [
  {
    type: 'document.write',
    category: 'I/O',
    label: 'Write Document',
    ports: [
      port('control-in',  'input',  'control'),
      port('data',        'input',  'unknown', 'data'),
      port('control-out', 'output', 'control'),
      port('paths',       'output', 'array',   'paths'),
    ],
    defaultConfig: { targetShard: '', pathTemplate: 'out/result-{i}.json', format: 'json' },
    configSchema: [
      { key: 'targetShard',  label: 'Target shard',  type: 'string' },
      { key: 'pathTemplate', label: 'Path template', type: 'string' },
      {
        key: 'format',
        label: 'Format',
        type: 'select',
        options: [
          { value: 'json', label: 'JSON (pretty-printed)' },
          { value: 'text', label: 'Text (String coerce)' },
        ],
      },
    ],
  },
];
