import type { FieldKind } from 'sh3-core';

export const PER_CONTEXT_CHAR_CAP = 8000;
export const TRUNCATION_MARKER = '\n…[truncated]';

export type ContextOrigin = 'field' | 'source' | 'document';

export interface ContextEntry {
  origin: ContextOrigin;
  /** Prompt-displayed identifier. Per-origin format:
   *  - field: '<shardId>:<fieldId>' (slot omitted from the header for
   *    brevity; the full slot tuple is still tracked by SelectedEntry).
   *  - source: '<id>' (already shardId-prefixed by convention).
   *  - document: '<shardId>:<path>'. */
  originKey: string;
  label: string;
  kind: ContextKind;
  value: unknown;
}

export interface BuildPromptInput {
  original: string;
  instruction: string;
  contexts: ContextEntry[];
}

export function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + TRUNCATION_MARKER;
}

export type ContextKind = 'text' | 'markdown' | FieldKind;

function fenceFor(kind: ContextKind): string | null {
  if (kind === 'markdown') return 'markdown';
  if (kind === 'json') return 'json';
  return null;
}

export function formatValue(raw: unknown, kind: ContextKind): string {
  let body: string;
  if (kind === 'json') {
    body = JSON.stringify(raw, null, 2);
  } else {
    body = String(raw);
  }
  const truncated = truncate(body, PER_CONTEXT_CHAR_CAP);
  const fence = fenceFor(kind);
  return fence ? `\`\`\`${fence}\n${truncated}\n\`\`\`` : truncated;
}

export function buildPrompt(input: BuildPromptInput): string {
  const lines: string[] = [
    "Rewrite the following text per the user's instruction.",
    'Return ONLY the rewritten text, no commentary.',
    '',
  ];
  if (input.contexts.length > 0) {
    lines.push('--- CONTEXT ---');
    for (const c of input.contexts) {
      lines.push(`[${c.label}] (${c.origin}:${c.originKey})`);
      lines.push(formatValue(c.value, c.kind));
      lines.push('');
    }
  }
  lines.push('--- ORIGINAL ---', input.original, '--- INSTRUCTION ---', input.instruction);
  return lines.join('\n');
}
