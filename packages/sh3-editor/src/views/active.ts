export interface ActiveEditorRef {
  save(): void;
  undo(): void;
  redo(): void;
  /** Returns false when the current document doesn't support preview. */
  togglePreview(): boolean;
}

let active: ActiveEditorRef | null = null;

export function setActiveEditor(ref: ActiveEditorRef): void {
  active = ref;
}

export function getActiveEditor(): ActiveEditorRef | null {
  return active;
}

export function clearActiveEditorIf(ref: ActiveEditorRef): void {
  if (active === ref) active = null;
}
