# Pipeline Graph Domain

Domain id: `sh3-pipeline:control-graph` — registered at `'sh3-editor.graph-domain'`.

> **v0.4 changes:**
> - The `control` data type was renamed to `run`. Affected: port discs (`run` colored), template port ids (`run`, `run-in`, `run-out`).
> - The connection rule moved from boolean `canConnect` to rich `resolveConnect` which can route cross-type connections through declared adapters.
> - Four conversion adapters were declared (number↔string, boolean↔string). Edges using them are persisted with an `adapter` id and rendered dashed.
> - New nodes: `print` (Debug category), `record.toJson`, `array.toJson` (Data category).
> - No persisted-document migration: pipeline assets created before v0.4 must be rebuilt.

## Edge classes

| dataType | Meaning | Color |
|---|---|---|
| `run`     | Execution sequencing | white/grey |
| `string`  | UTF-8 text | cyan |
| `number`  | float or integer | lime |
| `boolean` | true/false | amber |
| `record`  | `Record<string, unknown>` | mauve |
| `array`   | List value | rose |
| `doc`     | Document handle/ref | violet |
| `unknown` | Untyped escape hatch | dim grey |

The domain publishes this table via `GraphDomain.dataTypes`, and the sh3-editor renderer reads `dataTypes[t].color` for the port disc.

## Connection rule

`resolveConnect(src, tgt)` returns:

- `false` — connection rejected
- `true` — direct connection
- `{ via: <conversionId> }` — routed through the named conversion adapter

Rules in order:

1. `src.direction === 'output'` AND `tgt.direction === 'input'`, and `src.nodeId !== tgt.nodeId`; otherwise reject.
2. If either side is `run`, both sides must be `run`; otherwise reject.
3. If either side is `unknown`, accept directly.
4. If both sides match, accept directly.
5. Otherwise look up the conversion table; if an adapter `from→to` exists, return `{ via: id }`; else reject.

## Conversions

The v1 conversion set:

| id | from → to | adapt |
|---|---|---|
| `pipeline:number-to-string`  | `number → string`  | `String(v)` |
| `pipeline:string-to-number`  | `string → number`  | `parseNumberOrThrow` |
| `pipeline:boolean-to-string` | `boolean → string` | `'true' \| 'false'` |
| `pipeline:string-to-boolean` | `string → boolean` | `parseBooleanOrThrow` |

`parseNumberOrThrow` requires `Number.isFinite(Number(v))`; throws on `'abc'`, `'NaN'`, etc.

`parseBooleanOrThrow` accepts (case-insensitive, trimmed) `'true' / '1' / 'yes'` → `true`, `'false' / '0' / 'no' / ''` → `false`; throws on anything else.

Adapters apply only on the consuming edge at read time. The upstream node always sees its original output. Edges carrying an adapter are stored with `adapter: <id>` and rendered as dashed lines.

If an adapter throws at runtime, the runner logs an `error` and the consumer sees `undefined` for that input. If an edge persists an adapter id no longer in the table, the runner logs a `warn` and the raw value passes through.

## Node categories

- **Flow** — `start`, `end`, `branch`, `sequence`, `comment`
- **Data** — `setVar`, `getVar`, `literal.{string,number,boolean}`, `record.build`, `record.get`, `record.toJson`, `array.toJson`
- **Debug** — `print`
- **Verbs** — one node per `programmaticOnly: true` verb (catalog snapshotted at boot)

### `print` (Debug)

Inputs: `run-in` (run), `value` (unknown). Output: `run-out` (run).

Config:
- `path` — optional path expression that subselects into `value` before display. Supports dot notation, numeric brackets `[0]`, quoted-string brackets `['key']` / `["key"]`.
- `label` — optional prefix for the log line.

The handler stringifies the resolved value (verbatim for strings, JSON pretty-print for objects/arrays) and emits an `info` log entry; on path miss it logs `(path miss: <expr>)`; on `value === undefined` it logs `(no input)`.

### `record.toJson` / `array.toJson` (Data)

`record.toJson` — input `record: record`, output `json: string`. `array.toJson` — input `array: array`, output `json: string`. Both take a `pretty: boolean` config (default `true`). On error (e.g. circular ref) the handler emits `json: undefined` and logs `error`.

## Verb adapter

Each verb produces a template `type === 'verb:<shardId>:<name>'`.

**Inputs** — one `run-in` port (dataType `run`) plus:

- One port per `schema.input.properties` entry (dataType inferred from JSON Schema), when a schema is declared.
- Otherwise a single `args: string` fallback (whitespace-split into the verb's `args[]` at dispatch).

**Outputs** — one `run-out` port (dataType `run`) plus:

| Has `schema.output`? | Output ports |
|---|---|
| Object schema with `properties` | one typed port per property |
| Scalar schema | single `value` port (dataType inferred) |
| No output schema | four-port fallback: `result, stdout, stderr, scrollback` |

The fallback uses `runVerb`'s `{ result, scrollback }` resolution: `result` is the verb's raw return; `stdout` / `stderr` join scrollback `text` entries by stream; `scrollback` is the full structured array for advanced filtering.

## Prefetch mode (v0.3)

Verbs whose `schema.output` is shaped `{ type: 'array', items: { type: 'object', properties: {...} } }` produce **two** templates at catalog build:

- `verb:<shardId>:<name>` — the existing runtime variant. Default `config.mode: 'runtime'`.
- `verb:<shardId>:<name>:prefetch` — the prefetch variant. Category: `Pickers`. Default `config.mode: 'prefetch'`.

A prefetch node has no input ports and two output ports: `value` (dataType derived from the picked row's `valueField`) and `record` (the full row).

**Lifecycle:**
- The verb runs out-of-band (not during pipeline execution) on node instantiation, on the inspector Refresh button, and on debounced inspector `args` edits.
- The result list and selected row are cached in node config (`config.prefetch.list`, `config.prefetch.lastSelectedRow`) so the picker keeps working when the doc is reopened with the provider shard inactive.
- During pipeline runs, the prefetch handler reads cached state and emits without invoking the verb.

**Mode toggle (v1):** A `Runtime mode` / `Prefetch mode` button in the inspector swaps the node's template type while preserving position. Wires on the node are dropped (input/output ports differ between modes).
