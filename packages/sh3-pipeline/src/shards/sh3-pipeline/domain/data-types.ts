export type DataType =
  | 'control'
  | 'string'
  | 'number'
  | 'boolean'
  | 'record'
  | 'array'
  | 'doc'
  | 'unknown';

export const DATA_TYPES: readonly DataType[] = [
  'control', 'string', 'number', 'boolean', 'record', 'array', 'doc', 'unknown',
];

export const PORT_COLORS: Record<DataType, string> = {
  control: '#cccccc',
  string:  '#22d3ee',
  number:  '#a3e635',
  boolean: '#fbbf24',
  record:  '#c4b5fd',
  array:   '#fb7185',
  doc:     '#a78bfa',
  unknown: '#666666',
};

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
