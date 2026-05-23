import type { MountContext } from 'sh3-core';
import type { ApiInternals } from './model/api';

/** Forward this slot's editor-side dirty bit to its tab via `MountContext.setDirty`,
 *  giving every editor instance the colored tab-ring indicator for free. The host
 *  owns the visual; we just bridge `internals.dirtyChange` → `context.setDirty`
 *  filtered to the mount's own slot.
 *
 *  Returns the unsubscribe; call from the view factory's `unmount`. */
export function bindTabDirty(
  slotId: string,
  internals: ApiInternals,
  context: Pick<MountContext, 'setDirty'>,
): () => void {
  return internals.dirtyChange.on((id, dirty) => {
    if (id === slotId) context.setDirty(dirty);
  });
}
