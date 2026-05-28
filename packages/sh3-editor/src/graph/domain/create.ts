import type {
  ConnectResolution, ConversionDef, DataTypeDef,
  EdgeSemantics, GraphDomain, NodeTemplate, NodeVisuals, PortRef,
} from './types';

export interface GraphDomainSpec {
  id: string;
  label: string;
  edgeSemantics?: EdgeSemantics;
  useNodePalette?: boolean;
  showMeta?: boolean;
  defaultNodeWidth?: number;
  defaultNodeHeight?: number;
  templates?: NodeTemplate[];
  visuals?: Record<string, NodeVisuals>;
  canConnect?(src: PortRef, tgt: PortRef): boolean;
  resolveConnect?(src: PortRef, tgt: PortRef): ConnectResolution;
  dataTypes?: Record<string, DataTypeDef>;
  conversions?: ReadonlyArray<ConversionDef>;
  resolveLabel?(type: string, config: Record<string, unknown>): string;
  /** Default quick-access template types (in order). Used when the user has
   *  not customized the quick-access toolbar for this domain. Unknown types
   *  are filtered at toolbar-render time. */
  defaultQuickAccess?: string[];
  /** Default true. Set false to suppress blocks entirely in this domain. */
  allowBlocks?: boolean;
}

const DEFAULT_VISUALS: NodeVisuals = {
  label: '',
  borderColor: '#888888',
};

export function createGraphDomain(spec: GraphDomainSpec): GraphDomain {
  const templates = new Map<string, NodeTemplate>();
  for (const t of spec.templates ?? []) templates.set(t.type, t);

  const visuals = new Map<string, NodeVisuals>();
  for (const [k, v] of Object.entries(spec.visuals ?? {})) visuals.set(k, v);

  const defaultQuickAccess = [...(spec.defaultQuickAccess ?? [])];
  const allowBlocks = spec.allowBlocks ?? true;

  const dom: GraphDomain = {
    id: spec.id,
    label: spec.label,
    edgeSemantics: spec.edgeSemantics ?? 'oriented',
    useNodePalette: spec.useNodePalette ?? true,
    showMeta: spec.showMeta ?? true,
    defaultNodeWidth: spec.defaultNodeWidth ?? 180,
    defaultNodeHeight: spec.defaultNodeHeight ?? 80,

    getTemplates: () => Array.from(templates.values()),
    getTemplatesByCategory: () => {
      const m = new Map<string, NodeTemplate[]>();
      for (const t of templates.values()) {
        const arr = m.get(t.category);
        if (arr) arr.push(t);
        else m.set(t.category, [t]);
      }
      return m;
    },
    addTemplate: (t) => { templates.set(t.type, t); },

    getNodeVisuals: (type) => visuals.get(type) ?? { ...DEFAULT_VISUALS, label: type },
    addVisuals: (type, v) => { visuals.set(type, v); },

    resolveLabel: spec.resolveLabel ?? ((type) => type),

    getDefaultQuickAccess: () => [...defaultQuickAccess],
    hasTemplate: (type: string) => templates.has(type),
    allowBlocks,

    ...(spec.canConnect ? { canConnect: spec.canConnect } : {}),
    ...(spec.resolveConnect ? { resolveConnect: spec.resolveConnect } : {}),
    ...(spec.dataTypes ? { dataTypes: spec.dataTypes } : {}),
    ...(spec.conversions ? { conversions: spec.conversions } : {}),
  };
  return dom;
}
