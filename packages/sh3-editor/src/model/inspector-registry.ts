import type { InspectorMeta, OpenInspectorOptions } from '../types';
import { SvelteMap } from 'svelte/reactivity';

export interface InspectorEntry {
  value: unknown;
  meta?: InspectorMeta;
  options: OpenInspectorOptions;
}

export class InspectorRegistry {
  private entries = new SvelteMap<string, InspectorEntry>();
  private onClose?: (id: string) => void;

  constructor(onClose?: (id: string) => void) {
    this.onClose = onClose;
  }

  open(id: string, opts: OpenInspectorOptions): InspectorEntry {
    const existing = this.entries.get(id);
    if (existing) return existing;
    const entry: InspectorEntry = {
      value: opts.value,
      meta: opts.meta,
      options: opts,
    };
    this.entries.set(id, entry);
    return entry;
  }

  close(id: string): boolean {
    const had = this.entries.delete(id);
    if (had && this.onClose) this.onClose(id);
    return had;
  }

  get(id: string): InspectorEntry | undefined {
    return this.entries.get(id);
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  list(): string[] {
    return [...this.entries.keys()];
  }

  clear(): void {
    const ids = [...this.entries.keys()];
    this.entries.clear();
    if (this.onClose) for (const id of ids) this.onClose(id);
  }
}
