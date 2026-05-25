import { describe, it, expect } from 'vitest';
import { shard } from './shard';

describe('sh3-editor manifest', () => {
  it('declares documents:browse for cross-shard file-handler reads', () => {
    expect(shard.manifest.permissions).toEqual(
      expect.arrayContaining(['documents:browse']),
    );
  });

  it('does not declare the obsolete documents:read permission', () => {
    expect(shard.manifest.permissions).not.toContain('documents:read');
  });
});
