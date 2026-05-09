/**
 * JSON-Schema-shaped object the LLM tool-call API consumes verbatim.
 * Kept loose intentionally — providers do their own dialect translation.
 */
export type JsonSchema = Record<string, unknown>;

/** Single tool entry in the AI catalog. Same shape consumed by the LLM
 *  tool-call API and (Phase 2) the graph-domain emitter. */
export interface Tool {
  /** Canonical id, e.g. 'sh3-r2.backup', 'sh3-fe.read'. Tool names use '.'
   *  as separator (scope ids use ':' to keep the namespaces distinct). */
  name: string;
  description: string;
  inputSchema: JsonSchema;
  source: 'verb' | 'sh3-ai.tool' | 'action';
  run(args: unknown, opts: { signal: AbortSignal }): Promise<unknown>;
}

/** ToolSpec is the schema-only projection of Tool, sent to the LLM. */
export interface ToolSpec {
  name: string;
  description: string;
  inputSchema: JsonSchema;
}

/** Per-call result the dispatcher feeds back into the next chat() round. */
export interface ToolResult {
  toolCallId: string;
  content: string | { error: string };
}
