import type { Shard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import ZoneManager from './manager/ZoneManager.svelte';

export const shard: Shard = {
  manifest: {
    id: 'sh3-zones',
    label: 'Zones',
    version: '0.1.0',
    views: [{ id: 'sh3-zones-manager', label: 'Zone Manager' }],
    permissions: ['state:manage'],
  },

  activate(ctx: ShardContext) {
    ctx.registerView('sh3-zones-manager', {
      mount(container) {
        if (!ctx.zones) {
          container.textContent = 'Zone management requires the state:manage permission.';
          return { unmount() { container.textContent = ''; } };
        }

        const component = mount(ZoneManager, {
          target: container,
          props: { zones: ctx.zones },
        });
        return {
          unmount() {
            unmount(component);
          },
        };
      },
    });
  },
};
