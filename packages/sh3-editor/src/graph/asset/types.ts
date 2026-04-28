/**
 * Persisted, serializable definition of a graph. Source of truth on disk.
 * Consumers hand a GraphAsset to sh3-editor via GraphViewDescriptor.initial.
 */
export interface GraphAsset {
  id: string;
  name: string;
  /** Domain identifier; required. Loading an asset whose domain is missing
   *  from the registry fails loudly — no silent fallback. */
  domain: string;
  /** Schema version. v1 = 1. */
  version: number;
  nodes: GraphAssetNode[];
  edges: GraphAssetEdge[];
  metadata?: Record<string, unknown>;
}

export interface GraphAssetNode {
  id: string;
  /** Template key, e.g. "math:add". */
  type: string;
  /** Materialized at write-time, NOT derived from template at load time —
   *  assets survive template evolution. */
  ports: GraphAssetPort[];
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface GraphAssetPort {
  /** Unique within the asset; convention: `${nodeId}_${shortName}`. */
  id: string;
  label: string;
  direction: 'input' | 'output';
  /** Type tag for visuals + connection rules. */
  dataType?: string;
}

export interface GraphAssetEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}
