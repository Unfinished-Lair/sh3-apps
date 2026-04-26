import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sh3-core', () => ({
  shell: {
    popup: {
      show: vi.fn(),
      close: vi.fn(),
    },
  },
}));

import { shell } from 'sh3-core';
import {
  decideSettleValue,
  normalizeOrFallback,
  openColorPickerPopup,
  type PickDeps,
} from './popup-pick';

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
    (shell.popup.show as ReturnType<typeof vi.fn>).mockClear();
    (globalThis as any).window = { innerWidth: 1024, innerHeight: 768 };
  });

  it('synthesizes a viewport-center anchor when opts.anchor is omitted', () => {
    openColorPickerPopup({}, stubDeps);
    const [, options] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.anchor).toEqual({ x: 512, y: 384 });
  });

  it('passes through opts.anchor when supplied', () => {
    const el = { tagName: 'BUTTON' } as unknown as HTMLElement;
    openColorPickerPopup({ anchor: el }, stubDeps);
    const [, options] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.anchor).toBe(el);
  });

  it('passes a normalized initial into wrapper props (#000000 for invalid)', () => {
    openColorPickerPopup({ initial: 'garbage' }, stubDeps);
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(props.initial).toBe('#000000');
  });

  it('passes valid initial through unchanged', () => {
    openColorPickerPopup({ initial: '#abcdef' }, stubDeps);
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(props.initial).toBe('#abcdef');
  });

  it('ignores opts.alpha (no `alpha` prop forwarded to the wrapper)', () => {
    openColorPickerPopup({ alpha: true, initial: '#ff0000' }, stubDeps);
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(props).not.toHaveProperty('alpha');
    expect(props.initial).toBe('#ff0000');
  });

  it('forwards opts.title to the wrapper', () => {
    openColorPickerPopup({ title: 'Background color' }, stubDeps);
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(props.title).toBe('Background color');
  });

  it('returns a Promise that resolves when wrapper calls onResolve', async () => {
    const promise = openColorPickerPopup({ initial: '#ff0000' }, stubDeps);
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    props.onResolve('#abcdef');
    await expect(promise).resolves.toBe('#abcdef');
  });

  it('returns a Promise that resolves null when wrapper calls onResolve(null)', async () => {
    const promise = openColorPickerPopup({}, stubDeps);
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    props.onResolve(null);
    await expect(promise).resolves.toBe(null);
  });

  it('forwards user-palette deps into wrapper props', () => {
    const onSave = vi.fn();
    const onDelete = vi.fn();
    const palettes = [{ id: 'user-1', name: 'mine', colors: ['#fff'] }];
    openColorPickerPopup({}, {
      userPalettes: palettes as any,
      onSaveUserPalette: onSave,
      onDeleteUserPalette: onDelete,
    });
    const [, , props] = (shell.popup.show as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(props.userPalettes).toBe(palettes);
    expect(props.onSaveUserPalette).toBe(onSave);
    expect(props.onDeleteUserPalette).toBe(onDelete);
  });
});
