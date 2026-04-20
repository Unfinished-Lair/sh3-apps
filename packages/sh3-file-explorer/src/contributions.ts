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
