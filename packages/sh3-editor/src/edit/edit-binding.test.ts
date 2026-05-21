import { describe, it, expect, beforeEach } from 'vitest';
import { applyEditBatch } from './edit-binding';

describe('applyEditBatch (pure)', () => {
  it('returns the source unchanged when edits is empty', () => {
    expect(applyEditBatch('hello', [])).toBe('hello');
  });

  it('applies a single replace edit', () => {
    expect(applyEditBatch('hello world', [
      { kind: 'replace', byteStart: 6, byteEnd: 11, content: 'there' },
    ])).toBe('hello there');
  });

  it('applies a single insert edit', () => {
    expect(applyEditBatch('hello!', [
      { kind: 'insert', byteAt: 5, content: ', world' },
    ])).toBe('hello, world!');
  });

  it('applies a single delete edit', () => {
    expect(applyEditBatch('hello, world!', [
      { kind: 'delete', byteStart: 5, byteEnd: 12 },
    ])).toBe('hello!');
  });

  it('sorts edits by start before applying', () => {
    // intentionally out of order; result must be deterministic
    const result = applyEditBatch('aXbYc', [
      { kind: 'replace', byteStart: 3, byteEnd: 4, content: '2' },
      { kind: 'replace', byteStart: 1, byteEnd: 2, content: '1' },
    ]);
    expect(result).toBe('a1b2c');
  });

  it('throws on overlapping edits', () => {
    expect(() => applyEditBatch('hello world', [
      { kind: 'replace', byteStart: 0, byteEnd: 5, content: 'HI' },
      { kind: 'replace', byteStart: 3, byteEnd: 7, content: 'YO' },
    ])).toThrow(/overlap/i);
  });

  it('throws on out-of-range edits', () => {
    expect(() => applyEditBatch('hi', [
      { kind: 'replace', byteStart: 0, byteEnd: 5, content: 'too far' },
    ])).toThrow(/out of range/i);
  });

  it('handles multi-byte UTF-8 sequences correctly', () => {
    // '🚀' is 4 bytes in UTF-8. Replace it at byte offset 0..4 with 'X'.
    expect(applyEditBatch('🚀ok', [
      { kind: 'replace', byteStart: 0, byteEnd: 4, content: 'X' },
    ])).toBe('Xok');
  });
});

import { shiftCaret } from './edit-binding';

