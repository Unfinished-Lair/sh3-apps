import { describe, it, expect } from 'vitest';
import { migrateAsset } from './migrate';
import { CURRENT_ASSET_VERSION, type GraphAsset } from './types';

const v1: GraphAsset = {
  id: 'a', name: 'A', domain: 'd', version: 1,
  nodes: [], edges: [],
};

describe('migrateAsset', () => {
  it('promotes a v1 asset to current version with no blocks added', () => {
    const m = migrateAsset({ ...v1 });
    expect(m.version).toBe(CURRENT_ASSET_VERSION);
    expect(m.blocks).toBeUndefined();
  });

  it('is a no-op for current-version assets', () => {
    const cur = { ...v1, version: CURRENT_ASSET_VERSION };
    expect(migrateAsset(cur)).toBe(cur);
  });

  it('does not mutate the input', () => {
    const a = { ...v1 };
    migrateAsset(a);
    expect(a.version).toBe(1);
  });
});
