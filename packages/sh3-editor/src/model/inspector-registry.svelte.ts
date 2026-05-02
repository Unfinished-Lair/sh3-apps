import type { InspectorMeta, OpenInspectorOptions } from '../types';

export interface InspectorEntry {
  /** Reactive $state field (since 0.12.0). Mutating triggers $derived consumers
   *  that read entry.value, including the swap path used by bindInspector. */
  value: unknown;
  /** Reactive $state field (since 0.12.0). Same reactivity contract as `value`. */
  meta?: InspectorMeta;
  options: OpenInspectorOptions;
}

/** Backing store is a plain Map + a $state version counter. Reading get/has/list
 *  subscribes to the counter; every open/close mutation increments it, so consumers
 *  inside a $derived / $effect re-run. The new bumpVersion() method (since 0.12.0)
 *  lets external mutators (e.g. the bindInspector replace closure) signal swaps that
 *  do not change the entry identity but still need consumers to re-derive. */
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
    const entry = $state<InspectorEntry>({
      value: opts.value,
      meta: opts.meta,
      options: opts,
    });
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

  /** Force consumers of `get` / `has` / `list` to re-evaluate without changing
   *  the stored entries. Used by external mutators (bindInspector's replace
   *  closure) for swap operations whose visible effect is on `entry.value` /
   *  `entry.meta` — the $state fields handle most consumers, but anyone keying
   *  off `reg.get(id)` identity needs a nudge. */
  bumpVersion(): void {
    this.version++;
  }

  clear(): void {
    const ids = [...this.entries.keys()];
    this.entries.clear();
    if (ids.length > 0) this.version++;
    if (this.onClose) for (const id of ids) this.onClose(id);
  }
}
