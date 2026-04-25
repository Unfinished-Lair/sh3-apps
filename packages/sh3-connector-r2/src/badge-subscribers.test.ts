import { describe, it, expect, vi } from 'vitest';
import { createBadgeSubscribers } from './badge-subscribers';

describe('createBadgeSubscribers', () => {
  it('notifies subscribed callbacks', () => {
    const subs = createBadgeSubscribers();
    const cb = vi.fn();
    subs.subscribe(cb);
    subs.notify();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('disposer stops further notifications', () => {
    const subs = createBadgeSubscribers();
    const cb = vi.fn();
    const off = subs.subscribe(cb);
    subs.notify();
    off();
    subs.notify();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('isolates a throwing subscriber from others', () => {
    const subs = createBadgeSubscribers();
    const ok = vi.fn();
    const onError = vi.fn();
    subs.subscribe(() => { throw new Error('boom'); });
    subs.subscribe(ok);
    subs.notify(onError);
    expect(ok).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('notify with no subscribers is a no-op', () => {
    const subs = createBadgeSubscribers();
    expect(() => subs.notify()).not.toThrow();
  });
});
