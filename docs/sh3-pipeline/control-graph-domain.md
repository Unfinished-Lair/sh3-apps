# Control Graph Domain

Domain id: `sh3-pipeline:control-graph` — registered at `'sh3-editor.graph-domain'`.

## Edge classes

| dataType | Meaning | Color |
|---|---|---|
| `control` | Execution sequencing | white/grey |
| `string`  | UTF-8 text | cyan |
| `number`  | float or integer | lime |
| `boolean` | true/false | amber |
| `record`  | `Record<string, unknown>` | mauve |
| `array`   | List value | rose |
| `doc`     | Document handle/ref | violet |
| `unknown` | Untyped escape hatch | dim grey |

## Connection rule

`canConnect(src, tgt)` returns true iff:

- `src` is an output and `tgt` is an input, AND
- `src.nodeId !== tgt.nodeId`, AND
- Either both ports are `control`, OR neither is AND (`src.dataType === tgt.dataType` OR either is `'unknown'`).

## Node categories

- **Flow** — `start`, `end`, `branch`, `sequence`, `comment`
- **Data** — `setVar`, `getVar`, `literal.{string,number,boolean}`, `record.build`, `record.get`
- **Verbs** — one node per `programmaticOnly: true` verb (catalog snapshotted at boot)

## Verb adapter

Each verb produces a template `type === 'verb:<shardId>:<name>'`.

**Inputs** — one `control-in` port plus:

- One port per `schema.input.properties` entry (dataType inferred from JSON Schema), when a schema is declared.
- Otherwise a single `args: string` fallback (whitespace-split into the verb's `args[]` at dispatch).

**Outputs** — one `control-out` port plus:

| Has `schema.output`? | Output ports |
|---|---|
| Object schema with `properties` | one typed port per property |
| Scalar schema | single `value` port (dataType inferred) |
| No output schema | four-port fallback: `result, stdout, stderr, scrollback` |

The fallback uses `runVerb`'s `{ result, scrollback }` resolution: `result` is the verb's raw return; `stdout` / `stderr` join scrollback `text` entries by stream; `scrollback` is the full structured array for advanced filtering.

> v0.1.0 note: sh3-core's `VerbSchema` type only exposes `input` today (`output` is deferred upstream). All verb nodes therefore use the four-port fallback in this release. When sh3-core extends `VerbSchema` with `output`, the adapter's typed-output path already handles it.

## Prefetch mode (v0.3)

Verbs whose `schema.output` is shaped `{ type: 'array', items: { type: 'object', properties: {...} } }` produce **two** templates at catalog build:

- `verb:<shardId>:<name>` — the existing runtime variant. Default `config.mode: 'runtime'`.
- `verb:<shardId>:<name>:prefetch` — the prefetch variant. Category: `Pickers`. Default `config.mode: 'prefetch'`.

A prefetch node has no input ports and two output ports: `value` (dataType derived from the picked row's `valueField`) and `record` (the full row).

**Lifecycle:**
- The verb runs out-of-band (not during pipeline execution) on node instantiation, on the inspector Refresh button, and on debounced inspector `args` edits.
- The result list and selected row are cached in node config (`config.prefetch.list`, `config.prefetch.lastSelectedRow`) so the picker keeps working when the doc is reopened with the provider shard inactive.
- During pipeline runs, the prefetch handler reads cached state and emits without invoking the verb.

**Mode toggle (v1):** A `Runtime mode` / `Prefetch mode` button in the inspector swaps the node's template type while preserving position. Wires on the node are dropped (input/output ports differ between modes). The context-menu surface from the design document is deferred until sh3-editor exposes a node-scoped context-menu contribution point (`<upstream-issue-link>`).
