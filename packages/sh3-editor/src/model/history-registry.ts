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

export interface EditBatchSnapshot {
  before: string;
  after: string;
  cursorBefore: number;
  cursorEndBefore: number;
  cursorAfter: number;
  cursorEndAfter: number;
}

export interface CreateEditBatchCommandOptions {
  setter: (content: string, cursorStart: number, cursorEnd: number) => void;
  before: string;
  after: string;
  cursorBefore: number;
  cursorEndBefore: number;
  cursorAfter: number;
  cursorEndAfter: number;
  meta?: { kind?: string; label?: string; coalesceKey?: string };
  internalCoalesceKey?: string;
  now?: number;
}

/** Builds a HistoryCommand that applies / reverts a submitted edit batch.
 *  Sibling of createTextSwapCommand; kept distinct so meta.kind cleanly
 *  separates user-typing (text-swap) from contributor submits (edit-batch)
 *  for any future history-inspector UI, and so the coalesce predicate
 *  only matches on edit-batch entries. */
export function createEditBatchCommand(opts: CreateEditBatchCommandOptions): HistoryCommand {
  const snapshot: EditBatchSnapshot = {
    before: opts.before,
    after: opts.after,
    cursorBefore: opts.cursorBefore,
    cursorEndBefore: opts.cursorEndBefore,
    cursorAfter: opts.cursorAfter,
    cursorEndAfter: opts.cursorEndAfter,
  };
  return {
    apply:  () => opts.setter(opts.after,  opts.cursorAfter,  opts.cursorEndAfter),
    revert: () => opts.setter(opts.before, opts.cursorBefore, opts.cursorEndBefore),
    meta: {
      kind: 'edit-batch',
      label: opts.meta?.label,
      submittedKind: opts.meta?.kind,
      coalesceKey: opts.meta?.coalesceKey,
      internalCoalesceKey: opts.internalCoalesceKey,
      timestamp: opts.now,
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
