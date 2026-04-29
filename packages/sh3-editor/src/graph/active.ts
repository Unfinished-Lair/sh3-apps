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
}

let active: ActiveGraphRef | null = null;

export function setActiveGraph(ref: ActiveGraphRef): void {
  active = ref;
}

export function getActiveGraph(): ActiveGraphRef | null {
  return active;
}

export function clearActiveGraphIf(ref: ActiveGraphRef): void {
  if (active === ref) active = null;
}
