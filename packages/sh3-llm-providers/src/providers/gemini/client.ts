import type { AiProvider, ChatChunk, ChatMessage, ChatOptions } from 'sh3-ai';
import { makeIdleTimer } from '../idle-timer';
import { redactKey } from '../../shared/redact';
import { encodeToolName, decodeToolName } from '../../shared/tool-name-codec';
import { readErrorEnvelope } from '../../shared/error-envelope';
import { parseSseStream } from '../../shared/sse';
import type { ModelInfo, ProviderDeps } from '../types';

const STREAM_ENDPOINT = (modelId: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent`;

const LIST_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GeminiError';
  }
}

export interface GeminiGenerationConfig {
  /** null/omitted → do not send `generationConfig.temperature`. */
  temperature?: number | null;
  /** null/omitted → do not send `generationConfig.maxOutputTokens`. */
  maxOutputTokens?: number | null;
}

function buildGenerationFields(
  systemInstruction: string | undefined,
  config: GeminiGenerationConfig | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (systemInstruction) {
    out.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  const generationConfig: Record<string, number> = {};
  if (typeof config?.temperature === 'number') {
    generationConfig.temperature = config.temperature;
  }
  if (typeof config?.maxOutputTokens === 'number') {
    generationConfig.maxOutputTokens = config.maxOutputTokens;
  }
  if (Object.keys(generationConfig).length > 0) {
    out.generationConfig = generationConfig;
  }
  return out;
}

export async function listModels(apiKey: string): Promise<ModelInfo[]> {
  const url = `${LIST_ENDPOINT}?key=${apiKey}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    const raw = await readErrorEnvelope(res);
    throw new GeminiError(redactKey(raw, apiKey), res.status);
  }

  const data = await res.json();
  const models = Array.isArray(data?.models) ? data.models : [];
  return models
    .filter((m: { supportedGenerationMethods?: string[] }) =>
      m.supportedGenerationMethods?.includes('generateContent'),
    )
    .map((m: { name: string; displayName?: string }) => ({
      id: m.name.replace(/^models\//, ''),
      displayName: m.displayName ?? m.name.replace(/^models\//, ''),
    }))
    .sort((a: ModelInfo, b: ModelInfo) => a.id.localeCompare(b.id));
}

// Gemini's Schema type is a strict subset of JSON Schema. Sending unknown
// keys (notably `additionalProperties`, `$schema`, `oneOf`, `allOf`, `not`,
// `const`, `$ref`) gets rejected with
// `Invalid JSON payload received. Unknown name "<key>" at
// 'tools[0].function_declarations[N].parameters'`. Tool authors (and JSON
// Schema generators like zod-to-json-schema) routinely emit these, so we
// allowlist the keys Gemini actually accepts and recurse through the
// nesting points (`properties`, `items`, `anyOf`).
const GEMINI_SCHEMA_KEYS: ReadonlySet<string> = new Set([
  'type', 'format', 'title', 'description', 'nullable', 'enum',
  'maxItems', 'minItems', 'minProperties', 'maxProperties',
  'minLength', 'maxLength', 'pattern', 'minimum', 'maximum',
  'default', 'example', 'properties', 'required', 'items',
  'anyOf', 'propertyOrdering',
]);

export function sanitizeGeminiSchema(schema: unknown): unknown {
  if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) {
    return schema;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema as Record<string, unknown>)) {
    if (!GEMINI_SCHEMA_KEYS.has(key)) continue;
    if (key === 'properties' && value && typeof value === 'object') {
      const props: Record<string, unknown> = {};
      for (const [propName, propSchema] of Object.entries(value as Record<string, unknown>)) {
        props[propName] = sanitizeGeminiSchema(propSchema);
      }
      out[key] = props;
    } else if (key === 'items') {
      out[key] = sanitizeGeminiSchema(value);
    } else if (key === 'anyOf' && Array.isArray(value)) {
      out[key] = value.map(sanitizeGeminiSchema);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function buildToolsField(options: ChatOptions | undefined): Record<string, unknown> {
  if (!options?.tools || options.tools.length === 0) return {};
  return {
    tools: [
      {
        functionDeclarations: options.tools.map((t) => ({
          name: encodeToolName(t.name),
          description: t.description,
          parameters: sanitizeGeminiSchema(t.inputSchema),
        })),
      },
    ],
  };
}

function toolResultsToContents(
  options: ChatOptions | undefined,
  callIdToName: Map<string, string>,
): Array<Record<string, unknown>> {
  if (!options?.toolResults || options.toolResults.length === 0) return [];
  return options.toolResults.map((r) => {
    const decoded = callIdToName.get(r.toolCallId);
    const encoded = decoded ? encodeToolName(decoded) : r.toolCallId;
    const response = typeof r.content === 'string'
      ? { result: r.content }
      : { error: r.content.error };
    return {
      role: 'function',
      parts: [{ functionResponse: { name: encoded, response } }],
    };
  });
}

export async function* chatStream(
  apiKey: string,
  messages: ChatMessage[],
  modelId: string,
  signal: AbortSignal,
  config?: GeminiGenerationConfig,
  options?: ChatOptions,
  callIdToName: Map<string, string> = new Map(),
): AsyncIterable<ChatChunk> {
  const url = `${STREAM_ENDPOINT(modelId)}?alt=sse&key=${apiKey}`;
  const idle = makeIdleTimer(signal, options?.idleTimeoutMs);
  let res: Response;
  try {
    const baseContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [...baseContents, ...toolResultsToContents(options, callIdToName)],
        ...buildGenerationFields(options?.systemInstruction, config),
        ...buildToolsField(options),
      }),
      signal: idle.signal,
    });
  } catch (err) {
    idle.clear();
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    const raw = await readErrorEnvelope(res);
    throw new GeminiError(redactKey(raw, apiKey), res.status);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new GeminiError('streamGenerateContent: empty body');
  }

  type SsePart =
    | { kind: 'token'; text: string }
    | { kind: 'tool-call'; id: string; name: string; arguments: unknown };

  function* extractParts(parsed: unknown): Iterable<SsePart> {
    const parts = (parsed as {
      candidates?: {
        content?: {
          parts?: Array<{
            text?: string;
            functionCall?: { name?: string; args?: unknown };
          }>;
        };
      }[];
    })?.candidates?.[0]?.content?.parts;
    if (!parts) return;
    for (const p of parts) {
      if (typeof p.text === 'string' && p.text.length > 0) {
        yield { kind: 'token', text: p.text };
      } else if (p.functionCall && typeof p.functionCall.name === 'string') {
        yield {
          kind: 'tool-call',
          id: crypto.randomUUID(),
          name: decodeToolName(p.functionCall.name),
          arguments: p.functionCall.args ?? {},
        };
      }
    }
  }

  const rawTextRef = { value: '' };
  let yieldedAny = false;
  let yieldedToolCall = false;

  async function* yieldPart(part: SsePart): AsyncIterable<ChatChunk> {
    yieldedAny = true;
    if (part.kind === 'token') {
      yield { type: 'token', text: part.text };
    } else {
      yieldedToolCall = true;
      // Remember encoded↔decoded mapping so a follow-up turn carrying
      // toolResults can address the correct functionResponse.name.
      callIdToName.set(part.id, part.name);
      yield { type: 'tool-call', id: part.id, name: part.name, arguments: part.arguments };
    }
  }

  try {
    for await (const data of parseSseStream(reader, rawTextRef)) {
      idle.bump();
      let parsed: unknown;
      try { parsed = JSON.parse(data); } catch { continue; }
      for (const part of extractParts(parsed)) {
        yield* yieldPart(part);
      }
    }
  } catch (err) {
    idle.clear();
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  // Fallback: if SSE parsing yielded nothing but we got bytes, try JSON-array.
  // `streamGenerateContent` without alt=sse honored returns
  // `[GenerateContentResponse, ...]` with Content-Type application/json.
  // (We never gate on Content-Type — see memory note about Gemini's quirk.)
  if (!yieldedAny && rawTextRef.value.trim().length > 0) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawTextRef.value);
    } catch {
      parsed = undefined;
    }
    if (parsed !== undefined) {
      const chunks = Array.isArray(parsed) ? parsed : [parsed];
      for (const chunk of chunks) {
        for (const part of extractParts(chunk)) {
          yield* yieldPart(part);
        }
      }
    }
  }

  idle.clear();

  if (!yieldedAny) {
    const preview = rawTextRef.value.slice(0, 200).replace(/\s+/g, ' ');
    throw new GeminiError(
      `streamGenerateContent: empty stream${preview ? ` (body preview: ${preview})` : ''}`,
    );
  }
  yield yieldedToolCall
    ? { type: 'done', finishReason: 'tool-calls' }
    : { type: 'done' };
}

export function geminiProvider(deps: ProviderDeps): AiProvider {
  // Persist the encoded-name ↔ decoded-name map across turns of the same
  // dispatch loop so functionResponse.name can be addressed correctly.
  // sh3-ai's dispatch loop uses the same provider instance per loop.
  const callIdToName = new Map<string, string>();
  return {
    id: 'gemini',
    label: 'Gemini',
    capabilities: { tools: true },
    chain: () => deps.getChain(),
    chat(messages, model, signal, options) {
      return chatStream(
        deps.getApiKey(), messages, model, signal,
        {
          temperature: deps.getTemperature(),
          maxOutputTokens: deps.getMaxOutputTokens(),
        },
        options,
        callIdToName,
      );
    },
    isAuthFailure(err: unknown): boolean {
      return (
        err instanceof GeminiError &&
        (err.status === 400 || err.status === 401 || err.status === 403)
      );
    },
    isReady() {
      return deps.getApiKey().length > 0
        ? true
        : 'gemini: no API key configured. Open the Gemini settings (palette: "AI Configuration..." → "Gemini") to set one.';
    },
  };
}
