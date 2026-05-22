import { describe, it, expect } from 'vitest';
import { addrKey, sortFields, matchesFilter, excludeAddr, entryKey, groupSources, type FieldLike, type AddrLike, type SelectedEntry } from './picker';
import type { ContextSource } from 'sh3-core';

const FV = (
  shardId: string,
  fieldId: string,
  label: string,
  slotId?: string,
): FieldLike => ({ shardId, fieldId, label, slotId, kind: 'string' });

describe('addrKey', () => {
  it('builds a stable key from shardId, slotId, fieldId', () => {
    expect(addrKey({ shardId: 's', slotId: 'a', fieldId: 'f' }))
      .toBe(addrKey({ shardId: 's', slotId: 'a', fieldId: 'f' }));
  });
  it('treats absent slotId distinct from empty string slotId only by being undefined', () => {
    expect(addrKey({ shardId: 's', fieldId: 'f' }))
      .toBe(addrKey({ shardId: 's', slotId: '', fieldId: 'f' }));
  });
  it('produces different keys for different fieldIds', () => {
    expect(addrKey({ shardId: 's', fieldId: 'a' }))
      .not.toBe(addrKey({ shardId: 's', fieldId: 'b' }));
  });
  it('produces different keys for different shardIds', () => {
    expect(addrKey({ shardId: 'x', fieldId: 'f' }))
      .not.toBe(addrKey({ shardId: 'y', fieldId: 'f' }));
  });
});

describe('sortFields', () => {
  it('sorts by shardId, then slotId, then label', () => {
    const fvs = [
      FV('z-shard', 'f1', 'Title'),
      FV('a-shard', 'f2', 'Z-Field', 'main'),
      FV('a-shard', 'f3', 'A-Field', 'main'),
      FV('a-shard', 'f4', 'Mid', 'aaa'),
    ];
    const sorted = sortFields(fvs);
    expect(sorted.map((f) => f.label)).toEqual(['Mid', 'A-Field', 'Z-Field', 'Title']);
  });
  it('does not mutate the input', () => {
    const fvs = [FV('b', 'f', 'B'), FV('a', 'f', 'A')];
    const before = [...fvs];
    sortFields(fvs);
    expect(fvs).toEqual(before);
  });
});

describe('matchesFilter', () => {
  const fv = FV('sh3-editor', 'body', 'Body Text', 'editor.main');
  it('returns true on empty query', () => {
    expect(matchesFilter(fv, '')).toBe(true);
  });
  it('matches case-insensitively against label', () => {
    expect(matchesFilter(fv, 'BODY')).toBe(true);
  });
  it('matches against shardId', () => {
    expect(matchesFilter(fv, 'editor')).toBe(true);
  });
  it('matches against fieldId', () => {
    expect(matchesFilter(fv, 'body')).toBe(true);
  });
  it('returns false on no match', () => {
    expect(matchesFilter(fv, 'zzz')).toBe(false);
  });
});

describe('excludeAddr', () => {
  it('drops the entry whose triple matches', () => {
    const fvs = [
      FV('sh3-editor', 'body', 'Body', 'main'),
      FV('sh3-editor', 'title', 'Title', 'main'),
    ];
    const target: AddrLike = { shardId: 'sh3-editor', slotId: 'main', fieldId: 'body' };
    const out = excludeAddr(fvs, target);
    expect(out.map((f) => f.fieldId)).toEqual(['title']);
  });
  it('keeps everything when no match', () => {
    const fvs = [FV('sh3-editor', 'body', 'Body')];
    const target: AddrLike = { shardId: 'other', fieldId: 'body' };
    expect(excludeAddr(fvs, target).length).toBe(1);
  });
});

const SRC = (id: string, label: string, group?: string): ContextSource => ({
  id, label, group, get: () => '',
});

describe('entryKey', () => {
  it('namespaces field entries with field: prefix and matches addrKey ordering', () => {
    const a: SelectedEntry = { kind: 'field', addr: { shardId: 's', slotId: 'a', fieldId: 'f' } };
    const b: SelectedEntry = { kind: 'field', addr: { shardId: 's', slotId: 'a', fieldId: 'f' } };
    expect(entryKey(a)).toBe(entryKey(b));
    expect(entryKey(a).startsWith('field:')).toBe(true);
  });
  it('namespaces source entries with source: prefix and uses the source id verbatim', () => {
    const e: SelectedEntry = { kind: 'source', id: 'my-app:notes' };
    expect(entryKey(e)).toBe('source:my-app:notes');
  });
  it('namespaces document entries with document: prefix and uses shardId/path', () => {
    const e: SelectedEntry = { kind: 'document', shardId: 'sh3-server', path: 'docs/README.md' };
    expect(entryKey(e)).toBe('document:sh3-server/docs/README.md');
  });
  it('produces distinct keys across kinds even when the underlying id matches', () => {
    const f: SelectedEntry = { kind: 'field',  addr: { shardId: 'x', fieldId: 'y' } };
    const s: SelectedEntry = { kind: 'source', id: 'x:y' };
    expect(entryKey(f)).not.toBe(entryKey(s));
  });
});

describe('groupSources', () => {
  it('clusters by group, alphabetizing group names', () => {
    const out = groupSources([
      SRC('app:a', 'A', 'Zeta'),
      SRC('app:b', 'B', 'Alpha'),
      SRC('app:c', 'C', 'Alpha'),
    ]);
    expect(out.map((g) => g.group)).toEqual(['Alpha', 'Zeta']);
    expect(out[0].items.map((s) => s.label)).toEqual(['B', 'C']);
  });
  it('groups undefined under "Other" and places it last', () => {
    const out = groupSources([
      SRC('app:a', 'A', 'Apps'),
      SRC('app:b', 'B'),
    ]);
    expect(out.map((g) => g.group)).toEqual(['Apps', 'Other']);
    expect(out[1].items.map((s) => s.label)).toEqual(['B']);
  });
  it('sorts items alphabetically within each group by label', () => {
    const out = groupSources([
      SRC('app:z', 'Zeta',  'g'),
      SRC('app:a', 'Alpha', 'g'),
    ]);
    expect(out[0].items.map((s) => s.label)).toEqual(['Alpha', 'Zeta']);
  });
  it('returns an empty array on empty input', () => {
    expect(groupSources([])).toEqual([]);
  });
});

describe('matchesFilter (widened for ContextSource)', () => {
  const src = SRC('my-app:notes', 'Current Notes', 'My App');
  it('returns true on empty query for sources too', () => {
    expect(matchesFilter(src, '')).toBe(true);
  });
  it('matches case-insensitively against source label', () => {
    expect(matchesFilter(src, 'CURRENT')).toBe(true);
  });
  it('matches against source id', () => {
    expect(matchesFilter(src, 'my-app:notes')).toBe(true);
  });
  it('matches against source group', () => {
    expect(matchesFilter(src, 'my app')).toBe(true);
  });
  it('returns false on no match for a source', () => {
    expect(matchesFilter(src, 'zzz')).toBe(false);
  });
});
