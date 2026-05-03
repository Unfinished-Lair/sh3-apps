import { describe, it, expect, vi, beforeEach } from 'vitest';
import { warnOnce, __resetWarnState } from './warn';

beforeEach(() => __resetWarnState());

describe('warnOnce', () => {
  it('emits once per (slotId, tag) pair', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnOnce('slot-A', 'slider', 'value mismatch');
    warnOnce('slot-A', 'slider', 'value mismatch');
    warnOnce('slot-A', 'slider', 'value mismatch');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('emits separately for different slots', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnOnce('slot-A', 'slider', 'msg');
    warnOnce('slot-B', 'slider', 'msg');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it('emits separately for different tags within a slot', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnOnce('slot-A', 'slider', 'msg');
    warnOnce('slot-A', 'select', 'msg');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
