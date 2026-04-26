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
import PopupPickWrapper from './PopupPickWrapper.svelte';

export interface PickDeps {
  userPalettes: ColorPalette[];
  onSaveUserPalette: (palette: ColorPalette) => void;
  onDeleteUserPalette: (paletteId: string) => void;
}

/**
 * Mounts the color-picker surface as a `shell.popup` and resolves with the
 * user's chosen hex on commit (outside-click), or `null` on Escape / never-
 * interacted dismissal. See PopupPickWrapper.svelte for the lifecycle.
 *
 * `opts.anchor` is required by `shell.popup` — when omitted we synthesize a
 * virtual point at viewport center (PopupAnchor accepts `{ x, y }`).
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
    const anchor = opts.anchor ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    shell.popup.show(
      PopupPickWrapper as any,
      { anchor },
      {
        initial: normalizeOrFallback(opts.initial),
        title: opts.title,
        userPalettes: deps.userPalettes,
        onSaveUserPalette: deps.onSaveUserPalette,
        onDeleteUserPalette: deps.onDeleteUserPalette,
        onResolve: resolve,
      },
    );
  });
}
