import { describe, it, expect } from 'vitest';
import { HistoryEngine } from './history';
import type { HistoryCommand } from '../types';

function cmd(label: string, state: { value: string }, before: string, after: string): HistoryCommand {
  return {
    apply: () => { state.value = after; },
    revert: () => { state.value = before; },
    meta: { kind: 'test', label },
  };
}

describe('HistoryEngine', () => {
  it('starts empty with no undo/redo', () => {
    const h = new HistoryEngine();
    expect(h.canUndo).toBe(false);
    expect(h.canRedo).toBe(false);
    expect(h.peek()).toBeNull();
  });

  it('push records a command without calling apply()', () => {
    const state = { value: 'a' };
    const h = new HistoryEngine();
    h.push(cmd('c1', state, 'a', 'b'));
    expect(state.value).toBe('a');   // push does NOT invoke apply
    expect(h.canUndo).toBe(true);
    expect(h.canRedo).toBe(false);
  });

  it('undo runs revert and moves to redo stack', () => {
    const state = { value: 'b' };
    const h = new HistoryEngine();
    h.push(cmd('c1', state, 'a', 'b'));
    expect(h.undo()).toBe(true);
    expect(state.value).toBe('a');
    expect(h.canUndo).toBe(false);
    expect(h.canRedo).toBe(true);
  });

  it('redo runs apply and moves back to undo stack', () => {
    const state = { value: 'b' };
    const h = new HistoryEngine();
    h.push(cmd('c1', state, 'a', 'b'));
    h.undo();
    expect(h.redo()).toBe(true);
    expect(state.value).toBe('b');
    expect(h.canUndo).toBe(true);
    expect(h.canRedo).toBe(false);
  });

  it('undo returns false when empty', () => {
    const h = new HistoryEngine();
    expect(h.undo()).toBe(false);
    expect(h.redo()).toBe(false);
  });

  it('new push clears redo stack', () => {
    const state = { value: 'a' };
    const h = new HistoryEngine();
    h.push(cmd('c1', state, 'a', 'b'));
    h.undo();
    expect(h.canRedo).toBe(true);
    h.push(cmd('c2', state, 'a', 'c'));
    expect(h.canRedo).toBe(false);
  });

  it('peek returns top of undo stack without popping', () => {
    const state = { value: 'a' };
    const h = new HistoryEngine();
    const c1 = cmd('c1', state, 'a', 'b');
    h.push(c1);
    expect(h.peek()).toBe(c1);
    expect(h.canUndo).toBe(true);   // still there
  });

  it('replaceTop swaps top without running apply or revert', () => {
    const state = { value: 'a' };
    const h = new HistoryEngine();
    const c1 = cmd('c1', state, 'a', 'b');
    const c2 = cmd('c2', state, 'a', 'c');   // same `before`, different `after`
    h.push(c1);
    expect(h.replaceTop(c2)).toBe(true);
    expect(state.value).toBe('a');   // not touched
    expect(h.peek()).toBe(c2);
    // undo now runs c2.revert, not c1.revert
    h.undo();
    expect(state.value).toBe('a');
  });

  it('replaceTop returns false when empty', () => {
    const h = new HistoryEngine();
    expect(h.replaceTop({ apply() {}, revert() {} })).toBe(false);
  });

  it('clear empties both stacks', () => {
    const state = { value: 'a' };
    const h = new HistoryEngine();
    h.push(cmd('c1', state, 'a', 'b'));
    h.undo();
    h.clear();
    expect(h.canUndo).toBe(false);
    expect(h.canRedo).toBe(false);
  });

  it('onChange fires on push/undo/redo/clear/replaceTop', () => {
    const state = { value: 'a' };
    const h = new HistoryEngine();
    let count = 0;
    const off = h.onChange(() => { count++; });
    h.push(cmd('c1', state, 'a', 'b'));
    expect(count).toBe(1);
    h.undo();
    expect(count).toBe(2);
    h.redo();
    expect(count).toBe(3);
    h.replaceTop(cmd('c2', state, 'a', 'c'));
    expect(count).toBe(4);
    h.clear();
    expect(count).toBe(5);
    off();
    h.push(cmd('c3', state, 'a', 'd'));
    expect(count).toBe(5);   // unsubscribed
  });

  it('caps depth at DEFAULT_MAX_DEPTH=200 and drops the oldest', () => {
    const state = { value: '' };
    const h = new HistoryEngine();
    for (let i = 0; i < 205; i++) {
      h.push(cmd(`c${i}`, state, String(i), String(i + 1)));
    }
    // Push-pushes past 200 should still work; undo 205 times won't succeed.
    let undos = 0;
    while (h.undo()) undos++;
    expect(undos).toBe(200);
  });
});
