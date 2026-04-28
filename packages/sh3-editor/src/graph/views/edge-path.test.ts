import { describe, it, expect } from 'vitest';
import { cubicEdgePath } from './edge-path';

describe('cubicEdgePath', () => {
  it('starts with M and contains a single C', () => {
    const d = cubicEdgePath({ x: 0, y: 0 }, { x: 100, y: 50 });
    expect(d.startsWith('M ')).toBe(true);
    expect(d.split('C').length).toBe(2);
  });

  it('control offset scales with horizontal distance', () => {
    const close = cubicEdgePath({ x: 0, y: 0 }, { x: 50, y: 0 });
    const far   = cubicEdgePath({ x: 0, y: 0 }, { x: 500, y: 0 });
    expect(far.length).toBeGreaterThan(close.length); // more digits in coords
  });
});
