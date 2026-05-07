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

/** Contribution point id: shards register `AiConfigMenuItem` descriptors to
 *  add a child entry under the shared "AI Configuration..." palette submenu
 *  owned by sh3-ai. Use this so providers don't have to know sh3-ai's
 *  internal action ids. */
export const SH3_AI_CONFIG_MENU_CONTRIBUTION = 'sh3-ai.configMenu';

export interface ToolContribution {
  /** Canonical name, e.g. 'sh3-r2.backup'. */
  name: string;
  description: string;
  /** JSON Schema; sent verbatim to the LLM. */
  inputSchema: JsonSchema;
  run(args: unknown, opts: { signal: AbortSignal }): Promise<unknown>;
}

export interface AiConfigMenuItem {
  /** Stable suffix used to namespace the generated palette action id, e.g.
   *  'gemini.settings'. The full action id becomes
   *  `sh3-ai:open-config.<id>`; keep it unique across providers. */
  id: string;
  /** Submenu label shown in the palette, e.g. 'Gemini'. */
  label: string;
  run(): void;
}

export type { Scope };
export type { JsonSchema };
