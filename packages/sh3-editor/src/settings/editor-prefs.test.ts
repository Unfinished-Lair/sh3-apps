import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getEditorPrefs, setGridStyle, subscribeEditorPrefs,
  hydrateEditorPrefs, _resetForTests,
  DEFAULT_EDITOR_PREFS, type GridStyle,
} from './editor-prefs';

describe('editor-prefs', () => {
  beforeEach(() => { _resetForTests(); });

  it('starts at defaults', () => {
    expect(getEditorPrefs()).toEqual(DEFAULT_EDITOR_PREFS);
  });

  it('setGridStyle updates the value', () => {
    setGridStyle('dots');
    expect(getEditorPrefs().gridStyle).toBe('dots');
  });

  it('subscribers fire on change with the new prefs', () => {
    const cb = vi.fn();
    const unsubscribe = subscribeEditorPrefs(cb);
    setGridStyle('none');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls[0][0]).toEqual({ gridStyle: 'none' });
    unsubscribe();
    setGridStyle('cells');
    expect(cb).toHaveBeenCalledTimes(1); // not called after unsubscribe
  });

  it('subscribers do not fire when value is unchanged', () => {
    const cb = vi.fn();
    subscribeEditorPrefs(cb);
    setGridStyle('cells'); // default is 'cells'
    expect(cb).not.toHaveBeenCalled();
  });

  it('hydrateEditorPrefs accepts a valid blob and skips the subscriber', () => {
    const cb = vi.fn();
    subscribeEditorPrefs(cb);
    hydrateEditorPrefs({ gridStyle: 'dots' });
    expect(getEditorPrefs().gridStyle).toBe('dots');
    expect(cb).not.toHaveBeenCalled();
  });

  it('hydrateEditorPrefs ignores malformed blobs and keeps defaults', () => {
    hydrateEditorPrefs(null);
    expect(getEditorPrefs()).toEqual(DEFAULT_EDITOR_PREFS);
    hydrateEditorPrefs({ gridStyle: 'not-a-style' as GridStyle });
    expect(getEditorPrefs()).toEqual(DEFAULT_EDITOR_PREFS);
    hydrateEditorPrefs({ unrelated: 42 } as unknown);
    expect(getEditorPrefs()).toEqual(DEFAULT_EDITOR_PREFS);
  });
});
