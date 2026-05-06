/*
 * Inspector Fiddle app — three-slot layout that mounts two sh3-editor:editor
 * instances (top-left value JSON, bottom-left meta JSON) and one
 * sh3-editor:inspector instance (right). All three slots are bound by the
 * inspector-fiddle shard's contributions.
 */

import type { SourceApp } from 'sh3-core';

export const inspectorFiddleApp: SourceApp = {
  manifest: {
    id: 'inspector-fiddle-app',
    label: 'Inspector Fiddle',
    requiredShards: ['inspector-fiddle', 'sh3-editor'],
    layoutVersion: 1,
    icon: 'wand-sparkles',
  },
  initialLayout: {
    type: 'split',
    direction: 'horizontal',
    sizes: [1, 1],
    pinned: ['fr', 'fr'],
    children: [
      {
        type: 'split',
        direction: 'vertical',
        sizes: [1, 1],
        pinned: ['fr', 'fr'],
        children: [
          { type: 'slot', slotId: 'fiddle.value', viewId: 'sh3-editor:editor' },
          { type: 'slot', slotId: 'fiddle.meta',  viewId: 'sh3-editor:editor' },
        ],
      },
      { type: 'slot', slotId: 'fiddle.inspector', viewId: 'sh3-editor:inspector' },
    ],
  },
};
