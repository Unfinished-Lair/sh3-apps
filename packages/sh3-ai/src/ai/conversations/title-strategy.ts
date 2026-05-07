const DEFAULT_MAX = 60;

/** Truncate the first user message into a conversation title.
 *  Pure; no I/O. */
export function firstMessageTitle(text: string, max = DEFAULT_MAX): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length === 0) return 'Untitled';
  if (collapsed.length <= max) return collapsed;
  return `${collapsed.slice(0, max - 1)}…`;
}

/** Async strategy that asks the active provider to summarize the
 *  first turn into a title. Falls back to `firstMessageTitle(firstUser)`
 *  on any error or empty response. The `ask` callback is the shard's
 *  one-shot helper bound to the current provider. */
export async function llmSummarizeTitle(
  ask: (prompt: string, signal: AbortSignal) => Promise<string>,
  firstUserMsg: string,
  firstAssistantMsg: string,
  signal: AbortSignal,
  max = DEFAULT_MAX,
): Promise<string> {
  const prompt = [
    `Generate a concise title (≤${max} chars) summarising the conversation below.`,
    'Reply with ONLY the title, no quotes, no trailing punctuation, no preamble.',
    '',
    'USER:',
    firstUserMsg,
    '',
    'ASSISTANT:',
    firstAssistantMsg,
  ].join('\n');

  let raw: string;
  try {
    raw = await ask(prompt, signal);
  } catch {
    return firstMessageTitle(firstUserMsg, max);
  }
  const cleaned = cleanTitle(raw, max);
  return cleaned.length > 0 ? cleaned : firstMessageTitle(firstUserMsg, max);
}

function cleanTitle(raw: string, max: number): string {
  let s = raw.trim();
  // Strip surrounding quotes.
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  // Strip trailing punctuation (single char only — preserves "C++").
  s = s.replace(/[.!?,;:]+$/, '');
  // Collapse internal whitespace (incl. newlines).
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length > max) s = `${s.slice(0, max - 1)}…`;
  return s;
}
