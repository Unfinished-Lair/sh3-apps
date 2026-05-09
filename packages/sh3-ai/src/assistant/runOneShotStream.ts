import type { AiProvider, ChatMessage } from '../ai/provider';

/**
 * Streaming twin of `runOneShot` from shard.ts. Calls `onChunk` with the
 * accumulated text after every token chunk so callers can render a partial
 * preview, then returns the final text on completion.
 *
 * Iterates the provider's model chain on transient failure, same as
 * `runOneShot`. Throws once every model has failed (or on auth failure).
 */
export async function runOneShotStream(
  provider: AiProvider,
  prompt: string,
  signal: AbortSignal,
  onChunk: (accumulated: string) => void,
  systemInstruction?: string,
  idleTimeoutMs?: number,
): Promise<string> {
  const chain = provider.chain();
  if (chain.length === 0) {
    throw new Error(`${provider.id}: no models configured`);
  }
  const attempts: { model: string; error: string }[] = [];
  for (const model of chain) {
    try {
      const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
      let text = '';
      let done = false;
      for await (const chunk of provider.chat(messages, model, signal, { systemInstruction, idleTimeoutMs })) {
        if (chunk.type === 'token') {
          text += chunk.text;
          onChunk(text);
        } else if (chunk.type === 'tool-call') {
          throw new Error(`provider emitted a tool-call chunk for a tools-less request`);
        } else if (chunk.type === 'done') {
          done = true;
          break;
        }
      }
      if (!done) throw new Error('stream ended without done chunk');
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ model, error: msg });
      if (provider.isAuthFailure(err)) break;
    }
  }
  const tried = attempts.map((a) => a.model).join(', ');
  const last = attempts[attempts.length - 1]?.error ?? 'unknown error';
  throw new Error(`all models failed (tried ${tried}); last error: ${last}`);
}
