import type { ChatMessage } from './provider';

export class ConversationState {
  messages: ChatMessage[] = [];
  lockedModel: string | null = null;

  appendUser(content: string): void {
    this.messages.push({ role: 'user', content });
  }

  appendAssistant(content: string, model: string): void {
    this.messages.push({ role: 'assistant', content, model } as ChatMessage & { model: string });
  }

  popLastUser(): void {
    const last = this.messages[this.messages.length - 1];
    if (last?.role === 'user') this.messages.pop();
  }

  reset(): void {
    this.messages = [];
    this.lockedModel = null;
  }

  setLock(model: string | null): void {
    this.lockedModel = model;
  }
}
