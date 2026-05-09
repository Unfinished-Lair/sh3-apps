import type { Tool, JsonSchema } from './types';

/** Mirror of sh3-core's `ActiveActionDescriptor` — kept structurally loose
 *  so we don't take a hard dependency on the upstream module shape. Only
 *  the fields we actually consume are listed; extras pass through harmlessly.
 *  `submenu` and `aiInvocable` are listed even though sh3-core 0.16's
 *  descriptor does not yet carry them: the adapter is forward-compatible if
 *  they land later, and `submenu: true` actions are already filtered by
 *  `listActive()` because submenu parents have no `run`. */
export interface ActiveActionDescriptorLike {
  id: string;
  label: string;
  ownerShardId: string;
  scope: unknown;
  scopeBadge: string | null;
  paletteItem?: boolean;
  contextItem?: boolean;
  submenu?: boolean;
  aiInvocable?: boolean;
}

/** Programmatic action dispatch — sh3-core 0.16's `ctx.runAction(id, opts?)`. */
export type ActionInvoker = (
  id: string,
  opts: { signal: AbortSignal },
) => Promise<void>;

const EMPTY_INPUT_SCHEMA: JsonSchema = {
  type: 'object',
  properties: {},
  additionalProperties: false,
};

/** Convert the snapshot from `sh3.actions.listActive()` into AI-catalog
 *  Tools. Skips submenu containers and explicit `aiInvocable: false` opt-outs.
 *  Preserves input order (the upstream RFC defines tier-innermost-first,
 *  which is exactly what we want the LLM to see). */
export function actionsToTools(
  active: ReadonlyArray<ActiveActionDescriptorLike>,
  invoke: ActionInvoker,
): Tool[] {
  const out: Tool[] = [];
  for (const a of active) {
    if (a.submenu === true) continue;
    if (a.aiInvocable === false) continue;
    out.push(toTool(a, invoke));
  }
  return out;
}

function toTool(a: ActiveActionDescriptorLike, invoke: ActionInvoker): Tool {
  const name = toolNameFor(a.id);
  if (name.split('.').length > 3) {
    // The everything scope whitelists `*` / `*.*` / `*.*.*`. Names beyond
    // 3 segments fall outside that envelope; the design doc captures this
    // as an open question — restrict vs. extend the matcher.
    console.warn(
      `[sh3-ai] action tool name '${name}' has >3 dot-segments; ` +
        `it will not match the 'everything' AI scope until the matcher ` +
        `is relaxed or the action id is shortened. ` +
        `See docs/claude-plans/sh3-ai/2026-05-09-sh3-ai-actions-as-tools-design.md`,
    );
  }
  const description = buildDescription(a.label, a.scopeBadge);
  return {
    name,
    description,
    inputSchema: EMPTY_INPUT_SCHEMA,
    source: 'action',
    async run(_args, opts) {
      await invoke(a.id, { signal: opts.signal });
      return '';
    },
  };
}

/** Action ids look like `shardId:bare.maybe.nested`. Tool names use `.`
 *  exclusively so the glob matcher (single-segment `*`) stays meaningful.
 *  Only the *first* `:` is rewritten — defensive against ids that may
 *  later carry stray colons in the bare segment. */
function toolNameFor(id: string): string {
  const i = id.indexOf(':');
  if (i < 0) return id;
  return id.slice(0, i) + '.' + id.slice(i + 1);
}

function buildDescription(label: string, scopeBadge: string | null): string {
  const base = label.length > 0 ? label : '(no description)';
  return scopeBadge ? `${base} (${scopeBadge})` : base;
}
