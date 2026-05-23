/** Contribution point id for editor edit channels. Contributors register
 *  one EditorEditContribution per editor slot via
 *  ctx.contributions.register<EditorEditContribution>(EDITOR_EDIT_POINT, …).
 *
 *  See docs/sh3-rfcs/2026-05-21-editor-external-edit-contribution-design.md
 *  for the design rationale. */
export const EDITOR_EDIT_POINT = 'sh3-editor.edit';

/** A single byte-offset edit against an editor document's content.
 *  Offsets are UTF-8 byte positions in the source. The editor sorts an
 *  array of these and applies them as one atomic step. Must not overlap. */
export type EditorEdit =
  | { kind: 'replace'; byteStart: number; byteEnd: number; content: string }
  | { kind: 'insert';  byteAt: number;    content: string }
  | { kind: 'delete';  byteStart: number; byteEnd: number };

/** A coalescable, history-recorded edit batch submitted by a contributor. */
export interface EditorEditCommand {
  /** Edits in any order; the editor sorts and applies them as one atomic
   *  step. Must not overlap. */
  edits: EditorEdit[];
  meta?: {
    /** Free-form kind tag for history-inspector UI, e.g. 'table-edit'. */
    kind?: string;
    /** Free-form label, e.g. 'Cell commit'. */
    label?: string;
    /** Coalesce key — consecutive submits sharing this key within the
     *  editor's submit-coalesce window (1000ms) fold into one undo
     *  entry. The editor scopes the key by submitter identity
     *  internally; contributors do not need to prefix it with a shard
     *  id. Ignored by applyTransientEdit. */
    coalesceKey?: string;
  };
}

/** Slot-scoped channel handed to a contributor at bind time. */
export interface EditorEditChannel {
  /** Apply edits as a real, undoable, dirty-flagging edit. Returns true
   *  on success, false if the slot has no live editor instance bound.
   *  Throws on overlapping or out-of-range edits.
   *
   *  Do not mix submit/applyTransientEdit with EditorDocumentChannel.setBuffer
   *  against the same slot — setBuffer clears history. */
  submit(cmd: EditorEditCommand): boolean;

  /** Apply edits as a transient preview — no history push, no dirty
   *  flip, no caret shift. Useful for hover/scrub previews the
   *  contributor reverts itself. Same return/throw contract as submit.
   *  The cmd.meta field is ignored. */
  applyTransientEdit(cmd: EditorEditCommand): boolean;

  /** Publish this surface as the active undo/redo/save target for the
   *  slot. Call from your view's focus / pointerdown handler — the
   *  editor's app-scoped undo/redo/save actions will then drive this
   *  slot's history when invoked. Returns false if the slot has no
   *  live editor instance bound. Overwrites any previously-active
   *  surface; switching focus between surfaces is a clean handover. */
  setActive(): boolean;

  /** Clear the active target only if it's the ref this channel
   *  published. Idempotent and safe to call on unmount even after
   *  another surface has taken over. Don't call on blur — only on
   *  unmount — so focus handovers don't leave a null gap. */
  clearActive(): void;
}

/** Descriptor registered under EDITOR_EDIT_POINT. */
export interface EditorEditContribution {
  /** Slot id this binding owns. The editor matches at mount time. */
  slotId: string;

  /** Called once at editor mount with a slot-scoped channel. Returned
   *  disposer (if any) fires on slot unmount. Multiple descriptors per
   *  slot are supported; each gets its own channel; all share one
   *  history stack. History entry order is submit-arrival order, not
   *  descriptor-registration order. */
  bind(channel: EditorEditChannel): (() => void) | void;
}
