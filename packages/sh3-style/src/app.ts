import type { App } from 'sh3-core';

export const app: App = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.2.0',
    requiredShards: ['sh3-style'],
    layoutVersion: 1,
  },

  initialLayout: {
    type: 'tabs',
    tabs: [{ slotId: 'main', viewId: 'sh3-style-editor', label: 'Style Editor' }],
    activeTab: 0,
  },
};
