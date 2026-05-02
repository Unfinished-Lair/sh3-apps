import type { Component } from 'svelte';
import type {
  InspectorRendererProps,
  InspectorMeta,
  InspectorApi,
  WalkerCommitOverride,
  HistoryController,
  ToolbarAction,
} from '../types';

export {
  type InspectorMeta,
  type InspectorApi,
  type InspectorRendererProps,
  type WalkerCommitOverride,
  type HistoryController,
} from '../types';

/** Contribution point id for inspector renderers. Contributors register via
 *  `ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, { ... })`. */
export const INSPECTOR_RENDERER_POINT = 'sh3-editor.inspectorRenderer';

/** Shape of a contribution registered under INSPECTOR_RENDERER_POINT.
 *  Dispatch is exact-match on `type`; ties break by priority (higher wins)
 *  then by registration order (first wins). */
export interface InspectorRenderer {
  /** Stable, shard-prefixed id (e.g. 'sh3-chat:chat-message'). Uniqueness is the provider's concern. */
  id: string;
  /** The type tag this renderer claims. Matched against meta.type > value.__type. */
  type: string;
  /** Svelte 5 component accepting InspectorRendererProps. */
  component: Component<InspectorRendererProps>;
  /** Higher wins on ties. Convention: contributions >= 10. Default 10. */
  priority?: number;
}

/** Contribution point id for inspector instance binding (since 0.12.0).
 *  Contributors register via
 *  `ctx.contributions.register<InspectorInstanceContribution>(INSPECTOR_INSTANCE_POINT, { ... })`
 *  to seed an inspector slot, swap its value live, and observe edits. */
export const INSPECTOR_INSTANCE_POINT = 'sh3-editor.inspectorInstance';

/** Initial state seeded into an inspector slot when it mounts. */
export interface InspectorInstanceSeed {
  /** The inspected object. Most use cases wrap this in `$state(...)` so that
   *  walker mutations re-render the view. Non-reactive values still render,
   *  but the contributor must observe edits via `onValueChange` to react. */
  value: unknown;
  /** Per-field hint tree. See inspector.md §4. */
  meta?: InspectorMeta;
  /** Forces all fields read-only regardless of per-field meta. Default false. */
  readonly?: boolean;
  /** Toolbar rendered above the body. Default []. */
  toolbarActions?: ToolbarAction[];
}

/** Handle passed to `InspectorInstanceContribution.bind`. Scoped to the
 *  current mount; the contributor drops its reference in the bind disposer. */
export interface InspectorBindHandle {
  /** Swap fields on the live entry. value-swap clears the slot's history
   *  (commands captured against the previous object hold dead references).
   *  Field-only swaps (meta / readonly / toolbarActions) are silent. */
  replace(next: Partial<InspectorInstanceSeed>): void;
  /** Per-slot history controller. Same instance EditorApi.history(slotId)
   *  returns. Contributors call `.undo()` / `.redo()` / `.onChange(...)` /
   *  `.peek()` from outside the slot. */
  history: HistoryController;
}

/** A descriptor registered under INSPECTOR_INSTANCE_POINT. */
export interface InspectorInstanceContribution {
  /** Slot id this binding owns. Inspector matches at mount time. */
  slotId: string;
  /** Initial state. Read once when the inspector view mounts at `slotId`.
   *  Later changes flow through `bind` / `replace`. */
  seed: InspectorInstanceSeed;
  /** Push channel for swaps + outside-the-slot history. Inspector calls
   *  `bind` exactly once at mount with a handle scoped to that mount.
   *  Returned disposer (if any) fires on slot unmount; the contributor
   *  should drop its handle reference there. */
  bind?(handle: InspectorBindHandle): (() => void) | void;
  /** Routes walker field commits through a consumer-owned sink instead of
   *  the default in-place mutation + push to inspector history. Top-level
   *  on the descriptor (set at register time, NOT swappable via `replace`). */
  onCommit?: WalkerCommitOverride;
  /** Per-slot edit-flow-back. Fires on every value mutation observed by the
   *  inspector: walker commits, custom-renderer push, undo/redo movements. */
  onValueChange?(value: unknown): void;
}
