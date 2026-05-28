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
    expect(cb.mock.calls[0][0]).toMatchObject({ gridStyle: 'none' });
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

describe('editor-prefs quickAccess', () => {
  beforeEach(() => _resetForTests());

  it('defaults quickAccess to an empty domains map', () => {
    expect(getEditorPrefs().quickAccess).toEqual({ domains: {} });
  });

  it('hydrates a valid quickAccess blob', () => {
    hydrateEditorPrefs({
      gridStyle: 'cells',
      quickAccess: {
        domains: {
          'pipeline': { active: 'default', variants: { default: ['math.add', 'log.print'] } },
        },
      },
    });
    expect(getEditorPrefs().quickAccess.domains.pipeline.active).toBe('default');
    expect(getEditorPrefs().quickAccess.domains.pipeline.variants.default)
      .toEqual(['math.add', 'log.print']);
  });

  it('coerces malformed quickAccess to defaults', () => {
    hydrateEditorPrefs({ quickAccess: { domains: { x: 'not-an-object' } } });
    expect(getEditorPrefs().quickAccess).toEqual({ domains: {} });
  });

  it('drops non-string entries within a variant', () => {
    hydrateEditorPrefs({
      gridStyle: 'cells',
      quickAccess: {
        domains: {
          d: { active: 'a', variants: { a: ['valid', 42, null, 'also-valid'] } },
        },
      },
    });
    expect(getEditorPrefs().quickAccess.domains.d.variants.a).toEqual(['valid', 'also-valid']);
  });
});