describe('shiftCaret (pure)', () => {
  it('returns caret unchanged when no edits', () => {
    const out = shiftCaret(
      { cursorStart: 5, cursorEnd: 7 },
      [],
      'hello world',
    );
    expect(out).toEqual({ cursorStart: 5, cursorEnd: 7 });
  });

  it('leaves a caret BEFORE an edit unchanged', () => {
    // edit at bytes 6..11 ('world' -> 'there'); caret at char 3.
    const out = shiftCaret(
      { cursorStart: 3, cursorEnd: 3 },
      [{ kind: 'replace', byteStart: 6, byteEnd: 11, content: 'there' }],
      'hello world',
    );
    expect(out).toEqual({ cursorStart: 3, cursorEnd: 3 });
  });

  it('shifts a caret AFTER an edit by net delta', () => {
    // edit replaces 5-byte 'world' with 4-byte 'them' (delta -1); caret at end.
    const before = 'hello world';
    const out = shiftCaret(
      { cursorStart: before.length, cursorEnd: before.length },
      [{ kind: 'replace', byteStart: 6, byteEnd: 11, content: 'them' }],
      before,
    );
    // After: 'hello them' (length 10), caret was at 11 (= byte 11) → byte 10 → char 10.
    expect(out).toEqual({ cursorStart: 10, cursorEnd: 10 });
  });

  it('clamps a caret INSIDE an edit to the edit start (char-converted)', () => {
    // edit at bytes 0..5 ('hello' -> 'X'); caret at char 3 (inside).
    const out = shiftCaret(
      { cursorStart: 3, cursorEnd: 3 },
      [{ kind: 'replace', byteStart: 0, byteEnd: 5, content: 'X' }],
      'hello world',
    );
    expect(out).toEqual({ cursorStart: 0, cursorEnd: 0 });
  });

  it('treats cursorStart and cursorEnd independently across edits', () => {
    // 'abcXdef'; replace bytes 3..4 with 'YZ'; selection [2, 5] (covering 'cXd').
    // After: 'abcYZdef'; cursorStart=2 (before edit) unchanged; cursorEnd=5 is past
    // edit end (4), shifted by +1 → 6.
    const out = shiftCaret(
      { cursorStart: 2, cursorEnd: 5 },
      [{ kind: 'replace', byteStart: 3, byteEnd: 4, content: 'YZ' }],
      'abcXdef',
    );
    expect(out).toEqual({ cursorStart: 2, cursorEnd: 6 });
  });

  it('handles non-ASCII content: a 4-byte emoji replaced with a 1-byte char shifts a downstream caret by -3 chars in byte space, but -3 chars in char space too since the emoji is 2 UTF-16 code units', () => {
    // Source: '🚀ok' → '🚀' is 4 bytes UTF-8, 2 chars UTF-16. Total: 6 chars '🚀ok'.
    // Replace bytes 0..4 with 'X' (1 byte). Result: 'Xok' (3 chars).
    // Caret at end of source = char 4 ('🚀ok'.length === 4).
    // In byte space: caret_b = 6; after edit (net -3 bytes), caret_b = 3; char-space = 3.
    const before = '🚀ok';
    const out = shiftCaret(
      { cursorStart: before.length, cursorEnd: before.length },
      [{ kind: 'replace', byteStart: 0, byteEnd: 4, content: 'X' }],
      before,
    );
    expect(out).toEqual({ cursorStart: 3, cursorEnd: 3 });
  });

  it('handles non-ASCII content: caret BEFORE a 4-byte emoji edit stays unchanged across the byte/char conversion round-trip', () => {
    // 'ab🚀cd'. Replace '🚀' (bytes 2..6) with 'X'. Caret at char 1 (before edit).
    const out = shiftCaret(
      { cursorStart: 1, cursorEnd: 1 },
      [{ kind: 'replace', byteStart: 2, byteEnd: 6, content: 'X' }],
      'ab🚀cd',
    );
    expect(out).toEqual({ cursorStart: 1, cursorEnd: 1 });
  });
});

import { bindEdits } from './edit-binding';
import { InstanceRegistry } from '../model/instance-registry.svelte';
import { createApi } from '../model/api';
import { EDITOR_EDIT_POINT, type EditorEditContribution, type EditorEditChannel } from './contributions';

function makeEditContext(descriptors: EditorEditContribution[] = []) {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  const contributions = {
    list: <T>(pointId: string): T[] =>
      pointId === EDITOR_EDIT_POINT ? (descriptors as unknown as T[]) : [],
    register: <T>(_p: string, _d: T) => () => {},
    onChange: (_p: string, _cb: () => void) => () => {},
    onAnyChange: (_cb: () => void) => () => {},
    listPoints: () => [EDITOR_EDIT_POINT],
  };
  return { registry, internals, contributions };
}

describe('bindEdits (mount + cleanup)', () => {
  it('does nothing when no contributions match the slot', () => {
    const { registry, internals, contributions } = makeEditContext();
    const result = bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(typeof result.cleanup).toBe('function');
    result.cleanup(); // should not throw
  });

  it('calls bind() on a matching descriptor with a channel that exposes submit + applyTransientEdit', () => {
    let received: EditorEditChannel | null = null;
    const descriptor: EditorEditContribution = {
      slotId: 's1',
      bind(channel) { received = channel; },
    };
    const { registry, internals, contributions } = makeEditContext([descriptor]);
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(received).not.toBeNull();
    expect(typeof received!.submit).toBe('function');
    expect(typeof received!.applyTransientEdit).toBe('function');
  });

  it('skips descriptors with a non-matching slotId', () => {
    let called = false;
    const descriptor: EditorEditContribution = {
      slotId: 'other',
      bind() { called = true; },
    };
    const { registry, internals, contributions } = makeEditContext([descriptor]);
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(called).toBe(false);
  });

  it('passes a distinct channel to each of N matching descriptors', () => {
    const channels: EditorEditChannel[] = [];
    const d1: EditorEditContribution = { slotId: 's1', bind(c) { channels.push(c); } };
    const d2: EditorEditContribution = { slotId: 's1', bind(c) { channels.push(c); } };
    const { registry, internals, contributions } = makeEditContext([d1, d2]);
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(channels.length).toBe(2);
    expect(channels[0]).not.toBe(channels[1]);
  });

  it('invokes returned disposers on cleanup', () => {
    let disposed = 0;
    const descriptor: EditorEditContribution = {
      slotId: 's1',
      bind() { return () => { disposed++; }; },
    };
    const { registry, internals, contributions } = makeEditContext([descriptor]);
    const result = bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(disposed).toBe(0);
    result.cleanup();
    expect(disposed).toBe(1);
    // Second cleanup is idempotent.
    result.cleanup();
    expect(disposed).toBe(1);
  });
});

