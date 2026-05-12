import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';
import type { ParamDef, ReturnDef, PipelineInterface } from '../domain/types';

export const PIPELINE_DOC_VERSION = 1 as const;
export const DOMAIN_ID = 'sh3-pipeline:control-graph' as const;

export interface PipelineDocument {
  version: typeof PIPELINE_DOC_VERSION;
  domainId: typeof DOMAIN_ID;
  interface: PipelineInterface;
  asset: GraphAsset;
}

function isParamArray(v: unknown): v is ParamDef[] {
  return (
    Array.isArray(v) &&
    v.every(
      (p) =>
        p &&
        typeof p === 'object' &&
        typeof (p as ParamDef).name === 'string' &&
        typeof (p as ParamDef).dataType === 'string',
    )
  );
}

export function deriveInterface(asset: GraphAsset): PipelineInterface {
  const nodes = asset.nodes ?? [];

  const start = nodes.find((n) => n.type === 'start');
  const end = nodes.find((n) => n.type === 'end');

  const params = start?.config?.params;
  const returns = end?.config?.returns;

  return {
    inputs: isParamArray(params)
      ? params.map((p) => ({ name: p.name, dataType: p.dataType }))
      : [],
    outputs: isParamArray(returns)
      ? (returns as ReturnDef[]).map((r) => ({ name: r.name, dataType: r.dataType }))
      : [],
  };
}
