import { walkScope } from './walker';

export type UploadOutcome =
  | { status: 'uploaded' }
  | { status: 'skipped-unchanged' }
  | { status: 'failed'; reason?: string };

export interface BackupFolderProgress {
  currentLabel: string;
  total: number;
  processed: number;
  uploaded: number;
  skipped: number;
  failed: number;
}

export interface BackupFolderInput {
  list: () => Promise<Array<{ shardId: string; path: string }>>;
  shardId: string;
  pathPrefix?: string;
  recursive: boolean;
  upload: (item: { shardId: string; path: string }) => Promise<UploadOutcome>;
  onProgress?: (snapshot: BackupFolderProgress) => void;
}

export interface BackupFolderStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export async function backupFolder(input: BackupFolderInput): Promise<BackupFolderStats> {
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;
  const errors: string[] = [];

  const stats = await walkScope({
    list: input.list,
    scope: { shardId: input.shardId, pathPrefix: input.pathPrefix, recursive: input.recursive },
    onItem: async (item, _i, total) => {
      const res = await input.upload(item);
      processed++;
      if (res.status === 'uploaded') uploaded++;
      else if (res.status === 'skipped-unchanged') skipped++;
      else {
        failed++;
        if (res.reason) errors.push(`${item.path}: ${res.reason}`);
      }
      input.onProgress?.({
        currentLabel: `${item.shardId}/${item.path}`,
        total,
        processed,
        uploaded,
        skipped,
        failed,
      });
      return res.status;
    },
  });

  return { total: stats.total, uploaded, skipped, failed, errors };
}
