// Thin wrapper around vctx.scrollback.push so the dispatch loop reads
// linearly without scrollback boilerplate at every site. All entries
// reuse existing scrollback entry kinds; no new types needed in Phase 1.

interface ScrollbackPushable {
  push(entry: unknown): void;
}

interface TranscriptOptions {
  /** Length cap for inline previews (tool-call args, results). Default 80. */
  previewMax?: number;
}

export interface Transcript {
  /** Append a token-level chunk for streaming assistant text. */
  token(text: string): void;
  /** Status entry for tool-call activity (info/warn/error). */
  status(level: 'info' | 'warn' | 'error', text: string): void;
  /** Truncate a value for inline display (args, results). */
  preview(value: unknown): string;
}

export function makeTranscript(
  scrollback: ScrollbackPushable,
  opts?: TranscriptOptions,
): Transcript {
  const previewMax = opts?.previewMax ?? 80;
  let activeStream: { kind: 'text'; stream: 'stdout'; chunks: string[]; ts: number } | null = null;

  return {
    token(text: string) {
      if (activeStream) {
        activeStream.chunks.push(text);
      } else {
        activeStream = { kind: 'text', stream: 'stdout', chunks: [text], ts: Date.now() };
        scrollback.push(activeStream);
      }
    },
    status(level, text) {
      activeStream = null;
      scrollback.push({ kind: 'status', text, level, ts: Date.now() });
    },
    preview(value) {
      let s: string;
      try { s = typeof value === 'string' ? value : JSON.stringify(value); }
      catch { s = String(value); }
      if (s.length <= previewMax) return s;
      return `${s.slice(0, previewMax - 1)}…`;
    },
  };
}
