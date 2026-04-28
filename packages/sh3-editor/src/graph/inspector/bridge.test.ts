import { describe, it, expect, vi } from 'vitest';
import { fieldsToInspectorMeta, makeNodeConfigOverride } from './bridge';
import { graphAssetToState } from '../state/bridge';
import { createGraphDomain } from '../domain/create';
import type { FieldDescriptor } from '../state/types';
import type { HistoryController, HistoryCommand } from '../../types';

const dom = createGraphDomain({ id: 't', label: 't' });

function makeHistory(): HistoryController {
  const stack: HistoryCommand[] = [];
  const ctrl: HistoryController = {
    push(cmd) { stack.push(cmd); },
    undo() { return false; },
    redo() { return false; },
    peek() { return stack[stack.length - 1] ?? null; },
    replaceTop() { return false; },
    get canUndo() { return stack.length > 0; },
    get canRedo() { return false; },
    clear() { stack.length = 0; },
    onChange() { return () => {}; },
  };
  return ctrl;
}

describe('fieldsToInspectorMeta', () => {
  it('maps rendererHint to meta.type', () => {
    const fs: FieldDescriptor[] = [
      { key: 'a', label: 'A', type: 'string', rendererHint: 'color' },
    ];
    const meta = fieldsToInspectorMeta(fs);
    expect(meta.fields?.a.type).toBe('color');
  });

  it('maps disabled to meta.readonly', () => {
    const fs: FieldDescriptor[] = [{ key: 'a', label: 'A', type: 'number', disabled: true }];
    const meta = fieldsToInspectorMeta(fs);
    expect(meta.fields?.a.readonly).toBe(true);
  });

  it('maps label', () => {
    const fs: FieldDescriptor[] = [{ key: 'a', label: 'Alpha', type: 'string' }];
    const meta = fieldsToInspectorMeta(fs);
    expect(meta.fields?.a.label).toBe('Alpha');
  });
});

describe('makeNodeConfigOverride', () => {
  it('routes the edit through history (no descriptor onCommit)', () => {
    const state = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [{ id: 'n1', type: 't', position: { x: 0, y: 0 }, config: { x: 1 }, ports: [] }],
      edges: [],
    }, dom);
    const history = makeHistory();
    let assetChanged = 0;
    const override = makeNodeConfigOverride('n1', state, dom, history, undefined, () => assetChanged++);
    const handled = override(['x'], 7);
    expect(handled).toBe(true);
    expect(state.nodes.get('n1')!.config.x).toBe(7);
    expect(history.canUndo).toBe(true);
    expect(assetChanged).toBe(1);
  });

  it('descriptor onCommit returning true short-circuits the history push', () => {
    const state = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [{ id: 'n1', type: 't', position: { x: 0, y: 0 }, config: { x: 1 }, ports: [] }],
      edges: [],
    }, dom);
    const history = makeHistory();
    const onCommit = vi.fn().mockReturnValue(true);
    const override = makeNodeConfigOverride('n1', state, dom, history, onCommit, () => {});
    const handled = override(['x'], 9);
    expect(handled).toBe(true);
    expect(state.nodes.get('n1')!.config.x).toBe(1);  // unchanged
    expect(history.canUndo).toBe(false);
    expect(onCommit).toHaveBeenCalledWith('n1', ['x'], 9);
  });
});
