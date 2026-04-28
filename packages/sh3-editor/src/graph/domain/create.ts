import type {
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
  resolveLabel?(type: string, config: Record<string, unknown>): string;
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

    ...(spec.canConnect ? { canConnect: spec.canConnect } : {}),
  };
  return dom;
}
