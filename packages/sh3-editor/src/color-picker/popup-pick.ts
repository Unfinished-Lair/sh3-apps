export interface SettleState {
  escapePressed: boolean;
  userTouched: boolean;
  currentValue: string;
}

/**
 * Decides what value to resolve the pick promise with, based on the wrapper's
 * end-of-life flags. Pure function — owned here so it's exhaustively unit-
 * testable without mounting the wrapper.
 *
 * - Escape pressed (any time)        → null   ("user dismissed")
 * - Never interacted (no onChange)   → null   ("dismissed without picking")
 * - Otherwise                        → currentValue
 */
export function decideSettleValue(state: SettleState): string | null {
  if (state.escapePressed) return null;
  if (!state.userTouched) return null;
  return state.currentValue;
}

/**
 * Coerces an `opts.initial` value to a guaranteed valid `#rrggbb` string.
 * Anything that doesn't match the strict 6-digit hex pattern (including
 * undefined, 3-digit shorthand, RGBA 8-digit, or non-hex) becomes `#000000`.
 * Matches the standalone view's "invalid hex falls back to #000000" rule
 * documented in docs/sh3-editor/color-picker.md §2.
 */
export function normalizeOrFallback(initial: string | undefined): string {
  if (initial && /^#[0-9a-f]{6}$/i.test(initial)) return initial;
  return '#000000';
}

import { shell } from 'sh3-core';
import type { ColorPickOptions } from 'sh3-core';
import type { ColorPalette } from '../types';

export interface PickDeps {
  userPalettes: ColorPalette[];
  onSaveUserPalette: (palette: ColorPalette) => void;
  onDeleteUserPalette: (paletteId: string) => void;
}

/**
 * Meta payload threaded from `openColorPickerPopup` → `shell.float.open`
 * → `MountContext.meta` → `sh3-editor:color-pick` view factory →
 * `PopupPickWrapper` props. Kept here so the shard's view factory and
 * the opener share one type.
 */
export interface ColorPickViewMeta {
  initial: string;
  title?: string;
  userPalettes: ColorPalette[];
  onSaveUserPalette: (palette: ColorPalette) => void;
  onDeleteUserPalette: (paletteId: string) => void;
  onResolve: (hex: string | null) => void;
}

/**
 * Opens the color-picker surface as a dismissable float and resolves with
 * the user's chosen hex on commit (outside-click), or `null` on Escape /
 * never-interacted dismissal. See PopupPickWrapper.svelte for lifecycle.
 *
 * Threads `opts.anchor` straight into FloatOptions so the float-manager can
 * portal the frame above its opening overlay (modal, popup, parent float)
 * — without this, a picker invoked from inside a modal would render under
 * it. When `opts.anchor` is omitted, the float renders at the FloatLayer
 * root.
 *
 * `opts.alpha` is intentionally ignored — sh3-editor V1 doesn't support RGBA.
 * Callers requesting alpha get `#rrggbb` and detect via string length per the
 * sh3-core spec.
 */
export function openColorPickerPopup(
  opts: ColorPickOptions,
  deps: PickDeps,
): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const meta: ColorPickViewMeta = {
      initial: normalizeOrFallback(opts.initial),
      title: opts.title,
      userPalettes: deps.userPalettes,
      onSaveUserPalette: deps.onSaveUserPalette,
      onDeleteUserPalette: deps.onDeleteUserPalette,
      onResolve: resolve,
    };
    shell.float.open('sh3-editor:color-pick', {
      dismissable: true,
      anchor: opts.anchor,
      meta: meta as unknown as Record<string, unknown>,
    });
  });
}
