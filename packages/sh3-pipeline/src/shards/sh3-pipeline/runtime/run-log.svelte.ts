import type { RunLogEntry } from '../domain/types';

export interface RunLog {
  readonly entries: RunLogEntry[];
  push(entry: RunLogEntry): void;
  clear(): void;
}

export function createRunLog(): RunLog {
  const entries = $state<RunLogEntry[]>([]);
  return {
    get entries() { return entries; },
    push(entry: RunLogEntry) { entries.push(entry); },
    clear() { entries.length = 0; },
  };
}
