import type { NodeHandler } from './index';

interface DocumentWriteConfig {
  targetShard?: unknown;
  pathTemplate?: unknown;
  format?: unknown;
}

type Format = 'json' | 'text';

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

function resolvePath(template: string, item: unknown, index: number, itemIndex: number): string {
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

function sanitizePath(p: string): string {
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

export function makeDocumentWriteHandler(): NodeHandler {
  return async (ctx, inv) => {
    const cfg = inv.config as DocumentWriteConfig;
    const targetShard = typeof cfg.targetShard === 'string' ? cfg.targetShard : '';
    const pathTemplate = typeof cfg.pathTemplate === 'string' ? cfg.pathTemplate : '';
    if (!targetShard) throw new Error('document.write: config.targetShard is required');
    if (!pathTemplate) throw new Error('document.write: config.pathTemplate is required');
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

    const resolved: { path: string; content: string | ArrayBuffer }[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < items.length; i++) {
      const path = sanitizePath(resolvePath(pathTemplate, items[i], i, i));
      if (seen.has(path)) {
        throw new Error(
          `document.write: path collision at item ${i}: '${path}' was produced by an earlier item in this run`,
        );
      }
      seen.add(path);
      resolved.push({ path, content: resolveContent(items[i], format) });
    }

    const paths: string[] = [];
    for (let i = 0; i < resolved.length; i++) {
      try {
        await ctx.writeDocument(targetShard, resolved[i].path, resolved[i].content);
      } catch (cause) {
        const err = new Error(
          `document.write: item ${i} failed at '${resolved[i].path}': ${
            cause instanceof Error ? cause.message : String(cause)
          }`,
        ) as Error & { writtenSoFar: string[]; cause: unknown };
        err.writtenSoFar = [...paths];
        err.cause = cause;
        throw err;
      }
      paths.push(resolved[i].path);
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'debug',
        message: `document.write: wrote ${targetShard}/${resolved[i].path}`,
      });
    }
    return { outputs: { paths }, next: 'run-out' };
  };
}
