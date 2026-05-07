import type { AiProvider, ToolResult } from '../provider';
import type { Tool, ToolSpec } from '../catalog/types';
import type { ResolvedScope } from '../scope/types';
import { evaluate } from '../scope/evaluate';
import { ConversationState } from '../conversation';
import { serializeResult } from './serialize';
import { makeTranscript } from './transcript';

interface ScrollbackPushable {
  push(entry: unknown): void;
}

export interface DispatchLoopOptions {
  prompt: string;
  catalog: Tool[];           // already filtered by active scope at build time
  scope: ResolvedScope;      // re-checked per call
  conversation: ConversationState;
  provider: AiProvider;
  model: string;
  signal: AbortSignal;
  scrollback: ScrollbackPushable;
  maxRounds?: number;        // default 16
  maxResultBytes?: number;   // default 4096
}

export async function dispatchLoop(opts: DispatchLoopOptions): Promise<void> {
  const {
    prompt, catalog, scope, conversation, provider, model, signal,
    scrollback, maxRounds = 16, maxResultBytes,
  } = opts;

  const transcript = makeTranscript(scrollback);
  const tools: ToolSpec[] | undefined = catalog.length > 0
    ? catalog.map((t) => ({
        name: t.name, description: t.description, inputSchema: t.inputSchema,
      }))
    : undefined;

  conversation.appendUser(prompt);

  let toolResults: ToolResult[] | undefined;
  let round = 0;

  while (!signal.aborted) {
    if (round++ >= maxRounds) {
      transcript.status('warn', `tool-call iteration limit (${maxRounds}) reached`);
      break;
    }

    let assistantText = '';
    const pendingCalls: { id: string; name: string; arguments: unknown }[] = [];
    let finishReason: 'stop' | 'tool-calls' | 'length' | 'error' | undefined;

    for await (const chunk of provider.chat(
      conversation.messages, model, signal, { tools, toolResults },
    )) {
      if (chunk.type === 'token') {
        assistantText += chunk.text;
        transcript.token(chunk.text);
      } else if (chunk.type === 'tool-call') {
        pendingCalls.push(chunk);
        transcript.status('info', `→ ${chunk.name}(${transcript.preview(chunk.arguments)})`);
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

    toolResults = [];
    for (const call of pendingCalls) {
      if (signal.aborted) break;

      const decision = evaluate(scope, call.name);
      if (!decision.allowed) {
        const msg = decision.reason === 'blacklisted'
          ? `denied: blacklisted (matched ${decision.matchedPattern})`
          : `denied: not in whitelist`;
        transcript.status('warn', `× ${call.name}: ${msg}`);
        const r: ToolResult = { toolCallId: call.id, content: { error: msg } };
        toolResults.push(r);
        conversation.appendToolResult({ callId: call.id, content: r.content });
        continue;
      }

      const tool = catalog.find((t) => t.name === call.name);
      if (!tool) {
        const r: ToolResult = { toolCallId: call.id, content: { error: `unknown tool: ${call.name}` } };
        toolResults.push(r);
        conversation.appendToolResult({ callId: call.id, content: r.content });
        continue;
      }

      try {
        const result = await tool.run(call.arguments, { signal });
        const serialized = serializeResult(result, { maxBytes: maxResultBytes });
        transcript.status('info', `← ${call.name}: ${transcript.preview(serialized)}`);
        toolResults.push({ toolCallId: call.id, content: serialized });
        conversation.appendToolResult({ callId: call.id, content: serialized });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        transcript.status('error', `× ${call.name}: ${msg}`);
        const content = { error: msg };
        toolResults.push({ toolCallId: call.id, content });
        conversation.appendToolResult({ callId: call.id, content });
      }
    }
  }

  if (signal.aborted) {
    transcript.status('warn', 'aborted');
  }
}
