# Control Graph Runtime

## RunContext

```ts
interface RunContext {
  vars: Map<string, unknown>;
  inputs: Record<string, unknown>;
  docId: string;
  tenant: string;
  signal: AbortSignal;
  log: (entry: RunLogEntry) => void;
  invokeVerb: (shardId: string, name: string, args: string[], opts?: { signal?: AbortSignal; structured?: unknown }) => Promise<{ result: unknown; scrollback: unknown[] }>;
  runSubGraph: (docId: string, inputs: Record<string, unknown>) => Promise<{ outputs: Record<string, unknown> }>;
}
```

## Execution algorithm

Control-flow driven, lazy data pulls:

1. Locate the `start` node. Seed `RunContext.inputs[name]` into the start node's per-name output ports.
2. Follow the outgoing `control` edge to the next node.
3. Resolve data inputs: pull recursively from upstream pure-data nodes; cache per-(node, output-port) for the run.
4. Invoke the node handler.
5. Branch on the returned `next` control port; for `sequence`, iterate ordered `sequenceOuts`.
6. Reaching the `end` node: collect bound inputs into `{ outputs }` and resolve.

## Sub-graph fork

When a node calls `ctx.runSubGraph(docId, inputs)`:

- A **fresh** `vars` Map is created for the child — parent vars don't leak.
- `inputs` flows explicitly into the child's start node.
- `tenant`, `signal`, `log`, `invokeVerb` are inherited unchanged.

## Errors

Any thrown error aborts the run, emits a `level: error` log entry with `nodeId`, and rejects the run promise.

## Cancellation

Toolbar **Stop** calls `controller.abort()`. Node handlers receive the signal via `RunContext.signal`. Verb invocations forward it through `ctx.runVerb`'s opts. Async verbs that ignore the signal run to completion but their results are discarded.

## Run log

A `RunLogEntry` carries `{ ts, nodeId, level, message, data? }`. The runner pushes `enter` / `exit` debug entries around each node invocation and any `error` thrown during dispatch. Scrollback output from verb nodes is forwarded into the runner log:

- `kind: 'status'` entries map to their declared `level`.
- `kind: 'text', stream: 'stderr'` maps to `warn`.
- everything else maps to `info`.

Every log entry is also mirrored to the browser console with a `[pipeline:<level>] (<nodeId>) <message>` prefix routed to the appropriate console method (`debug` / `info` / `warn` / `error`). Filter the DevTools console with `[pipeline:` to isolate run output.
