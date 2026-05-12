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
}

export interface PipelineInterface {
  inputs: Array<{ name: string; dataType: DataType }>;
  outputs: Array<{ name: string; dataType: DataType }>;
}
