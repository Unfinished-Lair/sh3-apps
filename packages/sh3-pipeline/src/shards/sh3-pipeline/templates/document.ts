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
      port('run-in',  'input',  'run', ''),
      port('data',    'input',  'unknown', 'data'),
      port('run-out', 'output', 'run', ''),
      port('paths',   'output', 'array', 'paths'),
    ],
    defaultConfig: {
      folder: null,
      filename: 'result-{i}.json',
      format: 'json',
    },
    configSchema: [
      { key: 'folder',   label: 'Folder',   type: 'doc-folder' },
      { key: 'filename', label: 'Filename', type: 'string' },
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
