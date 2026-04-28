export interface Point { x: number; y: number; }

/** Cubic Bézier with horizontal control offset proportional to dx, clamped. */
export function cubicEdgePath(src: Point, tgt: Point): string {
  const dx = Math.abs(tgt.x - src.x);
  const offset = Math.max(40, Math.min(160, dx * 0.5));
  const c1 = { x: src.x + offset, y: src.y };
  const c2 = { x: tgt.x - offset, y: tgt.y };
  return `M ${src.x} ${src.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${tgt.x} ${tgt.y}`;
}
