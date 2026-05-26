import type { DataType } from './data-types';

export interface ParamDef {
  name: string;
  dataType: DataType;
  label?: string;
  required?: boolean;
  default?: unknown;
}

export type ReturnDef = ParamDef;

export interface RunLogEntry {
  ts: number;
  nodeId: string | null;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: unknown;
}

export interface RunContext {
  vars: Map<string, unknown>;
  inputs: Record<string, unknown>;
  docId: string;
  tenant: string;
  signal: AbortSignal;
  log: (entry: RunLogEntry) => void;
  invokeVerb: (
    shardId: string,
    name: string,
    args: string[],
    opts?: { signal?: AbortSignal; structured?: unknown },
  ) => Promise<{ result: unknown; scrollback: unknown[] }>;
  runSubGraph: (
    docId: string,
    inputs: Record<string, unknown>,
  ) => Promise<{ outputs: Record<string, unknown> }>;
  /**
   * Cross-shard document write. The caller assembles the full
   * scope-rooted path (`<shardId>/<path>`) and passes it as a single
   * argument; the implementation routes it to
   * `ctx.documents.writeText` / `writeBinary` based on content type.
   * Surfaces sh3-core's `PermissionError` (kind: 'write-without-grant')
   * when the shard does not declare `documents:write`.
   */
  writeDocument: (
    fullPath: string,
    content: string | ArrayBuffer,
  ) => Promise<void>;
}

export interface PipelineInterface {
  inputs: Array<{ name: string; dataType: DataType }>;
  outputs: Array<{ name: string; dataType: DataType }>;
}

export interface PrefetchListSnapshot {
  rows: Record<string, unknown>[];
  fetchedAt: number;
  schemaSnapshot: { properties: Record<string, unknown> } | null;
}

export interface PrefetchConfig {
  shardId: string;
  name: string;
  summary: string;
  /** Inspector literals mapped onto the verb's structured input. */
  args: Record<string, unknown>;
  /** Row field whose value flows on the `value` output port. Null until set. */
  valueField: string | null;
  /** Cached result; null before first fetch. */
  list: PrefetchListSnapshot | null;
  /** Stringified `valueField` value of the selected row (or JSON of the row). */
  selectedRowKey: string | null;
  /** Frozen snapshot of the selected row so orphans still emit a value. */
  lastSelectedRow: Record<string, unknown> | null;
  /** Surface for the last refresh error; null after successful fetch. */
  lastError: { message: string; ts: number } | null;
}