describe('EditorEditChannel.submit (mechanics)', () => {
  it('returns false when no live editor instance is bound for the slot', () => {
    let channel!: EditorEditChannel;
    const descriptor: EditorEditContribution = {
      slotId: 's1',
      bind(c) { channel = c; },
    };
    const { registry, internals, contributions } = makeEditContext([descriptor]);
    bindEdits({ slotId: 's1', contributions, registry, internals });
    // registry has no entry for 's1'
    expect(channel.submit({ edits: [{ kind: 'insert', byteAt: 0, content: 'X' }] })).toBe(false);
  });

  it('applies a single replace edit when an instance is bound', () => {
    let channel!: EditorEditChannel;
    const descriptor: EditorEditContribution = {
      slotId: 's1',
      bind(c) { channel = c; },
    };
    const { registry, internals, contributions } = makeEditContext([descriptor]);
    registry.open('s1', { content: 'hello world' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const ok = channel.submit({
      edits: [{ kind: 'replace', byteStart: 6, byteEnd: 11, content: 'there' }],
    });
    expect(ok).toBe(true);
    expect(registry.get('s1')!.document.content).toBe('hello there');
  });

  it('applies a sorted multi-edit batch atomically', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'aXbYc' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({
      edits: [
        { kind: 'replace', byteStart: 3, byteEnd: 4, content: '2' },
        { kind: 'replace', byteStart: 1, byteEnd: 2, content: '1' },
      ],
    });
    expect(registry.get('s1')!.document.content).toBe('a1b2c');
  });

  it('throws on overlapping edits; document untouched', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hello world' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(() => channel.submit({
      edits: [
        { kind: 'replace', byteStart: 0, byteEnd: 5, content: 'HI' },
        { kind: 'replace', byteStart: 3, byteEnd: 7, content: 'YO' },
      ],
    })).toThrow(/overlap/i);
    expect(registry.get('s1')!.document.content).toBe('hello world');
  });

  it('throws on out-of-range edits; document untouched', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hi' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(() => channel.submit({
      edits: [{ kind: 'replace', byteStart: 0, byteEnd: 5, content: 'too far' }],
    })).toThrow(/out of range/i);
    expect(registry.get('s1')!.document.content).toBe('hi');
  });

  it('no-op submit (same content) returns true without mutating', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hi' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const ok = channel.submit({
      edits: [{ kind: 'replace', byteStart: 0, byteEnd: 1, content: 'h' }], // 'h' → 'h'
    });
    expect(ok).toBe(true);
    expect(registry.get('s1')!.document.content).toBe('hi');
  });
});

describe('EditorEditChannel.submit (history)', () => {
  it("pushes a HistoryCommand with meta.kind='edit-batch' and meta.submittedKind from cmd.meta.kind", () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hello world' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({
      edits: [{ kind: 'replace', byteStart: 6, byteEnd: 11, content: 'there' }],
      meta: { kind: 'table-edit', label: 'Cell commit' },
    });
    const top = internals.history('s1').peek();
    expect(top).not.toBeNull();
    expect(top!.meta?.kind).toBe('edit-batch');
    expect((top!.meta as { submittedKind?: string }).submittedKind).toBe('table-edit');
    expect(top!.meta?.label).toBe('Cell commit');
  });

  it('undo after submit reverts content AND caret to the pre-submit state', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    const entry = registry.open('s1', { content: 'hello world' });
    entry.document.cursorStart = 3;
    entry.document.cursorEnd = 3;
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({
      edits: [{ kind: 'replace', byteStart: 6, byteEnd: 11, content: 'there' }],
    });
    expect(entry.document.content).toBe('hello there');
    internals.history('s1').undo();
    expect(entry.document.content).toBe('hello world');
    expect(entry.document.cursorStart).toBe(3);
    expect(entry.document.cursorEnd).toBe(3);
  });
});

