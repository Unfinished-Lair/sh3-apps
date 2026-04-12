/**
 * Registry Manager app — composes the sh3-registry shard's
 * manage view into a single-slot admin interface.
 *
 * Standalone package: installed from a registry or pre-included.
 */

import type { SourceApp } from 'sh3-core';

export const registryApp: SourceApp = {
  manifest: {
    id: 'sh3-registry',
    label: 'Registry Manager',
    requiredShards: ['sh3-registry'],
    layoutVersion: 1,
    admin: true,
  },
  initialLayout: {
    type: 'tabs',
    activeTab: 0,
    tabs: [
      { slotId: 'registry.manage', viewId: 'sh3-registry:manage', label: 'Registry' },
    ],
  },
};
