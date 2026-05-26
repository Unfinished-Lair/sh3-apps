import { describe, it, expect } from 'vitest';
import { buildControlGraphDomain } from './build';
import { CONVERSIONS, DATA_TYPE_DEFS } from './data-types';

const fakeHost = { log: () => {} };

function makeCtx(verbs: Array<{ shardId: string; name: string; summary?: string; schema?: unknown }>) {
  return {
    sh3: {
      listVerbs: (_opts: { programmaticOnly: boolean }) => verbs,
    },
  };
}

describe('buildControlGraphDomain', () => {
  it('registers structural + verb templates and exposes domain identity', () => {
    const ctx = makeCtx([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask' }]);
    const domain = buildControlGraphDomain(ctx as any, fakeHost);
    expect(domain.id).toBe('sh3-pipeline:control-graph');
    expect(domain.label).toBe('Control Graph');
    const types = domain.getTemplates().map((t) => t.type);
    expect(types).toContain('start');
    expect(types).toContain('end');
    expect(types).toContain('verb:ai:ai:ask');
  });

  it('groups templates by category', () => {
    const ctx = makeCtx([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask' }]);
    const domain = buildControlGraphDomain(ctx as any, fakeHost);
    const byCat = domain.getTemplatesByCategory();
    expect(byCat.has('Flow')).toBe(true);
    expect(byCat.has('Data')).toBe(true);
    expect(byCat.has('Verbs')).toBe(true);
  });

  it('resolveConnect honors the run-port rule', () => {
    const ctx = makeCtx([]);
    const domain = buildControlGraphDomain(ctx as any, fakeHost);
    const a = { nodeId: 'a', portId: 'p', direction: 'output' as const, dataType: 'run' };
    const b = { nodeId: 'b', portId: 'p', direction: 'input' as const, dataType: 'run' };
    expect(domain.resolveConnect!(a, b)).toBe(true);
  });

  it('exposes verb-decorated visuals', () => {
    const ctx = makeCtx([{ shardId: 'ai', name: 'ai:ask', summary: 'Ask' }]);
    const domain = buildControlGraphDomain(ctx as any, fakeHost);
    expect(domain.getNodeVisuals('start').borderColor).toBe('#22c55e');
    expect(domain.getNodeVisuals('verb:ai:ai:ask').borderColor).toBe('#3b82f6');
  });

  it('domain exposes dataTypes / conversions / resolveConnect', () => {
    const ctx = makeCtx([]);
    const domain = buildControlGraphDomain(ctx as any, fakeHost);
    expect(domain.dataTypes).toBe(DATA_TYPE_DEFS);
    expect(domain.conversions).toBe(CONVERSIONS);
    expect(typeof domain.resolveConnect).toBe('function');
    expect(domain.canConnect).toBeUndefined();
  });
});
