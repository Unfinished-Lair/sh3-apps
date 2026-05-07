// Public type-only entry point for shards that want to register tools or
// scopes against sh3-ai's contribution points without taking a runtime
// dependency on sh3-ai. Consumers import these as type-only:
//
//   import type { ToolContribution } from 'sh3-ai/contributions';

import type { JsonSchema } from './ai/catalog/types';
import type { Scope } from './ai/scope/types';

/** Contribution point id: shards register `ToolContribution` descriptors here. */
export const SH3_AI_TOOL_CONTRIBUTION = 'sh3-ai.tool';

/** Contribution point id: optional, escape hatch only — most users
 *  author scopes via `ai:scope save` instead. */
export const SH3_AI_SCOPE_CONTRIBUTION = 'sh3-ai.scope';

export interface ToolContribution {
  /** Canonical name, e.g. 'sh3-r2.backup'. */
  name: string;
  description: string;
  /** JSON Schema; sent verbatim to the LLM. */
  inputSchema: JsonSchema;
  run(args: unknown, opts: { signal: AbortSignal }): Promise<unknown>;
}

export type { Scope };
export type { JsonSchema };
