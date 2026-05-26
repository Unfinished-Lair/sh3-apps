import { describe, it, expect } from 'vitest';
import { shard } from './shard';

describe('sh3-editor manifest', () => {
  it('declares no permissions — the editor uses its own document handle and SH3 brokers access', () => {
    expect(shard.manifest.permissions).toEqual([]);
  });
});
