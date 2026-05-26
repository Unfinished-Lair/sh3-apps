import type { NodeHandler } from './index';

interface DocumentWriteConfig {
  folder?: unknown;
  filename?: unknown;
  format?: unknown;
}

type Format = 'json' | 'text';

interface FolderRef {
  shardId: string;
  path: string;
}

function isFolderRef(v: unknown): v is FolderRef {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.shardId === 'string' && o.shardId.length > 0 && typeof o.path === 'string';
}

function normalizeToItems(data: unknown): unknown[] {
  if (data === undefined || data === null) {
    throw new Error("document.write: no data on 'data' input");
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return normalizeToItems(parsed);
    } catch {
      return [data];
    }
  }
  if (Array.isArray(data)) return data;
  return [data];
}

function resolveFilename(template: string, item: unknown, index: number, itemIndex: number): string {
  let resolved = template.replaceAll('{i}', String(index));
  const placeholderRe = /\{([a-zA-Z_][\w-]*)\}/g;
  resolved = resolved.replace(placeholderRe, (_match, key: string) => {
    if (!item || typeof item !== 'object') {
      throw new Error(
        `document.write: item ${itemIndex}: template field '${key}' is missing or not stringable`,
      );
    }
    const v = (item as Record<string, unknown>)[key];
    if (typeof v === 'string') return v;
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    throw new Error(
      `document.write: item ${itemIndex}: template field '${key}' is missing or not stringable`,
    );
  });
  return resolved;
}

function sanitizeFilename(p: string): string {
  return p.replaceAll(':', '-');
}

function resolveContent(item: unknown, format: Format): string | ArrayBuffer {
  if (item && typeof item === 'object') {
    const c = (item as Record<string, unknown>).content;
    if (typeof c === 'string') return c;
    if (c instanceof ArrayBuffer) return c;
  }
  if (format === 'text') return String(item);
  return JSON.stringify(item, null, 2);
}

function assembleFolderPrefix(folder: FolderRef): string {
  return folder.path ? `${folder.shardId}/${folder.path}` : folder.shardId;
}

function buildRelativePath(folder: FolderRef, filename: string): string {
  return folder.path ? `${folder.path}/${filename}` : filename;
}

export function makeDocumentWriteHandler(): NodeHandler {
  return async (ctx, inv) => {
    const cfg = inv.config as DocumentWriteConfig;

    if (!isFolderRef(cfg.folder)) {
      throw new Error('document.write: config.folder is required (pick a folder)');
    }
    const folder = cfg.folder;

    if (typeof cfg.filename !== 'string' || cfg.filename.length === 0) {
      throw new Error('document.write: config.filename is required');
    }
    const filenameTemplate = cfg.filename;
    const format: Format = cfg.format === 'text' ? 'text' : 'json';

    const items = normalizeToItems(inv.inputs.data);
    if (items.length === 0) {
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'info',
        message: 'document.write: data is empty array; no writes',
      });
      return { outputs: { paths: [] }, next: 'run-out' };
    }

    const folderPrefix = assembleFolderPrefix(folder);
    const resolved: { fullPath: string; relPath: string; content: string | ArrayBuffer }[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < items.length; i++) {
      const filename = sanitizeFilename(resolveFilename(filenameTemplate, items[i], i, i));
      const fullPath = `${folderPrefix}/${filename}`;
      if (seen.has(fullPath)) {
        throw new Error(
          `document.write: path collision at item ${i}: '${fullPath}' was produced by an earlier item in this run`,
        );
      }
      seen.add(fullPath);
      const relPath = buildRelativePath(folder, filename);
      resolved.push({ fullPath, relPath, content: resolveContent(items[i], format) });
    }

    const paths: string[] = [];
    for (let i = 0; i < resolved.length; i++) {
      try {
        await ctx.writeDocument(resolved[i].fullPath, resolved[i].content);
      } catch (cause) {
        const err = new Error(
          `document.write: item ${i} failed at '${resolved[i].fullPath}': ${
            cause instanceof Error ? cause.message : String(cause)
          }`,
        ) as Error & { writtenSoFar: string[]; cause: unknown };
        err.writtenSoFar = [...paths];
        err.cause = cause;
        throw err;
      }
      paths.push(resolved[i].relPath);
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'debug',
        message: `document.write: wrote ${resolved[i].fullPath}`,
      });
    }
    return { outputs: { paths }, next: 'run-out' };
  };
}
