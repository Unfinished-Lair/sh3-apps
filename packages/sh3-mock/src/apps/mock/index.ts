/*
 * Mock app — the phase-8 reference app. Proves the full boot → home →
 * launch → render → return → relaunch flow against one shard (`mock`)
 * and one view (`mock:panel`).
 *
 * Composition-only: no app-internal state, no activate hook. The initial
 * layout matches what phase-7 shipped as the default shell layout (three
 * panels, one sidebar and a 3-tab group), so the first post-migration
 * boot is visually identical to the last pre-migration boot once the
 * user launches mock app from home.
 */

import type { App } from 'sh3-core';

export const mockApp: App = {
  manifest: {
    id: 'mock-app',
    label: 'Mock App',
    version: '0.1.0',
    requiredShards: ['mock'],
    layoutVersion: 2,
  },
  initialLayout: {
    type: 'split',
    direction: 'horizontal',
    sizes: [200, 2, 1],
    pinned: ['px', 'fr', 'fr'],
    children: [
      { type: 'slot', slotId: 'main.sidebar', viewId: 'mock:panel' },
      {
        type: 'tabs',
        activeTab: 0,
        persistent: true,
        tabs: [
          { slotId: 'main.center.a', viewId: 'mock:panel', label: 'Panel A' },
          { slotId: 'main.center.b', viewId: 'mock:panel', label: 'Panel B' },
          { slotId: 'main.center.c', viewId: 'mock:panel', label: 'Panel C' },
        ],
      },
      { type: 'slot', slotId: 'main.inspector', viewId: 'mock:panel' },
    ],
  },
};