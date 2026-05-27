import { describe, it, expect } from 'vitest';
import { structuralTemplates } from './structural';
import { VISUALS as nodeVisuals } from '../domain/visuals';

describe('structuralTemplates', () => {
  it('produces a stable set covering all built-in node types', () => {
    const types = structuralTemplates.map((t) => t.type);
    expect(types).toContain('start');
    expect(types).toContain('end');
    expect(types).toContain('branch');
    expect(types).toContain('sequence');
    expect(types).toContain('comment');
    expect(types).toContain('setVar');
    expect(types).toContain('getVar');
    expect(types).toContain('literal.string');
    expect(types).toContain('literal.number');
    expect(types).toContain('literal.boolean');
    expect(types).toContain('record.build');
    expect(types).toContain('record.get');
  });

  it('start has one run output and no inputs initially', () => {
    const start = structuralTemplates.find((t) => t.type === 'start')!;
    expect(start.ports.filter((p) => p.direction === 'input')).toHaveLength(0);
    expect(start.ports.filter((p) => p.direction === 'output' && p.dataType === 'run')).toHaveLength(1);
  });

  it('end has one run input and no outputs initially', () => {
    const end = structuralTemplates.find((t) => t.type === 'end')!;
    expect(end.ports.filter((p) => p.direction === 'output')).toHaveLength(0);
    expect(end.ports.filter((p) => p.direction === 'input' && p.dataType === 'run')).toHaveLength(1);
  });

  it('branch has 1 run in, 1 boolean in, 2 run outs (then, else)', () => {
    const b = structuralTemplates.find((t) => t.type === 'branch')!;
    const runIns = b.ports.filter((p) => p.direction === 'input' && p.dataType === 'run');
    const runOuts = b.ports.filter((p) => p.direction === 'output' && p.dataType === 'run');
    const boolIn = b.ports.filter((p) => p.direction === 'input' && p.dataType === 'boolean');
    expect(runIns).toHaveLength(1);
    expect(runOuts).toHaveLength(2);
    expect(boolIn).toHaveLength(1);
    expect(runOuts.map((p) => p.id).sort()).toEqual(['else', 'then']);
  });

  it('literal.string has no run ports and a single string output', () => {
    const lit = structuralTemplates.find((t) => t.type === 'literal.string')!;
    expect(lit.ports.every((p) => p.dataType !== 'run')).toBe(true);
    const outs = lit.ports.filter((p) => p.direction === 'output');
    expect(outs).toHaveLength(1);
    expect(outs[0].dataType).toBe('string');
  });

  it('setVar has unique run in/out port ids + a value input', () => {
    const sv = structuralTemplates.find((t) => t.type === 'setVar')!;
    const runIn = sv.ports.find((p) => p.direction === 'input' && p.dataType === 'run');
    const runOut = sv.ports.find((p) => p.direction === 'output' && p.dataType === 'run');
    expect(runIn).toBeDefined();
    expect(runOut).toBeDefined();
    expect(runIn!.id).not.toBe(runOut!.id);
    expect(sv.ports.find((p) => p.direction === 'input' && p.id === 'value')).toBeDefined();
  });

  it('all template ports have unique ids within their template', () => {
    for (const t of structuralTemplates) {
      const ids = t.ports.map((p) => p.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });
});

describe('comment node visuals', () => {
  it('declares bodySchema bound to text', () => {
    const v = nodeVisuals.comment;
    expect(v.bodySchema).toEqual([
      { key: 'text', meta: { type: 'text', widget: { type: 'text', placeholder: 'Comment…', rows: 3 } } },
    ]);
  });
  it('declares resize options', () => {
    const v = nodeVisuals.comment;
    expect(v.resize).toEqual({ axes: 'both', minW: 80, minH: 40 });
  });
});

function recordBuildTemplate() {
  return structuralTemplates.find((t) => t.type === 'record.build')!;
}

describe('record.build computePorts', () => {
  it('returns only the record output when keys is empty', () => {
    const t = recordBuildTemplate();
    expect(t.computePorts).toBeDefined();
    const ports = t.computePorts!({ keys: [] });
    expect(ports.map(p => p.id)).toEqual(['record']);
  });

  it('produces one input port per key', () => {
    const t = recordBuildTemplate();
    const ports = t.computePorts!({ keys: ['a', 'b'] });
    expect(ports.map(p => `${p.direction}:${p.id}`)).toEqual([
      'output:record',
      'input:a',
      'input:b',
    ]);
  });

  it('dedupes duplicate keys', () => {
    const t = recordBuildTemplate();
    const ports = t.computePorts!({ keys: ['a', 'a', 'b'] });
    expect(ports.map(p => p.id)).toEqual(['record', 'a', 'b']);
  });

  it('skips empty and non-string entries defensively', () => {
    const t = recordBuildTemplate();
    const ports = t.computePorts!({ keys: ['a', '', null as any, 42 as any, 'b'] });
    expect(ports.map(p => p.id)).toEqual(['record', 'a', 'b']);
  });
});
