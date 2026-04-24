// Public contribution surface for the sh3-editor Help view.
// Contributors add tabs via `ctx.contributions.register(HELP_TABS_CONTRIBUTION_POINT_ID, {...})`.

/** Contribution point id for Help view tabs. */
export const HELP_TABS_CONTRIBUTION_POINT_ID = 'sh3-editor:help.tabs';

/** Snapshot of the context at the moment Help was opened. Frozen for the modal's lifetime. */
export interface HelpSnapshot {
  activeAppId: string | null;
  focusedViewId: string | null;
  mountedViewIds: readonly string[];
  selection: { type: string; ref: unknown } | null;
  capturedAt: number;
}

/** Context handed to a tab's mount function. */
export interface HelpTabContext {
  surface: 'view' | 'modal';
  snapshot: HelpSnapshot;
  /** Present only when surface === 'modal'. Call to dismiss the Help modal. */
  close?: () => void;
}

/** Handle returned from a tab's mount. `unmount` fires when Help closes. */
export interface HelpTabHandle {
  unmount(): void;
}

/** Contribution descriptor registered under `HELP_TABS_CONTRIBUTION_POINT_ID`. */
export interface HelpTabContribution {
  /** Unique id. Convention: `<shardId>:help-tab:<slug>`. First-registered wins on collision. */
  id: string;
  label: string;
  icon?: string;
  /** Lower = earlier tab. Built-in Hotkeys = 0. Default 100. Ties broken by registration order. */
  priority?: number;
  mount(container: HTMLElement, ctx: HelpTabContext): HelpTabHandle;
}
