import type { SourceApp } from 'sh3-core';
import { restoreConfirmedTheme } from './shard';

export const app: SourceApp = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
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
