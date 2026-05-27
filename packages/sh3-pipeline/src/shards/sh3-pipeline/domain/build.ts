import type {
  ConnectResolution,
  ConversionDef,
  DataTypeDef,
  GraphDomain,
  GraphDomainHost,
  NodeTemplate,
  NodeVisuals,
  PortRef,
} from '@unfinished-lair/sh3-editor/graph/types';
import { structuralTemplates } from '../templates/structural';
import { documentTemplates } from '../templates/document';
import { verbsToTemplates, type VerbDescriptor } from '../templates/verb-adapter';
import { resolveConnect as resolveConnectFn } from './connect-rule';
import { CONVERSIONS, DATA_TYPE_DEFS } from './data-types';
import { VISUALS, VERB_VISUAL } from './visuals';

// Cross-shard rule: sh3-pipeline must not value-import from sh3-editor. The
// editor exports `createGraphDomain` as a runtime value, so we satisfy the
// GraphDomain contract locally instead.
function makeDomain(opts: {
  id: string;
  label: string;
  templates: NodeTemplate[];
  visuals: Record<string, NodeVisuals>;
  defaultVisual: (type: string) => NodeVisuals;
  resolveConnect: (src: PortRef, tgt: PortRef) => ConnectResolution;
  dataTypes: Record<string, DataTypeDef>;
  conversions: ReadonlyArray<ConversionDef>;
}): GraphDomain {
  const templates = new Map<string, NodeTemplate>();
  for (const t of opts.templates) templates.set(t.type, t);
  const visuals = new Map<string, NodeVisuals>(Object.entries(opts.visuals));

  return {
    id: opts.id,
    label: opts.label,
    edgeSemantics: 'oriented',
    useNodePalette: true,
    showMeta: true,
    defaultNodeWidth: 200,
    defaultNodeHeight: 80,
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
    getNodeVisuals: (type) => visuals.get(type) ?? opts.defaultVisual(type),
    addVisuals: (type, v) => { visuals.set(type, v); },
    resolveLabel: (type, config) => {
      const v = visuals.get(type) ?? opts.defaultVisual(type);
      return typeof v.label === 'function' ? v.label(config) : v.label;
    },
    resolveConnect: opts.resolveConnect,
    dataTypes: opts.dataTypes,
    conversions: opts.conversions,
  };
}

export interface CtxLike {
  sh3: { listVerbs: (opts: { programmaticOnly: boolean }) => VerbDescriptor[] };
}

export function buildControlGraphDomain(ctx: CtxLike, _host: GraphDomainHost): GraphDomain {
  const verbs = ctx.sh3.listVerbs({ programmaticOnly: true });
  const verbTemplates = verbsToTemplates(verbs);

  const visualMap: Record<string, NodeVisuals> = { ...VISUALS };
  for (const t of verbTemplates) {
    const labelText = typeof t.label === 'string' ? t.label : t.type;
    visualMap[t.type] = {
      ...VERB_VISUAL,
      label: (config) => {
        const mode = (config as { mode?: unknown }).mode;
        const name = String((config as { name?: string }).name ?? labelText);
        return mode === 'prefetch' ? `⚡ ${name}` : name;
      },
      bodySchema: [
        { key: 'prefetch',
          meta: { type: 'sh3-pipeline:prefetch-node-body' },
          show: (cfg) => (cfg as { mode?: unknown }).mode === 'prefetch' },
        { meta: { type: 'badge',
                  widget: { type: 'badge', level: 'error' } },
          show: (cfg) => {
            const c = cfg as { mode?: unknown; prefetch?: { lastError?: unknown } };
            return c.mode === 'prefetch' && !!c.prefetch?.lastError;
          } },
        { meta: { type: 'badge',
                  widget: { type: 'badge', level: 'warn' } },
          show: (cfg) => {
            const c = cfg as {
              mode?: unknown;
              prefetch?: {
                selectedRowKey?: string | null;
                valueField?: string | null;
                list?: { rows?: Record<string, unknown>[] } | null;
              };
            };
            if (c.mode !== 'prefetch') return false;
            const pf = c.prefetch;
            if (!pf?.selectedRowKey || !Array.isArray(pf?.list?.rows)) return false;
            const rows = pf.list!.rows!;
            const valueField = pf.valueField ?? null;
            const found = rows.some((r) => {
              const k = valueField && r[valueField] != null
                ? String(r[valueField]) : JSON.stringify(r);
              return k === pf.selectedRowKey;
            });
            return !found;
          } },
      ],
    };
  }

  return makeDomain({
    id: 'sh3-pipeline:control-graph',
    label: 'Control Graph',
    templates: [...structuralTemplates, ...documentTemplates, ...verbTemplates],
    visuals: visualMap,
    defaultVisual: (type) => ({ ...VERB_VISUAL, label: type, borderColor: '#888888' }),
    resolveConnect: resolveConnectFn,
    dataTypes: DATA_TYPE_DEFS,
    conversions: CONVERSIONS,
  });
}
