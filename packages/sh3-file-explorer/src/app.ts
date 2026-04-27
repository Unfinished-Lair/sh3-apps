import type { SourceApp } from 'sh3-core';

/*
 * File Explorer app.
 * Launchable from home. Opens a single Files view.
 */

export const app: SourceApp = {
  manifest: {
    id: 'sh3-file-explorer-app',
    label: 'File Explorer',
    requiredShards: ['sh3-file-explorer'],
    layoutVersion: 2,
    permissions: ['documents:browse', 'documents:read', 'documents:write'],
  },
  initialLayout: {
    type: 'slot',
    slotId: 'sh3-file-explorer.files',
    viewId: 'sh3-file-explorer-browser',
  },
};
