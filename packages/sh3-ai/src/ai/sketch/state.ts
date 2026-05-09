export type RenderMode = 'inline' | 'isolated';

export interface SketchSnapshot {
  html: string;
  mode: RenderMode;
}

export class SketchState {
  private snapshot: SketchSnapshot | null = null;
  private listeners = new Set<(s: SketchSnapshot | null) => void>();

  get current(): SketchSnapshot | null {
    return this.snapshot;
  }

  set(snapshot: SketchSnapshot): void {
    this.snapshot = { html: snapshot.html, mode: snapshot.mode };
    for (const fn of this.listeners) fn(this.snapshot);
  }

  clear(): void {
    this.snapshot = null;
    for (const fn of this.listeners) fn(null);
  }

  subscribe(fn: (s: SketchSnapshot | null) => void): () => void {
    this.listeners.add(fn);
    fn(this.snapshot);
    return () => {
      this.listeners.delete(fn);
    };
  }
}
