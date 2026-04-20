import type { Selection } from './explorerShard.svelte';

type NonNullSelection = NonNullable<Selection>;

export interface SelectionAction {
  id: string;
  label: string;
  appliesTo?(sel: NonNullSelection): boolean;
  onInvoke(sel: NonNullSelection): void | Promise<void>;
  kind?: 'primary' | 'secondary';
}

const actions = new Map<string, SelectionAction>();
const listeners = new Set<() => void>();

function notify(): void {
  for (const fn of listeners) fn();
}

export function registerSelectionAction(action: SelectionAction): () => void {
  if (actions.has(action.id)) {
    throw new Error(`SelectionAction "${action.id}" is already registered`);
  }
  actions.set(action.id, action);
  notify();
  return () => {
    if (actions.delete(action.id)) notify();
  };
}

export function listSelectionActions(sel: Selection): SelectionAction[] {
  if (!sel) return [];
  const out: SelectionAction[] = [];
  for (const a of actions.values()) {
    if (!a.appliesTo || a.appliesTo(sel)) out.push(a);
  }
  return out;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Test-only. Not exported from the package root. */
export function __resetForTest(): void {
  actions.clear();
  listeners.clear();
}
