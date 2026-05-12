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
