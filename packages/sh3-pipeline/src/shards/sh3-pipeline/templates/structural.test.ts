import { describe, it, expect } from 'vitest';
import { structuralTemplates } from './structural';

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

  it('start has one control output and no inputs initially', () => {
    const start = structuralTemplates.find((t) => t.type === 'start')!;
    expect(start.ports.filter((p) => p.direction === 'input')).toHaveLength(0);
    expect(start.ports.filter((p) => p.direction === 'output' && p.dataType === 'control')).toHaveLength(1);
  });

  it('end has one control input and no outputs initially', () => {
    const end = structuralTemplates.find((t) => t.type === 'end')!;
    expect(end.ports.filter((p) => p.direction === 'output')).toHaveLength(0);
    expect(end.ports.filter((p) => p.direction === 'input' && p.dataType === 'control')).toHaveLength(1);
  });

  it('branch has 1 control in, 1 boolean in, 2 control outs (then, else)', () => {
    const b = structuralTemplates.find((t) => t.type === 'branch')!;
    const ctrlIns = b.ports.filter((p) => p.direction === 'input' && p.dataType === 'control');
    const ctrlOuts = b.ports.filter((p) => p.direction === 'output' && p.dataType === 'control');
    const boolIn = b.ports.filter((p) => p.direction === 'input' && p.dataType === 'boolean');
    expect(ctrlIns).toHaveLength(1);
    expect(ctrlOuts).toHaveLength(2);
    expect(boolIn).toHaveLength(1);
    expect(ctrlOuts.map((p) => p.id).sort()).toEqual(['else', 'then']);
  });

  it('literal.string has no control ports and a single string output', () => {
    const lit = structuralTemplates.find((t) => t.type === 'literal.string')!;
    expect(lit.ports.every((p) => p.dataType !== 'control')).toBe(true);
    const outs = lit.ports.filter((p) => p.direction === 'output');
    expect(outs).toHaveLength(1);
    expect(outs[0].dataType).toBe('string');
  });

  it('setVar has unique control in/out port ids + a value input', () => {
    const sv = structuralTemplates.find((t) => t.type === 'setVar')!;
    const ctrlIn = sv.ports.find((p) => p.direction === 'input' && p.dataType === 'control');
    const ctrlOut = sv.ports.find((p) => p.direction === 'output' && p.dataType === 'control');
    expect(ctrlIn).toBeDefined();
    expect(ctrlOut).toBeDefined();
    expect(ctrlIn!.id).not.toBe(ctrlOut!.id);
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
