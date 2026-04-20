import type { SourceApp } from 'sh3-core';

export const app: SourceApp = {
  manifest: {
    id: 'sh3-connector-r2-app',
    label: 'R2 Backup',
    requiredShards: ['sh3-connector-r2'],
    layoutVersion: 2,
    permissions: ['documents:browse'],
  },
  initialLayout: {
    type: 'tabs',
    activeTab: 0,
    tabs: [
      { slotId: 'sh3-connector-r2.targets', viewId: 'sh3-connector-r2-targets', label: 'Targets' },
      { slotId: 'sh3-connector-r2.backup',  viewId: 'sh3-connector-r2-backup',  label: 'Backup' },
      { slotId: 'sh3-connector-r2.import',  viewId: 'sh3-connector-r2-import',  label: 'Import' },
    ],
  },
};
