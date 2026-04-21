import type { InspectorMeta, OpenInspectorOptions } from '../types';

export interface InspectorEntry {
  value: unknown;
  meta?: InspectorMeta;
  options: OpenInspectorOptions;
}

/** Backing store is a plain Map + a $state version counter. Reading get/has/list
 *  subscribes to the counter; every mutation increments it, so consumers inside
 *  a $derived / $effect re-run. $state compiles to svelte/internal/client calls
 *  (which stay external at artifact build time against the host), so the signal
 *  graph is shared with the components that render the registry's values. */
export class InspectorRegistry {
  private entries = new Map<string, InspectorEntry>();
  private version = $state(0);
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
    this.version++;
    return entry;
  }

  close(id: string): boolean {
    const had = this.entries.delete(id);
    if (had) {
      this.version++;
      if (this.onClose) this.onClose(id);
    }
    return had;
  }

  get(id: string): InspectorEntry | undefined {
    this.version;  // subscribe
    return this.entries.get(id);
  }

  has(id: string): boolean {
    this.version;
    return this.entries.has(id);
  }

  list(): string[] {
    this.version;
    return [...this.entries.keys()];
  }

  clear(): void {
    const ids = [...this.entries.keys()];
    this.entries.clear();
    if (ids.length > 0) this.version++;
    if (this.onClose) for (const id of ids) this.onClose(id);
  }
}
