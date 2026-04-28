import type { GraphAsset } from './asset/types';
import type { GraphDomainHost, GraphDomain } from './domain/types';
import type { NodeId, EdgeId } from './state/types';
import type { HistoryController, InspectorMeta, WalkerCommitOverride } from '../types';

// ---------- Constants (cross-shard string literal contract) ----------

/** Contribution point id for graph domains. External consumers MUST inline
 *  this string literal — never import it as a runtime value across shards. */
export const GRAPH_DOMAIN_POINT = 'sh3-editor.graph-domain';

/** Contribution point id for graph view bindings. Same string-literal rule. */
export const GRAPH_VIEW_POINT = 'sh3-editor.graph-view';

// ---------- Domain contribution ----------

export interface GraphDomainContribution {
  /** Stable, shard-prefixed id, e.g. 'my-shader-app:shader-graph'. */
  id: string;
  /** Lazy factory; called when the editor first mounts a graph that
   *  references this domain. Runs at most once per editor activation. */
  factory: (host: GraphDomainHost) => GraphDomain;
}

// ---------- View descriptor + controller ----------

export interface GraphViewDescriptor {
  /** Must match the slotId of the SlotNode / TabEntry that mounts the graph. */
  slotId: string;

  /** Domain id; must be registered at GRAPH_DOMAIN_POINT before the graph
   *  view is mounted at this slot. The view fails loudly otherwise. */
  domainId: string;

  /** Initial asset. Pass an empty asset for a fresh graph. Consumed once at
   *  mount; later updates go through GraphController.setAsset. */
  initial: GraphAsset;

  /** Fires after every committed mutation. NOT fired by setAsset (no echo). */
  onChange: (asset: GraphAsset) => void;

  /** Called exactly once after the graph mounts and is ready to accept setAsset. */
  bind?: (ctrl: GraphController) => void;

  /** Read-only mode. */
  readonly?: boolean;

  /** Inspector commit override — called BEFORE the graph history command
   *  runs. Returning true skips the graph history push. */
  onCommit?: (
    nodeId: string,
    path: (string | number)[],
    next: unknown,
  ) => boolean | void;
}

export interface GraphInspectorBinding {
  value: Record<string, unknown>;
  meta: InspectorMeta;
  onCommit: WalkerCommitOverride;
}

export interface GraphController {
  setAsset(asset: GraphAsset): void;
  getAsset(): GraphAsset;
  select(ids: (NodeId | EdgeId)[]): void;
  clearSelection(): void;
  focus(target: { nodeId: NodeId } | { rect: { x: number; y: number; w: number; h: number } }): void;
  fitToContent(): void;
  readonly history: HistoryController;
  onSelectionChange(cb: (selected: (NodeId | EdgeId)[]) => void): () => void;
  /** Returns null when selection is empty, multi-node, or an edge. */
  getSelectedInspectorBinding(): GraphInspectorBinding | null;
}
