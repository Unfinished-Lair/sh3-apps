import type { SourceApp } from 'sh3-core';

/*
 * File Explorer app.
 * Launchable from home. Opens a two-tab workspace: Files + Connectors.
 * Both tab view ids are registered by the sh3-file-explorer shard.
 */

export const app: SourceApp = {
  manifest: {
    id: 'sh3-file-explorer-app',
    label: 'File Explorer',
    requiredShards: ['sh3-file-explorer'],
    layoutVersion: 1,
    permissions: ['documents:browse'],
  },
  initialLayout: {
    type: 'tabs',
    activeTab: 0,
    tabs: [
      { slotId: 'sh3-file-explorer.files', viewId: 'sh3-file-explorer-browser', label: 'Files' },
      { slotId: 'sh3-file-explorer.connectors', viewId: 'sh3-file-explorer-connectors', label: 'Connectors' },
    ],
  },
};
