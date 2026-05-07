import type { ChatMessage } from './provider';
import type { AutosaveController } from 'sh3-core';
import type {
  ConversationDocument,
  PersistedMessage,
  PersistedToolCall,
  PersistedToolResult,
} from './conversations/types';
import { serializeConversation } from './conversations/serialize';

export class ConversationState {
  messages: ChatMessage[] = [];
  lockedModel: string | null = null;

  readonly toolCalls: PersistedToolCall[] = [];
  readonly toolResults: PersistedToolResult[] = [];

  /** Bound conversation id; null when in-memory only (rare — usually
   *  the shard binds immediately after creation). */
  id: string | null = null;
  title: string = '';
  createdAt: number = 0;
  /** Snapshot of the provider id at last persisted turn. */
  providerId: string | null = null;

  private autosave: AutosaveController | null = null;

  appendUser(content: string): void {
    this.messages.push({ role: 'user', content });
    this.persistIfBound();
  }

  appendAssistant(content: string, model: string): void {
    this.messages.push({ role: 'assistant', content, model } as ChatMessage & { model: string });
    this.persistIfBound();
  }

  appendToolCall(call: { callId: string; name: string; arguments: unknown }): void {
    this.toolCalls.push({
      messageIndex: this.messages.length - 1,
      ...call,
    });
    this.persistIfBound();
  }

  appendToolResult(result: { callId: string; content: string | { error: string } }): void {
    this.toolResults.push({
      messageIndex: this.messages.length - 1,
      ...result,
    });
    this.persistIfBound();
  }

  popLastUser(): void {
    const last = this.messages[this.messages.length - 1];
    if (last?.role === 'user') {
      this.messages.pop();
      this.persistIfBound();
    }
  }

  /** Clear in-memory state. Used by `detach` and (legacy) callers
   *  outside a binding context. Does NOT delete the underlying doc. */
  reset(): void {
    this.messages = [];
    this.lockedModel = null;
    this.toolCalls.length = 0;
    this.toolResults.length = 0;
    // No persistIfBound — reset is also called by detach which has
    // already disposed the autosave controller.
  }

  setLock(model: string | null): void {
    this.lockedModel = model;
    // Lock changes don't change the document yet (model is snapshotted
    // at turn time); persist anyway for visibility on reload.
    this.persistIfBound();
  }

  /** Swap in a conversation document. Replaces in-memory contents and
   *  starts autosaving via the supplied controller. Detaches any prior
   *  binding without writing to it. */
  bindTo(doc: ConversationDocument, autosave: AutosaveController): void {
    if (this.autosave) {
      // Discard previous controller — caller is responsible for prior
      // doc's lifecycle. We do NOT dispose, since dispose() flushes; we
      // just drop our reference.
      this.autosave = null;
    }
    this.id = doc.id;
    this.title = doc.title;
    this.createdAt = doc.createdAt;
    this.providerId = doc.providerId;
    this.lockedModel = doc.model;
    this.messages = doc.messages.map(messageFromPersisted);
    this.toolCalls.length = 0;
    this.toolCalls.push(...doc.toolCalls);
    this.toolResults.length = 0;
    this.toolResults.push(...doc.toolResults);
    this.autosave = autosave;
  }

  /** Stop autosaving and clear the binding. Does NOT clear in-memory
   *  contents (caller usually proceeds to bindTo a new doc, or to
   *  reset). Disposes the controller (flushing pending writes). */
  detach(): void {
    if (this.autosave) {
      // Fire-and-forget: dispose returns a Promise we don't await; the
      // controller's debounce window is small and shard deactivate
      // will await its own dispose anyway.
      void this.autosave.dispose();
      this.autosave = null;
    }
    this.id = null;
    this.title = '';
    this.createdAt = 0;
    this.providerId = null;
  }

  private persistIfBound(): void {
    if (!this.autosave || !this.id) return;
    this.autosave.update(serializeConversation(this.toDocument()));
  }

  toDocument(): ConversationDocument {
    if (!this.id) throw new Error('ConversationState is not bound to a document');
    return {
      id: this.id,
      version: 1,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: Date.now(),
      providerId: this.providerId,
      model: this.lockedModel,
      messages: this.messages.map(messageToPersisted),
      toolCalls: [...this.toolCalls],
      toolResults: [...this.toolResults],
    };
  }
}

function messageToPersisted(m: ChatMessage): PersistedMessage {
  if (m.role === 'assistant') {
    const model = (m as ChatMessage & { model?: string }).model ?? '';
    return { role: 'assistant', content: m.content, model };
  }
  return { role: 'user', content: m.content };
}

function messageFromPersisted(m: PersistedMessage): ChatMessage {
  if (m.role === 'assistant') {
    return { role: 'assistant', content: m.content, model: m.model } as ChatMessage & { model: string };
  }
  return { role: 'user', content: m.content };
}
