import { describe, it, expect, beforeEach } from 'vitest';
import { setRenderers, resolveRenderer, __reset } from './registry';
import type { InspectorRenderer } from './contributions';
import type { Component } from 'svelte';

const A = {} as Component<any>;
const B = {} as Component<any>;
const C = {} as Component<any>;

function r(id: string, type: string, component: Component<any>, priority?: number): InspectorRenderer {
  return { id, type, component, priority };
}

beforeEach(() => __reset());

describe('resolveRenderer', () => {
  it('returns walker for plain objects when no type tag matches', () => {
    const res = resolveRenderer({ x: 1 }, undefined);
    expect(res.kind).toBe('walker');
  });

  it('returns walker for arrays', () => {
    const res = resolveRenderer([1, 2, 3], undefined);
    expect(res.kind).toBe('walker');
  });

  it('returns leaf for primitives at the top level', () => {
    expect(resolveRenderer(42, undefined).kind).toBe('leaf');
    expect(resolveRenderer('hi', undefined).kind).toBe('leaf');
    expect(resolveRenderer(null, undefined).kind).toBe('leaf');
    expect(resolveRenderer(undefined, undefined).kind).toBe('leaf');
  });

  it('returns leaf for exotics (Map, class instance)', () => {
    class Foo {}
    expect(resolveRenderer(new Map(), undefined).kind).toBe('leaf');
    expect(resolveRenderer(new Foo(), undefined).kind).toBe('leaf');
  });

  it('dispatches custom renderer when meta.type matches', () => {
    setRenderers([r('x', 'foo', A)]);
    const res = resolveRenderer({}, { type: 'foo' });
    expect(res.kind).toBe('custom');
    if (res.kind === 'custom') expect(res.component).toBe(A);
  });

  it('dispatches custom renderer when value.__type matches', () => {
    setRenderers([r('x', 'foo', A)]);
    const res = resolveRenderer({ __type: 'foo', v: 1 }, undefined);
    expect(res.kind).toBe('custom');
    if (res.kind === 'custom') expect(res.component).toBe(A);
  });

  it('meta.type wins over value.__type when both present', () => {
    setRenderers([r('x', 'foo', A), r('y', 'bar', B)]);
    const res = resolveRenderer({ __type: 'foo' }, { type: 'bar' });
    expect(res.kind).toBe('custom');
    if (res.kind === 'custom') expect(res.component).toBe(B);
  });

  it('meta.type that matches no renderer falls through to __type', () => {
    setRenderers([r('x', 'foo', A)]);
    const res = resolveRenderer({ __type: 'foo' }, { type: 'nothing-registered' });
    expect(res.kind).toBe('custom');
    if (res.kind === 'custom') expect(res.component).toBe(A);
  });

  it('higher priority wins on type-tag ties', () => {
    setRenderers([r('x', 'foo', A, 10), r('y', 'foo', B, 20)]);
    const res = resolveRenderer({}, { type: 'foo' });
    if (res.kind === 'custom') expect(res.component).toBe(B);
    else throw new Error('expected custom');
  });

  it('ties within priority break by registration order (first wins)', () => {
    setRenderers([r('x', 'foo', A), r('y', 'foo', B)]);
    const res = resolveRenderer({}, { type: 'foo' });
    if (res.kind === 'custom') expect(res.component).toBe(A);
    else throw new Error('expected custom');
  });
});
