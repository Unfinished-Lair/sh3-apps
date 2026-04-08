import type { App } from 'sh3-core';

export const app: App = {
  manifest: {
    id: 'sh3-zones',
    label: 'Zones',
    version: '0.1.0',
    requiredShards: ['sh3-zones'],
    layoutVersion: 1,
    permissions: ['state:manage'],
  },

  initialLayout: {
    type: 'tabs',
    tabs: [{ slotId: 'main', viewId: 'sh3-zones-manager', label: 'Zone Manager' }],
    activeTab: 0,
  },
};
