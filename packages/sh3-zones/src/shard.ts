import type { Shard, ShardContext } from 'sh3-core';

export const shard: Shard = {
  manifest: {
    id: 'sh3-zones',
    label: 'Zones',
    version: '0.1.0',
    views: [{ id: 'sh3-zones-manager', label: 'Zone Manager' }],
  },

  activate(ctx: ShardContext) {
    ctx.registerView('sh3-zones-manager', {
      mount(container) {
        container.textContent = 'sh3-zones loading…';
        return { unmount() { container.textContent = ''; } };
      },
    });
  },
};
