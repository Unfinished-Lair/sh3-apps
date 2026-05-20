import type { GraphState } from './state/types';
import type { GraphDomain } from './domain/types';
import type { HistoryController } from '../types';

export interface ActiveGraphRef {
  readonly state: GraphState;
  readonly domain: GraphDomain;
  readonly history: HistoryController;
  onAssetChanged(): void;
  onSelectionChange(ids: string[]): void;
  zoomIn(focal?: { x: number; y: number }): void;
  zoomOut(focal?: { x: number; y: number }): void;
  zoomReset(): void;
  fitContent(): void;
  dismissPalette(): void;
  /** Insert a node from a registered template at the given graph-coord point,
   *  or at a default position (recent empty-click within the last 5s, else
   *  the viewport's graph-coord center) if `at` is omitted. */
  insertNodeFromTemplate(templateType: string, at?: { x: number; y: number }): void;
  /** Returns the user's most recent empty-canvas click in graph coords if it
   *  was within the recency window, else null. Used by the picker for
   *  click-to-insert default placement. */
  getRecentDrop(): { x: number; y: number } | null;
}

let active: ActiveGraphRef | null = null;
const subscribers = new Set<(ref: ActiveGraphRef | null) => void>();

export function setActiveGraph(ref: ActiveGraphRef): void {
  active = ref;
  for (const cb of subscribers) cb(ref);
}

export function getActiveGraph(): ActiveGraphRef | null {
  return active;
}

export function clearActiveGraphIf(ref: ActiveGraphRef): void {
  if (active === ref) {
    active = null;
    for (const cb of subscribers) cb(null);
  }
}

export function onActiveGraphChange(
  cb: (ref: ActiveGraphRef | null) => void,
): () => void {
  subscribers.add(cb);
  return () => { subscribers.delete(cb); };
}
