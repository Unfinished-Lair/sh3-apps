import { describe, it, expect } from 'vitest';
import { addrKey, sortFields, matchesFilter, excludeAddr, type FieldLike, type AddrLike } from './picker';

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
