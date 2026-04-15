/*
 * Diagnostic shard — self-driving framework introspection shard.
 *
 * Always loaded in phase 8 (no env split yet). Self-starts via its
 * `autostart` hook:
 *   - If the shell is on home at boot: silently attempt to splice a
 *     diagnostic panel into home's layout. Home is a single-slot layout
 *     in phase 8, so this gracefully no-ops when no tabs group is found.
 *   - If an app is active: read own workspace zone for a per-app
 *     `sessionBehavior` preference. If 'silent', do nothing. If 'dock',
 *     attempt dock. If unset, open a modal asking "Dock" vs "Silent".
 *     Persist the choice and act on it.
 *
 * Note on internal imports: DiagnosticPanel.svelte reads from
 * `shards/activate.svelte.ts` directly for the registeredShards /
 * activeShards reactive maps. That's a deliberate phase-8 shortcut —
 * introspection helpers belong on the public api.ts surface long-term,
 * but factoring them out is a phase-9 concern.
 *
 * Note on the modal path: in phase 8 all shards load at boot, so
 * autostart runs while the shell is on home. The per-app modal prompt
 * path is therefore effectively dead code in phase 8 (it would only be
 * reachable if diagnostic were activated mid-session after an app had
 * launched). Included for design completeness.
 */

import { mount, unmount } from 'svelte';
import DiagnosticPanel from './manager/DiagnosticPanel.svelte';
import DiagnosticRoutes from './manager/DiagnosticRoutes.svelte';
import DiagnosticPromptModal from './manager/DiagnosticPromptModal.svelte';
import type { SourceShard, ViewFactory, ViewHandle, MountContext, LayoutNode } from 'sh3-core';
import {
  shell,
  getActiveApp,
  spliceIntoActiveLayout,
  inspectActiveLayout,
} from 'sh3-core';

type Behavior = 'dock' | 'silent';

export const diagnosticShard: SourceShard = {
  manifest: {
    id: 'diagnostic',
    label: 'Diagnostic',
    views: [
      { id: 'diagnostic:panel', label: 'Diagnostic', standalone: true },
      { id: 'diagnostic:routes', label: 'API Routes', standalone: true },
    ],
  },
  activate(ctx) {
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
  },
  autostart(ctx) {
    const state = ctx.state({
      workspace: {
        sessionBehavior: {} as Record<string, Behavior>,
      },
    });

    const active = getActiveApp();

    // Home context: attempt a silent dock. Home's single-slot layout has
    // no tabs group in phase 8 so tryDock will no-op gracefully.
    if (!active) {
      tryDock();
      return;
    }

    const contextKey = active.id;
    const stored = state.workspace.sessionBehavior[contextKey];
    if (stored === 'silent') return;
    if (stored === 'dock') {
      tryDock();
      return;
    }

    // First-time prompt for this app.
    shell.modal.open(DiagnosticPromptModal, {
      appLabel: active.label,
      onChoose: (choice: Behavior) => {
        state.workspace.sessionBehavior[contextKey] = choice;
        if (choice === 'dock') tryDock();
      },
    });
  },
};

function tryDock(): void {
  const { root } = inspectActiveLayout();
  if (!containsTabs(root.docked)) return;
  try {
    spliceIntoActiveLayout({
      slotId: 'diagnostic.panel',
      viewId: 'diagnostic:panel',
      label: 'Diagnostic',
    });
  } catch (err) {
    // Splice can still refuse for reasons the containsTabs probe doesn't
    // cover (e.g. a layout shape the helper doesn't accept). Failing
    // silently is the right call for a self-starting introspection shard.
    console.warn('[diagnostic] splice failed:', err);
  }
}

function containsTabs(node: LayoutNode): boolean {
  if (node.type === 'tabs') return true;
  if (node.type === 'split') return node.children.some((c) => containsTabs(c));
  return false;
}
