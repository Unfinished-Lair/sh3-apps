import { describe, it, expect } from 'vitest';
import { resolveScope } from './resolve';
import type { Scope } from './types';

const A: Scope = { id: 'A', label: 'A', whitelist: ['a.*'], blacklist: ['a.bad'] };
const B: Scope = { id: 'B', label: 'B', extends: ['A'], whitelist: ['b.*'], blacklist: [] };
const C: Scope = { id: 'C', label: 'C', extends: ['B'], whitelist: ['c.*'], blacklist: ['b.also-bad'] };
const CYCLE_X: Scope = { id: 'X', label: 'X', extends: ['Y'], whitelist: [], blacklist: [] };
const CYCLE_Y: Scope = { id: 'Y', label: 'Y', extends: ['X'], whitelist: [], blacklist: [] };

describe('resolveScope', () => {
  it('returns own whitelist/blacklist when no extends', () => {
    const r = resolveScope(A, () => undefined);
    expect(r.whitelist).toEqual(['a.*']);
    expect(r.blacklist).toEqual(['a.bad']);
  });

  it('flattens single-level extends', () => {
    const lookup = (id: string) => (id === 'A' ? A : undefined);
    const r = resolveScope(B, lookup);
    expect(r.whitelist.sort()).toEqual(['a.*', 'b.*'].sort());
    expect(r.blacklist).toEqual(['a.bad']);
  });

  it('flattens transitive extends', () => {
    const lookup = (id: string) => ({ A, B } as Record<string, Scope>)[id];
    const r = resolveScope(C, lookup);
    expect(r.whitelist.sort()).toEqual(['a.*', 'b.*', 'c.*'].sort());
    expect(r.blacklist.sort()).toEqual(['a.bad', 'b.also-bad'].sort());
  });

  it('skips unknown extends ids without throwing', () => {
    const lookup = () => undefined;
    const r = resolveScope(B, lookup);
    expect(r.whitelist).toEqual(['b.*']);
    expect(r.blacklist).toEqual([]);
  });

  it('throws on a direct cycle', () => {
    const lookup = (id: string) => ({ X: CYCLE_X, Y: CYCLE_Y } as Record<string, Scope>)[id];
    expect(() => resolveScope(CYCLE_X, lookup)).toThrow(/cycle/i);
  });

  it('dedupes patterns when multiple branches contribute the same pattern', () => {
    const D: Scope = { id: 'D', label: 'D', extends: ['A'], whitelist: ['a.*'], blacklist: [] };
    const lookup = (id: string) => (id === 'A' ? A : undefined);
    const r = resolveScope(D, lookup);
    expect(r.whitelist).toEqual(['a.*']); // one entry, not two
  });
});
