import type { GraphAssetPort } from '../asset/types';

export type EdgeSemantics = 'oriented' | 'adjacency';

export interface NodeVisuals {
  label: string | ((config: Record<string, unknown>) => string);
  borderColor: string;
  textColor?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  icon?: string;
  /** Per-dataType stroke colors for edges originating at this node's outputs. */
  portColors?: Record<string, string>;
}

export interface NodeTemplate {
  /** Unique within the domain. */
  type: string;
  category: string;
  label: string;
  /** Canonical port shape; gets cloned per-node at template-instantiation time. */
  ports: GraphAssetPort[];
  defaultConfig: Record<string, unknown>;
  configSchema?: ConfigFieldDef[];
}

export interface ConfigFieldDef {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: { value: string; label: string }[];
  /** Dispatch hint for the inspector bridge — mapped to InspectorMeta.type. */
  rendererHint?: string;
}

export interface PortRef {
  nodeId: string;
  /** Short form (no node-id prefix). */
  portId: string;
  direction: 'input' | 'output';
  dataType?: string;
}

export interface GraphDomainHost {
  log: (level: 'debug' | 'info' | 'warn' | 'error', msg: string, ...args: unknown[]) => void;
}

export interface GraphDomain {
  // Identity
  readonly id: string;
  readonly label: string;

  // Static behavior
  readonly edgeSemantics: EdgeSemantics;
  readonly useNodePalette: boolean;
  readonly showMeta: boolean;
  readonly defaultNodeWidth: number;
  readonly defaultNodeHeight: number;

  // Templates
  getTemplates(): NodeTemplate[];
  getTemplatesByCategory(): Map<string, NodeTemplate[]>;
  /** Upserts by `type`. Late registrations override built-ins. */
  addTemplate(t: NodeTemplate): void;

  // Visuals
  /** Returns a value, never throws. Missing visual returns a default fallback. */
  getNodeVisuals(type: string): NodeVisuals;
  addVisuals(type: string, v: NodeVisuals): void;
  resolveLabel(type: string, config: Record<string, unknown>): string;

  // Connection rules — default: any output → any input on a different node.
  canConnect?(src: PortRef, tgt: PortRef): boolean;
}
