/*
 * Mock shard — the pre-real-work shard used to validate the phase 4 stack.
 *
 * What it contributes:
 *   - One view, `mock:panel`, mounted by the layout in any slot whose
 *     leaf references that viewId.
 *
 * What it owns:
 *   - A workspace state zone carrying `countersBySlot: Record<string, number>`,
 *     hydrated from localStorage on activation.
 *
 * The view factory mounts a Svelte MockPanel component into the container
 * the shell hands it and returns a handle whose `unmount` tears the
 * component down and whose `onResize` pushes live dimensions into the
 * component's `width`/`height` props. The workspace zone proxy is passed
 * as a prop so the component reads/writes it directly, which is reactive
 * because the proxy is a Svelte 5 $state.
 *
 * `.svelte.ts` extension so we can use $state as a local reactive box for
 * width/height without wrapping them in objects.
 */

import { mount, unmount } from 'svelte';
import MockPanel from './MockPanel.svelte';
import type { Shard, ViewFactory, ViewHandle, MountContext } from 'sh3-core';

export const mockShard: Shard = {
  manifest: {
    id: 'mock',
    label: 'Mock',
    version: '0.1.0',
    views: [{ id: 'mock:panel', label: 'Mock Panel' }],
  },
  activate(ctx) {
    const state = ctx.state({
      workspace: {
        countersBySlot: {} as Record<string, number>,
      },
    });

    const factory: ViewFactory = {
      mount(container: HTMLElement, context: MountContext): ViewHandle {
        const slotId = context.slotId;

        // Reactive dimension box. The slot drives these via onResize and
        // the component reads them reactively because it's a $state proxy.
        const dims = $state({ width: 0, height: 0 });

        const instance = mount(MockPanel, {
          target: container,
          props: {
            slotId,
            context,
            workspace: state.workspace,
            dims,
          },
        });

        // Add a dirty-toggle button directly to the container.
        const dirtyBtn = document.createElement('button');
        dirtyBtn.textContent = 'Toggle dirty';
        dirtyBtn.style.cssText = 'margin-top: 8px; padding: 4px 8px; cursor: pointer;';
        let isDirty = false;
        dirtyBtn.onclick = () => {
          isDirty = !isDirty;
          context.setDirty(isDirty);
          dirtyBtn.textContent = isDirty ? 'Mark clean' : 'Toggle dirty';
        };
        container.appendChild(dirtyBtn);

        return {
          unmount() {
            unmount(instance);
          },
          onResize(w, h) {
            dims.width = w;
            dims.height = h;
          },
          closable: true,
        };
      },
    };

    ctx.registerView('mock:panel', factory);
  },
};
