import { describe, it, expect } from 'vitest';
import { clientToGraph, fitToContent, clampZoom, type Viewport } from './viewport';

describe('viewport/clientToGraph', () => {
  const rect = { left: 100, top: 50 } as DOMRect;

  it('identity at zoom=1, translate=0', () => {
    const vp: Viewport = { x: 0, y: 0, zoom: 1 };
    expect(clientToGraph({ x: 150, y: 80 }, rect, vp)).toEqual({ x: 50, y: 30 });
  });

  it('accounts for translate', () => {
    const vp: Viewport = { x: 20, y: 10, zoom: 1 };
    expect(clientToGraph({ x: 150, y: 80 }, rect, vp)).toEqual({ x: 30, y: 20 });
  });

  it('accounts for zoom', () => {
    const vp: Viewport = { x: 0, y: 0, zoom: 2 };
    // canvas-pixel (50, 30) → graph (25, 15)
    expect(clientToGraph({ x: 150, y: 80 }, rect, vp)).toEqual({ x: 25, y: 15 });
  });

  it('combines translate and zoom', () => {
    const vp: Viewport = { x: 20, y: 10, zoom: 0.5 };
    // canvas-pixel (50, 30); subtract translate → (30, 20); divide by zoom → (60, 40)
    expect(clientToGraph({ x: 150, y: 80 }, rect, vp)).toEqual({ x: 60, y: 40 });
  });
});

describe('viewport/clampZoom', () => {
  it('clamps below 0.2', () => { expect(clampZoom(0.05)).toBe(0.2); });
  it('clamps above 3', () => { expect(clampZoom(10)).toBe(3); });
  it('passes through values inside range', () => { expect(clampZoom(1.5)).toBe(1.5); });
});

describe('viewport/fitToContent', () => {
  const canvas = { w: 800, h: 600 };

  it('returns identity when there are no nodes', () => {
    expect(fitToContent([], canvas)).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('centers a single node at zoom=1 when it fits', () => {
    const node = { position: { x: 0, y: 0 }, width: 200, height: 100 };
    const vp = fitToContent([node], canvas, 0);
    expect(vp.zoom).toBe(1);
    // node center (100, 50) → screen center (400, 300): translate = (300, 250)
    expect(vp.x).toBe(300);
    expect(vp.y).toBe(250);
  });

  it('scales down when content exceeds canvas', () => {
    const node = { position: { x: 0, y: 0 }, width: 1600, height: 800 };
    const vp = fitToContent([node], canvas, 0);
    // limited by horizontal: 800/1600 = 0.5
    expect(vp.zoom).toBe(0.5);
  });

  it('honours padding', () => {
    const node = { position: { x: 0, y: 0 }, width: 600, height: 400 };
    // available area shrinks by 2*padding on each axis: (800-160) x (600-160) = 640 x 440
    // node aspect 600x400 → fits at zoom = 640/600 ≈ 1.066, capped at 1
    const vp = fitToContent([node], canvas, 80);
    expect(vp.zoom).toBe(1);
  });

  it('applies clampZoom to the computed scale', () => {
    const node = { position: { x: 0, y: 0 }, width: 10, height: 10 };
    const vp = fitToContent([node], canvas, 0);
    expect(vp.zoom).toBeLessThanOrEqual(3);
  });
});
