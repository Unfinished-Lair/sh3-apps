import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerSelectionAction,
  listSelectionActions,
  subscribe,
  __resetForTest,
} from './contributions';
import type { Selection } from './explorerShard.svelte';

const fileSel: Selection = { shardId: 'notes', path: 'hello.md' };

describe('contributions registry', () => {
  beforeEach(() => __resetForTest());

  it('returns empty list when nothing is registered', () => {
    expect(listSelectionActions(fileSel)).toEqual([]);
  });

  it('registers an action and lists it', () => {
    registerSelectionAction({ id: 'x:backup', label: 'Backup', onInvoke: () => {} });
    const actions = listSelectionActions(fileSel);
    expect(actions).toHaveLength(1);
    expect(actions[0].id).toBe('x:backup');
  });

  it('filters actions by appliesTo', () => {
    registerSelectionAction({
      id: 'x:md-only',
      label: 'MD only',
      appliesTo: (sel) => sel.path.endsWith('.md'),
      onInvoke: () => {},
    });
    expect(listSelectionActions({ shardId: 'notes', path: 'a.md' })).toHaveLength(1);
    expect(listSelectionActions({ shardId: 'notes', path: 'a.txt' })).toHaveLength(0);
  });

  it('unregister removes the action', () => {
    const off = registerSelectionAction({ id: 'x:tmp', label: 'Tmp', onInvoke: () => {} });
    expect(listSelectionActions(fileSel)).toHaveLength(1);
    off();
    expect(listSelectionActions(fileSel)).toHaveLength(0);
  });

  it('throws on duplicate id', () => {
    registerSelectionAction({ id: 'x:dup', label: 'A', onInvoke: () => {} });
    expect(() =>
      registerSelectionAction({ id: 'x:dup', label: 'B', onInvoke: () => {} }),
    ).toThrow(/already registered/);
  });

  it('subscribe fires on register and unregister', () => {
    let count = 0;
    const stop = subscribe(() => { count++; });
    const off = registerSelectionAction({ id: 'x:s', label: 'S', onInvoke: () => {} });
    expect(count).toBe(1);
    off();
    expect(count).toBe(2);
    stop();
    registerSelectionAction({ id: 'x:s2', label: 'S2', onInvoke: () => {} });
    expect(count).toBe(2);
  });
});