describe('EditorEditChannel.submit (dirty + contentChange)', () => {
  it('flips dirty true and emits dirtyChange on the first edit', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    const entry = registry.open('s1', { content: 'hello' });
    expect(entry.document.dirty).toBe(false);
    const dirtyEvents: boolean[] = [];
    internals.dirtyChange.on((id, d) => { if (id === 's1') dirtyEvents.push(d); });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 5, content: '!' }] });
    expect(entry.document.dirty).toBe(true);
    expect(dirtyEvents).toEqual([true]);
  });

  it('does not re-emit dirtyChange on subsequent submits when already dirty', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hello' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const events: boolean[] = [];
    internals.dirtyChange.on((id, d) => { if (id === 's1') events.push(d); });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 5, content: 'A' }] });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 6, content: 'B' }] });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 7, content: 'C' }] });
    expect(events).toEqual([true]);
  });

  it('fires contentChange to listeners with the post-submit content', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hello' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const events: string[] = [];
    internals.contentChange.on((id, c) => { if (id === 's1') events.push(c); });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 5, content: '!' }] });
    expect(events).toEqual(['hello!']);
  });
});

describe('EditorEditChannel.submit (caret smart-shift end-to-end)', () => {
  it('shifts a caret AFTER the edit by the net delta', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    const entry = registry.open('s1', { content: 'hello world' });
    entry.document.cursorStart = 11;
    entry.document.cursorEnd = 11;
    bindEdits({ slotId: 's1', contributions, registry, internals });
    // 'world' (5 bytes) → 'them' (4 bytes), delta -1.
    channel.submit({
      edits: [{ kind: 'replace', byteStart: 6, byteEnd: 11, content: 'them' }],
    });
    expect(entry.document.content).toBe('hello them');
    expect(entry.document.cursorStart).toBe(10);
    expect(entry.document.cursorEnd).toBe(10);
  });

  it('clamps a caret INSIDE the edit range to the edit start', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    const entry = registry.open('s1', { content: 'hello world' });
    entry.document.cursorStart = 3; // inside 'hello'
    entry.document.cursorEnd = 3;
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({
      edits: [{ kind: 'replace', byteStart: 0, byteEnd: 5, content: 'X' }],
    });
    expect(entry.document.content).toBe('X world');
    expect(entry.document.cursorStart).toBe(0);
    expect(entry.document.cursorEnd).toBe(0);
  });

  it('handles non-ASCII content: a 4-byte emoji replaced with a 1-byte char shifts a caret at the end of the buffer to the new end (char-count-aware)', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    const entry = registry.open('s1', { content: '🚀ok' });
    entry.document.cursorStart = '🚀ok'.length; // 4 (2 for emoji + 2 for 'ok')
    entry.document.cursorEnd = entry.document.cursorStart;
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({
      edits: [{ kind: 'replace', byteStart: 0, byteEnd: 4, content: 'X' }],
    });
    expect(entry.document.content).toBe('Xok');
    expect(entry.document.cursorStart).toBe(3); // 'Xok'.length
    expect(entry.document.cursorEnd).toBe(3);
  });
});

import { vi } from 'vitest';

