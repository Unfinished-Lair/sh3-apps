/** Current persisted schema version. v1 → v2 introduced blocks. */
export const CURRENT_ASSET_VERSION = 2;

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
  /** Schema version. v1 = 1, v2 introduces `blocks`. */
  version: number;
  nodes: GraphAssetNode[];
  edges: GraphAssetEdge[];
  blocks?: GraphAssetBlock[];
  metadata?: Record<string, unknown>;
}

export interface GraphAssetBlock {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  color: string;
  alpha: number;
  label: string;
  labelAnchor: 'top' | 'above' | 'centered';
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
  /** Persisted explicit width. When absent, bridge fills from
   *  visuals.defaultWidth (or domain.defaultNodeWidth). */
  width?: number;
  /** Persisted explicit height. When absent, the node uses
   *  visuals.defaultHeight as min-height and grows intrinsically. */
  height?: number;
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
  /**
   * Conversion id recorded when the domain's `resolveConnect` returned
   * `{ via }`. Absent = direct connection, no adapter applied at runtime.
   */
  adapter?: string;
}
