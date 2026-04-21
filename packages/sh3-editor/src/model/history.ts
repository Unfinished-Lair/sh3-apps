import type { HistoryCommand } from '../types';

const DEFAULT_MAX_DEPTH = 200;

export class HistoryEngine {
  private undoStack: HistoryCommand[] = [];
  private redoStack: HistoryCommand[] = [];
  private maxDepth: number;
  private listeners = new Set<() => void>();

  constructor(maxDepth: number = DEFAULT_MAX_DEPTH) {
    this.maxDepth = maxDepth;
  }

  push(cmd: HistoryCommand): void {
    if (cmd.meta && cmd.meta.timestamp == null) {
      cmd.meta.timestamp = Date.now();
    } else if (!cmd.meta) {
      cmd.meta = { timestamp: Date.now() };
    }
    this.undoStack.push(cmd);
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    this.redoStack.length = 0;
    this.emit();
  }

  undo(): boolean {
    const cmd = this.undoStack.pop();
    if (!cmd) return false;
    cmd.revert();
    this.redoStack.push(cmd);
    this.emit();
    return true;
  }

  redo(): boolean {
    const cmd = this.redoStack.pop();
    if (!cmd) return false;
    cmd.apply();
    this.undoStack.push(cmd);
    this.emit();
    return true;
  }

  peek(): HistoryCommand | null {
    return this.undoStack[this.undoStack.length - 1] ?? null;
  }

  replaceTop(cmd: HistoryCommand): boolean {
    if (this.undoStack.length === 0) return false;
    if (cmd.meta && cmd.meta.timestamp == null) {
      cmd.meta.timestamp = Date.now();
    } else if (!cmd.meta) {
      cmd.meta = { timestamp: Date.now() };
    }
    this.undoStack[this.undoStack.length - 1] = cmd;
    this.emit();
    return true;
  }

  clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.emit();
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  onChange(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  private emit(): void {
    for (const cb of this.listeners) cb();
  }
}
