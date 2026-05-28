import { describe, it, expect } from 'vitest';
import { isContained, computeMembership } from './block-membership';
import type { GraphState } from '../state/types';

const rect = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });

describe('isContained', () => {
  it('returns true when node bbox is fully inside block bbox', () => {
    expect(isContained(rect(0,0,100,100), rect(10,10,20,20))).toBe(true);
  });
  it('returns false when node partially overlaps', () => {
    expect(isContained(rect(0,0,100,100), rect(90,90,50,50))).toBe(false);
  });
  it('inclusive boundary — touching edges counts as inside', () => {
    expect(isContained(rect(0,0,100,100), rect(0,0,100,100))).toBe(true);
  });
});

describe('computeMembership', () => {
  it('produces one set per block; nodes assigned to every block containing them', () => {
    const state = {
      blocks: new Map([
        ['B1', { id: 'B1', position: { x: 0, y: 0 }, width: 200, height: 200,
                 color: '#000', alpha: 0.2, label: '', labelAnchor: 'top' as const }],
        ['B2', { id: 'B2', position: { x: 150, y: 150 }, width: 200, height: 200,
                 color: '#000', alpha: 0.2, label: '', labelAnchor: 'top' as const }],
      ]),
      nodes: new Map([
        ['N1', { id: 'N1', position: { x: 10, y: 10 }, width: 50, height: 50 }],
        ['N2', { id: 'N2', position: { x: 160, y: 160 }, width: 30, height: 30 }],
        ['N3', { id: 'N3', position: { x: 500, y: 500 }, width: 30, height: 30 }],
      ]),
    } as unknown as GraphState;
    const cache = computeMembership(state);
    expect([...cache.members.get('B1')!].sort()).toEqual(['N1', 'N2']);
    expect([...cache.members.get('B2')!]).toEqual(['N2']);
    expect([...cache.members.values()].every((s) => !s.has('N3'))).toBe(true);
  });
});
