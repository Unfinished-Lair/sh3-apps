/*
 * Diagnostic shard — registers the panel/routes/logs views and installs
 * the global log capture at register() time. No self-injection or
 * per-app prompting in v3; SH3 surfaces diagnostic at the framework
 * level now.
 *
 * Note on internal imports: DiagnosticPanel.svelte reads from
 * `shards/activate.svelte.ts` directly for the registeredShards /
 * activeShards reactive maps. That's a deliberate shortcut —
 * introspection helpers belong on the public api.ts surface long-term.
 */

import { mount, unmount } from 'svelte';
import DiagnosticPanel from './manager/DiagnosticPanel.svelte';
import DiagnosticRoutes from './manager/DiagnosticRoutes.svelte';
import LogPanel from './manager/LogPanel.svelte';
import type { SourceShard, ViewFactory, ViewHandle, MountContext, ShardContext } from 'sh3-core';
import { installLogCapture } from './log/capture.svelte';

/**
 * Module-level context captured during register(). Leaf views import this
 * to route HTTP through ctx.fetch (Tauri-safe transport) and to write into
 * the shard's own document zone via docs.
 */
export let diagnosticContext: {
  fetch: ShardContext['fetch'];
  docs: ShardContext['documents'];
  tenantId: string;
} = undefined!;

export const diagnosticShard: SourceShard = {
  manifest: {
    id: 'diagnostic',
    label: 'Diagnostic',
    views: [
      { id: 'diagnostic:panel', label: 'Diagnostic', standalone: true },
      { id: 'diagnostic:routes', label: 'API Routes', standalone: true },
      { id: 'diagnostic:logs', label: 'Logs', standalone: true },
    ],
  },
  register(ctx) {
    // Patch console + window error/rejection listeners ASAP so anything that
    // logs during the rest of activation lands in the buffer.
    installLogCapture();

    diagnosticContext = {
      fetch: ctx.fetch.bind(ctx),
      docs: ctx.documents,
      tenantId: ctx.tenantId,
    };

    const factory: ViewFactory = {
      mount(container: HTMLElement, _context: MountContext): ViewHandle {
        const instance = mount(DiagnosticPanel, { target: container });
        return {
          unmount() {
            unmount(instance);
          },
        };
      },
    };
    ctx.registerView('diagnostic:panel', factory);

    const routesFactory: ViewFactory = {
      mount(container: HTMLElement, _context: MountContext): ViewHandle {
        const instance = mount(DiagnosticRoutes, { target: container });
        return {
          unmount() {
            unmount(instance);
          },
        };
      },
    };
    ctx.registerView('diagnostic:routes', routesFactory);

    const logsFactory: ViewFactory = {
      mount(container: HTMLElement, _context: MountContext): ViewHandle {
        const instance = mount(LogPanel, { target: container });
        return {
          unmount() {
            unmount(instance);
          },
        };
      },
    };
    ctx.registerView('diagnostic:logs', logsFactory);
  },
};
