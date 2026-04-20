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
    type: 'slot',
    slotId: 'sh3-connector-r2.targets',
    viewId: 'sh3-connector-r2-targets',
  },
};
