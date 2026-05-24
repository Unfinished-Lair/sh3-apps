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
   * Cross-shard document write, plumbed from the owning shard's
   * `ctx.browse.writeTo`. Throws `documents:write capability missing`
   * if the shard does not declare the capability.
   */
  writeDocument: (
    targetShard: string,
    path: string,
    content: string | ArrayBuffer,
  ) => Promise<void>;
}

export interface PipelineInterface {
  inputs: Array<{ name: string; dataType: DataType }>;
  outputs: Array<{ name: string; dataType: DataType }>;
}
