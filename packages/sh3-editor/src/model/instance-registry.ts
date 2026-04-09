import type { EditorDocument, OpenDocumentOptions } from '../types';
import { HistoryEngine } from './history';

export interface RegistryEntry {
  document: EditorDocument;
  history: HistoryEngine;
  options: OpenDocumentOptions;
}

export class InstanceRegistry {
  private entries = new Map<string, RegistryEntry>();

  open(id: string, opts: OpenDocumentOptions): RegistryEntry {
    if (this.entries.has(id)) {
      return this.entries.get(id)!;
    }

    const document: EditorDocument = {
      id,
      content: opts.content,
      filePath: opts.filePath ?? null,
      cursorStart: 0,
      cursorEnd: 0,
      scrollTop: 0,
      scrollLeft: 0,
      dirty: false,
      language: opts.language ?? null,
    };

    const entry: RegistryEntry = {
      document,
      history: new HistoryEngine(),
      options: opts,
    };

    this.entries.set(id, entry);
    return entry;
  }

  close(id: string): boolean {
    return this.entries.delete(id);
  }

  get(id: string): RegistryEntry | undefined {
    return this.entries.get(id);
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  list(): string[] {
    return [...this.entries.keys()];
  }

  clear(): void {
    this.entries.clear();
  }
}
