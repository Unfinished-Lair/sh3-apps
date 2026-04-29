import { describe, it, expect, beforeEach } from 'vitest';
import {
  setActiveGraph, getActiveGraph, clearActiveGraphIf,
  type ActiveGraphRef,
} from './active';

function makeRef(): ActiveGraphRef {
  return {
    state: {} as ActiveGraphRef['state'],
    domain: {} as ActiveGraphRef['domain'],
    history: {} as ActiveGraphRef['history'],
    onAssetChanged() {},
    onSelectionChange() {},
  };
}

describe('graph/active', () => {
  beforeEach(() => {
    // module state leaks between tests — reset via a sentinel ref then clear.
    const sentinel = makeRef();
    setActiveGraph(sentinel);
    clearActiveGraphIf(sentinel);
  });

  it('starts with no active graph', () => {
    expect(getActiveGraph()).toBeNull();
  });

  it('setActiveGraph stores the ref', () => {
    const ref = makeRef();
    setActiveGraph(ref);
    expect(getActiveGraph()).toBe(ref);
  });

  it('clearActiveGraphIf only clears when ref matches (LIFO swap)', () => {
    const a = makeRef();
    const b = makeRef();

    setActiveGraph(a);
    setActiveGraph(b); // b wins

    // unmount of A fires after B's mount: clearing A must not blank B.
    clearActiveGraphIf(a);
    expect(getActiveGraph()).toBe(b);

    clearActiveGraphIf(b);
    expect(getActiveGraph()).toBeNull();
  });
});
