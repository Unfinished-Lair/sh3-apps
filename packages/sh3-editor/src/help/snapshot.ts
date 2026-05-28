export interface HelpSnapshot {
  activeAppId: string | null;
  focusedViewId: string | null;
  mountedViewIds: readonly string[];
  selection: { type: string; ref: unknown } | null;
  capturedAt: number;
}

let current: HelpSnapshot | null = null;
const subs = new Set<(s: HelpSnapshot | null) => void>();

export function getHelpSnapshot(): HelpSnapshot | null {
  return current;
}

export function setHelpSnapshot(snap: HelpSnapshot): void {
  current = snap;
  for (const cb of subs) cb(current);
}

export function clearHelpSnapshot(): void {
  if (current === null) return;
  current = null;
  for (const cb of subs) cb(null);
}

export function onHelpSnapshotChange(cb: (s: HelpSnapshot | null) => void): () => void {
  subs.add(cb);
  return () => { subs.delete(cb); };
}
