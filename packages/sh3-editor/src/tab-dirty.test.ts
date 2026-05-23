import { describe, it, expect, vi } from 'vitest';
import { bindTabDirty } from './tab-dirty';
import { InstanceRegistry } from './model/instance-registry.svelte';
import { createApi } from './model/api';

function makeInternals() {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  return internals;
}

describe('bindTabDirty', () => {
  it('forwards dirty changes for the bound slot to context.setDirty', () => {
    const internals = makeInternals();
    const setDirty = vi.fn();
    bindTabDirty('slot-A', internals, { setDirty });

    internals.dirtyChange.emit('slot-A', true);
    internals.dirtyChange.emit('slot-A', false);

    expect(setDirty.mock.calls).toEqual([[true], [false]]);
  });

  it('ignores dirty changes for other slots', () => {
    const internals = makeInternals();
    const setDirty = vi.fn();
    bindTabDirty('slot-A', internals, { setDirty });

    internals.dirtyChange.emit('slot-OTHER', true);

    expect(setDirty).not.toHaveBeenCalled();
  });

  it('the returned disposer unsubscribes — no further calls', () => {
    const internals = makeInternals();
    const setDirty = vi.fn();
    const off = bindTabDirty('slot-A', internals, { setDirty });

    internals.dirtyChange.emit('slot-A', true);
    off();
    internals.dirtyChange.emit('slot-A', false);

    expect(setDirty.mock.calls).toEqual([[true]]);
  });
});
