import { describe, it, expect } from 'vitest';
import { normalizeRect, nodesInRect } from './marquee';

describe('normalizeRect', () => {
  it('returns top-left/bottom-right regardless of input order', () => {
    expect(normalizeRect({ x: 10, y: 10 }, { x: 20, y: 30 })).toEqual({
      x: 10, y: 10, w: 10, h: 20,
    });
    expect(normalizeRect({ x: 20, y: 30 }, { x: 10, y: 10 })).toEqual({
      x: 10, y: 10, w: 10, h: 20,
    });
    expect(normalizeRect({ x: 20, y: 10 }, { x: 10, y: 30 })).toEqual({
      x: 10, y: 10, w: 10, h: 20,
    });
  });

  it('handles degenerate zero-size rect', () => {
    expect(normalizeRect({ x: 5, y: 5 }, { x: 5, y: 5 })).toEqual({
      x: 5, y: 5, w: 0, h: 0,
    });
  });
});

describe('nodesInRect', () => {
  const nodes = [
    { id: 'a', position: { x: 0, y: 0 }, width: 100, height: 50 },
    { id: 'b', position: { x: 200, y: 0 }, width: 100, height: 50 },
    { id: 'c', position: { x: 0, y: 200 }, width: 100, height: 50 },
  ];

  it('returns nodes whose AABB overlaps the marquee', () => {
    const hits = nodesInRect(nodes, { x: -10, y: -10, w: 50, h: 50 });
    expect(hits.sort()).toEqual(['a']);
  });

  it('returns multiple nodes when overlapped', () => {
    const hits = nodesInRect(nodes, { x: -10, y: -10, w: 400, h: 100 });
    expect(hits.sort()).toEqual(['a', 'b']);
  });

  it('returns empty when no overlap', () => {
    const hits = nodesInRect(nodes, { x: 500, y: 500, w: 50, h: 50 });
    expect(hits).toEqual([]);
  });

  it('touching edges count as overlap', () => {
    // Marquee right edge at x=0 meets node a's left edge at x=0.
    const hits = nodesInRect(nodes, { x: -50, y: 0, w: 50, h: 10 });
    expect(hits).toEqual(['a']);
  });

  it('marquee entirely inside a node still counts as overlap', () => {
    const hits = nodesInRect(nodes, { x: 10, y: 10, w: 5, h: 5 });
    expect(hits).toEqual(['a']);
  });
});
