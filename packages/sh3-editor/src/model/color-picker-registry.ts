import type { OpenColorPickerOptions } from '../types';
import { normalizeHex } from '../util/color';
import { SvelteMap } from 'svelte/reactivity';

export interface ColorPickerEntry {
  value: string;                  // always a normalized hex: '#rrggbb'
  options: OpenColorPickerOptions;
}

/** Parallel to InspectorRegistry: open/get/close/list over in-memory entries.
 *  Value normalization applies on open; invalid hex falls back to #000000. */
export class ColorPickerRegistry {
  private entries = new SvelteMap<string, ColorPickerEntry>();
  private onClose?: (id: string) => void;

  constructor(onClose?: (id: string) => void) {
    this.onClose = onClose;
  }

  open(id: string, opts: OpenColorPickerOptions): ColorPickerEntry {
    const existing = this.entries.get(id);
    if (existing) return existing;
    const normalized = normalizeHex(opts.value) ?? '#000000';
    const entry: ColorPickerEntry = {
      value: normalized,
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

  get(id: string): ColorPickerEntry | undefined {
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
