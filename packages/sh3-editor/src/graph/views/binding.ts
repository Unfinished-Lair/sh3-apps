import type { GraphAsset } from '../asset/types';
import type { GraphViewDescriptor } from '../contributions';

export type Binding =
  | { kind: 'descriptor'; descriptor: GraphViewDescriptor }
  | { kind: 'meta'; asset: GraphAsset; domainId: string;
      onChange?: (a: GraphAsset) => void; readonly?: boolean }
  | { kind: 'empty' };

export interface MetaBinding {
  asset?: GraphAsset;
  domainId?: string;
  onChange?: (a: GraphAsset) => void;
  readonly?: boolean;
}

export function pickBinding(
  slotId: string,
  meta: MetaBinding | undefined,
  descriptors: GraphViewDescriptor[],
): Binding {
  const matches = descriptors.filter((d) => d.slotId === slotId);
  if (matches.length > 1) {
    console.warn(`graph: multiple GraphViewDescriptor matches for slot ${slotId}; using first`, matches);
  }
  if (matches.length >= 1) return { kind: 'descriptor', descriptor: matches[0] };
  if (meta && meta.asset && meta.domainId) {
    return {
      kind: 'meta',
      asset: meta.asset,
      domainId: meta.domainId,
      onChange: meta.onChange,
      readonly: meta.readonly,
    };
  }
  return { kind: 'empty' };
}
