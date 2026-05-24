// Transcript abstraction for the dispatch loop.
//
// The dispatch loop emits four kinds of activity:
//   - assistant tokens (streaming MD text)
//   - tool calls (LLM-issued, before result arrives)
//   - tool results (after run() returns / errors / is denied)
//   - status entries (loop-level: iteration limit, abort)
//
// Two factories materialize that activity:
//   - makeTranscript(scrollback) — folds tokens into a coalescing text entry
//     and pushes status-shaped entries for tool activity. Used by tests and
//     any caller holding a raw Scrollback handle.
//   - makeOutputTranscript(output, opts) — drives a single streaming
//     ResponseCard per turn so MD renders properly and tool calls appear
//     inline as compact rows. Used by mode.ts.
//
// Both honor the same `Transcript` interface so dispatchLoop is unaware of
// which one it's talking to.

import ResponseCard from '../ResponseCard.svelte';
import type { CardSegment } from '../ResponseCard.types';
import type { ShellModeOutput, StreamHandle } from 'sh3-core';

interface ScrollbackPushable {
  push(entry: unknown): void;
}

interface TranscriptOptions {
  /** Length cap for inline previews (tool-call args, results). Default 80. */
  previewMax?: number;
}

interface OutputTranscriptOptions extends TranscriptOptions {
  /** Model id rendered in the card header. */
  model: string;
  /** Whether the conversation is locked to a single model. */
  locked?: boolean;
}

export interface Transcript {
  /** Append a token-level chunk for streaming assistant text. */
  token(text: string): void;
  /** A tool call has been issued by the LLM but not yet executed. */
  toolCall(call: { id: string; name: string; argsPreview: string }): void;
  /** A tool call's result (or denial / error) is in. */
  toolResult(result: { id: string; resultPreview: string; error?: boolean }): void;
  /** Loop-level status entry (warn / error). NOT used for tool activity. */
  status(level: 'info' | 'warn' | 'error', text: string): void;
  /** Streaming reasoning chunk (Claude extended thinking, DeepSeek
   *  reasoning_content). Implementations decide how to surface it; the
   *  dispatch loop gates this call on the user's Show Reasoning toggle. */
  reasoning(text: string): void;
  /** Truncate a value for inline display. */
  preview(value: unknown): string;
  /** The dispatch turn finished cleanly. */
  complete(): void;
  /** The dispatch turn failed at the loop level. Tool-run errors don't go
   *  here — they're surfaced via toolResult. */
  error(err: unknown): void;
}

function makePreview(previewMax: number) {
  return (value: unknown) => {
    let s: string;
    try {
      s = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
      s = String(value);
    }
    if (s.length <= previewMax) return s;
    return `${s.slice(0, previewMax - 1)}…`;
  };
}

export function makeTranscript(
  scrollback: ScrollbackPushable,
  opts?: TranscriptOptions,
): Transcript {
  const previewMax = opts?.previewMax ?? 80;
  let activeStream:
    | { kind: 'text'; stream: 'stdout'; chunks: string[]; ts: number }
    | null = null;

  return {
    token(text) {
      if (activeStream) {
        activeStream.chunks.push(text);
      } else {
        activeStream = { kind: 'text', stream: 'stdout', chunks: [text], ts: Date.now() };
        scrollback.push(activeStream);
      }
    },
    toolCall({ name, argsPreview }) {
      activeStream = null;
      scrollback.push({
        kind: 'status',
        level: 'info',
        text: `→ ${name}(${argsPreview})`,
        ts: Date.now(),
      });
    },
    toolResult({ resultPreview, error }) {
      activeStream = null;
      scrollback.push({
        kind: 'status',
        level: error ? 'error' : 'info',
        text: error ? `× ${resultPreview}` : `← ${resultPreview}`,
        ts: Date.now(),
      });
    },
    status(level, text) {
      activeStream = null;
      scrollback.push({ kind: 'status', text, level, ts: Date.now() });
    },
    reasoning(text) {
      activeStream = null;
      scrollback.push({
        kind: 'status',
        level: 'info',
        text: `⌄ ${text}`,
        ts: Date.now(),
      });
    },
    preview: makePreview(previewMax),
    complete() {},
    error() {},
  };
}

export function makeOutputTranscript(
  output: ShellModeOutput,
  opts: OutputTranscriptOptions,
): Transcript {
  const previewMax = opts.previewMax ?? 80;
  const segments: CardSegment[] = [];
  let handle: StreamHandle | null = null;
  let finalized = false;

  const ensureStream = () => {
    if (handle) return;
    handle = output.stream(ResponseCard, {
      segments: [...segments],
      markdown: undefined,
      model: opts.model,
      locked: !!opts.locked,
      __aiCard: true,
    });
  };

  const push = () => {
    ensureStream();
    handle!.append({ segments: [...segments] });
  };

  const ensureTextSegment = () => {
    const tail = segments[segments.length - 1];
    if (tail && tail.kind === 'text') return tail;
    const seg: CardSegment = { kind: 'text', markdown: '' };
    segments.push(seg);
    return seg;
  };

  return {
    token(text) {
      const seg = ensureTextSegment();
      if (seg.kind !== 'text') return; // narrowing for TS — unreachable
      seg.markdown += text;
      // Replace the segment object so Svelte sees a new identity.
      segments[segments.length - 1] = { kind: 'text', markdown: seg.markdown };
      push();
    },
    toolCall({ id, name, argsPreview }) {
      segments.push({ kind: 'tool-call', id, name, argsPreview });
      push();
    },
    toolResult({ id, resultPreview, error }) {
      // Find the matching pending tool-call and replace it in place.
      for (let i = segments.length - 1; i >= 0; i--) {
        const seg = segments[i];
        if (seg.kind === 'tool-call' && seg.id === id) {
          segments[i] = { ...seg, resultPreview, error };
          break;
        }
      }
      push();
    },
    reasoning(text) {
      const tail = segments[segments.length - 1];
      if (tail && tail.kind === 'reasoning') {
        const merged: CardSegment = { kind: 'reasoning', markdown: tail.markdown + text };
        segments[segments.length - 1] = merged;
      } else {
        segments.push({ kind: 'reasoning', markdown: text });
      }
      push();
    },
    status(level, text) {
      // Loop-level status — surface outside the card so it's clearly distinct
      // from tool-call activity (which lives inside the card).
      output.status(level, text);
    },
    preview: makePreview(previewMax),
    complete() {
      if (finalized) return;
      finalized = true;
      handle?.complete();
    },
    error(err) {
      if (finalized) return;
      finalized = true;
      handle?.error(err);
    },
  };
}
