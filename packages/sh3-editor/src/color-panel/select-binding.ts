import type { ColorPanelDescriptor } from './contributions';

/** Minimal shape of an intra-shard color-picker entry the dispatch needs. */
export interface ColorPickerEntryLike {
  value: string;
}

/** Ad-hoc meta the dispatch reads when neither entry nor descriptor matches. */
export interface ColorPanelAdHocMeta {
  value?: string;
  readonly?: boolean;
}

/** Discriminated union of where the picker should source its value from. */
export type BindingSource =
  | { kind: 'entry'; entry: ColorPickerEntryLike }
  | { kind: 'descriptor'; descriptor: ColorPanelDescriptor }
  | { kind: 'adhoc'; adHocValue: string | undefined; adHocReadonly: boolean };

/**
 * Pure dispatch: pick exactly one binding source for `slotId` in priority order:
 *   1. The intra-shard registry `entry` if present.
 *   2. The first descriptor in `descriptors` whose `slotId` matches.
 *   3. Ad-hoc fallback from `MountContext.meta`.
 *
 * No reactive dependencies — caller is responsible for re-running this if
 * any input changes (today, dispatch is captured at mount time).
 */
export function selectBindingSource(
  slotId: string,
  entry: ColorPickerEntryLike | undefined,
  descriptors: ColorPanelDescriptor[],
  adHocMeta: ColorPanelAdHocMeta | undefined,
): BindingSource {
  if (entry) return { kind: 'entry', entry };
  const matched = descriptors.find((d) => d.slotId === slotId);
  if (matched) return { kind: 'descriptor', descriptor: matched };
  return {
    kind: 'adhoc',
    adHocValue: adHocMeta?.value,
    adHocReadonly: adHocMeta?.readonly ?? false,
  };
}
