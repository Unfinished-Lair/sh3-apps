import { describe, it, expect } from 'vitest';
import { shard } from './shard';

describe('sh3-ai manifest', () => {
  it('declares documents:browse and documents:write for cross-shard file-handler reads and writes', () => {
    // sh3-core 0.26 collapsed documents:read into documents:browse; the
    // manifest must request browse + write (write implies browse but we keep
    // it declared for clarity).
    expect(shard.manifest.permissions).toEqual(
      expect.arrayContaining(['documents:browse', 'documents:write']),
    );
  });

  it('does not declare the obsolete documents:read permission', () => {
    expect(shard.manifest.permissions).not.toContain('documents:read');
  });
});
