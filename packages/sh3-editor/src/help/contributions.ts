// Public contribution surface for the sh3-editor Help hub.
// Contributors register a tab as { id, label, viewId } — the viewId is mounted
// inside the F1 hub's TabsNode.

/** Contribution point id for Help hub tabs. */
export const HELP_TABS_CONTRIBUTION_POINT_ID = 'sh3-editor:help.tabs';

/** Snapshot of the context at the moment the Help hub was opened. */
export interface HelpSnapshot {
  activeAppId: string | null;
  focusedViewId: string | null;
  mountedViewIds: readonly string[];
  selection: { type: string; ref: unknown } | null;
  capturedAt: number;
}

/** Optional visibility predicate input. */
export interface HelpTabVisibilityContext {
  activeAppId: string | null;
}

/** Contribution descriptor registered under `HELP_TABS_CONTRIBUTION_POINT_ID`. */
export interface HelpTabContribution {
  /** Unique id. Convention: `<shardId>:help-tab:<slug>`. First-registered wins on collision. */
  id: string;
  label: string;
  icon?: string;
  /** Lower = earlier tab. Built-in Hotkeys = 0. Default 100. */
  priority?: number;
  /** REQUIRED as of sh3-editor 0.19. View id mounted in this tab. */
  viewId: string;
  /** Optional visibility predicate. Re-evaluated on contributions.onChange. */
  visible?(ctx: HelpTabVisibilityContext): boolean;
}
