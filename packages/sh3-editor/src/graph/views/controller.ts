import type { GraphAsset } from '../asset/types';
import type { GraphDomain } from '../domain/types';
import type { GraphState, NodeId, EdgeId } from '../state/types';
import type { GraphController, GraphInspectorBinding, GraphViewDescriptor } from '../contributions';
import { graphAssetToState, graphStateToAsset } from '../state/bridge';
import { makeReplaceAssetCommand } from '../history/commands';
import { fieldsToInspectorMeta, makeNodeConfigOverride } from '../inspector/bridge';
import type { HistoryController, HistoryCommand } from '../../types';

interface FocusHandler {
  focus(target: { nodeId: NodeId } | { rect: { x: number; y: number; w: number; h: number } }): void;
  fitToContent(): void;
}

export function createHistoryController(): HistoryController {
  const undoStack: HistoryCommand[] = [];
  const redoStack: HistoryCommand[] = [];
  const subs = new Set<() => void>();
  function emit() { for (const cb of subs) cb(); }
  return {
    push(cmd) { undoStack.push(cmd); redoStack.length = 0; emit(); },
    undo() {
      const cmd = undoStack.pop();
      if (!cmd) return false;
      cmd.revert();
      redoStack.push(cmd);
      emit();
      return true;
    },
    redo() {
      const cmd = redoStack.pop();
      if (!cmd) return false;
      cmd.apply();
      undoStack.push(cmd);
      emit();
      return true;
    },
    peek() { return undoStack[undoStack.length - 1] ?? null; },
    replaceTop(cmd) {
      if (undoStack.length === 0) return false;
      undoStack[undoStack.length - 1] = cmd;
      emit();
      return true;
    },
    get canUndo() { return undoStack.length > 0; },
    get canRedo() { return redoStack.length > 0; },
    clear() { undoStack.length = 0; redoStack.length = 0; emit(); },
    onChange(cb) { subs.add(cb); return () => subs.delete(cb); },
  };
}

export type InternalGraphController = GraphController & { _isAlive(): boolean; _kill(): void };

export function createGraphController(
  state: GraphState,
  dom: GraphDomain,
  descriptor: GraphViewDescriptor | undefined,
  onAssetChanged: () => void,
  focus?: FocusHandler,
): InternalGraphController {
  const history = createHistoryController();
  let alive = true;
  const selectionSubs = new Set<(s: (NodeId | EdgeId)[]) => void>();
  function emitSelection() {
    const arr = Array.from(state.selection) as (NodeId | EdgeId)[];
    for (const cb of selectionSubs) cb(arr);
  }

  return {
    setAsset(asset: GraphAsset) {
      if (!alive) return;
      const cmd = makeReplaceAssetCommand(state, dom, asset);
      cmd.apply();
      history.push(cmd);
      // No onChange echo per spec §9.1.
    },
    getAsset() {
      return graphStateToAsset(state);
    },
    select(ids) {
      if (!alive) return;
      state.selection.clear();
      for (const id of ids) state.selection.add(id);
      emitSelection();
    },
    clearSelection() {
      if (!alive) return;
      if (state.selection.size === 0) { emitSelection(); return; }
      state.selection.clear();
      emitSelection();
    },
    focus(target) { if (alive) focus?.focus(target); },
    fitToContent() { if (alive) focus?.fitToContent(); },
    history,
    onSelectionChange(cb) {
      selectionSubs.add(cb);
      return () => selectionSubs.delete(cb);
    },
    getSelectedInspectorBinding(): GraphInspectorBinding | null {
      if (!alive) return null;
      const sel = Array.from(state.selection);
      if (sel.length !== 1) return null;
      const id = sel[0];
      const node = state.nodes.get(id);
      if (!node) return null;       // an edge id, not a node
      return {
        value: node.config,
        meta: fieldsToInspectorMeta(node.configFields),
        onCommit: makeNodeConfigOverride(
          node.id, state, dom, history, descriptor?.onCommit, onAssetChanged,
        ),
      };
    },
    _isAlive() { return alive; },
    _kill() { alive = false; },
  };
}
