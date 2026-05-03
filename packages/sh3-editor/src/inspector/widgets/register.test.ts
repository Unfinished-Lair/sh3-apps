import { describe, it, expect } from 'vitest';

import { registerBuiltinWidgets } from './register';
import { INSPECTOR_RENDERER_POINT, type InspectorRenderer } from '../contributions';

interface Captured {
  pointId: string;
  contribution: InspectorRenderer;
}

function mockCtx(captured: Captured[]) {
  return {
    contributions: {
      register: <T>(pointId: string, contribution: T) => {
        captured.push({ pointId, contribution: contribution as unknown as InspectorRenderer });
        return () => {};
      },
    },
  };
}

describe('registerBuiltinWidgets', () => {
  it('registers all widgets at INSPECTOR_RENDERER_POINT with priority 10', () => {
    const captured: Captured[] = [];
    const ctx = mockCtx(captured);
    registerBuiltinWidgets(ctx as any);
    expect(captured.length).toBeGreaterThan(0);
    for (const c of captured) {
      expect(c.pointId).toBe(INSPECTOR_RENDERER_POINT);
      expect(c.contribution.priority).toBe(10);
      expect(typeof c.contribution.id).toBe('string');
      expect(typeof c.contribution.type).toBe('string');
    }
  });

  it('returns a disposer that unregisters every contribution', () => {
    const captured: Captured[] = [];
    const disposes: number[] = [];
    const ctx = {
      contributions: {
        register: <T>(_p: string, _c: T) => {
          const idx = disposes.length;
          disposes.push(0);
          return () => { disposes[idx] = 1; };
        },
      },
    };
    const dispose = registerBuiltinWidgets(ctx as any);
    dispose();
    expect(disposes.every((x) => x === 1)).toBe(true);
  });

  it('expected widget tags present', () => {
    const captured: Captured[] = [];
    registerBuiltinWidgets(mockCtx(captured) as any);
    const tags = captured.map((c) => c.contribution.type).sort();
    expect(tags).toEqual([
      'file', 'icon-toggle', 'number', 'range', 'segmented',
      'select', 'slider', 'slider-group', 'string', 'text',
    ]);
  });
});
