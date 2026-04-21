import type { ApiInternals } from '../model/api';
import type { ColorPalette } from '../types';

/** Dependencies the color renderer needs from the shard (ambient singleton).
 *  Set on shard activate; cleared on deactivate. */
export interface ColorRendererDeps {
  internals: ApiInternals;
  userPalettes: ColorPalette[];
  onSaveUserPalette: (palette: ColorPalette) => void;
  onDeleteUserPalette: (id: string) => void;
}

let current: ColorRendererDeps | null = null;

export function setColorRendererDeps(d: ColorRendererDeps | null): void {
  current = d;
}

export function getColorRendererDeps(): ColorRendererDeps | null {
  return current;
}