describe('EditorEditChannel.submit (coalescing)', () => {
  it('coalesces consecutive same-coalesceKey submits within EDIT_COALESCE_MS into one undo entry', () => {
    vi.useFakeTimers();
    try {
      let channel!: EditorEditChannel;
      const { registry, internals, contributions } = makeEditContext([
        { slotId: 's1', bind(c) { channel = c; } },
      ]);
      registry.open('s1', { content: 'a' });
      bindEdits({ slotId: 's1', contributions, registry, internals });
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 1, content: 'b' }],
        meta: { coalesceKey: 'drag' },
      });
      vi.advanceTimersByTime(200);
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 2, content: 'c' }],
        meta: { coalesceKey: 'drag' },
      });
      vi.advanceTimersByTime(200);
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 3, content: 'd' }],
        meta: { coalesceKey: 'drag' },
      });
      expect(registry.get('s1')!.document.content).toBe('abcd');
      // One undo should land on pre-coalesce state 'a'.
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('a');
      // No further undo available (stack had depth 1).
      expect(internals.history('s1').canUndo).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does NOT coalesce after EDIT_COALESCE_MS has elapsed', () => {
    vi.useFakeTimers();
    try {
      let channel!: EditorEditChannel;
      const { registry, internals, contributions } = makeEditContext([
        { slotId: 's1', bind(c) { channel = c; } },
      ]);
      registry.open('s1', { content: 'a' });
      bindEdits({ slotId: 's1', contributions, registry, internals });
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 1, content: 'b' }],
        meta: { coalesceKey: 'drag' },
      });
      vi.advanceTimersByTime(1500);
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 2, content: 'c' }],
        meta: { coalesceKey: 'drag' },
      });
      // Two entries; one undo undoes the 'c', another undoes the 'b'.
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('ab');
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('a');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does NOT coalesce when the coalesceKey differs (same submitter)', () => {
    vi.useFakeTimers();
    try {
      let channel!: EditorEditChannel;
      const { registry, internals, contributions } = makeEditContext([
        { slotId: 's1', bind(c) { channel = c; } },
      ]);
      registry.open('s1', { content: 'a' });
      bindEdits({ slotId: 's1', contributions, registry, internals });
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 1, content: 'b' }],
        meta: { coalesceKey: 'A' },
      });
      vi.advanceTimersByTime(100);
      channel.submit({
        edits: [{ kind: 'insert', byteAt: 2, content: 'c' }],
        meta: { coalesceKey: 'B' },
      });
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('ab');
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('a');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does NOT coalesce across different submitters even with the same coalesceKey', () => {
    vi.useFakeTimers();
    try {
      let channelA!: EditorEditChannel;
      let channelB!: EditorEditChannel;
      const { registry, internals, contributions } = makeEditContext([
        { slotId: 's1', bind(c) { channelA = c; } },
        { slotId: 's1', bind(c) { channelB = c; } },
      ]);
      registry.open('s1', { content: 'a' });
      bindEdits({ slotId: 's1', contributions, registry, internals });
      channelA.submit({
        edits: [{ kind: 'insert', byteAt: 1, content: 'b' }],
        meta: { coalesceKey: 'drag' },
      });
      vi.advanceTimersByTime(100);
      channelB.submit({
        edits: [{ kind: 'insert', byteAt: 2, content: 'c' }],
        meta: { coalesceKey: 'drag' },
      });
      // submitterId namespacing should keep these distinct.
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('ab');
      internals.history('s1').undo();
      expect(registry.get('s1')!.document.content).toBe('a');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does NOT coalesce when no coalesceKey is provided', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 1, content: 'b' }] });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 2, content: 'c' }] });
    internals.history('s1').undo();
    expect(registry.get('s1')!.document.content).toBe('ab');
    internals.history('s1').undo();
    expect(registry.get('s1')!.document.content).toBe('a');
  });
});

