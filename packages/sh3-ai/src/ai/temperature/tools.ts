import type { Tool, JsonSchema } from '../catalog/types';

const MIN_TEMPERATURE = 0;
const MAX_TEMPERATURE = 2;

export interface TemperatureToolDeps {
  /** Read the user's current temperature. `null` means "API default". */
  get(): number | null;
  /** Write the user's temperature. `null` clears it (API default). */
  set(value: number | null): void;
}

const getSchema: JsonSchema = {
  type: 'object',
  properties: {},
};

const setSchema: JsonSchema = {
  type: 'object',
  required: ['temperature'],
  properties: {
    temperature: {
      type: ['number', 'null'],
      minimum: MIN_TEMPERATURE,
      maximum: MAX_TEMPERATURE,
      description: `Sampling temperature in [${MIN_TEMPERATURE}, ${MAX_TEMPERATURE}], or null to fall back to the provider API's default. Lower = more deterministic, higher = more creative.`,
    },
  },
};

const getDescription =
  "Read the current sampling temperature applied to subsequent chat() calls in this shard. Returns { temperature: number | null } where null means the provider API's default is in effect.";

const setDescription =
  "Adjust the sampling temperature applied to subsequent chat() calls in this shard. Use this to nudge determinism vs. creativity mid-conversation — e.g. drop to ~0.2 before asking for a structured edit, raise to ~0.9 before brainstorming. Pass `temperature: null` to revert to the API default. Range 0..2; values outside the range are rejected.";

/**
 * Build the two `ai.temperature.*` tools that expose the shard-owned
 * sampling temperature to the chat dispatcher. Both are whitelisted in
 * `SCOPE_READ_ONLY` because adjusting one's own temperature mid-conversation
 * is a self-tuning capability, not a side-effecting action against the host.
 */
export function makeTemperatureTools(deps: TemperatureToolDeps): Tool[] {
  return [
    {
      name: 'ai.temperature.get',
      source: 'sh3-ai.tool',
      description: getDescription,
      inputSchema: getSchema,
      async run() {
        return { temperature: deps.get() };
      },
    },
    {
      name: 'ai.temperature.set',
      source: 'sh3-ai.tool',
      description: setDescription,
      inputSchema: setSchema,
      async run(rawArgs) {
        const next = parseTemperature(rawArgs);
        deps.set(next);
        return { temperature: next };
      },
    },
  ];
}

function parseTemperature(raw: unknown): number | null {
  if (!raw || typeof raw !== 'object') {
    throw new Error('ai.temperature.set: arguments must be an object');
  }
  const obj = raw as Record<string, unknown>;
  if (!('temperature' in obj)) {
    throw new Error('ai.temperature.set: missing required field `temperature`');
  }
  const v = obj.temperature;
  if (v === null) return null;
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error('ai.temperature.set: temperature must be a finite number or null');
  }
  if (v < MIN_TEMPERATURE || v > MAX_TEMPERATURE) {
    throw new Error(
      `ai.temperature.set: temperature must be between ${MIN_TEMPERATURE} and ${MAX_TEMPERATURE} (got ${v})`,
    );
  }
  return v;
}
