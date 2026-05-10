import type { SourceApp } from 'sh3-core';
import { restoreConfirmedTheme } from './shard';

export const app: SourceApp = {
  manifest: {
    id: 'sh3-style',
    label: 'Style',
    requiredShards: ['sh3-style'],
    layoutVersion: 2,
    icon: 'palette',
  },

  initialLayout: {
    type: 'split',
    direction: 'horizontal',
    sizes: [200, 1],
    pinned: ['px', 'fr'],
    children: [
      {
        type: 'slot',
        slotId: 'main.list',
        viewId: 'sh3-style-list',
        role: 'sidebar',
      },
      {
        type: 'slot',
        slotId: 'main.edit',
        viewId: 'sh3-style-edit',
      },
    ],
  },

  // Undo any in-progress theme preview when the app is unloaded
  // (e.g. user switches to a different app).
  deactivate() {
    restoreConfirmedTheme();
  },
};
