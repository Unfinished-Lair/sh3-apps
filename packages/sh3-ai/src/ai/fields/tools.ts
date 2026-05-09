import type { ShardContext, FieldAddress, FieldKind, FieldView } from 'sh3-core';
import type { Tool, JsonSchema } from '../catalog/types';

/**
 * Build the three `ai.fields.*` tools that expose sh3-core 0.17's
 * controllable-field surface (`ctx.sh3.fields.list/get/set`) to the chat
 * dispatcher. The same fields the AI Assistant decorates show up here as
 * read/write tools — the LLM can answer "what's in my text editor right
 * now?" without anyone having to start the assistant.
 *
 * Tool naming uses the 3-segment shape `ai.fields.<op>` to dodge collisions
 * with verbs registered as `ai.<bare>` (the docs/sketch tools use the same
 * pattern). The matching `ai.fields.list` / `ai.fields.get` entries are
 * added to the read-only scope's whitelist; `ai.fields.set` is gated under
 * `ai:scope save` or `ai:scope sh3-ai:everything`.
 */
export function makeFieldsTools(ctx: ShardContext): Tool[] {
  const addressProps: JsonSchema = {
    shardId: {
      type: 'string',
      description:
        "Owner shard id from a prior ai.fields.list entry (e.g. 'sh3-editor').",
    },
    slotId: {
      type: 'string',
      description:
        'Slot id when the field is slot-scoped. Required when the field was registered with a scope; absent otherwise.',
    },
    fieldId: {
      type: 'string',
      description:
        "Field id from a prior ai.fields.list entry (e.g. 'body', 'fields.House').",
    },
  };

  const listSchema: JsonSchema = {
    type: 'object',
    properties: {
      shardId: { type: 'string', description: 'Filter to one owning shard.' },
      slotId: { type: 'string', description: 'Filter to one slot.' },
      kind: {
        type: 'string',
        enum: ['string', 'number', 'integer', 'boolean', 'enum', 'json'],
        description: 'Filter to one FieldKind.',
      },
    },
  };

  const getSchema: JsonSchema = {
    type: 'object',
    properties: addressProps,
    required: ['shardId', 'fieldId'],
  };

  const setSchema: JsonSchema = {
    type: 'object',
    properties: {
      ...addressProps,
      value: {
        description:
          "New value. Must match the field's kind: string/number/integer/boolean primitives, or one of enumValues for kind: 'enum'. JSON-kind fields accept any JSON-serializable value.",
      },
    },
    required: ['shardId', 'fieldId', 'value'],
  };

  return [
    {
      name: 'ai.fields.list',
      source: 'sh3-ai.tool',
      description:
        'Enumerate every controllable field currently registered in this Sh3 instance. Returns a JSON array of { shardId, slotId?, fieldId, label, kind, readonly, source, enumValues? } entries — the same surface the AI Assistant decorates. Filter by shardId/slotId/kind to narrow down. Use this BEFORE ai.fields.get / ai.fields.set to discover what is reachable; the contents change as the user opens, closes, or rearranges views.',
      inputSchema: listSchema,
      async run(rawArgs) {
        const opts = parseListOpts(rawArgs);
        const views = ctx.sh3.fields.list(opts);
        return views.map(viewToWire);
      },
    },
    {
      name: 'ai.fields.get',
      source: 'sh3-ai.tool',
      description:
        "Read the current value of one controllable field by its (shardId, slotId?, fieldId) tuple. Address comes from a prior ai.fields.list call. Returns { value } where value is the field's primitive (or JSON-shaped) snapshot. Throws when the field address is not currently registered (e.g. the slot just unmounted).",
      inputSchema: getSchema,
      async run(rawArgs) {
        const addr = parseAddress(rawArgs);
        const value = ctx.sh3.fields.get(addr);
        return { value };
      },
    },
    {
      name: 'ai.fields.set',
      source: 'sh3-ai.tool',
      description:
        "Write a new value into one controllable field by its (shardId, slotId?, fieldId) tuple. Returns { ok: true } on success. The host runs the field's setter — read-only fields refuse with an error, kind-mismatched values may be rejected by the host, and the change is undoable through the host's normal history. Confirm intent with the user before calling unless they have explicitly asked for the edit; for prose-style rewrites the AI Assistant float (palette: 'AI: Start Assistant') gives the user a per-field accept/discard step that this tool skips.",
      inputSchema: setSchema,
      async run(rawArgs) {
        const addr = parseAddress(rawArgs);
        const value = parseValue(rawArgs);
        await ctx.sh3.fields.set(addr, value);
        return { ok: true };
      },
    },
  ];
}

interface ListOpts {
  shardId?: string;
  slotId?: string;
  kind?: FieldKind;
}

function parseListOpts(raw: unknown): ListOpts {
  if (!raw || typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  const out: ListOpts = {};
  if (typeof obj.shardId === 'string' && obj.shardId.length > 0) out.shardId = obj.shardId;
  if (typeof obj.slotId === 'string' && obj.slotId.length > 0) out.slotId = obj.slotId;
  if (typeof obj.kind === 'string') out.kind = obj.kind as FieldKind;
  return out;
}

function parseAddress(raw: unknown): FieldAddress {
  if (!raw || typeof raw !== 'object') {
    throw new Error('expected an object with shardId, slotId?, fieldId');
  }
  const obj = raw as Record<string, unknown>;
  const shardId = obj.shardId;
  const fieldId = obj.fieldId;
  if (typeof shardId !== 'string' || shardId.length === 0) {
    throw new Error("missing or empty 'shardId'");
  }
  if (typeof fieldId !== 'string' || fieldId.length === 0) {
    throw new Error("missing or empty 'fieldId'");
  }
  const addr: FieldAddress = { shardId, fieldId };
  if (typeof obj.slotId === 'string' && obj.slotId.length > 0) {
    addr.slotId = obj.slotId;
  }
  return addr;
}

function parseValue(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || !('value' in raw)) {
    throw new Error("missing 'value'");
  }
  return (raw as Record<string, unknown>).value;
}

function viewToWire(fv: FieldView): Record<string, unknown> {
  // Strip the `element` HTMLElement — DOM nodes don't survive JSON.
  const out: Record<string, unknown> = {
    shardId: fv.shardId,
    fieldId: fv.fieldId,
    label: fv.label,
    kind: fv.kind,
    readonly: fv.readonly,
    source: fv.source,
  };
  if (fv.slotId !== undefined) out.slotId = fv.slotId;
  if (fv.description !== undefined) out.description = fv.description;
  if (fv.enumValues !== undefined) out.enumValues = fv.enumValues;
  return out;
}
