import type { GraphAssetPort } from '../asset/types';
import type { InspectorMeta } from '../../types';

export type EdgeSemantics = 'oriented' | 'adjacency';

export interface ResizeOptions {
  /** Default 'both'. */
  axes?: 'both' | 'width' | 'height';
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface BodyFieldDef {
  /** Config path the widget binds to. Omit for whole-panel renderers
   *  that don't bind to a specific config field. */
  key?: string | (string | number)[];
  /** Same shape inspector widgets receive — type + per-widget options. */
  meta: InspectorMeta;
  /** Visibility predicate. Pure function of config; re-evaluated on every
   *  state revision++. Omit to always show. */
  show?: (config: Record<string, unknown>) => boolean;
}

export interface NodeVisuals {
  label: string | ((config: Record<string, unknown>) => string);
  borderColor: string;
  textColor?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  icon?: string;
  /** Per-dataType stroke colors for edges originating at this node's outputs. */
  portColors?: Record<string, string>;
  /** Declarative inline body. Each entry dispatches through
   *  INSPECTOR_RENDERER_POINT in a bare context (no labels, no group). */
  bodySchema?: BodyFieldDef[];
  /** Enables resize handles. Presence is opt-in; constraints clamp drags. */
  resize?: ResizeOptions;
}

export interface NodeTemplate {
  /** Unique within the domain. */
  type: string;
  category: string;
  label: string;
  /** Canonical/static port shape. Used when computePorts is absent and as
   *  the palette/preview shape (templates have no config in the palette). */
  ports: GraphAssetPort[];
  /** Optional: when present, replaces `ports` once the node has config.
   *  Must be pure and synchronous — called at instantiation and on every
   *  config commit. Throwing falls back to `ports` (a warning is logged). */
  computePorts?: (config: Record<string, unknown>) => GraphAssetPort[];
  defaultConfig: Record<string, unknown>;
  configSchema?: ConfigFieldDef[];
}

export interface ConfigFieldDef {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'string-list' | 'doc-folder';
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

/**
 * Domain-level declaration for a port data type. The renderer reads
 * `color` for port discs (with fallback to per-template `portColors`,
 * then `borderColor`).
 */
export interface DataTypeDef {
  label: string;
  color: string;
  description?: string;
}

/**
 * Declared conversion adapter between two data types. The conversion id is
 * persisted on the edge (`GraphAssetEdge.adapter`) when `resolveConnect`
 * resolves a cross-type connection via this entry. The consumer runtime
 * applies `adapt(value)` when reading the upstream output.
 */
export interface ConversionDef {
  id: string;
  from: string;
  to: string;
  adapt: (value: unknown) => unknown;
}

/**
 * Resolution result for a candidate connection.
 * - `false`: connection rejected
 * - `true`: direct connection (no adapter)
 * - `{ via }`: routed through the named conversion id
 */
export type ConnectResolution = false | true | { via: string };

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
  /** Boolean form. When `resolveConnect` is also present, it wins. */
  canConnect?(src: PortRef, tgt: PortRef): boolean;

  /** Rich form: supports adapter-routed connections. Overrides canConnect when present. */
  resolveConnect?(src: PortRef, tgt: PortRef): ConnectResolution;

  /** Domain-level data type registry. Renderer reads `[t].color` for port discs. */
  dataTypes?: Record<string, DataTypeDef>;

  /** Adapter table. Indexed by id at runtime by the consumer. */
  conversions?: ReadonlyArray<ConversionDef>;

  /** Returns the snapshot of defaultQuickAccess (or []). Optional so domains
   *  built against sh3-editor < 0.19 still satisfy the contract — consumers
   *  must treat a missing method as no defaults. */
  getDefaultQuickAccess?(): string[];

  /** True iff a template with this type is registered. Optional for
   *  backward compatibility. */
  hasTemplate?(type: string): boolean;

  /** Read-only opt-out flag; defaults to true when omitted. */
  readonly allowBlocks?: boolean;
}
