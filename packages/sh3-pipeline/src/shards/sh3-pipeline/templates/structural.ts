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

export const structuralTemplates: NodeTemplate[] = [
  {
    type: 'start',
    category: 'Flow',
    label: 'Start',
    ports: [port('run', 'output', 'run', '')],
    defaultConfig: { params: [] },
    configSchema: [],
  },
  {
    type: 'end',
    category: 'Flow',
    label: 'End',
    ports: [port('run', 'input', 'run', '')],
    defaultConfig: { returns: [] },
    configSchema: [],
  },
  {
    type: 'branch',
    category: 'Flow',
    label: 'Branch',
    ports: [
      port('run',  'input',  'run',     ''),
      port('cond', 'input',  'boolean', 'cond'),
      port('then', 'output', 'run',     'then'),
      port('else', 'output', 'run',     'else'),
    ],
    defaultConfig: {},
  },
  {
    type: 'sequence',
    category: 'Flow',
    label: 'Sequence',
    ports: [
      port('run',   'input',  'run', ''),
      port('out-1', 'output', 'run', '1'),
      port('out-2', 'output', 'run', '2'),
    ],
    defaultConfig: { count: 2 },
  },
  {
    type: 'comment',
    category: 'Flow',
    label: 'Comment',
    ports: [],
    defaultConfig: { text: '' },
    configSchema: [{ key: 'text', label: 'Text', type: 'string' }],
  },
  {
    type: 'literal.string',
    category: 'Data',
    label: 'String',
    ports: [port('value', 'output', 'string')],
    defaultConfig: { value: '' },
    configSchema: [{ key: 'value', label: 'Value', type: 'string' }],
  },
  {
    type: 'literal.number',
    category: 'Data',
    label: 'Number',
    ports: [port('value', 'output', 'number')],
    defaultConfig: { value: 0 },
    configSchema: [{ key: 'value', label: 'Value', type: 'number' }],
  },
  {
    type: 'literal.boolean',
    category: 'Data',
    label: 'Boolean',
    ports: [port('value', 'output', 'boolean')],
    defaultConfig: { value: false },
    configSchema: [{ key: 'value', label: 'Value', type: 'boolean' }],
  },
  {
    type: 'setVar',
    category: 'Data',
    label: 'Set Var',
    ports: [
      port('run-in',  'input',  'run', ''),
      port('value',   'input',  'unknown'),
      port('run-out', 'output', 'run', ''),
    ],
    defaultConfig: { key: '' },
    configSchema: [{ key: 'key', label: 'Key', type: 'string' }],
  },
  {
    type: 'getVar',
    category: 'Data',
    label: 'Get Var',
    ports: [port('value', 'output', 'unknown')],
    defaultConfig: { key: '' },
    configSchema: [{ key: 'key', label: 'Key', type: 'string' }],
  },
  {
    type: 'record.build',
    category: 'Data',
    label: 'Record',
    ports: [port('record', 'output', 'record')],
    defaultConfig: { keys: [] as string[] },
    configSchema: [{ key: 'keys', label: 'Fields', type: 'string-list' }],
    computePorts: (config) => {
      const out: GraphAssetPort[] = [port('record', 'output', 'record')];
      const keys = Array.isArray(config.keys) ? (config.keys as unknown[]) : [];
      const seen = new Set<string>();
      for (const k of keys) {
        if (typeof k !== 'string' || k.length === 0 || seen.has(k)) continue;
        seen.add(k);
        out.push(port(k, 'input', 'unknown', k));
      }
      return out;
    },
  },
  {
    type: 'record.get',
    category: 'Data',
    label: 'Record Get',
    ports: [
      port('record', 'input', 'record'),
      port('value', 'output', 'unknown'),
    ],
    defaultConfig: { key: '' },
    configSchema: [{ key: 'key', label: 'Key', type: 'string' }],
  },
];
