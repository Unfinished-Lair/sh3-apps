import type { ChatMessage } from './provider';

export class ConversationState {
  messages: ChatMessage[] = [];
  lockedModel: string | null = null;

  readonly toolCalls: Array<{
    messageIndex: number;
    callId: string;
    name: string;
    arguments: unknown;
  }> = [];

  readonly toolResults: Array<{
    messageIndex: number;
    callId: string;
    content: string | { error: string };
  }> = [];

  appendUser(content: string): void {
    this.messages.push({ role: 'user', content });
  }

  appendAssistant(content: string, model: string): void {
    this.messages.push({ role: 'assistant', content, model } as ChatMessage & { model: string });
  }

  appendToolCall(call: { callId: string; name: string; arguments: unknown }): void {
    // Tied to the assistant message that announced the call (the one just appended).
    this.toolCalls.push({
      messageIndex: this.messages.length - 1,
      ...call,
    });
  }

  appendToolResult(result: { callId: string; content: string | { error: string } }): void {
    this.toolResults.push({
      messageIndex: this.messages.length - 1,
      ...result,
    });
  }

  popLastUser(): void {
    const last = this.messages[this.messages.length - 1];
    if (last?.role === 'user') this.messages.pop();
  }

  reset(): void {
    this.messages = [];
    this.lockedModel = null;
    this.toolCalls.length = 0;
    this.toolResults.length = 0;
  }

  setLock(model: string | null): void {
    this.lockedModel = model;
  }
}
