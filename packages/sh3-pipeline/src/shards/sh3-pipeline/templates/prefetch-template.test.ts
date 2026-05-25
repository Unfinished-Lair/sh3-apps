import { describe, expect, it } from 'vitest';
import { buildPrefetchPorts, defaultPrefetchConfig, isPickerableVerb } from './prefetch-template';
import type { VerbDescriptor } from './verb-adapter';

const arrayOutputVerb: VerbDescriptor = {
  shardId: 'workspace-mgr',
  name: 'workspaces.list',
  summary: 'List available workspaces',
  schema: {
    input: { type: 'object', properties: { tenant: { type: 'string' } } },
    output: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          tier: { type: 'string' },
        },
      },
    },
  },
};

const scalarOutputVerb: VerbDescriptor = {
  shardId: 'x',
  name: 'count',
  summary: '',
  schema: { input: { type: 'object', properties: {} }, output: { type: 'number' } },
};

const noOutputSchemaVerb: VerbDescriptor = {
  shardId: 'x',
  name: 'side-effect',
  summary: '',
  schema: { input: { type: 'object', properties: {} } },
};

describe('isPickerableVerb', () => {
  it('returns true for array-of-object output schemas', () => {
    expect(isPickerableVerb(arrayOutputVerb)).toBe(true);
  });

  it('returns false for scalar output schemas', () => {
    expect(isPickerableVerb(scalarOutputVerb)).toBe(false);
  });

  it('returns false for verbs with no output schema', () => {
    expect(isPickerableVerb(noOutputSchemaVerb)).toBe(false);
  });

  it('returns false for array-of-scalar output schemas', () => {
    expect(isPickerableVerb({
      ...scalarOutputVerb,
      schema: { ...scalarOutputVerb.schema!, output: { type: 'array', items: { type: 'string' } } },
    })).toBe(false);
  });
});

describe('buildPrefetchPorts', () => {
  it('returns value + record outputs only', () => {
    const ports = buildPrefetchPorts(arrayOutputVerb);
    expect(ports.map(p => `${p.direction}:${p.id}`)).toEqual([
      'output:value',
      'output:record',
    ]);
  });

  it('value port has dataType "unknown" until a valueField is known', () => {
    const valuePort = buildPrefetchPorts(arrayOutputVerb).find((p) => p.id === 'value');
    expect(valuePort?.dataType).toBe('unknown');
  });

  it('record port has dataType "record"', () => {
    const recordPort = buildPrefetchPorts(arrayOutputVerb).find((p) => p.id === 'record');
    expect(recordPort?.dataType).toBe('record');
  });
});

describe('defaultPrefetchConfig', () => {
  it('seeds an empty prefetch block', () => {
    expect(defaultPrefetchConfig()).toEqual({
      args: {},
      valueField: null,
      list: null,
      selectedRowKey: null,
      lastSelectedRow: null,
      lastError: null,
    });
  });
});
