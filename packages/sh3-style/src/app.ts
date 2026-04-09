import type { App } from 'sh3-core';
import { restoreConfirmedTheme } from './shard';

export const app: App = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    version: '0.2.2',
    requiredShards: ['sh3-style'],
    layoutVersion: 1,
  },

  initialLayout: {
    type: 'tabs',
    tabs: [{ slotId: 'main', viewId: 'sh3-style-editor', label: 'Style Editor' }],
    activeTab: 0,
  },

  // Undo any in-progress theme preview when the app is unloaded
  // (e.g. user switches to a different app).
  deactivate() {
    restoreConfirmedTheme();
  },
};
