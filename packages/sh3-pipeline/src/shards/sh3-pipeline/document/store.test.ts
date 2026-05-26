import { describe, it, expect } from 'vitest';
import { applyPrefetchSuffixFixup, applyDocumentWriteFolderMigration } from './store';
import { DOMAIN_ID } from './format';
import type { PipelineDocument } from './format';

function docWith(...nodes: Array<{ id: string; type: string; config?: Record<string, unknown> }>): PipelineDocument {
  return {
    version: 1,
    domainId: DOMAIN_ID,
    interface: { inputs: [], outputs: [] },
    asset: {
      id: 'graph', name: '', domain: DOMAIN_ID, version: 1,
      nodes: nodes.map(n => ({
        id: n.id, type: n.type, position: { x: 0, y: 0 },
        config: n.config ?? {}, ports: [],
      })),
      edges: [],
    },
  };
}

describe('applyPrefetchSuffixFixup', () => {
  it('strips :prefetch suffix and forces config.mode=prefetch', () => {
    const doc = docWith({ id: 'n1', type: 'verb:s:list:prefetch' });
    applyPrefetchSuffixFixup(doc);
    expect(doc.asset.nodes[0].type).toBe('verb:s:list');
    expect(doc.asset.nodes[0].config?.mode).toBe('prefetch');
  });

  it('leaves base-type nodes untouched', () => {
    const doc = docWith({ id: 'n1', type: 'verb:s:list', config: { mode: 'runtime' } });
    applyPrefetchSuffixFixup(doc);
    expect(doc.asset.nodes[0].type).toBe('verb:s:list');
    expect(doc.asset.nodes[0].config?.mode).toBe('runtime');
  });

  it('is idempotent on already-normalized docs', () => {
    const doc = docWith({ id: 'n1', type: 'verb:s:list', config: { mode: 'prefetch' } });
    const before = JSON.stringify(doc);
    applyPrefetchSuffixFixup(doc);
    expect(JSON.stringify(doc)).toBe(before);
  });
});

describe('applyDocumentWriteFolderMigration', () => {
  it('migrates {targetShard, pathTemplate} to {folder, filename}', () => {
    const doc = docWith({
      id: 'n1',
      type: 'document.write',
      config: { targetShard: 'sh3-text', pathTemplate: 'out/result-{i}.json', format: 'json' },
    });
    applyDocumentWriteFolderMigration(doc);
    expect(doc.asset.nodes[0].config).toEqual({
      folder: { shardId: 'sh3-text', path: 'out' },
      filename: 'result-{i}.json',
      format: 'json',
    });
  });

  it('handles legacy pathTemplate with no slash (no folder, just filename)', () => {
    const doc = docWith({
      id: 'n1',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'just-a-file.json', format: 'json' },
    });
    applyDocumentWriteFolderMigration(doc);
    expect(doc.asset.nodes[0].config).toEqual({
      folder: { shardId: 's', path: '' },
      filename: 'just-a-file.json',
      format: 'json',
    });
  });

  it('handles legacy pathTemplate with nested folders', () => {
    const doc = docWith({
      id: 'n1',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'a/b/c/file.json', format: 'text' },
    });
    applyDocumentWriteFolderMigration(doc);
    expect(doc.asset.nodes[0].config).toEqual({
      folder: { shardId: 's', path: 'a/b/c' },
      filename: 'file.json',
      format: 'text',
    });
  });

  it('defaults missing legacy format to json', () => {
    const doc = docWith({
      id: 'n1',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'x.json' },
    });
    applyDocumentWriteFolderMigration(doc);
    expect(doc.asset.nodes[0].config.format).toBe('json');
  });

  it('leaves non-document.write nodes untouched', () => {
    const doc = docWith({
      id: 'n1',
      type: 'verb:s:list',
      config: { targetShard: 's', pathTemplate: 'x.json' },
    });
    const before = JSON.stringify(doc);
    applyDocumentWriteFolderMigration(doc);
    expect(JSON.stringify(doc)).toBe(before);
  });

  it('is idempotent on already-migrated docs', () => {
    const doc = docWith({
      id: 'n1',
      type: 'document.write',
      config: {
        folder: { shardId: 's', path: 'out' },
        filename: 'r.json',
        format: 'json',
      },
    });
    const before = JSON.stringify(doc);
    applyDocumentWriteFolderMigration(doc);
    expect(JSON.stringify(doc)).toBe(before);
  });

  it('does not overwrite when folder is already set, even if legacy fields linger', () => {
    const doc = docWith({
      id: 'n1',
      type: 'document.write',
      config: {
        folder: { shardId: 'new-shard', path: 'new-out' },
        filename: 'new.json',
        format: 'json',
        targetShard: 'old-shard',
        pathTemplate: 'old/r.json',
      },
    });
    applyDocumentWriteFolderMigration(doc);
    expect((doc.asset.nodes[0].config.folder as any).shardId).toBe('new-shard');
  });
});
