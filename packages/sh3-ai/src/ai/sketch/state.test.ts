import { describe, it, expect, vi } from 'vitest';
import { SketchState, type SketchSnapshot } from './state';

describe('SketchState', () => {
  it('current is null initially', () => {
    const s = new SketchState();
    expect(s.current).toBeNull();
  });

  it('set then current returns the snapshot', () => {
    const s = new SketchState();
    const snap: SketchSnapshot = { html: 'x', mode: 'inline' };
    s.set(snap);
    expect(s.current).toEqual(snap);
  });

  it('clear() resets current to null', () => {
    const s = new SketchState();
    s.set({ html: 'x', mode: 'inline' });
    s.clear();
    expect(s.current).toBeNull();
  });

  it('subscribers added before any set get an immediate null callback', () => {
    const s = new SketchState();
    const fn = vi.fn();
    s.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(null);
  });

  it('subscribers added after a set get an immediate callback with the current snapshot', () => {
    const s = new SketchState();
    s.set({ html: '<b>hi</b>', mode: 'isolated' });
    const fn = vi.fn();
    s.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ html: '<b>hi</b>', mode: 'isolated' });
  });

  it('multiple subscribers all receive set and clear notifications', () => {
    const s = new SketchState();
    const a = vi.fn();
    const b = vi.fn();
    s.subscribe(a);
    s.subscribe(b);
    a.mockClear();
    b.mockClear();

    s.set({ html: 'one', mode: 'inline' });
    expect(a).toHaveBeenCalledWith({ html: 'one', mode: 'inline' });
    expect(b).toHaveBeenCalledWith({ html: 'one', mode: 'inline' });

    s.clear();
    expect(a).toHaveBeenLastCalledWith(null);
    expect(b).toHaveBeenLastCalledWith(null);
  });

  it('unsubscribe stops further notifications for that listener only', () => {
    const s = new SketchState();
    const a = vi.fn();
    const b = vi.fn();
    const offA = s.subscribe(a);
    s.subscribe(b);
    a.mockClear();
    b.mockClear();

    offA();
    s.set({ html: 'x', mode: 'inline' });
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("set accepts both modes; mode round-trips verbatim", () => {
    const s = new SketchState();
    s.set({ html: 'a', mode: 'inline' });
    expect(s.current?.mode).toBe('inline');
    s.set({ html: 'b', mode: 'isolated' });
    expect(s.current?.mode).toBe('isolated');
  });
});
