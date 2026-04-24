import type { HelpSnapshot } from '../../help/contributions';

export interface SnapshotInputs {
  getActiveApp(): string | null;
  listMountedViewIds(): readonly string[];
  readFocusedViewId(): string | null;
  getSelection(): { type: string; ref: unknown } | null;
  now(): number;
}

export function captureHelpSnapshot(inputs: SnapshotInputs): HelpSnapshot {
  return {
    activeAppId: inputs.getActiveApp(),
    focusedViewId: inputs.readFocusedViewId(),
    mountedViewIds: [...inputs.listMountedViewIds()],
    selection: inputs.getSelection(),
    capturedAt: inputs.now(),
  };
}

/**
 * Build the runtime input set used by Help.svelte. Separated so the pure
 * capture fn above can be tested without shell or DOM.
 *
 * Mounted views and focused view are read from the DOM via the
 * `data-sh3-view` contract that sh3-core 0.11.0+ stamps on every pooled
 * slot host. This avoids needing listing APIs that only exist on the
 * verb context's `ShellApi`.
 */
export function buildRuntimeInputs(opts: {
  getActiveAppId(): string | null;
  getSelection(): { type: string; ref: unknown } | null;
  doc?: Document;
}): SnapshotInputs {
  const doc = opts.doc ?? (typeof document !== 'undefined' ? document : undefined);

  return {
    getActiveApp: () => opts.getActiveAppId(),
    listMountedViewIds: () => {
      if (!doc) return [];
      const hosts = doc.querySelectorAll('[data-sh3-view]');
      const ids = new Set<string>();
      hosts.forEach((el) => {
        const id = el.getAttribute('data-sh3-view');
        if (id) ids.add(id);
      });
      return [...ids];
    },
    readFocusedViewId: () => {
      if (!doc || !doc.activeElement) return null;
      const host = (doc.activeElement as Element).closest('[data-sh3-view]');
      return host?.getAttribute('data-sh3-view') ?? null;
    },
    getSelection: () => opts.getSelection(),
    now: () => Date.now(),
  };
}
