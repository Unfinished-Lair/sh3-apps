import { HistoryEngine } from './history';
import type { HistoryCommand } from '../types';

export interface TextSwapSnapshot {
  before: string;
  after: string;
  cursorBefore: number;
  cursorAfter: number;
}

export interface CreateTextSwapCommandOptions {
  setter: (content: string, cursor: number) => void;
  before: string;
  after: string;
  cursorBefore: number;
  cursorAfter: number;
  now?: number;
}

/** Build a HistoryCommand that swaps document content + cursor via `setter`.
 *  The command is used by the text editor's pushContent / undo / redo paths
 *  and by replaceTop during coalescing. Snapshot is attached on meta so the
 *  coalescing caller can rebuild a merged successor. */
export function createTextSwapCommand(opts: CreateTextSwapCommandOptions): HistoryCommand {
  const { setter, before, after, cursorBefore, cursorAfter, now } = opts;
  const snapshot: TextSwapSnapshot = { before, after, cursorBefore, cursorAfter };
  return {
    apply: () => setter(after, cursorAfter),
    revert: () => setter(before, cursorBefore),
    meta: {
      kind: 'text-swap',
      timestamp: now,
      snapshot,
    },
  };
}

export class HistoryRegistry {
  private engines = new Map<string, HistoryEngine>();

  get(id: string): HistoryEngine {
    let e = this.engines.get(id);
    if (!e) {
      e = new HistoryEngine();
      this.engines.set(id, e);
    }
    return e;
  }

  release(id: string): void {
    this.engines.delete(id);
  }

  clear(): void {
    this.engines.clear();
  }
}
