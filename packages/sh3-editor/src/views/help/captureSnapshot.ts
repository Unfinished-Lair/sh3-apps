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
 * `shell` is the minimal bit we need from the sh3 runtime; exact return
 * shapes of the listing APIs are normalized here.
 */
export function buildRuntimeInputs(opts: {
  shell: {
    getActiveApp(): { id: string } | string | null;
    listViewsInCurrentLayout(): Array<{ id: string } | string>;
    listFloats(): Array<{ viewId: string } | { id: string }>;
  };
  getSelection(): { type: string; ref: unknown } | null;
  doc?: Document;
}): SnapshotInputs {
  const doc = opts.doc ?? (typeof document !== 'undefined' ? document : undefined);

  function extractAppId(v: { id: string } | string | null): string | null {
    if (v === null) return null;
    if (typeof v === 'string') return v;
    return v.id;
  }

  function extractViewId(v: { id: string } | { viewId: string } | string): string | null {
    if (typeof v === 'string') return v;
    if ('viewId' in v) return v.viewId;
    if ('id' in v) return v.id;
    return null;
  }

  return {
    getActiveApp: () => extractAppId(opts.shell.getActiveApp()),
    listMountedViewIds: () => {
      const layoutViews = opts.shell.listViewsInCurrentLayout()
        .map(extractViewId)
        .filter((v): v is string => v !== null);
      const floatViews = opts.shell.listFloats()
        .map(extractViewId)
        .filter((v): v is string => v !== null);
      return [...new Set([...layoutViews, ...floatViews])];
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
