import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { makeIdleTimer } from './idle-timer';

describe('makeIdleTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('is a passthrough when idleTimeoutMs is undefined', () => {
    const ext = new AbortController().signal;
    const t = makeIdleTimer(ext, undefined);
    expect(t.signal).toBe(ext);
    // bump/clear are noops; calling them must not throw.
    t.bump();
    t.clear();
  });

  it('is a passthrough when idleTimeoutMs is 0', () => {
    const ext = new AbortController().signal;
    const t = makeIdleTimer(ext, 0);
    expect(t.signal).toBe(ext);
  });

  it('aborts after idleTimeoutMs with no bump', () => {
    const ext = new AbortController().signal;
    const t = makeIdleTimer(ext, 1000);
    expect(t.signal.aborted).toBe(false);
    vi.advanceTimersByTime(999);
    expect(t.signal.aborted).toBe(false);
    vi.advanceTimersByTime(1);
    expect(t.signal.aborted).toBe(true);
    expect((t.signal.reason as Error).name).toBe('TimeoutError');
  });

  it('bump() resets the countdown', () => {
    const ext = new AbortController().signal;
    const t = makeIdleTimer(ext, 1000);
    vi.advanceTimersByTime(800);
    t.bump();
    vi.advanceTimersByTime(800);
    expect(t.signal.aborted).toBe(false);
    vi.advanceTimersByTime(200);
    expect(t.signal.aborted).toBe(true);
  });

  it('clear() prevents the timer from firing', () => {
    const ext = new AbortController().signal;
    const t = makeIdleTimer(ext, 1000);
    t.clear();
    vi.advanceTimersByTime(5000);
    expect(t.signal.aborted).toBe(false);
  });

  it('external abort propagates through the composed signal', () => {
    const ac = new AbortController();
    const t = makeIdleTimer(ac.signal, 5000);
    expect(t.signal.aborted).toBe(false);
    ac.abort();
    expect(t.signal.aborted).toBe(true);
  });
});
