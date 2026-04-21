import type {
  EditorApi,
  EditorDocument,
  HistoryCommand,
  HistoryController,
  OpenDocumentOptions,
  OpenInspectorOptions,
  UserPrefs,
} from '../types';
import { InstanceRegistry } from './instance-registry';
import { InspectorRegistry } from './inspector-registry';
import { HistoryRegistry, createTextSwapCommand } from './history-registry';

type Callback<T extends unknown[]> = (...args: T) => void;

class EventBus<T extends unknown[]> {
  private listeners = new Set<Callback<T>>();

  on(cb: Callback<T>): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  emit(...args: T): void {
    for (const cb of this.listeners) cb(...args);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export interface ApiInternals {
  emitSave(id: string): void;
  contentChange: EventBus<[string, string]>;
  dirtyChange: EventBus<[string, boolean]>;
  saveEvent: EventBus<[string]>;
  prefsChange: EventBus<[string, UserPrefs]>;
  inspectorValueChange: EventBus<[string, unknown]>;
  history: (id: string) => HistoryController;
  inspectors: InspectorRegistry;
}

/** Wraps a HistoryEngine as a HistoryController with the public surface.
 *  Kept here (not in history-registry.ts) because the controller layer is an
 *  API concern — the engine stays engine-only. */
function makeController(reg: HistoryRegistry, id: string, onAfterMutation: () => void): HistoryController {
  const engine = reg.get(id);
  const controller: HistoryController = {
    push(cmd: HistoryCommand) {
      engine.push(cmd);
      onAfterMutation();
    },
    undo() {
      const ok = engine.undo();
      if (ok) onAfterMutation();
      return ok;
    },
    redo() {
      const ok = engine.redo();
      if (ok) onAfterMutation();
      return ok;
    },
    peek() { return engine.peek(); },
    replaceTop(cmd) {
      const ok = engine.replaceTop(cmd);
      if (ok) onAfterMutation();
      return ok;
    },
    get canUndo() { return engine.canUndo; },
    get canRedo() { return engine.canRedo; },
    clear() {
      engine.clear();
      onAfterMutation();
    },
    onChange(cb) { return engine.onChange(cb); },
  };
  return controller;
}

const TEXT_COALESCE_MS = 300;

export function createApi(
  registry: InstanceRegistry,
): { api: EditorApi; internals: ApiInternals; teardown: () => void } {
  const contentChange = new EventBus<[string, string]>();
  const dirtyChange = new EventBus<[string, boolean]>();
  const saveEvent = new EventBus<[string]>();
  const prefsChange = new EventBus<[string, UserPrefs]>();
  const inspectorValueChange = new EventBus<[string, unknown]>();

  const historyRegistry = new HistoryRegistry();
  const inspectors = new InspectorRegistry((id) => {
    historyRegistry.release(id);
  });

  // Cached controllers so external callers get a stable reference.
  const controllers = new Map<string, HistoryController>();
  function history(id: string): HistoryController {
    let c = controllers.get(id);
    if (!c) {
      const isInspector = () => inspectors.has(id);
      c = makeController(historyRegistry, id, () => {
        if (isInspector()) {
          inspectorValueChange.emit(id, inspectors.get(id)?.value ?? null);
        }
      });
      controllers.set(id, c);
    }
    return c;
  }

  function releaseHistory(id: string): void {
    historyRegistry.release(id);
    controllers.delete(id);
  }

  const api: EditorApi = {
    getContent(instanceId) {
      const entry = registry.get(instanceId);
      return entry ? entry.document.content : null;
    },
    isDirty(instanceId) {
      const entry = registry.get(instanceId);
      return entry ? entry.document.dirty : false;
    },
    getDocument(instanceId) {
      const entry = registry.get(instanceId);
      return entry ? entry.document : null;
    },
    listInstances() {
      return registry.list();
    },
    openDocument(id, opts) {
      registry.open(id, opts);
    },
    closeDocument(id) {
      if (registry.close(id)) releaseHistory(id);
    },
    updateContent(id, content, cursorStart, cursorEnd) {
      const entry = registry.get(id);
      if (!entry) return;
      const doc = entry.document;
      const before = doc.content;
      if (before === content) return;
      const cursorBefore = doc.cursorStart;

      const setter = (c: string, cur: number) => {
        doc.content = c;
        doc.cursorStart = cur;
        doc.cursorEnd = cur;
        contentChange.emit(id, c);
      };

      // Mutate first; push does not apply.
      doc.content = content;
      doc.cursorStart = cursorStart;
      doc.cursorEnd = cursorEnd;

      const ctrl = history(id);
      const now = Date.now();
      const top = ctrl.peek();
      const prevSnap = top?.meta?.kind === 'text-swap'
        ? (top.meta as any).snapshot as { before: string; after: string; cursorBefore: number; cursorAfter: number } | undefined
        : undefined;
      const isSingleChar = Math.abs(content.length - before.length) <= 1;
      const withinWindow = prevSnap && top?.meta?.timestamp != null && now - (top.meta.timestamp as number) < TEXT_COALESCE_MS;

      if (prevSnap && isSingleChar && withinWindow) {
        ctrl.replaceTop(createTextSwapCommand({
          setter,
          before: prevSnap.before,
          after: content,
          cursorBefore: prevSnap.cursorBefore,
          cursorAfter: cursorStart,
          now,
        }));
      } else {
        ctrl.push(createTextSwapCommand({
          setter,
          before,
          after: content,
          cursorBefore,
          cursorAfter: cursorStart,
          now,
        }));
      }

      const wasDirty = doc.dirty;
      doc.dirty = true;
      // contentChange already emitted by setter on future undo/redo; for the
      // initial push we emit once here since setter was not called.
      contentChange.emit(id, content);
      if (!wasDirty) dirtyChange.emit(id, true);
    },
    markClean(id) {
      const entry = registry.get(id);
      if (!entry) return;
      if (entry.document.dirty) {
        entry.document.dirty = false;
        dirtyChange.emit(id, false);
      }
    },
    onContentChange(cb) { return contentChange.on(cb); },
    onDirtyChange(cb) { return dirtyChange.on(cb); },
    onSave(cb) { return saveEvent.on(cb); },
    onPrefsChange(cb) { return prefsChange.on(cb); },

    openInspector(id, opts: OpenInspectorOptions) {
      inspectors.open(id, opts);
    },
    closeInspector(id) {
      if (inspectors.close(id)) releaseHistory(id);
    },
    getInspectorValue(id) {
      return inspectors.get(id)?.value ?? null;
    },
    listInspectorInstances() {
      return inspectors.list();
    },
    onInspectorValueChange(cb) { return inspectorValueChange.on(cb); },

    history,
  };

  const internals: ApiInternals = {
    emitSave(id) { saveEvent.emit(id); },
    contentChange,
    dirtyChange,
    saveEvent,
    prefsChange,
    inspectorValueChange,
    history,
    inspectors,
  };

  const teardown = () => {
    contentChange.clear();
    dirtyChange.clear();
    saveEvent.clear();
    prefsChange.clear();
    inspectorValueChange.clear();
    historyRegistry.clear();
    controllers.clear();
    inspectors.clear();
  };

  return { api, internals, teardown };
}
