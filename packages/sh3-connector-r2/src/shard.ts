import type { SourceShard, ShardContext } from 'sh3-core';

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-connector-r2',
    label: 'R2 Backup',
    views: [
      { id: 'sh3-connector-r2-targets', label: 'Targets' },
      { id: 'sh3-connector-r2-backup', label: 'Backup' },
      { id: 'sh3-connector-r2-import', label: 'Import' },
    ],
    permissions: ['documents:browse'],
  },

  activate(_ctx: ShardContext) {
    // Views and contributions registered in a later task.
  },
};
