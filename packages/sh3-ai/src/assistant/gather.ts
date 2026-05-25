import type { FieldAddress, FieldKind, FieldView } from 'sh3-core';
import type { ContextSource } from 'sh3-core';
import { PermissionError } from 'sh3-core';
import type { ContextEntry, ContextKind } from './prompt';
import type { SelectedEntry } from './picker';

export interface GatherDeps {
  fields: {
    get(addr: FieldAddress): unknown;
    list(opts?: { shardId?: string; slotId?: string; kind?: FieldKind }): FieldView[];
  };
  sources(): ContextSource[];
  /**
   * Read a document by scope-rooted path (`<shardId>/<rest>`). In sh3-core 0.26
   * cross-shard reads go through `ctx.documents.readText` directly; addresses
   * outside the handle's grants throw `PermissionError`.
   *
   * Optional — when omitted, document entries surface a soft warning toast.
   * Callers that hold `documents:browse` (or `documents:write`) should always
   * pass this in.
   */
  readDocument?: (rootedPath: string) => Promise<unknown>;
  /** Whether the underlying handle was granted browse (or implied via write). */
  canBrowseDocuments?: boolean;
  toast(message: string): void;
}

export async function gatherContexts(
  selected: SelectedEntry[],
  deps: GatherDeps,
): Promise<ContextEntry[]> {
  const out: ContextEntry[] = [];
  for (const entry of selected) {
    try {
      const gathered = await gatherOne(entry, deps);
      if (gathered !== null) out.push(gathered);
    } catch (err) {
      const message =
        err instanceof PermissionError
          ? 'documents:browse not granted for this path'
          : err instanceof Error
            ? err.message
            : String(err);
      deps.toast(`AI context: ${describeEntry(entry)} failed: ${message}`);
    }
  }
  return out;
}

async function gatherOne(
  entry: SelectedEntry,
  deps: GatherDeps,
): Promise<ContextEntry | null> {
  if (entry.kind === 'field') {
    const value = deps.fields.get(entry.addr);
    if (value == null) return null;
    const meta = deps.fields
      .list({ shardId: entry.addr.shardId })
      .find(
        (f) =>
          (f.slotId ?? undefined) === (entry.addr.slotId ?? undefined) &&
          f.fieldId === entry.addr.fieldId,
      );
    return {
      origin: 'field',
      originKey: `${entry.addr.shardId}:${entry.addr.fieldId}`,
      label: meta?.label ?? entry.addr.fieldId,
      kind: (meta?.kind ?? 'string') as ContextKind,
      value,
    };
  }

  if (entry.kind === 'source') {
    const descriptor = deps.sources().find((s) => s.id === entry.id);
    if (!descriptor) return null;
    const value = await descriptor.get();
    if (value == null) return null;
    return {
      origin: 'source',
      originKey: descriptor.id,
      label: descriptor.label,
      kind: (descriptor.kind ?? 'text') as ContextKind,
      value,
    };
  }

  // entry.kind === 'document'
  if (!deps.readDocument || deps.canBrowseDocuments === false) {
    // The shard manifest didn't request browse (or read access is otherwise
    // unavailable). Surface as a soft warning rather than a throw so other
    // entries continue.
    throw new Error('documents:browse not granted');
  }
  const rootedPath = `${entry.shardId}/${entry.path}`;
  const value = await deps.readDocument(rootedPath);
  if (value == null) return null;
  return {
    origin: 'document',
    originKey: `${entry.shardId}:${entry.path}`,
    label: lastSegment(entry.path),
    kind: inferDocumentKind(entry.path),
    value,
  };
}

function describeEntry(entry: SelectedEntry): string {
  switch (entry.kind) {
    case 'field':
      return `field '${entry.addr.shardId}:${entry.addr.fieldId}'`;
    case 'source':
      return `source '${entry.id}'`;
    case 'document':
      return `document '${entry.shardId}:${entry.path}'`;
  }
}

function lastSegment(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx >= 0 ? path.slice(idx + 1) : path;
}

function inferDocumentKind(path: string): ContextKind {
  const lower = path.toLowerCase();
  if (lower.endsWith('.md') || lower.endsWith('.markdown')) return 'markdown';
  if (lower.endsWith('.json')) return 'json';
  return 'text';
}
