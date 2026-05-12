import type { ShardContext } from 'sh3-core';
import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';
import {
  DOMAIN_ID,
  PIPELINE_DOC_VERSION,
  deriveInterface,
  type PipelineDocument,
} from './format';

/**
 * docId convention: 'shardId:path' (colon-separated). Examples:
 *   'sh3-pipeline:pipelines/cats.pipeline.json'
 *   'sh3-file-explorer:scratch/draft.pipeline.json'
 */
export function splitDocId(docId: string): { shardId: string; path: string } {
  const idx = docId.indexOf(':');
  if (idx <= 0 || idx === docId.length - 1) {
    throw new Error(`Invalid docId ${docId}: expected 'shardId:path'`);
  }
  return { shardId: docId.slice(0, idx), path: docId.slice(idx + 1) };
}

export function emptyAsset(): GraphAsset {
  return {
    id: 'graph',
    name: '',
    domain: DOMAIN_ID,
    version: 1,
    nodes: [],
    edges: [],
  };
}

export function emptyDocument(): PipelineDocument {
  return {
    version: PIPELINE_DOC_VERSION,
    domainId: DOMAIN_ID,
    interface: { inputs: [], outputs: [] },
    asset: emptyAsset(),
  };
}

export async function load(ctx: ShardContext, docId: string): Promise<PipelineDocument> {
  const { shardId, path } = splitDocId(docId);
  const readFrom = ctx.browse?.readFrom;
  if (!readFrom) throw new Error('documents:read capability missing');
  const content = await readFrom(shardId, path);
  if (content === null) throw new Error(`Document not found: ${docId}`);
  if (typeof content !== 'string') {
    throw new Error(`Expected text document at ${docId}, got binary`);
  }
  const parsed = JSON.parse(content) as PipelineDocument;
  if (parsed.version !== PIPELINE_DOC_VERSION) {
    throw new Error(
      `Unsupported pipeline document version ${parsed.version} (expected ${PIPELINE_DOC_VERSION})`,
    );
  }
  if (parsed.domainId !== DOMAIN_ID) {
    throw new Error(`Document domainId ${parsed.domainId} does not match ${DOMAIN_ID}`);
  }
  return parsed;
}

export async function save(
  ctx: ShardContext,
  docId: string,
  doc: PipelineDocument,
): Promise<void> {
  const { shardId, path } = splitDocId(docId);
  const writeTo = ctx.browse?.writeTo;
  if (!writeTo) throw new Error('documents:write capability missing');
  const next: PipelineDocument = {
    ...doc,
    interface: deriveInterface(doc.asset),
  };
  await writeTo(shardId, path, JSON.stringify(next, null, 2));
}
