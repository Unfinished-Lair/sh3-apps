export interface Rect { x: number; y: number; w: number; h: number }

export function normalizeRect(
  a: { x: number; y: number },
  b: { x: number; y: number },
): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const w = Math.abs(a.x - b.x);
  const h = Math.abs(a.y - b.y);
  return { x, y, w, h };
}

export function nodesInRect(
  nodes: { id: string; position: { x: number; y: number }; width: number; height: number }[],
  rect: Rect,
): string[] {
  const r2x = rect.x + rect.w;
  const r2y = rect.y + rect.h;
  const hits: string[] = [];
  for (const n of nodes) {
    const nx2 = n.position.x + n.width;
    const ny2 = n.position.y + n.height;
    const overlap =
      n.position.x <= r2x && nx2 >= rect.x &&
      n.position.y <= r2y && ny2 >= rect.y;
    if (overlap) hits.push(n.id);
  }
  return hits;
}
