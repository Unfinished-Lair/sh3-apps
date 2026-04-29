export interface Viewport { x: number; y: number; zoom: number; }

export function clampZoom(z: number): number {
  return Math.min(3, Math.max(0.2, z));
}

export function clientToGraph(
  client: { x: number; y: number },
  rect: { left: number; top: number },
  vp: Viewport,
): { x: number; y: number } {
  const cx = client.x - rect.left;
  const cy = client.y - rect.top;
  return {
    x: (cx - vp.x) / vp.zoom,
    y: (cy - vp.y) / vp.zoom,
  };
}

export function fitToContent(
  nodes: Iterable<{ position: { x: number; y: number }; width: number; height: number }>,
  canvas: { w: number; h: number },
  padding = 80,
): Viewport {
  const arr = Array.from(nodes);
  if (arr.length === 0) return { x: 0, y: 0, zoom: 1 };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of arr) {
    if (n.position.x < minX) minX = n.position.x;
    if (n.position.y < minY) minY = n.position.y;
    if (n.position.x + n.width > maxX) maxX = n.position.x + n.width;
    if (n.position.y + n.height > maxY) maxY = n.position.y + n.height;
  }

  const w = maxX - minX;
  const h = maxY - minY;
  const availW = Math.max(1, canvas.w - 2 * padding);
  const availH = Math.max(1, canvas.h - 2 * padding);
  const rawZoom = Math.min(availW / w, availH / h, 1); // never zoom *in* on fit
  const zoom = clampZoom(rawZoom);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return {
    x: canvas.w / 2 - cx * zoom,
    y: canvas.h / 2 - cy * zoom,
    zoom,
  };
}
