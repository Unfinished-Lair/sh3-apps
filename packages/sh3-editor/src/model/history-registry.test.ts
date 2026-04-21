import { describe, it, expect } from 'vitest';
import { HistoryRegistry, createTextSwapCommand } from './history-registry';

describe('createTextSwapCommand', () => {
  it('apply writes after+cursorAfter via setter; revert writes before+cursorBefore', () => {
    let content = 'x';
    let cursor = 0;
    const setter = (c: string, cur: number) => { content = c; cursor = cur; };
    const cmd = createTextSwapCommand({
      setter,
      before: 'before',
      after: 'after',
      cursorBefore: 3,
      cursorAfter: 5,
    });
    cmd.apply();
    expect(content).toBe('after');
    expect(cursor).toBe(5);
    cmd.revert();
    expect(content).toBe('before');
    expect(cursor).toBe(3);
  });

  it('stamps meta.kind="text-swap" and attaches snapshot for replaceTop coalescing', () => {
    const cmd = createTextSwapCommand({
      setter: () => {},
      before: 'a',
      after: 'ab',
      cursorBefore: 1,
      cursorAfter: 2,
    });
    expect(cmd.meta?.kind).toBe('text-swap');
    expect(cmd.meta?.snapshot).toEqual({
      before: 'a',
      after: 'ab',
      cursorBefore: 1,
      cursorAfter: 2,
    });
  });

  it('stamps timestamp when `now` is supplied', () => {
    const cmd = createTextSwapCommand({
      setter: () => {},
      before: 'a',
      after: 'ab',
      cursorBefore: 1,
      cursorAfter: 2,
      now: 12345,
    });
    expect(cmd.meta?.timestamp).toBe(12345);
  });
});

describe('HistoryRegistry', () => {
  it('get returns the same engine across calls for a given id', () => {
    const reg = new HistoryRegistry();
    const e1 = reg.get('a');
    const e2 = reg.get('a');
    expect(e1).toBe(e2);
  });

  it('different ids get different engines', () => {
    const reg = new HistoryRegistry();
    expect(reg.get('a')).not.toBe(reg.get('b'));
  });

  it('release drops the engine', () => {
    const reg = new HistoryRegistry();
    const e1 = reg.get('a');
    reg.release('a');
    const e2 = reg.get('a');
    expect(e1).not.toBe(e2);
  });

  it('clear drops all engines', () => {
    const reg = new HistoryRegistry();
    const e1 = reg.get('a');
    const e2 = reg.get('b');
    reg.clear();
    expect(reg.get('a')).not.toBe(e1);
    expect(reg.get('b')).not.toBe(e2);
  });
});
