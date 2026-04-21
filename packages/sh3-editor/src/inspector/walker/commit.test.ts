import { describe, it, expect, vi } from 'vitest';
import { attemptCommit } from './commit';

describe('attemptCommit', () => {
  it('calls fallback when override is undefined', () => {
    const fallback = vi.fn();
    const handled = attemptCommit(undefined, ['fill'], '#ff0000', fallback);
    expect(handled).toBe(false);
    expect(fallback).toHaveBeenCalledOnce();
  });

  it('calls fallback when override returns false', () => {
    const fallback = vi.fn();
    const override = vi.fn(() => false);
    const handled = attemptCommit(override, ['fill'], '#ff0000', fallback);
    expect(override).toHaveBeenCalledWith(['fill'], '#ff0000');
    expect(fallback).toHaveBeenCalledOnce();
    expect(handled).toBe(false);
  });

  it('calls fallback when override returns undefined (void)', () => {
    const fallback = vi.fn();
    const override = vi.fn(() => {});
    const handled = attemptCommit(override, ['fill'], '#ff0000', fallback);
    expect(fallback).toHaveBeenCalledOnce();
    expect(handled).toBe(false);
  });

  it('skips fallback when override returns true', () => {
    const fallback = vi.fn();
    const override = vi.fn(() => true);
    const handled = attemptCommit(override, ['fill'], '#ff0000', fallback);
    expect(override).toHaveBeenCalledWith(['fill'], '#ff0000');
    expect(fallback).not.toHaveBeenCalled();
    expect(handled).toBe(true);
  });

  it('forwards the path array untouched to the override', () => {
    const override = vi.fn(() => true);
    const path = ['nodes', 3, 'style', 'stroke'] as (string | number)[];
    attemptCommit(override, path, '#000', vi.fn());
    expect(override).toHaveBeenCalledWith(path, '#000');
    expect(override.mock.calls[0][0]).toBe(path);
  });

  it('lets override throw — fallback is not called and error propagates', () => {
    const fallback = vi.fn();
    const boom = new Error('consumer bug');
    const override = vi.fn(() => { throw boom; });
    expect(() => attemptCommit(override, ['x'], 1, fallback)).toThrow(boom);
    expect(fallback).not.toHaveBeenCalled();
  });
});
