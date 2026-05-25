import { describe, expect, it } from 'vitest';
import { buildPrefetchTemplate, isPickerableVerb } from './prefetch-template';
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

describe('buildPrefetchTemplate', () => {
  it('produces type "verb:<shard>:<name>:prefetch"', () => {
    const t = buildPrefetchTemplate(arrayOutputVerb);
    expect(t.type).toBe('verb:workspace-mgr:workspaces.list:prefetch');
  });

  it('uses category "Pickers" so the palette groups them together', () => {
    expect(buildPrefetchTemplate(arrayOutputVerb).category).toBe('Pickers');
  });

  it('uses the verb name as label', () => {
    expect(buildPrefetchTemplate(arrayOutputVerb).label).toBe('workspaces.list');
  });

  it('has no input ports', () => {
    const ports = buildPrefetchTemplate(arrayOutputVerb).ports;
    expect(ports.filter((p) => p.direction === 'input')).toEqual([]);
  });

  it('has exactly two output ports: value and record', () => {
    const outs = buildPrefetchTemplate(arrayOutputVerb).ports.filter((p) => p.direction === 'output');
    expect(outs.map((p) => p.id)).toEqual(['value', 'record']);
  });

  it('value port has dataType "unknown" until a valueField is known', () => {
    const valuePort = buildPrefetchTemplate(arrayOutputVerb).ports.find((p) => p.id === 'value');
    expect(valuePort?.dataType).toBe('unknown');
  });

  it('record port has dataType "record"', () => {
    const recordPort = buildPrefetchTemplate(arrayOutputVerb).ports.find((p) => p.id === 'record');
    expect(recordPort?.dataType).toBe('record');
  });

  it('seeds defaultConfig with mode: "prefetch" and an empty prefetch block', () => {
    const t = buildPrefetchTemplate(arrayOutputVerb);
    expect(t.defaultConfig).toMatchObject({
      mode: 'prefetch',
      shardId: 'workspace-mgr',
      name: 'workspaces.list',
      prefetch: {
        args: {},
        valueField: null,
        list: null,
        selectedRowKey: null,
        lastSelectedRow: null,
        lastError: null,
      },
    });
  });
});
