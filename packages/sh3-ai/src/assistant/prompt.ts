import type { FieldKind } from 'sh3-core';

export const PER_FIELD_CHAR_CAP = 8000;
export const TRUNCATION_MARKER = '\n…[truncated]';

export interface ContextEntry {
  shardId: string;
  slotId?: string;
  fieldId: string;
  label: string;
  kind: FieldKind;
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

export function formatValue(raw: unknown, kind: FieldKind): string {
  let s: string;
  if (kind === 'json') {
    s = JSON.stringify(raw, null, 2);
  } else {
    s = String(raw);
  }
  return truncate(s, PER_FIELD_CHAR_CAP);
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
      lines.push(`[${c.label}] (${c.shardId})`);
      lines.push(formatValue(c.value, c.kind));
      lines.push('');
    }
  }
  lines.push('--- ORIGINAL ---', input.original, '--- INSTRUCTION ---', input.instruction);
  return lines.join('\n');
}
