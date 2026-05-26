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
  // sh3-core 0.26 coalesced doc API: ctx.documents is a DocumentHandle
  // property; paths are scope-rooted as `<boundId>/<rest>`. Permission
  // failures throw PermissionError synchronously — no capability probe.
  const content = await ctx.documents.readText(`${shardId}/${path}`);
  if (content === null) throw new Error(`Document not found: ${docId}`);
  const parsed = JSON.parse(content) as PipelineDocument;
  if (parsed.version !== PIPELINE_DOC_VERSION) {
    throw new Error(
      `Unsupported pipeline document version ${parsed.version} (expected ${PIPELINE_DOC_VERSION})`,
    );
  }
  if (parsed.domainId !== DOMAIN_ID) {
    throw new Error(`Document domainId ${parsed.domainId} does not match ${DOMAIN_ID}`);
  }
  applyPrefetchSuffixFixup(parsed);
  applyDocumentWriteFolderMigration(parsed);
  return parsed;
}

/**
 * In-place migration: any pipeline node whose `type` ends in `:prefetch`
 * (a relic of the 0.3.0 catalog-doubling workaround) has the suffix
 * stripped and `config.mode = 'prefetch'` set. Idempotent — re-running on
 * a normalized doc is a no-op.
 */
export function applyPrefetchSuffixFixup(doc: PipelineDocument): void {
  const SUFFIX = ':prefetch';
  for (const n of doc.asset.nodes) {
    if (typeof n.type === 'string' && n.type.endsWith(SUFFIX)) {
      n.type = n.type.slice(0, -SUFFIX.length);
      if (!n.config) n.config = {};
      if (n.config.mode !== 'prefetch') n.config.mode = 'prefetch';
    }
  }
}

/**
 * In-place migration: document.write nodes saved before the folder-picker
 * refactor used `{ targetShard, pathTemplate }`. Convert to
 * `{ folder: { shardId, path }, filename }`. Idempotent — re-running on a
 * normalised doc is a no-op.
 */
export function applyDocumentWriteFolderMigration(doc: PipelineDocument): void {
  for (const n of doc.asset.nodes) {
    if (n.type !== 'document.write') continue;
    const cfg = (n.config ?? {}) as Record<string, unknown>;
    if (typeof cfg.targetShard !== 'string' || typeof cfg.pathTemplate !== 'string') continue;
    if (cfg.folder !== undefined) continue;
    const template = cfg.pathTemplate;
    const lastSlash = template.lastIndexOf('/');
    const folderPath = lastSlash >= 0 ? template.slice(0, lastSlash) : '';
    const filename   = lastSlash >= 0 ? template.slice(lastSlash + 1) : template;
    n.config = {
      folder: { shardId: cfg.targetShard, path: folderPath },
      filename,
      format: typeof cfg.format === 'string' ? cfg.format : 'json',
    };
  }
}

export async function save(
  ctx: ShardContext,
  docId: string,
  doc: PipelineDocument,
): Promise<void> {
  const { shardId, path } = splitDocId(docId);
  const next: PipelineDocument = {
    ...doc,
    interface: deriveInterface(doc.asset),
  };
  // sh3-core 0.26: scope-rooted path; missing grant raises PermissionError.
  await ctx.documents.writeText(`${shardId}/${path}`, JSON.stringify(next, null, 2));
}
