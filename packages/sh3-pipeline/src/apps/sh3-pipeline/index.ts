import { PERMISSION_DOCUMENTS_WRITE, type SourceApp } from 'sh3-core';

export const app: SourceApp = {
  manifest: {
    id: 'sh3-pipeline',
    icon: 'git-merge',
    label: 'Pipeline',
    requiredShards: ['sh3-pipeline', 'sh3-editor'],
    permissions: [PERMISSION_DOCUMENTS_WRITE],
    layoutVersion: 6,
    menus: [
      { id: 'file',     label: 'File' },
      { id: 'pipeline', label: 'Pipeline' },
    ],
  },
  initialLayout: [
    {
      name: 'main',
      variants: {
        default: {
          docked: {
            type: 'split',
            direction: 'vertical',
            sizes: [40, 1, 140],
            fixed: [true, false, false],
            pinned: ['px', 'fr', 'px'],
            children: [
              { type: 'slot', slotId: 'toolbar', viewId: 'sh3-pipeline:toolbar' },
              {
                type: 'split',
                direction: 'horizontal',
                sizes: [1, 300],
                pinned: ['fr', 'px'],
                children: [
                  { type: 'slot', slotId: 'graph',     viewId: 'sh3-editor:graph' },
                  { type: 'slot', slotId: 'inspector', viewId: 'sh3-editor:inspector' },
                ],
              },
              {
                type: 'tabs',
                tabs: [{ label: 'Logs', slotId: 'log', viewId: 'diagnostic:logs' }],
                activeTab: 0,
              },
            ],
          },
          floats: [],
        },
        compact: {
          docked: {
            type: 'split',
            direction: 'horizontal',
            sizes: [200, 1, 280],
            pinned: ['px', 'fr', 'px'],
            children: [
              { type: 'slot', slotId: 'toolbar',   viewId: 'sh3-pipeline:toolbar',   role: 'sidebar' },
              {
                type: 'tabs',
                role: 'body',
                tabs: [
                  { label: 'Graph', slotId: 'graph', viewId: 'sh3-editor:graph' },
                  { label: 'Logs',  slotId: 'log',   viewId: 'diagnostic:logs' },
                ],
                activeTab: 0,
              },
              { type: 'slot', slotId: 'inspector', viewId: 'sh3-editor:inspector', role: 'inspector' },
            ],
          },
          floats: [],
        },
      },
    },
  ],
};
