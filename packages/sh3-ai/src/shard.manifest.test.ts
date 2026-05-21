import { describe, it, expect } from 'vitest';
import { shard } from './shard';

describe('sh3-ai manifest', () => {
  it('declares documents:browse and documents:read for cross-shard file-handler reads', () => {
    expect(shard.manifest.permissions).toEqual(
      expect.arrayContaining(['documents:browse', 'documents:read']),
    );
  });
});
