import type { RunContext, RunLogEntry } from '../domain/types';

export interface RunContextDeps {
  docId: string;
  tenant: string;
  inputs: Record<string, unknown>;
  signal: AbortSignal;
  log: (entry: RunLogEntry) => void;
  invokeVerb: RunContext['invokeVerb'];
  runSubGraph: RunContext['runSubGraph'];
  writeDocument: RunContext['writeDocument'];
}

export function createRunContext(deps: RunContextDeps): RunContext {
  return {
    vars: new Map<string, unknown>(),
    inputs: deps.inputs,
    docId: deps.docId,
    tenant: deps.tenant,
    signal: deps.signal,
    log: deps.log,
    invokeVerb: deps.invokeVerb,
    runSubGraph: deps.runSubGraph,
    writeDocument: deps.writeDocument,
  };
}
