// Transcript abstraction for the dispatch loop. Two factories:
//   - makeTranscript(scrollback) — pushes raw scrollback entries directly
//     (used by unit tests and any caller holding a Scrollback handle).
//   - makeOutputTranscript(output) — bridges to a ShellModeOutput
//     (used by mode.ts so tool-call activity is rendered via the same
//     coalescing/streaming primitives as ordinary mode output).

interface ScrollbackPushable {
  push(entry: unknown): void;
}

interface OutputLike {
  text(stream: 'stdout' | 'stderr', chunk: string): void;
  status(level: 'info' | 'warn' | 'error', msg: string): void;
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

function makePreview(previewMax: number) {
  return (value: unknown) => {
    let s: string;
    try { s = typeof value === 'string' ? value : JSON.stringify(value); }
    catch { s = String(value); }
    if (s.length <= previewMax) return s;
    return `${s.slice(0, previewMax - 1)}…`;
  };
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
    preview: makePreview(previewMax),
  };
}

export function makeOutputTranscript(
  output: OutputLike,
  opts?: TranscriptOptions,
): Transcript {
  const previewMax = opts?.previewMax ?? 80;
  return {
    token(text) { output.text('stdout', text); },
    status(level, text) { output.status(level, text); },
    preview: makePreview(previewMax),
  };
}
