import { describe, it, expect, vi } from 'vitest';
import { bindInspector } from './inspector-binding';
import { InstanceRegistry } from './model/instance-registry.svelte';
import { createApi } from './model/api';
import {
  INSPECTOR_INSTANCE_POINT,
  type InspectorInstanceContribution,
  type InspectorBindHandle,
} from './inspector/contributions';

function makeContext(descriptors: InspectorInstanceContribution[] = []) {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  const contributions = {
    list: <T>(pointId: string): T[] =>
      pointId === INSPECTOR_INSTANCE_POINT
        ? (descriptors as unknown as T[])
        : [],
    register: <T>(_pointId: string, _desc: T) => () => {},
    onChange: (_pointId: string, _cb: () => void) => () => {},
    listPoints: () => [INSPECTOR_INSTANCE_POINT],
  };
  return { registry, internals, contributions };
}

describe('bindInspector — seed-or-reuse + fallback', () => {
  it('does not re-seed an entry that already exists (open beats seed)', () => {
    const ctx = makeContext([
      { slotId: 'slot-A', seed: { value: 'from-seed' } },
    ]);
    ctx.internals.inspectors.open('slot-A', { value: 'from-imperative-open' });
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(entry?.value).toBe('from-imperative-open');
  });

  it('returns undefined when no contribution AND no registry entry', () => {
    const ctx = makeContext([]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(entry).toBeUndefined();
  });

  it('returns the existing entry when no contribution but registry has it', () => {
    const ctx = makeContext([]);
    ctx.internals.inspectors.open('slot-A', { value: { legacy: true } });
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(entry?.value).toEqual({ legacy: true });
  });

  it('threads seed.meta / readonly / toolbarActions / onCommit into the entry', () => {
    const action = { id: 'a', label: 'A', onAction: () => {} };
    const onCommit = () => true;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: {
        value: { x: 1 },
        meta: { label: 'Root' },
        readonly: true,
        toolbarActions: [action],
      },
      onCommit,
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(entry?.meta?.label).toBe('Root');
    expect(entry?.options.readonly).toBe(true);
    expect(entry?.options.toolbarActions).toEqual([action]);
    expect(entry?.options.onCommit).toBe(onCommit);
  });
});

describe('bindInspector — contribution selection', () => {
  it('returns the matching descriptor entry seeded from seed.value', () => {
    const value = { x: 1 };
    const ctx = makeContext([
      { slotId: 'slot-A', seed: { value } },
    ]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(entry?.value).toBe(value);
  });

  it('ignores contributions with mismatched slotId', () => {
    const ctx = makeContext([
      { slotId: 'slot-OTHER', seed: { value: { other: true } } },
    ]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(entry).toBeUndefined();
  });

  it('first registered wins on slotId collision and warns', () => {
    const warn = vi.fn();
    const ctx = makeContext([
      { slotId: 'slot-A', seed: { value: 'first' } },
      { slotId: 'slot-A', seed: { value: 'second' } },
    ]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx, warn });
    expect(entry?.value).toBe('first');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('slot-A');
  });
});

describe('bindInspector — bind handle + value swap', () => {
  it('captures the bind handle at mount and disposes on cleanup', () => {
    let captured: InspectorBindHandle | null = null;
    let disposed = false;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 } },
      bind(handle) {
        captured = handle;
        return () => { disposed = true; };
      },
    }]);
    const { cleanup } = bindInspector({ slotId: 'slot-A', ...ctx });
    expect(captured).not.toBeNull();
    expect(typeof captured!.replace).toBe('function');
    expect(captured!.history).toBeDefined();
    cleanup();
    expect(disposed).toBe(true);
  });

  it('replace({ value }) mutates entry, clears history, fires inspectorValueChange', () => {
    let captured!: InspectorBindHandle;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 } },
      bind(h) { captured = h; return () => {}; },
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });

    ctx.internals.history('slot-A').push({ apply() {}, revert() {} });
    expect(ctx.internals.history('slot-A').canUndo).toBe(true);

    const valueSpy = vi.fn();
    ctx.internals.inspectorValueChange.on(valueSpy);

    const next = { n: 2 };
    captured.replace({ value: next });

    expect(entry?.value).toBe(next);
    expect(ctx.internals.history('slot-A').canUndo).toBe(false);
    expect(valueSpy).toHaveBeenCalledWith('slot-A', next);
  });

  it('replace({ value: same }) is silent (===, no events, no history clear)', () => {
    let captured!: InspectorBindHandle;
    const same = { n: 1 };
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: same },
      bind(h) { captured = h; return () => {}; },
    }]);
    bindInspector({ slotId: 'slot-A', ...ctx });
    ctx.internals.history('slot-A').push({ apply() {}, revert() {} });
    const valueSpy = vi.fn();
    ctx.internals.inspectorValueChange.on(valueSpy);

    captured.replace({ value: same });

    expect(ctx.internals.history('slot-A').canUndo).toBe(true);
    expect(valueSpy).not.toHaveBeenCalled();
  });

  it('replace({ value: undefined }) IS a swap (explicit clear)', () => {
    let captured!: InspectorBindHandle;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 } },
      bind(h) { captured = h; return () => {}; },
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    const valueSpy = vi.fn();
    ctx.internals.inspectorValueChange.on(valueSpy);

    captured.replace({ value: undefined });

    expect(entry?.value).toBeUndefined();
    expect(valueSpy).toHaveBeenCalledWith('slot-A', undefined);
  });

  it('handle.history is the same controller internals.history(slotId) returns', () => {
    let captured!: InspectorBindHandle;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: {} },
      bind(h) { captured = h; return () => {}; },
    }]);
    bindInspector({ slotId: 'slot-A', ...ctx });
    expect(captured.history).toBe(ctx.internals.history('slot-A'));
  });
});

