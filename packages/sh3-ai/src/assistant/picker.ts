import type { FieldAddress, FieldKind } from 'sh3-core';
import type { ContextSource } from 'sh3-core';

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

export function matchesFilter(item: FieldLike | ContextSource, q: string): boolean {
  if (q === '') return true;
  const ql = q.toLowerCase();
  if ('fieldId' in item) {
    return (
      item.label.toLowerCase().includes(ql) ||
      item.shardId.toLowerCase().includes(ql) ||
      item.fieldId.toLowerCase().includes(ql)
    );
  }
  return (
    item.label.toLowerCase().includes(ql) ||
    item.id.toLowerCase().includes(ql) ||
    (item.group?.toLowerCase().includes(ql) ?? false) ||
    (item.description?.toLowerCase().includes(ql) ?? false)
  );
}

export function excludeAddr<T extends FieldLike>(fvs: T[], target: AddrLike): T[] {
  const key = addrKey(target);
  return fvs.filter((f) => addrKey(f) !== key);
}

export type SelectedEntry =
  | { kind: 'field'; addr: FieldAddress }
  | { kind: 'source'; id: string }
  | { kind: 'document'; shardId: string; path: string };

export function entryKey(entry: SelectedEntry): string {
  switch (entry.kind) {
    case 'field':
      return `field:${entry.addr.shardId}${SEP}${entry.addr.slotId ?? ''}${SEP}${entry.addr.fieldId}`;
    case 'source':
      return `source:${entry.id}`;
    case 'document':
      return `document:${entry.shardId}/${entry.path}`;
  }
}

export interface SourceGroup {
  group: string;
  items: ContextSource[];
}

export function groupSources(sources: ContextSource[]): SourceGroup[] {
  if (sources.length === 0) return [];
  const buckets = new Map<string, ContextSource[]>();
  for (const s of sources) {
    const key = s.group ?? 'Other';
    const arr = buckets.get(key) ?? [];
    arr.push(s);
    buckets.set(key, arr);
  }
  const sortedKeys = [...buckets.keys()].sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });
  return sortedKeys.map((group) => ({
    group,
    items: [...(buckets.get(group) ?? [])].sort((a, b) => a.label.localeCompare(b.label)),
  }));
}
