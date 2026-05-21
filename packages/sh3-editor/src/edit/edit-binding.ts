import type { ContributionsApi } from 'sh3-core';
import type { InstanceRegistry } from '../model/instance-registry.svelte';
import type { ApiInternals } from '../model/api';
import type {
  EditorEdit,
  EditorEditChannel,
  EditorEditCommand,
  EditorEditContribution,
} from './contributions';
import { EDITOR_EDIT_POINT } from './contributions';
import { createEditBatchCommand } from '../model/history-registry';
import { setActiveEditor, clearActiveEditorIf, type ActiveEditorRef } from '../views/active';

const EDIT_COALESCE_MS = 1000;

const enc = new TextEncoder();
const dec = new TextDecoder();

function editStart(e: EditorEdit): number {
  return e.kind === 'insert' ? e.byteAt : e.byteStart;
}
function editEnd(e: EditorEdit): number {
  return e.kind === 'insert' ? e.byteAt : e.byteEnd;
}

/** Pure byte-offset patcher. Exported for unit tests; not re-exported
 *  through the package barrel.
 *  @internal */
export function applyEditBatch(source: string, edits: readonly EditorEdit[]): string {
  if (edits.length === 0) return source;

  const src = enc.encode(source);
  const sorted = [...edits].sort((a, b) => editStart(a) - editStart(b));

  let prevEnd = 0;
  for (const e of sorted) {
    const s = editStart(e);
    const f = editEnd(e);
    if (s < prevEnd) {
      throw new Error(`overlapping edits at byte ${s}`);
    }
    if (s < 0 || f > src.length || f < s) {
      throw new Error(`edit out of range: [${s}, ${f}) in ${src.length}-byte source`);
    }
    prevEnd = f;
  }

  const chunks: Uint8Array[] = [];
  let cur = 0;
  for (const e of sorted) {
    const s = editStart(e);
    const f = editEnd(e);
    if (cur < s) chunks.push(src.slice(cur, s));
    if (e.kind !== 'delete') chunks.push(enc.encode(e.content));
    cur = f;
  }
  if (cur < src.length) chunks.push(src.slice(cur));

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return dec.decode(out);
}

export interface CaretRange {
  cursorStart: number;
  cursorEnd: number;
}

/** Compute the new caret position after applying a sorted batch of
 *  byte-offset edits to `beforeText`. Caret is char-based on input/output
 *  (matches textarea.selectionStart/selectionEnd); the function converts
 *  to byte space internally so edits can be byte-offset.
 *  @internal */
export function shiftCaret(
  caret: CaretRange,
  edits: readonly EditorEdit[],
  beforeText: string,
): CaretRange {
  if (edits.length === 0) {
    return { cursorStart: caret.cursorStart, cursorEnd: caret.cursorEnd };
  }
  const sorted = [...edits].sort((a, b) => editStart(a) - editStart(b));
  const beforeBytes = enc.encode(beforeText);

  const shiftOne = (charPos: number): number => {
    // char → byte: encode the prefix and count its byte length.
    let caretB = enc.encode(beforeText.slice(0, charPos)).length;

    for (const e of sorted) {
      const s = editStart(e);
      const f = editEnd(e);
      const oldLenB = f - s;
      const newLenB = e.kind === 'delete' ? 0 : enc.encode(e.content).length;
      if (f <= caretB) {
        caretB += newLenB - oldLenB;
      } else if (s >= caretB) {
        // edit is past the caret — leave it alone.
      } else {
        // caret falls inside [s, f) — clamp to edit start.
        caretB = s;
        // After clamping, subsequent edits can still shift further: they
        // all start at >= f > s = caretB, so they're past-the-caret and
        // the next iterations no-op. Continue the loop for symmetry.
      }
    }

    // Compute the resulting beforeBytes-mirror after applying edits in
    // byte space; we don't need the actual `afterBytes` — we need to
    // decode the byte slice [0, caretB) of the AFTER-state to count its
    // UTF-16 char length. Reconstruct the relevant prefix only.
    return byteOffsetToCharOffset(beforeBytes, sorted, caretB);
  };

  return {
    cursorStart: shiftOne(caret.cursorStart),
    cursorEnd:   shiftOne(caret.cursorEnd),
  };
}

/** Reconstruct the UTF-8 byte stream up through `afterByteOffset` of the
 *  POST-edit buffer, decode it, and return its UTF-16 char length. */
