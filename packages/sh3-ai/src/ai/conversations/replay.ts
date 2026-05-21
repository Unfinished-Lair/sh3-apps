import type { Scrollback } from 'sh3-core';
import ResponseCard from '../ResponseCard.svelte';
import type { CardSegment } from '../ResponseCard.types';
import type {
  ConversationDocument,
  PersistedToolCall,
  PersistedToolResult,
} from './types';

const PREVIEW_MAX = 80;

function preview(value: unknown): string {
  let s: string;
  try {
    s = typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    s = String(value);
  }
  if (s.length <= PREVIEW_MAX) return s;
  return `${s.slice(0, PREVIEW_MAX - 1)}…`;
}

function segmentsForAssistant(
  messageIndex: number,
  text: string,
  toolCalls: PersistedToolCall[],
  toolResults: PersistedToolResult[],
): CardSegment[] {
  const segments: CardSegment[] = [];
  if (text.length > 0) segments.push({ kind: 'text', markdown: text });
  for (const call of toolCalls) {
    if (call.messageIndex !== messageIndex) continue;
    const result = toolResults.find(
      (r) => r.messageIndex === messageIndex && r.callId === call.callId,
    );
    let resultPreview: string | undefined;
    let error = false;
    if (result) {
      if (typeof result.content === 'string') {
        resultPreview = preview(result.content);
      } else {
        resultPreview = preview(result.content.error);
        error = true;
      }
    }
    segments.push({
      kind: 'tool-call',
      id: call.callId,
      name: call.name,
      argsPreview: preview(call.arguments),
      resultPreview,
      error,
    });
  }
  return segments;
}

/** Push prompt + assistant entries reconstructing the saved conversation
 *  into the local terminal scrollback. Caller is responsible for clearing
 *  first if a clean rehydration is desired. */
export function replayConversationToScrollback(
  doc: ConversationDocument,
  scrollback: Scrollback,
  cwd: string,
): void {
  const ts = doc.updatedAt;
  doc.messages.forEach((msg, index) => {
    if (msg.role === 'user') {
      scrollback.push({ kind: 'prompt', cwd, line: msg.content, ts });
      return;
    }
    const segments = segmentsForAssistant(
      index,
      msg.content,
      doc.toolCalls,
      doc.toolResults,
    );
    if (segments.length === 0) return;
    scrollback.push({
      kind: 'rich',
      component: ResponseCard,
      props: {
        segments,
        model: msg.model || null,
        locked: false,
        __streamState: 'complete',
        __aiCard: true,
      },
      ts,
    });
  });
}