describe('bindInspector — field-only swaps are silent', () => {
  it('replace({ meta }) updates entry.meta, no value events, history intact', () => {
    let captured!: InspectorBindHandle;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 }, meta: { label: 'Old' } },
      bind(h) { captured = h; return () => {}; },
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    ctx.internals.history('slot-A').push({ apply() {}, revert() {} });
    const valueSpy = vi.fn();
    ctx.internals.inspectorValueChange.on(valueSpy);

    captured.replace({ meta: { label: 'New' } });

    expect(entry?.meta?.label).toBe('New');
    expect(ctx.internals.history('slot-A').canUndo).toBe(true);
    expect(valueSpy).not.toHaveBeenCalled();
  });

  it('replace({ readonly: true }) updates entry.options.readonly silently', () => {
    let captured!: InspectorBindHandle;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: {}, readonly: false },
      bind(h) { captured = h; return () => {}; },
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    const valueSpy = vi.fn();
    ctx.internals.inspectorValueChange.on(valueSpy);

    captured.replace({ readonly: true });

    expect(entry?.options.readonly).toBe(true);
    expect(valueSpy).not.toHaveBeenCalled();
  });

  it('replace({ toolbarActions }) replaces the array silently', () => {
    let captured!: InspectorBindHandle;
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: {}, toolbarActions: [] },
      bind(h) { captured = h; return () => {}; },
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });
    const action = { id: 'a', label: 'A', onAction: () => {} };
    const valueSpy = vi.fn();
    ctx.internals.inspectorValueChange.on(valueSpy);

    captured.replace({ toolbarActions: [action] });

    expect(entry?.options.toolbarActions).toEqual([action]);
    expect(valueSpy).not.toHaveBeenCalled();
  });
});

describe('bindInspector — onValueChange forwarder', () => {
  it('fires only for matching slotId', () => {
    const onValueChange = vi.fn();
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 } },
      onValueChange,
    }]);
    bindInspector({ slotId: 'slot-A', ...ctx });

    ctx.internals.inspectorValueChange.emit('slot-A', { n: 2 });
    ctx.internals.inspectorValueChange.emit('slot-OTHER', { other: true });

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith({ n: 2 });
  });

  it('cleanup unsubscribes the forwarder', () => {
    const onValueChange = vi.fn();
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 } },
      onValueChange,
    }]);
    const { cleanup } = bindInspector({ slotId: 'slot-A', ...ctx });
    cleanup();
    ctx.internals.inspectorValueChange.emit('slot-A', { n: 2 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('two slots are isolated — A callback never sees B traffic', () => {
    const aSpy = vi.fn();
    const bSpy = vi.fn();
    const ctx = makeContext([
      { slotId: 'slot-A', seed: { value: 'a' }, onValueChange: aSpy },
      { slotId: 'slot-B', seed: { value: 'b' }, onValueChange: bSpy },
    ]);
    bindInspector({ slotId: 'slot-A', ...ctx });
    bindInspector({ slotId: 'slot-B', ...ctx });

    ctx.internals.inspectorValueChange.emit('slot-A', 'edit-A');
    ctx.internals.inspectorValueChange.emit('slot-B', 'edit-B');

    expect(aSpy).toHaveBeenCalledWith('edit-A');
    expect(aSpy).toHaveBeenCalledTimes(1);
    expect(bSpy).toHaveBeenCalledWith('edit-B');
    expect(bSpy).toHaveBeenCalledTimes(1);
  });

  it('replace({ value }) is observed by the contribution onValueChange', () => {
    let captured!: InspectorBindHandle;
    const onValueChange = vi.fn();
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value: { n: 1 } },
      bind(h) { captured = h; return () => {}; },
      onValueChange,
    }]);
    bindInspector({ slotId: 'slot-A', ...ctx });
    captured.replace({ value: { n: 2 } });
    expect(onValueChange).toHaveBeenCalledWith({ n: 2 });
  });
});

describe('bindInspector — outside-the-slot history via handle', () => {
  it('handle.history.undo() runs the last command and fires onValueChange', () => {
    let captured!: InspectorBindHandle;
    const onValueChange = vi.fn();
    const value = { n: 1 } as { n: number };
    const ctx = makeContext([{
      slotId: 'slot-A',
      seed: { value },
      bind(h) { captured = h; return () => {}; },
      onValueChange,
    }]);
    const { entry } = bindInspector({ slotId: 'slot-A', ...ctx });

    value.n = 2;
    captured.history.push({
      apply()  { value.n = 2; },
      revert() { value.n = 1; },
    });
    expect(value.n).toBe(2);

    onValueChange.mockClear();
    captured.history.undo();

    expect(value.n).toBe(1);
    expect(onValueChange).toHaveBeenCalledWith(entry?.value);
  });
});
