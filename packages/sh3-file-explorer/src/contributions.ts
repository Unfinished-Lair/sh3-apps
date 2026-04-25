import type { Selection } from './explorerShard.svelte';

type NonNullSelection = NonNullable<Selection>;

/**
 * Contribution point id for per-selection action buttons rendered in the
 * SelectionPanel. Contributors register via
 * `ctx.contributions.register<SelectionAction>(SELECTION_ACTION_POINT, { ... })`.
 */
export const SELECTION_ACTION_POINT = 'sh3-file-explorer.selectionAction';

/**
 * Shape of a contribution registered under `SELECTION_ACTION_POINT`.
 * Descriptors are freeform from sh3-core's perspective — file-explorer
 * reads this type back out of `ctx.contributions.list<SelectionAction>(...)`.
 */
export interface SelectionAction {
  /** Stable, shard-prefixed id. Uniqueness is the provider's concern. */
  id: string;
  /** Rendered on the action button. */
  label: string;
  /** Optional selection filter. Default: always show. */
  appliesTo?(sel: NonNullSelection): boolean;
  /** Invoked on click; runs in the contributing shard's realm. */
  onInvoke(sel: NonNullSelection): void | Promise<void>;
  /** Visual weight. Default 'secondary'. */
  kind?: 'primary' | 'secondary';
}

/**
 * Contribution point id for per-document badges rendered next to filenames
 * in the tree and in the SelectionPanel. Providers register a single
 * descriptor; the explorer iterates all registered providers per visible row.
 */
export const DOCUMENT_BADGE_POINT = 'sh3-file-explorer.documentBadge';

export interface Badge {
  /** Glyph / unicode rendered inline in the tree row. */
  icon: string;
  tone?: 'ok' | 'warn' | 'muted';
  /** Short text shown in the tree row's title attribute on hover. */
  tooltip?: string;
  /** Header line shown in the SelectionPanel's badge section. */
  label?: string;
  /** Secondary line shown beneath label in the SelectionPanel. */
  detail?: string;
}

export interface BadgeDoc {
  shardId: string;
  path: string;
  kind: 'file' | 'folder';
  /** File rows only — populated by the explorer from BrowseEntry.lastModified. */
  lastModified?: number;
  /** Folder rows only — recursive count of file descendants computed during tree build. */
  descendantCount?: number;
}

export interface DocumentBadgeProvider {
  /** Stable, shard-prefixed id for diagnostics. */
  id: string;
  /** Sync resolution. Return null when there's nothing to say about this doc. */
  getBadge(doc: BadgeDoc): Badge | null;
  /** Subscribe to provider-side state changes. Return a disposer. */
  onChange?(cb: () => void): () => void;
}