function byteOffsetToCharOffset(
  beforeBytes: Uint8Array,
  sortedEdits: readonly EditorEdit[],
  afterByteOffset: number,
): number {
  // Walk the same merge the patcher does, but stop once we've collected
  // `afterByteOffset` bytes' worth of output.
  const chunks: Uint8Array[] = [];
  let cur = 0;       // cursor in beforeBytes
  let produced = 0;  // bytes of after-stream collected so far

  const take = (chunk: Uint8Array): boolean => {
    const remaining = afterByteOffset - produced;
    if (chunk.length <= remaining) {
      chunks.push(chunk);
      produced += chunk.length;
      return produced < afterByteOffset;
    }
    chunks.push(chunk.slice(0, remaining));
    produced = afterByteOffset;
    return false;
  };

  for (const e of sortedEdits) {
    const s = editStart(e);
    const f = editEnd(e);
    if (cur < s) {
      if (!take(beforeBytes.slice(cur, s))) break;
    }
    if (e.kind !== 'delete') {
      if (!take(enc.encode(e.content))) break;
    }
    cur = f;
  }
  if (produced < afterByteOffset && cur < beforeBytes.length) {
    take(beforeBytes.slice(cur, beforeBytes.length));
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return dec.decode(out).length;
}

export interface BindEditOptions {
  slotId: string;
  contributions: ContributionsApi;
  registry: InstanceRegistry;
  internals: ApiInternals;
  warn?: (msg: string) => void;
}

export interface BindEditResult {
  cleanup(): void;
}

/** Mount-time helper. Looks up EditorEditContributions for the slot,
 *  hands each one a slot-scoped EditorEditChannel, and tracks disposers
 *  for cleanup at unmount. Multiple descriptors per slot are supported. */
export function bindEdits(opts: BindEditOptions): BindEditResult {
  const { slotId, contributions, registry, internals, warn = console.warn } = opts;
  const matches = contributions
    .list<EditorEditContribution>(EDITOR_EDIT_POINT)
    .filter((c) => c.slotId === slotId);

  let nextSubmitterId = 1;
  const offs: Array<() => void> = [];
  const channels: EditorEditChannel[] = [];
  for (const bound of matches) {
    const submitterId = nextSubmitterId++;
    const channel = makeChannel(slotId, submitterId, registry, internals, warn);
    channels.push(channel);
    const disposer = bound.bind(channel);
    if (typeof disposer === 'function') offs.push(disposer);
  }

  return {
    cleanup() {
      for (const off of offs) {
        try { off(); } catch (e) { console.warn('[sh3-editor] bindEdits cleanup', e); }
      }
      // Drop any active-surface refs this binding's channels published so
      // an unmounted view never lingers as the global undo/redo target.
      for (const ch of channels) {
        try { ch.clearActive(); } catch (e) { console.warn('[sh3-editor] bindEdits clearActive', e); }
      }
      offs.length = 0;
      channels.length = 0;
    },
  };
}

function makeChannel(
  slotId: string,
  submitterId: number,
  registry: InstanceRegistry,
  internals: ApiInternals,
  warn: (msg: string) => void,
): EditorEditChannel {
  const activeRef: ActiveEditorRef = {
    save() { internals.emitSave(slotId); },
    undo() { internals.history(slotId).undo(); },
    redo() { internals.history(slotId).redo(); },
    togglePreview() { return false; },
  };
  return {
    submit(cmd: EditorEditCommand): boolean {
      const entry = registry.get(slotId);
      if (!entry) return false;

      const before = entry.document.content;
      const cursorBefore = entry.document.cursorStart;
      const cursorEndBefore = entry.document.cursorEnd;

      const after = applyEditBatch(before, cmd.edits);
      if (after === before) return true;

      const { cursorStart: cursorAfter, cursorEnd: cursorEndAfter } =
        shiftCaret({ cursorStart: cursorBefore, cursorEnd: cursorEndBefore }, cmd.edits, before);

      const setter = (content: string, cs: number, ce: number) => {
        entry.document.content = content;
        entry.document.cursorStart = cs;
        entry.document.cursorEnd = ce;
        internals.contentChange.emit(slotId, content);
      };

      // Mutate first; push() does not call apply().
      entry.document.content = after;
      entry.document.cursorStart = cursorAfter;
      entry.document.cursorEnd = cursorEndAfter;

      const now = Date.now();
      const ctrl = internals.history(slotId);
      const internalKey = cmd.meta?.coalesceKey
        ? `${submitterId}:${cmd.meta.coalesceKey}`
        : undefined;
      const top = ctrl.peek();
      const topMeta = top?.meta as
        | { kind?: string; internalCoalesceKey?: string; timestamp?: number; snapshot?: { before: string; cursorBefore: number; cursorEndBefore: number } }
        | undefined;
      const canCoalesce =
        internalKey != null
        && topMeta?.kind === 'edit-batch'
        && topMeta.internalCoalesceKey === internalKey
        && topMeta.timestamp != null
        && now - topMeta.timestamp < EDIT_COALESCE_MS
        && topMeta.snapshot != null;

      if (canCoalesce) {
        const prevSnap = topMeta.snapshot!;
        ctrl.replaceTop(createEditBatchCommand({
          setter,
          before: prevSnap.before,
          after,
          cursorBefore: prevSnap.cursorBefore,
          cursorEndBefore: prevSnap.cursorEndBefore,
          cursorAfter,
          cursorEndAfter,
          meta: cmd.meta,
          internalCoalesceKey: internalKey,
          now,
        }));
      } else {
        ctrl.push(createEditBatchCommand({
          setter,
          before, after,
          cursorBefore, cursorEndBefore,
          cursorAfter, cursorEndAfter,
          meta: cmd.meta,
          internalCoalesceKey: internalKey,
          now,
        }));
      }

      // setter is only called by apply/revert (undo/redo). For the initial
      // submit we emit contentChange once here and flip dirty manually.
      internals.contentChange.emit(slotId, after);
      if (!entry.document.dirty) {
        entry.document.dirty = true;
        internals.dirtyChange.emit(slotId, true);
      }

      return true;
    },

    applyTransientEdit(cmd: EditorEditCommand): boolean {
      const entry = registry.get(slotId);
      if (!entry) return false;

      const before = entry.document.content;
      // applyEditBatch throws on overlap / out-of-range; let it propagate.
      const after = applyEditBatch(before, cmd.edits);
      if (after === before) return true;

      entry.document.content = after;
      // No caret shift, no history, no dirty flip. Observers still
      // need to see the new content so they stay consistent.
      internals.contentChange.emit(slotId, after);
      return true;
    },

    setActive(): boolean {
      const entry = registry.get(slotId);
      if (!entry) return false;
      setActiveEditor(activeRef);
      return true;
    },

    clearActive(): void {
      clearActiveEditorIf(activeRef);
    },
  };
}
