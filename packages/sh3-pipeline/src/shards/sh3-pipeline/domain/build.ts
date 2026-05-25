import type {
  GraphDomain,
  GraphDomainHost,
  NodeTemplate,
  NodeVisuals,
  PortRef,
} from '@unfinished-lair/sh3-editor/graph/types';
import { structuralTemplates } from '../templates/structural';
import { documentTemplates } from '../templates/document';
import { verbsToTemplates, type VerbDescriptor } from '../templates/verb-adapter';
import { hybridConnectRule } from './connect-rule';
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
  canConnect: (src: PortRef, tgt: PortRef) => boolean;
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
    canConnect: opts.canConnect,
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
    if (t.type.endsWith(':prefetch')) {
      visualMap[t.type] = {
        ...VERB_VISUAL,
        label: (config) => `⚡ ${String((config as { name?: string }).name ?? t.label)}`,
        borderColor: '#a78bfa',
        textColor: '#f5f3ff',
      };
    } else {
      visualMap[t.type] = { ...VERB_VISUAL, label: typeof t.label === 'string' ? t.label : t.type };
    }
  }

  return makeDomain({
    id: 'sh3-pipeline:control-graph',
    label: 'Control Graph',
    templates: [...structuralTemplates, ...documentTemplates, ...verbTemplates],
    visuals: visualMap,
    defaultVisual: (type) => ({ ...VERB_VISUAL, label: type, borderColor: '#888888' }),
    canConnect: hybridConnectRule,
  });
}
