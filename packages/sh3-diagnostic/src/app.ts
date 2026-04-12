import type { SourceApp } from 'sh3-core';

/*
 * Diagnostic app 
 * Provides a launchable app from the home screen that opens the
 * diagnostic panel in a single-tab layout. Unlike the shard's
 * autostart dock behavior (which splices into other apps), this
 * gives the diagnostic view its own dedicated workspace.
 */

export const app: SourceApp = {
  manifest: {
    id: 'diagnostic-app',
    label: 'Diagnostic',
    requiredShards: ['diagnostic', 'sh3-zones'],
    layoutVersion: 1,
    admin: true,
    permissions: ['state:manage'],
  },
  initialLayout: {
    type: 'tabs',
    activeTab: 0,
    tabs: [
      { slotId: 'diagnostic.main', viewId: 'diagnostic:panel', label: 'Diagnostic' },
      { slotId: 'diagnostic.routes', viewId: 'diagnostic:routes', label: 'API Routes' },
      { slotId: 'diagnostic.zones', viewId: 'sh3-zones-manager', label: 'Zone Manager' }
    ],
  },
};
