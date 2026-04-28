import { describe, it, expect, vi } from 'vitest';
import { graphAssetToState } from '../state/bridge';
import { createGraphController } from '../views/controller';
import { createGraphDomain } from '../domain/create';
import { createDomainRegistry } from '../domain/registry';
import {
  makeAddNodeCommand,
} from '../history/commands';
import type { GraphAsset } from '../asset/types';

describe('graph smoke', () => {
  it('descriptor flow: register domain, mount, mutate, observe onChange', () => {
    const reg = createDomainRegistry();
    reg.register({
      id: 'shader',
      factory: () => createGraphDomain({
        id: 'shader', label: 'Shader',
        templates: [{
          type: 'tex.sample', category: 'Sampler', label: 'Sample Texture',
          ports: [
            { id: 'uv', label: 'UV', direction: 'input', dataType: 'vec2' },
            { id: 'col', label: 'Color', direction: 'output', dataType: 'vec4' },
          ],
          defaultConfig: { wrap: 'repeat' },
        }],
      }),
    });

    const dom = reg.get('shader')!;
    const initial: GraphAsset = {
      id: 'g1', name: 'demo', domain: 'shader', version: 1, nodes: [], edges: [],
    };
    const state = graphAssetToState(initial, dom);
    const onChange = vi.fn();
    const ctrl = createGraphController(state, dom, undefined, () => onChange(ctrl.getAsset()));

    // add a node
    const cmd = makeAddNodeCommand(state, dom, {
      id: 'n1', type: 'tex.sample', position: { x: 10, y: 10 },
      config: { wrap: 'repeat' },
      ports: [
        { id: 'n1_uv',  label: 'UV',    direction: 'input',  dataType: 'vec2' },
        { id: 'n1_col', label: 'Color', direction: 'output', dataType: 'vec4' },
      ],
    });
    cmd.apply(); ctrl.history.push(cmd);
    // controller does not auto-emit on raw command push — emulate Graph.svelte's hook:
    onChange(ctrl.getAsset());

    expect(state.nodes.size).toBe(1);
    expect(onChange).toHaveBeenCalledTimes(1);

    // undo via controller's history
    ctrl.history.undo();
    expect(state.nodes.size).toBe(0);
    ctrl.history.redo();
    expect(state.nodes.size).toBe(1);

    // setAsset should NOT emit onChange
    onChange.mockClear();
    ctrl.setAsset({ ...initial, nodes: [], edges: [] });
    expect(onChange).not.toHaveBeenCalled();
    expect(ctrl.getAsset().nodes).toHaveLength(0);
  });

  it('missing domain produces null lookup', () => {
    const reg = createDomainRegistry();
    expect(reg.get('not-registered')).toBeNull();
  });
});
