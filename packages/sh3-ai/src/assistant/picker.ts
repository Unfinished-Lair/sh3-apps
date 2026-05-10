import type { FieldKind } from 'sh3-core';

export interface AddrLike {
  shardId: string;
  slotId?: string;
  fieldId: string;
}

export interface FieldLike extends AddrLike {
  label: string;
  kind: FieldKind;
}

const SEP = '␟';

export function addrKey(a: AddrLike): string {
  return `${a.shardId}${SEP}${a.slotId ?? ''}${SEP}${a.fieldId}`;
}

export function sortFields<T extends FieldLike>(fvs: T[]): T[] {
  return [...fvs].sort((a, b) => {
    if (a.shardId !== b.shardId) return a.shardId.localeCompare(b.shardId);
    const aSlot = a.slotId ?? '';
    const bSlot = b.slotId ?? '';
    if (aSlot !== bSlot) return aSlot.localeCompare(bSlot);
    return a.label.localeCompare(b.label);
  });
}

export function matchesFilter(fv: FieldLike, q: string): boolean {
  if (q === '') return true;
  const ql = q.toLowerCase();
  return (
    fv.label.toLowerCase().includes(ql) ||
    fv.shardId.toLowerCase().includes(ql) ||
    fv.fieldId.toLowerCase().includes(ql)
  );
}

export function excludeAddr<T extends FieldLike>(fvs: T[], target: AddrLike): T[] {
  const key = addrKey(target);
  return fvs.filter((f) => addrKey(f) !== key);
}
