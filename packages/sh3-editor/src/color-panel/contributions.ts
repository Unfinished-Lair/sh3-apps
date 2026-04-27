/**
 * Cross-shard contribution point id for the live color panel binding.
 *
 * External shards register a `ColorPanelDescriptor` here keyed by their
 * layout slot's `slotId`. The picker view, mounted by the host's layout
 * at the matching slot, dispatches to the descriptor for the lifetime of
 * the slot. See `docs/sh3-editor/color-picker.md` §1.6.
 *
 * External consumers MUST inline this string literal — never import it as
 * a runtime value across shards (sh3-core 0.10.x+ runtime model).
 */
export const COLOR_PANEL_POINT = 'sh3-editor.color-panel';

/**
 * Descriptor a host registers at `COLOR_PANEL_POINT` to bind a live color
 * panel mounted into its own `App.initialLayout` at `slotId`.
 *
 * Picker dispatch priority (handled inside sh3-editor):
 *   1. Intra-shard `EditorApi.openColorPicker(slotId, ...)` entry
 *   2. This descriptor
 *   3. Ad-hoc `MountContext.meta`
 */
export interface ColorPanelDescriptor {
  /** Must match the slotId of the SlotNode / TabEntry that mounts the picker. */
  slotId: string;
  /** Seed hex; invalid hex coerces to '#000000'. */
  initial: string;
  /** Fires on every user commit (drag end, slider, hex Enter/blur, swatch click,
   *  palette save, history undo/redo). NOT fired by controller.setValue. */
  onChange: (hex: string) => void;
  /** Called exactly once after the picker mounts and is ready to accept setValue. */
  bind?: (ctrl: ColorPanelController) => void;
}

/**
 * Controller handed back to the host via `ColorPanelDescriptor.bind` after
 * the panel mounts. The reference becomes a no-op after the picker unmounts.
 */
export interface ColorPanelController {
  /**
   * Push a new value into the panel without emitting `onChange` (no echo).
   * Invalid hex coerces to '#000000'. Pushed values participate in the
   * panel's history controller (Ctrl+Z / Ctrl+Y still work).
   */
  setValue(hex: string): void;
}
