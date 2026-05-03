import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDebouncedParser } from './parse';

function flushDebounce() {
  vi.advanceTimersByTime(200);
}

describe('createDebouncedParser', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('emits a successful parse after the debounce window', () => {
    const onSuccess = vi.fn();
    const onError   = vi.fn();
    const parser = createDebouncedParser({ onSuccess, onError, debounceMs: 150 });

    parser.feed('{"a":1}');
    expect(onSuccess).not.toHaveBeenCalled();

    flushDebounce();
    expect(onSuccess).toHaveBeenCalledWith({ a: 1 }, '{"a":1}');
    expect(onError).not.toHaveBeenCalled();
  });

  it('coalesces rapid feeds — only the last is parsed', () => {
    const onSuccess = vi.fn();
    const parser = createDebouncedParser({ onSuccess, onError: () => {}, debounceMs: 150 });

    parser.feed('{"a":');
    parser.feed('{"a":1');
    parser.feed('{"a":1}');
    flushDebounce();

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({ a: 1 }, '{"a":1}');
  });

  it('reports parse errors with the JSON.parse message', () => {
    const onSuccess = vi.fn();
    const onError   = vi.fn();
    const parser = createDebouncedParser({ onSuccess, onError, debounceMs: 150 });

    parser.feed('{ this is not json');
    flushDebounce();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(typeof onError.mock.calls[0][0]).toBe('string');
    expect(onError.mock.calls[0][0]).toMatch(/.+/);
  });

  it('recovers — error then success clears the error path', () => {
    const onSuccess = vi.fn();
    const onError   = vi.fn();
    const parser = createDebouncedParser({ onSuccess, onError, debounceMs: 150 });

    parser.feed('{ broken');
    flushDebounce();
    expect(onError).toHaveBeenCalledTimes(1);

    parser.feed('{"ok":true}');
    flushDebounce();
    expect(onSuccess).toHaveBeenCalledWith({ ok: true }, '{"ok":true}');
    // onError must not be called again on recovery
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('flush() emits immediately, bypassing the debounce window', () => {
    const onSuccess = vi.fn();
    const parser = createDebouncedParser({ onSuccess, onError: () => {}, debounceMs: 150 });

    parser.feed('{"a":1}');
    parser.flush();
    expect(onSuccess).toHaveBeenCalledWith({ a: 1 }, '{"a":1}');
  });

  it('cancel() drops a pending parse', () => {
    const onSuccess = vi.fn();
    const onError   = vi.fn();
    const parser = createDebouncedParser({ onSuccess, onError, debounceMs: 150 });

    parser.feed('{"a":1}');
    parser.cancel();
    flushDebounce();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
