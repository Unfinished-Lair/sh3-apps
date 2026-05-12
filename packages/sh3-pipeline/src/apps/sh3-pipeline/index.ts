import type { SourceApp } from 'sh3-core';

export const app: SourceApp = {
  manifest: {
    id: 'sh3-pipeline',
    icon: 'git-merge',
    label: 'Pipeline',
    requiredShards: ['sh3-pipeline'],
    layoutVersion: 1,
  },
  initialLayout: {
    type: 'tabs',
    activeTab: 0,
    tabs: [{ slotId: 'main', viewId: 'sh3-pipeline:main', label: 'View', role: 'body' }],
  },
};
