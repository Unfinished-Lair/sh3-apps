import type { GraphAssetPort } from '../asset/types';

export type GraphId = string;
export type NodeId = string;
export type EdgeId = string;
/** Short port id (no node-id prefix). */
export type PortShortId = string;

/** Editable in-memory mirror of a GraphAsset. Mutated via history commands. */
export interface GraphState {
  id: GraphId;
  domainId: string;
  name: string;
  version: number;
  nodes: Map<NodeId, NodeState>;
  edges: Map<EdgeId, EdgeState>;
  metadata: Record<string, unknown>;
  // editor-only
  readonly: boolean;
  selection: Set<NodeId | EdgeId>;
  /**
   * Monotonic counter bumped by every mutation (commands.ts + in-place
   * mutations like node drag). The graph data layer uses plain Map/Set
   * (no svelte/reactivity) to stay framework-agnostic; this single
   * tracked field is the only subscription point. Consumers read
   * `state.revision` inside their reactive scope ($derived for Svelte;
   * useSyncExternalStore for React; etc.) to re-evaluate on any change.
   * Tracked via the host component's $state proxy at the GraphHost level.
   */
  revision: number;
}

export interface PortDefinition extends GraphAssetPort {
  /** Short form (no node-id prefix). Used for handler dispatch and edge target keys. */
  shortId: PortShortId;
}

export interface FieldDescriptor {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json' | 'doc' | 'doc-folder' | 'string-list';
  options?: { value: string; label: string }[];
  /** Renderer dispatch hint, mapped to InspectorMeta.type by the inspector bridge. */
  rendererHint?: string;
  /** True when the corresponding input port has an incoming edge. */
  disabled?: boolean;
}

export interface NodeState {
  id: NodeId;
  type: string;
  /** Resolved from domain.resolveLabel(type, config). Cache; recomputed on config change. */
  label: string;
  ports: PortDefinition[];
  config: Record<string, unknown>;
  /** Cached inspector schema, built by buildConfigFields. Recomputed on config / edge changes. */
  configFields: FieldDescriptor[];
  position: { x: number; y: number };
  // editor-only
  width: number;
  height: number;
  /** Visuals defaults captured at bridge/command build time so
   *  graphStateToAsset can decide whether to omit width/height on
   *  serialization. Not for runtime layout — runtime reads width/height. */
  defaultsForSerialization: { width: number; height: number };
}

export interface EdgeState {
  id: EdgeId;
  sourceNodeId: NodeId;
  sourcePortId: PortShortId;
  targetNodeId: NodeId;
  targetPortId: PortShortId;
  /**
   * Conversion id recorded when the domain's `resolveConnect` returned
   * `{ via }`. Mirrors GraphAssetEdge.adapter through the in-memory state.
   */
  adapter?: string;
}
