const ENDPOINT = (modelId: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

export class GeminiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function askGemini(apiKey: string, prompt: string, modelId: string): Promise<string> {
  const url = `${ENDPOINT(modelId)}?key=${apiKey}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GeminiError(redactKey(msg, apiKey));
  }

  if (!res.ok) {
    let envelopeMsg: string | undefined;
    try {
      const body = await res.json();
      envelopeMsg = body?.error?.message;
    } catch {
      // body wasn't JSON — fall through to status fallback
    }
    const raw = envelopeMsg ?? `HTTP ${res.status}`;
    throw new GeminiError(redactKey(raw, apiKey), res.status);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts as Array<{ text?: string }> | undefined;
  if (!parts || parts.length === 0) {
    throw new GeminiError('unexpected response shape');
  }
  return parts.map((p) => p.text ?? '').join('');
}

function redactKey(message: string, apiKey: string): string {
  if (!apiKey) return message;
  return message.split(apiKey).join('***');
}

const LIST_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface ModelInfo {
  id: string;
  displayName: string;
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
    let envelopeMsg: string | undefined;
    try {
      const body = await res.json();
      envelopeMsg = body?.error?.message;
    } catch {
      // body wasn't JSON — fall through to status fallback
    }
    const raw = envelopeMsg ?? `HTTP ${res.status}`;
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
