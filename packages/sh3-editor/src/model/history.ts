import type { HistoryEntry, HistoryResult } from '../types';

const COALESCE_MS = 300;
const DEFAULT_MAX_DEPTH = 200;

export class HistoryEngine {
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private maxDepth: number;

  constructor(maxDepth: number = DEFAULT_MAX_DEPTH) {
    this.maxDepth = maxDepth;
  }

  /**
   * Record a content change. Consecutive single-character edits within
   * COALESCE_MS are merged into one undo entry.
   */
  push(before: string, after: string, cursorBefore: number, cursorAfter: number): void {
    const now = Date.now();
    const last = this.undoStack[this.undoStack.length - 1];

    const isSingleChar = Math.abs(after.length - before.length) <= 1;
    if (last && isSingleChar && (now - last.timestamp) < COALESCE_MS) {
      last.after = after;
      last.cursorAfter = cursorAfter;
      last.timestamp = now;
      this.redoStack.length = 0;
      return;
    }

    this.undoStack.push({ before, after, cursorBefore, cursorAfter, timestamp: now });
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    this.redoStack.length = 0;
  }

  undo(): HistoryResult | null {
    const entry = this.undoStack.pop();
    if (!entry) return null;
    this.redoStack.push(entry);
    return { content: entry.before, cursor: entry.cursorBefore };
  }

  redo(): HistoryResult | null {
    const entry = this.redoStack.pop();
    if (!entry) return null;
    this.undoStack.push(entry);
    return { content: entry.after, cursor: entry.cursorAfter };
  }

  clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
