import type { EditorApi, EditorDocument, OpenDocumentOptions } from '../types';
import { InstanceRegistry } from './instance-registry';

type Callback<T extends unknown[]> = (...args: T) => void;

class EventBus<T extends unknown[]> {
  private listeners = new Set<Callback<T>>();

  on(cb: Callback<T>): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  emit(...args: T): void {
    for (const cb of this.listeners) cb(...args);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export interface ApiInternals {
  emitSave(id: string): void;
  contentChange: EventBus<[string, string]>;
  dirtyChange: EventBus<[string, boolean]>;
  saveEvent: EventBus<[string]>;
}

export function createApi(registry: InstanceRegistry): { api: EditorApi; internals: ApiInternals } {
  const contentChange = new EventBus<[string, string]>();
  const dirtyChange = new EventBus<[string, boolean]>();
  const saveEvent = new EventBus<[string]>();

  const api: EditorApi = {
    getContent(instanceId: string): string | null {
      const entry = registry.get(instanceId);
      return entry ? entry.document.content : null;
    },

    isDirty(instanceId: string): boolean {
      const entry = registry.get(instanceId);
      return entry ? entry.document.dirty : false;
    },

    getDocument(instanceId: string): EditorDocument | null {
      const entry = registry.get(instanceId);
      return entry ? entry.document : null;
    },

    listInstances(): string[] {
      return registry.list();
    },

    openDocument(id: string, opts: OpenDocumentOptions): void {
      registry.open(id, opts);
    },

    closeDocument(id: string): void {
      registry.close(id);
    },

    updateContent(id: string, content: string, cursorStart: number, cursorEnd: number): void {
      const entry = registry.get(id);
      if (!entry) return;

      const doc = entry.document;
      const before = doc.content;
      if (before === content) return;

      entry.history.push(before, content, doc.cursorStart, cursorStart);
      doc.content = content;
      doc.cursorStart = cursorStart;
      doc.cursorEnd = cursorEnd;

      const wasDirty = doc.dirty;
      doc.dirty = true;
      contentChange.emit(id, content);
      if (!wasDirty) dirtyChange.emit(id, true);
    },

    markClean(id: string): void {
      const entry = registry.get(id);
      if (!entry) return;
      if (entry.document.dirty) {
        entry.document.dirty = false;
        dirtyChange.emit(id, false);
      }
    },

    onContentChange(callback: (id: string, content: string) => void): () => void {
      return contentChange.on(callback);
    },

    onDirtyChange(callback: (id: string, dirty: boolean) => void): () => void {
      return dirtyChange.on(callback);
    },

    onSave(callback: (id: string) => void): () => void {
      return saveEvent.on(callback);
    },
  };

  const internals: ApiInternals = {
    emitSave(id: string): void {
      saveEvent.emit(id);
    },
    contentChange,
    dirtyChange,
    saveEvent,
  };

  return { api, internals };
}
