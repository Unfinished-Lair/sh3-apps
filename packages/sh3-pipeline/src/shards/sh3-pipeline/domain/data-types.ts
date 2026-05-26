import type { DataTypeDef, ConversionDef } from '@unfinished-lair/sh3-editor/graph/types';

export type DataType =
  | 'run'
  | 'string'
  | 'number'
  | 'boolean'
  | 'record'
  | 'array'
  | 'doc'
  | 'unknown';

export const DATA_TYPES: readonly DataType[] = [
  'run', 'string', 'number', 'boolean', 'record', 'array', 'doc', 'unknown',
];

export const DATA_TYPE_DEFS: Record<DataType, DataTypeDef> = {
  run:     { label: 'Run',      color: '#cccccc', description: 'Execution sequencing' },
  string:  { label: 'String',   color: '#22d3ee' },
  number:  { label: 'Number',   color: '#a3e635' },
  boolean: { label: 'Boolean',  color: '#fbbf24' },
  record:  { label: 'Record',   color: '#c4b5fd' },
  array:   { label: 'Array',    color: '#fb7185' },
  doc:     { label: 'Document', color: '#a78bfa' },
  unknown: { label: 'Unknown',  color: '#666666', description: 'Untyped escape hatch' },
};

/** Back-compat alias: existing code that imports PORT_COLORS keeps working. */
export const PORT_COLORS: Record<DataType, string> = Object.fromEntries(
  (Object.entries(DATA_TYPE_DEFS) as [DataType, DataTypeDef][])
    .map(([k, v]) => [k, v.color]),
) as Record<DataType, string>;

export function parseNumberOrThrow(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`cannot parse number from ${JSON.stringify(v)}`);
  return n;
}

export function parseBooleanOrThrow(v: unknown): boolean {
  if (typeof v !== 'string') {
    if (typeof v === 'boolean') return v;
    throw new Error(`cannot parse boolean from ${JSON.stringify(v)}`);
  }
  const s = v.trim().toLowerCase();
  if (s === 'true' || s === '1' || s === 'yes') return true;
  if (s === 'false' || s === '0' || s === 'no' || s === '') return false;
  throw new Error(`cannot parse boolean from ${JSON.stringify(v)}`);
}

export const CONVERSIONS: ReadonlyArray<ConversionDef> = [
  { id: 'pipeline:number-to-string',  from: 'number',  to: 'string',  adapt: (v) => String(v) },
  { id: 'pipeline:string-to-number',  from: 'string',  to: 'number',  adapt: (v) => parseNumberOrThrow(v) },
  { id: 'pipeline:boolean-to-string', from: 'boolean', to: 'string',  adapt: (v) => (v ? 'true' : 'false') },
  { id: 'pipeline:string-to-boolean', from: 'string',  to: 'boolean', adapt: (v) => parseBooleanOrThrow(v) },
];

export function dataTypeFromJsonSchema(schema: unknown): DataType {
  if (!schema || typeof schema !== 'object') return 'unknown';
  const s = schema as { type?: string; format?: string };
  if (s.format === 'sh3-document') return 'doc';
  switch (s.type) {
    case 'string':  return 'string';
    case 'number':
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'array':   return 'array';
    case 'object':  return 'record';
    default:        return 'unknown';
  }
}
