import { describe, it, expect } from 'vitest';
import { verbsToTemplates, type VerbDescriptor } from './verb-adapter';

describe('verbsToTemplates', () => {
  it('produces a unique template type per verb, prefixed with verb:', () => {
    const verbs: VerbDescriptor[] = [
      { shardId: 'ai', name: 'ai:ask',   summary: 'Ask the AI' },
      { shardId: 'ai', name: 'ai:reset', summary: 'Reset state' },
    ];
    const t = verbsToTemplates(verbs);
    expect(t.map((x) => x.type)).toEqual(['verb:ai:ai:ask', 'verb:ai:ai:reset']);
  });

  it('falls back to args+result/stdout/stderr/scrollback when no schema', () => {
    const t = verbsToTemplates([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask' }])[0];

    const inIds = t.ports.filter((p) => p.direction === 'input').map((p) => p.id);
    const outIds = t.ports.filter((p) => p.direction === 'output').map((p) => p.id);

    expect(inIds).toEqual(['control-in', 'args']);
    expect(outIds).toEqual(['control-out', 'result', 'stdout', 'stderr', 'scrollback']);
  });

  it('maps schema.input.properties to typed input ports', () => {
    const t = verbsToTemplates([{
      shardId: 'demo',
      name: 'demo:do',
      summary: 'Do',
      schema: {
        input: {
          type: 'object',
          properties: {
            topic:    { type: 'string' },
            maxItems: { type: 'integer' },
            loud:     { type: 'boolean' },
          },
          required: ['topic'],
        },
      },
    }])[0];

    const inputs = t.ports.filter((p) => p.direction === 'input');
    const byId = new Map(inputs.map((p) => [p.id, p]));
    expect(byId.get('topic')?.dataType).toBe('string');
    expect(byId.get('maxItems')?.dataType).toBe('number');
    expect(byId.get('loud')?.dataType).toBe('boolean');
    expect(byId.get('control-in')?.dataType).toBe('control');
  });

  it('maps schema.output object properties to typed output ports (no fallback)', () => {
    const t = verbsToTemplates([{
      shardId: 'demo',
      name: 'demo:do',
      summary: 'Do',
      schema: {
        input: { type: 'object', properties: {} },
        output: {
          type: 'object',
          properties: { answer: { type: 'string' }, count: { type: 'number' } },
        },
      },
    }])[0];

    const outputs = t.ports.filter((p) => p.direction === 'output');
    const byId = new Map(outputs.map((p) => [p.id, p]));
    expect(byId.get('answer')?.dataType).toBe('string');
    expect(byId.get('count')?.dataType).toBe('number');
    expect(byId.get('control-out')?.dataType).toBe('control');
    expect(outputs.map((p) => p.id).sort()).toEqual(['answer', 'control-out', 'count']);
  });

  it('assigns category=Verbs and label=v.name (concise, single-line)', () => {
    const t = verbsToTemplates([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask the AI' }])[0];
    expect(t.category).toBe('Verbs');
    expect(t.label).toBe('ai:ask');
  });

  it('stores summary in defaultConfig for later tooltip use', () => {
    const t = verbsToTemplates([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask the AI' }])[0];
    expect(t.defaultConfig).toMatchObject({ shardId: 'ai', name: 'ai:ask', summary: 'Ask the AI' });
  });

  describe('defaultConfig schema metadata (drives runtime dispatch)', () => {
    it('no schema → hasInputSchema:false, outputPortIds:null', () => {
      const t = verbsToTemplates([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask' }])[0];
      expect(t.defaultConfig).toMatchObject({
        hasInputSchema: false,
        outputPortIds: null,
      });
    });

    it('object input + object output → hasInputSchema:true, outputPortIds lists props', () => {
      const t = verbsToTemplates([{
        shardId: 'demo',
        name: 'demo:do',
        summary: 'Do',
        schema: {
          input:  { type: 'object', properties: { topic: { type: 'string' } } },
          output: { type: 'object', properties: { answer: { type: 'string' }, count: { type: 'number' } } },
        },
      }])[0];
      expect(t.defaultConfig).toMatchObject({
        hasInputSchema: true,
        outputPortIds: ['answer', 'count'],
      });
    });

    it('input schema only (dirt-cli shape) → hasInputSchema:true, outputPortIds:null', () => {
      const t = verbsToTemplates([{
        shardId: 'dirt',
        name: 'dirt-cli',
        summary: 'Run',
        schema: {
          input: {
            type: 'object',
            properties: {
              tool: { type: 'string' },
              args: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      }])[0];
      expect(t.defaultConfig).toMatchObject({
        hasInputSchema: true,
        outputPortIds: null,
      });
    });

    it('scalar output schema → outputPortIds is empty array (single `value` port)', () => {
      const t = verbsToTemplates([{
        shardId: 'demo',
        name: 'demo:do',
        summary: 'Do',
        schema: {
          input: { type: 'object', properties: {} },
          output: { type: 'string' },
        },
      }])[0];
      expect(t.defaultConfig).toMatchObject({
        hasInputSchema: true,
        outputPortIds: [],
      });
    });

    it('pickerable verb (array-of-object output) gets computePorts', () => {
      const t = verbsToTemplates([{
        shardId: 'workspace-mgr',
        name: 'workspaces.list',
        summary: 'List workspaces',
        schema: {
          output: {
            type: 'array',
            items: { type: 'object', properties: { id: { type: 'string' } } },
          },
        },
      }])[0];
      expect(t.computePorts).toBeDefined();
      expect(t.defaultConfig).not.toHaveProperty('pickerable');
    });

    it('non-pickerable verb (no schema) omits computePorts', () => {
      const t = verbsToTemplates([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask' }])[0];
      expect(t.computePorts).toBeUndefined();
      expect(t.defaultConfig).not.toHaveProperty('pickerable');
    });

    it('non-pickerable verb (object output) omits computePorts', () => {
      const t = verbsToTemplates([{
        shardId: 'demo',
        name: 'demo:do',
        summary: 'Do',
        schema: {
          output: { type: 'object', properties: { answer: { type: 'string' } } },
        },
      }])[0];
      expect(t.computePorts).toBeUndefined();
      expect(t.defaultConfig).not.toHaveProperty('pickerable');
    });
  });
});

describe('verbsToTemplates — one template per verb', () => {
  it('emits exactly one template per verb', () => {
    const verbs: VerbDescriptor[] = [
      {
        shardId: 's', name: 'do', summary: '',
        schema: { output: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' } } } } },
      },
      { shardId: 's', name: 'nondrop', summary: '' },
    ];
    const tmpls = verbsToTemplates(verbs);
    expect(tmpls.map(t => t.type)).toEqual(['verb:s:do', 'verb:s:nondrop']);
  });

  it('computePorts(mode:runtime) matches runtime shape', () => {
    const v: VerbDescriptor = {
      shardId: 's', name: 'list', summary: '',
      schema: { output: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' } } } } },
    };
    const [tmpl] = verbsToTemplates([v]);
    const runtimePorts = tmpl.computePorts!({ mode: 'runtime', shardId: 's', name: 'list', summary: '' });
    expect(runtimePorts.map(p => p.id)).toEqual(tmpl.ports.map(p => p.id));
  });

  it('computePorts(mode:prefetch) on a pickerable verb returns the prefetch shape', () => {
    const v: VerbDescriptor = {
      shardId: 's', name: 'list', summary: '',
      schema: { output: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' } } } } },
    };
    const [tmpl] = verbsToTemplates([v]);
    const prefetchPorts = tmpl.computePorts!({ mode: 'prefetch', shardId: 's', name: 'list', summary: '' });
    expect(prefetchPorts.map(p => `${p.direction}:${p.id}`)).toEqual([
      'output:value',
      'output:record',
    ]);
  });

  it('non-pickerable verb has no computePorts', () => {
    const v: VerbDescriptor = { shardId: 's', name: 'plain', summary: '' };
    const [tmpl] = verbsToTemplates([v]);
    expect(tmpl.computePorts).toBeUndefined();
  });
});
