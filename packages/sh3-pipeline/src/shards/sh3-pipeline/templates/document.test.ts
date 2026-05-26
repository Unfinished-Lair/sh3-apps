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

  it('declares folder, filename, and format in configSchema', () => {
    const t = documentTemplates[0];
    const keys = (t.configSchema ?? []).map((f) => f.key);
    expect(keys).toEqual(['folder', 'filename', 'format']);
  });

  it('marks folder field as doc-folder', () => {
    const t = documentTemplates[0];
    const folderField = (t.configSchema ?? []).find((f) => f.key === 'folder');
    expect(folderField?.type).toBe('doc-folder');
  });

  it('defaultConfig has null folder, filename template, json format', () => {
    const t = documentTemplates[0];
    expect(t.defaultConfig).toEqual({
      folder: null,
      filename: 'result-{i}.json',
      format: 'json',
    });
  });

  it('defaultConfig round-trips through JSON', () => {
    const t = documentTemplates[0];
    expect(JSON.parse(JSON.stringify(t.defaultConfig))).toEqual(t.defaultConfig);
  });
});
