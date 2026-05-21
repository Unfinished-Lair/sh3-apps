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

import { createEditBatchCommand } from './history-registry';

describe('createEditBatchCommand', () => {
  it('apply writes after-state via setter; revert writes before-state via setter', () => {
    let content = '';
    let cs = -1;
    let ce = -1;
    const setter = (c: string, cursorStart: number, cursorEnd: number) => {
      content = c;
      cs = cursorStart;
      ce = cursorEnd;
    };
    const cmd = createEditBatchCommand({
      setter,
      before: 'hello',
      after: 'hello world',
      cursorBefore: 5,
      cursorEndBefore: 5,
      cursorAfter: 11,
      cursorEndAfter: 11,
    });
    cmd.apply();
    expect(content).toBe('hello world');
    expect(cs).toBe(11);
    expect(ce).toBe(11);
    cmd.revert();
    expect(content).toBe('hello');
    expect(cs).toBe(5);
    expect(ce).toBe(5);
  });

  it('stamps meta.kind="edit-batch" and carries submittedKind from meta.kind', () => {
    const cmd = createEditBatchCommand({
      setter: () => {},
      before: 'a',
      after: 'b',
      cursorBefore: 0, cursorEndBefore: 0,
      cursorAfter:  0, cursorEndAfter:  0,
      meta: { kind: 'table-edit', label: 'Cell commit', coalesceKey: 'drag' },
    });
    expect(cmd.meta?.kind).toBe('edit-batch');
    expect((cmd.meta as { submittedKind?: string }).submittedKind).toBe('table-edit');
    expect(cmd.meta?.label).toBe('Cell commit');
    expect((cmd.meta as { coalesceKey?: string }).coalesceKey).toBe('drag');
  });

  it('attaches a six-field snapshot for replaceTop coalescing', () => {
    const cmd = createEditBatchCommand({
      setter: () => {},
      before: 'a', after: 'b',
      cursorBefore: 1, cursorEndBefore: 1,
      cursorAfter: 2,  cursorEndAfter: 2,
    });
    expect(cmd.meta?.snapshot).toEqual({
      before: 'a', after: 'b',
      cursorBefore: 1, cursorEndBefore: 1,
      cursorAfter: 2,  cursorEndAfter: 2,
    });
  });

  it('stamps timestamp when `now` is supplied', () => {
    const cmd = createEditBatchCommand({
      setter: () => {},
      before: 'a', after: 'b',
      cursorBefore: 0, cursorEndBefore: 0,
      cursorAfter:  0, cursorEndAfter:  0,
      now: 42,
    });
    expect(cmd.meta?.timestamp).toBe(42);
  });

  it('carries internalCoalesceKey through meta for the coalesce predicate', () => {
    const cmd = createEditBatchCommand({
      setter: () => {},
      before: 'a', after: 'b',
      cursorBefore: 0, cursorEndBefore: 0,
      cursorAfter:  0, cursorEndAfter:  0,
      internalCoalesceKey: '1:drag',
    });
    expect((cmd.meta as { internalCoalesceKey?: string }).internalCoalesceKey).toBe('1:drag');
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
