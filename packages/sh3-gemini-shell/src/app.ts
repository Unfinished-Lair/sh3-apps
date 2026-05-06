import type { SourceApp } from 'sh3-core';

export const app: SourceApp = {
  manifest: {
    id: 'gemini-shell',
    label: 'Gemini',
    requiredShards: ['gemini'],
    layoutVersion: 1,
    icon: 'sparkles',
  },
  initialLayout: {
    type: 'tabs',
    activeTab: 0,
    tabs: [
      {
        slotId: 'gemini.settings',
        viewId: 'gemini:settings',
        label: 'Settings',
      },
    ],
  },
};
