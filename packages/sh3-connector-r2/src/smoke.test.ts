import { describe, it, expect } from 'vitest';
import { shard, app } from './index';

describe('sh3-connector-r2 smoke', () => {
  it('exports a shard with the expected id', () => {
    expect(shard.manifest.id).toBe('sh3-connector-r2');
    expect(shard.manifest.views).toHaveLength(3);
  });

  it('exports an app requiring the shard', () => {
    expect(app.manifest.id).toBe('sh3-connector-r2-app');
    expect(app.manifest.requiredShards).toContain('sh3-connector-r2');
  });
});