describe('EditorEditChannel.applyTransientEdit', () => {
  it('mutates content without history push, dirty flip, or caret shift', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    const entry = registry.open('s1', { content: 'hello' });
    entry.document.cursorStart = 2;
    entry.document.cursorEnd = 2;
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const dirtyEvents: boolean[] = [];
    internals.dirtyChange.on((id, d) => { if (id === 's1') dirtyEvents.push(d); });
    const ok = channel.applyTransientEdit({
      edits: [{ kind: 'insert', byteAt: 5, content: '!' }],
    });
    expect(ok).toBe(true);
    expect(entry.document.content).toBe('hello!');
    expect(entry.document.cursorStart).toBe(2);
    expect(entry.document.cursorEnd).toBe(2);
    expect(entry.document.dirty).toBe(false);
    expect(dirtyEvents).toEqual([]);
    expect(internals.history('s1').peek()).toBeNull();
  });

  it('fires contentChange so downstream observers stay consistent', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hello' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const events: string[] = [];
    internals.contentChange.on((id, c) => { if (id === 's1') events.push(c); });
    channel.applyTransientEdit({
      edits: [{ kind: 'insert', byteAt: 5, content: '!' }],
    });
    expect(events).toEqual(['hello!']);
  });

  it('returns false when no instance is bound', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(channel.applyTransientEdit({
      edits: [{ kind: 'insert', byteAt: 0, content: 'X' }],
    })).toBe(false);
  });

  it('applyTransientEdit followed by submit with the same edits — only submit appears on history', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.applyTransientEdit({ edits: [{ kind: 'insert', byteAt: 1, content: 'b' }] });
    // Transient already mutated to 'ab'. submit re-applies the same edit
    // against 'ab' (it will throw if we tried byteAt=1; but for the test
    // we drive a different edit so the assertion is unambiguous):
    channel.submit({ edits: [{ kind: 'insert', byteAt: 2, content: 'c' }] });
    expect(registry.get('s1')!.document.content).toBe('abc');
    // History has exactly one entry (the submit).
    const ctrl = internals.history('s1');
    expect(ctrl.canUndo).toBe(true);
    ctrl.undo();
    // The submit reverts 'c' → 'ab'. The transient leaves no trail.
    expect(registry.get('s1')!.document.content).toBe('ab');
    expect(ctrl.canUndo).toBe(false);
  });

  it('throws on overlapping edits; document untouched', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'hello world' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(() => channel.applyTransientEdit({
      edits: [
        { kind: 'replace', byteStart: 0, byteEnd: 5, content: 'HI' },
        { kind: 'replace', byteStart: 3, byteEnd: 7, content: 'YO' },
      ],
    })).toThrow(/overlap/i);
    expect(registry.get('s1')!.document.content).toBe('hello world');
  });
});

import { getActiveEditor, clearActiveEditorIf } from '../views/active';

describe('EditorEditChannel.setActive / clearActive', () => {
  beforeEach(() => {
    // Reset the active-editor singleton between tests so cross-test bleed
    // doesn't mask bugs.
    const cur = getActiveEditor();
    if (cur) clearActiveEditorIf(cur);
  });

  it('setActive returns false when no instance is bound; does not publish', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(channel.setActive()).toBe(false);
    expect(getActiveEditor()).toBeNull();
  });

  it('setActive returns true when instance bound and publishes an active ref', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    expect(channel.setActive()).toBe(true);
    expect(getActiveEditor()).not.toBeNull();
  });

  it('published ref undo/redo drives the slot history', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.submit({ edits: [{ kind: 'insert', byteAt: 1, content: 'b' }] });
    expect(registry.get('s1')!.document.content).toBe('ab');
    channel.setActive();
    getActiveEditor()!.undo();
    expect(registry.get('s1')!.document.content).toBe('a');
    getActiveEditor()!.redo();
    expect(registry.get('s1')!.document.content).toBe('ab');
  });

  it('published ref save fires saveEvent for the slot', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    const saves: string[] = [];
    internals.saveEvent.on((id) => { saves.push(id); });
    channel.setActive();
    getActiveEditor()!.save();
    expect(saves).toEqual(['s1']);
  });

  it('published ref togglePreview returns false (not supported on non-editor surfaces)', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.setActive();
    expect(getActiveEditor()!.togglePreview()).toBe(false);
  });

  it('two channels for same slot: second setActive overwrites first; first clearActive is no-op', () => {
    let chA!: EditorEditChannel;
    let chB!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { chA = c; } },
      { slotId: 's1', bind(c) { chB = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    bindEdits({ slotId: 's1', contributions, registry, internals });
    chA.setActive();
    const refA = getActiveEditor();
    chB.setActive();
    const refB = getActiveEditor();
    expect(refA).not.toBe(refB);
    // A's clearActive should not clobber B's published ref.
    chA.clearActive();
    expect(getActiveEditor()).toBe(refB);
    chB.clearActive();
    expect(getActiveEditor()).toBeNull();
  });

  it('bindEdits cleanup auto-clears active ref when it belongs to a channel of this binding', () => {
    let channel!: EditorEditChannel;
    const { registry, internals, contributions } = makeEditContext([
      { slotId: 's1', bind(c) { channel = c; } },
    ]);
    registry.open('s1', { content: 'a' });
    const result = bindEdits({ slotId: 's1', contributions, registry, internals });
    channel.setActive();
    expect(getActiveEditor()).not.toBeNull();
    result.cleanup();
    expect(getActiveEditor()).toBeNull();
  });
});
