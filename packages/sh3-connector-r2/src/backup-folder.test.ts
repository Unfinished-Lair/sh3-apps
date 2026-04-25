import { describe, it, expect, vi } from 'vitest';
import { backupFolder } from './backup-folder';

describe('backupFolder', () => {
  it('calls upload for each matched doc and aggregates outcomes', async () => {
    const docs = [
      { shardId: 'notes', path: 'sub/a.md' },
      { shardId: 'notes', path: 'sub/b.md' },
      { shardId: 'notes', path: 'sub/c.md' },
      { shardId: 'notes', path: 'other.md' },
      { shardId: 'editor', path: 'sub/x.md' },
    ];
    const outcomes = ['uploaded', 'skipped-unchanged', 'failed'] as const;
    let i = 0;
    const upload = vi.fn(async () => ({ status: outcomes[i++], reason: i === 3 ? 'boom' : undefined }));
    const onProgress = vi.fn();

    const stats = await backupFolder({
      list: async () => docs,
      shardId: 'notes',
      pathPrefix: 'sub/',
      recursive: true,
      upload,
      onProgress,
    });

    expect(upload).toHaveBeenCalledTimes(3);
    expect(stats).toEqual({
      total: 3,
      uploaded: 1,
      skipped: 1,
      failed: 1,
      errors: ['sub/c.md: boom'],
    });
    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenLastCalledWith({
      currentLabel: 'notes/sub/c.md',
      total: 3,
      processed: 3,
      uploaded: 1,
      skipped: 1,
      failed: 1,
    });
  });

  it('honors recursive=false and only matches direct children', async () => {
    const docs = [
      { shardId: 'notes', path: 'sub/a.md' },
      { shardId: 'notes', path: 'sub/nested/b.md' },
    ];
    const upload = vi.fn(async () => ({ status: 'uploaded' as const }));
    const stats = await backupFolder({
      list: async () => docs,
      shardId: 'notes',
      pathPrefix: 'sub/',
      recursive: false,
      upload,
    });
    expect(upload).toHaveBeenCalledTimes(1);
    expect(upload).toHaveBeenCalledWith({ shardId: 'notes', path: 'sub/a.md' });
    expect(stats.total).toBe(1);
  });

  it('treats undefined onProgress as a no-op', async () => {
    const docs = [{ shardId: 'notes', path: 'a.md' }];
    const upload = vi.fn(async () => ({ status: 'uploaded' as const }));
    const stats = await backupFolder({
      list: async () => docs,
      shardId: 'notes',
      recursive: true,
      upload,
    });
    expect(stats.total).toBe(1);
  });
});
