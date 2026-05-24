import type { AiProvider, ToolCallSpec, ToolResult } from '../provider';
import type { Tool, ToolSpec } from '../catalog/types';
import type { ResolvedScope } from '../scope/types';
import { evaluate } from '../scope/evaluate';
import { ConversationState } from '../conversation';
import { serializeResult } from './serialize';
import type { Transcript } from './transcript';

export interface DispatchLoopOptions {
  prompt: string;
  catalog: Tool[];           // already filtered by active scope at build time
  scope: ResolvedScope;      // re-checked per call
  conversation: ConversationState;
  provider: AiProvider;
  model: string;
  signal: AbortSignal;
  transcript: Transcript;
  maxRounds?: number;        // default 16
  maxResultBytes?: number;   // default 4096
  /** Sh3-ai-owned shared system instruction; forwarded to the provider on
   *  every round via `ChatOptions.systemInstruction`. */
  systemInstruction?: string;
  /** Forwarded to the provider via `ChatOptions.idleTimeoutMs` on every
   *  round. `0` or `undefined` disables the watchdog. */
  idleTimeoutMs?: number;
  /** Forwarded to the provider via `ChatOptions.temperature` on every
   *  round. `null` / `undefined` → API default. */
  temperature?: number | null;
  /** Whether to surface reasoning chunks via `transcript.reasoning`.
   *  When false, reasoning chunks are still accumulated for the next-round
   *  echo (DeepSeek `reasoning_content`, Claude signed thinking blocks)
   *  but not rendered. Defaults to true. */
  showReasoning?: boolean;
}

export async function dispatchLoop(opts: DispatchLoopOptions): Promise<void> {
  const {
    prompt, catalog, scope, conversation, provider, model, signal,
    transcript, maxRounds = 16, maxResultBytes, systemInstruction,
    idleTimeoutMs, temperature, showReasoning = true,
  } = opts;
  const tools: ToolSpec[] | undefined = catalog.length > 0
    ? catalog.map((t) => ({
        name: t.name, description: t.description, inputSchema: t.inputSchema,
      }))
    : undefined;

  conversation.appendUser(prompt);

  let toolCalls: ToolCallSpec[] | undefined;
  let toolResults: ToolResult[] | undefined;
  let reasoningContent: string | { text: string; providerBlocks?: unknown[] } | undefined;
  let round = 0;

  while (!signal.aborted) {
    if (round++ >= maxRounds) {
      transcript.status('warn', `tool-call iteration limit (${maxRounds}) reached`);
      break;
    }

    let assistantText = '';
    let assistantReasoning = '';
    const assistantReasoningBlocks: unknown[] = [];
    const pendingCalls: ToolCallSpec[] = [];
    let finishReason: 'stop' | 'tool-calls' | 'length' | 'error' | undefined;

    for await (const chunk of provider.chat(
      conversation.messages, model, signal,
      { tools, toolCalls, toolResults, reasoningContent, systemInstruction, idleTimeoutMs, temperature },
    )) {
      if (chunk.type === 'token') {
        assistantText += chunk.text;
        transcript.token(chunk.text);
      } else if (chunk.type === 'reasoning') {
        assistantReasoning += chunk.text;
        if (chunk.providerData !== undefined) {
          assistantReasoningBlocks.push(chunk.providerData);
        }
        if (showReasoning && chunk.text.length > 0) {
          transcript.reasoning(chunk.text);
        }
      } else if (chunk.type === 'tool-call') {
        pendingCalls.push({ id: chunk.id, name: chunk.name, arguments: chunk.arguments });
        transcript.toolCall({
          id: chunk.id,
          name: chunk.name,
          argsPreview: transcript.preview(chunk.arguments),
        });
      } else if (chunk.type === 'done') {
        finishReason = chunk.finishReason;
        break;
      }
    }

    if (assistantText) conversation.appendAssistant(assistantText, model);

    for (const call of pendingCalls) {
      conversation.appendToolCall({
        callId: call.id, name: call.name, arguments: call.arguments,
      });
    }

    if (finishReason !== 'tool-calls' || pendingCalls.length === 0) break;

    toolCalls = [...pendingCalls];
    toolResults = [];
    reasoningContent = assistantReasoningBlocks.length > 0
      ? { text: assistantReasoning, providerBlocks: assistantReasoningBlocks }
      : (assistantReasoning.length > 0 ? assistantReasoning : undefined);
    for (const call of pendingCalls) {
      if (signal.aborted) break;

      const decision = evaluate(scope, call.name);
      if (!decision.allowed) {
        const msg = decision.reason === 'blacklisted'
          ? `denied: blacklisted (matched ${decision.matchedPattern})`
          : `denied: not in whitelist`;
        transcript.toolResult({ id: call.id, resultPreview: msg, error: true });
        const r: ToolResult = { toolCallId: call.id, content: { error: msg } };
        toolResults.push(r);
        conversation.appendToolResult({ callId: call.id, content: r.content });
        continue;
      }

      const tool = catalog.find((t) => t.name === call.name);
      if (!tool) {
        const msg = `unknown tool: ${call.name}`;
        transcript.toolResult({ id: call.id, resultPreview: msg, error: true });
        const r: ToolResult = { toolCallId: call.id, content: { error: msg } };
        toolResults.push(r);
        conversation.appendToolResult({ callId: call.id, content: r.content });
        continue;
      }

      try {
        const result = await tool.run(call.arguments, { signal });
        const serialized = serializeResult(result, { maxBytes: maxResultBytes });
        transcript.toolResult({
          id: call.id,
          resultPreview: transcript.preview(serialized),
        });
        toolResults.push({ toolCallId: call.id, content: serialized });
        conversation.appendToolResult({ callId: call.id, content: serialized });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        transcript.toolResult({ id: call.id, resultPreview: msg, error: true });
        const content = { error: msg };
        toolResults.push({ toolCallId: call.id, content });
        conversation.appendToolResult({ callId: call.id, content });
      }
    }
  }

  if (signal.aborted) {
    transcript.status('warn', 'aborted');
  }
  transcript.complete();
}
