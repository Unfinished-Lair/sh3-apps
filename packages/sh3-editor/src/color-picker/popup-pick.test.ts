import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sh3-core', () => ({
  sh3: {
    float: {
      open: vi.fn(() => 'float-1'),
      close: vi.fn(),
    },
  },
}));

import { sh3 } from 'sh3-core';
import {
  decideSettleValue,
  normalizeOrFallback,
  openColorPickerPopup,
  type PickDeps,
} from './popup-pick';

const floatOpen = sh3.float.open as unknown as ReturnType<typeof vi.fn>;

describe('decideSettleValue', () => {
  it('returns null when Escape was pressed (regardless of touch)', () => {
    expect(decideSettleValue({ escapePressed: true,  userTouched: true,  currentValue: '#abcdef' })).toBe(null);
    expect(decideSettleValue({ escapePressed: true,  userTouched: false, currentValue: '#abcdef' })).toBe(null);
  });

  it('returns null when user never touched the picker', () => {
    expect(decideSettleValue({ escapePressed: false, userTouched: false, currentValue: '#abcdef' })).toBe(null);
  });

  it('returns currentValue when user touched and did not press Escape', () => {
    expect(decideSettleValue({ escapePressed: false, userTouched: true,  currentValue: '#abcdef' })).toBe('#abcdef');
  });
});

describe('normalizeOrFallback', () => {
  it('returns valid #rrggbb input unchanged', () => {
    expect(normalizeOrFallback('#abcdef')).toBe('#abcdef');
    expect(normalizeOrFallback('#FF8800')).toBe('#FF8800');
  });

  it('returns #000000 for undefined', () => {
    expect(normalizeOrFallback(undefined)).toBe('#000000');
  });

  it('returns #000000 for malformed strings', () => {
    expect(normalizeOrFallback('garbage')).toBe('#000000');
    expect(normalizeOrFallback('#abc')).toBe('#000000');
    expect(normalizeOrFallback('#abcdefgh')).toBe('#000000');
    expect(normalizeOrFallback('rgb(1,2,3)')).toBe('#000000');
    expect(normalizeOrFallback('')).toBe('#000000');
  });
});

const stubDeps: PickDeps = {
  userPalettes: [],
  onSaveUserPalette: () => {},
  onDeleteUserPalette: () => {},
};

describe('openColorPickerPopup', () => {
  beforeEach(() => {
    floatOpen.mockClear();
  });

  it('opens the sh3-editor:color-pick float with dismissable: true', () => {
    openColorPickerPopup({}, stubDeps);
    const [viewId, options] = floatOpen.mock.calls[0];
    expect(viewId).toBe('sh3-editor:color-pick');
    expect(options.dismissable).toBe(true);
  });

  it('omits anchor when opts.anchor is not supplied (float renders at root)', () => {
    openColorPickerPopup({}, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    expect(options.anchor).toBeUndefined();
  });

  it('threads opts.anchor straight into FloatOptions for overlay portaling', () => {
    const el = { tagName: 'BUTTON' } as unknown as HTMLElement;
    openColorPickerPopup({ anchor: el }, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    expect(options.anchor).toBe(el);
  });

  it('passes a normalized initial through meta (#000000 for invalid)', () => {
    openColorPickerPopup({ initial: 'garbage' }, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    expect(options.meta.initial).toBe('#000000');
  });

  it('passes valid initial through meta unchanged', () => {
    openColorPickerPopup({ initial: '#abcdef' }, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    expect(options.meta.initial).toBe('#abcdef');
  });

  it('does not forward opts.alpha to meta', () => {
    openColorPickerPopup({ alpha: true, initial: '#ff0000' }, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    expect(options.meta).not.toHaveProperty('alpha');
    expect(options.meta.initial).toBe('#ff0000');
  });

  it('forwards opts.title through meta', () => {
    openColorPickerPopup({ title: 'Background color' }, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    expect(options.meta.title).toBe('Background color');
  });

  it('returns a Promise that resolves when meta.onResolve is called', async () => {
    const promise = openColorPickerPopup({ initial: '#ff0000' }, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    options.meta.onResolve('#abcdef');
    await expect(promise).resolves.toBe('#abcdef');
  });

  it('returns a Promise that resolves null when meta.onResolve is called with null', async () => {
    const promise = openColorPickerPopup({}, stubDeps);
    const [, options] = floatOpen.mock.calls[0];
    options.meta.onResolve(null);
    await expect(promise).resolves.toBe(null);
  });

  it('forwards user-palette deps through meta', () => {
    const onSave = vi.fn();
    const onDelete = vi.fn();
    const palettes = [{ id: 'user-1', name: 'mine', colors: ['#fff'] }];
    openColorPickerPopup({}, {
      userPalettes: palettes as any,
      onSaveUserPalette: onSave,
      onDeleteUserPalette: onDelete,
    });
    const [, options] = floatOpen.mock.calls[0];
    expect(options.meta.userPalettes).toBe(palettes);
    expect(options.meta.onSaveUserPalette).toBe(onSave);
    expect(options.meta.onDeleteUserPalette).toBe(onDelete);
  });
});
