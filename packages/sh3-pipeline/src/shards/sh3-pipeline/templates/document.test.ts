import { describe, it, expect } from 'vitest';
import { documentTemplates } from './document';

describe('documentTemplates', () => {
  it('contains exactly one entry of type document.write', () => {
    expect(documentTemplates.map((t) => t.type)).toEqual(['document.write']);
  });

  it('uses the I/O category', () => {
    const t = documentTemplates[0];
    expect(t.category).toBe('I/O');
  });

  it('declares the four expected ports', () => {
    const t = documentTemplates[0];
    const portIds = t.ports.map((p) => `${p.direction}:${p.id}`).sort();
    expect(portIds).toEqual([
      'input:data',
      'input:run-in',
      'output:paths',
      'output:run-out',
    ]);
  });

  it('declares targetShard, pathTemplate, and format in configSchema', () => {
    const t = documentTemplates[0];
    const keys = (t.configSchema ?? []).map((f) => f.key);
    expect(keys).toEqual(['targetShard', 'pathTemplate', 'format']);
  });

  it('defaultConfig round-trips through JSON', () => {
    const t = documentTemplates[0];
    expect(JSON.parse(JSON.stringify(t.defaultConfig))).toEqual(t.defaultConfig);
  });
});
