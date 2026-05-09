import { describe, it, expect } from 'vitest';
import { SketchState } from './state';
import { makeSketchTools } from './tools';
import type { Tool } from '../catalog/types';

function setup(viewOpen = false) {
  const state = new SketchState();
  let isOpen = viewOpen;
  const tools = makeSketchTools({
    state,
    isViewOpen: () => isOpen,
  });
  const byName = new Map<string, Tool>(tools.map((t) => [t.name, t]));
  return {
    state,
    tools,
    byName,
    setViewOpen(v: boolean) { isOpen = v; },
  };
}

const opts = { signal: new AbortController().signal };

describe('makeSketchTools — surface', () => {
  it('exposes ai.sketch.show with sh3-ai.tool source', () => {
    const { tools } = setup();
    expect(tools).toHaveLength(1);
    const t = tools[0];
    expect(t.name).toBe('ai.sketch.show');
    expect(t.source).toBe('sh3-ai.tool');
    expect(typeof t.description).toBe('string');
    expect(t.description.length).toBeGreaterThan(0);
  });

  it('inputSchema requires html and exposes mode enum', () => {
    const { byName } = setup();
    const schema = byName.get('ai.sketch.show')!.inputSchema as {
      type: string;
      properties: Record<string, { type: string; enum?: string[] }>;
      required: string[];
    };
    expect(schema.type).toBe('object');
    expect(schema.required).toEqual(['html']);
    expect(schema.properties.html.type).toBe('string');
    expect(schema.properties.mode.type).toBe('string');
    expect(schema.properties.mode.enum).toEqual(['inline', 'isolated']);
  });
});

describe('ai.sketch.show — run', () => {
  it("default mode is inline; reports viewOpen=false when view is closed", async () => {
    const { state, byName } = setup(false);
    const out = await byName.get('ai.sketch.show')!.run({ html: '<b>hi</b>' }, opts);
    expect(out).toEqual({ ok: true, viewOpen: false });
    expect(state.current).toEqual({ html: '<b>hi</b>', mode: 'inline' });
  });

  it('honors explicit isolated mode', async () => {
    const { state, byName } = setup(false);
    await byName.get('ai.sketch.show')!.run({ html: '<b>hi</b>', mode: 'isolated' }, opts);
    expect(state.current).toEqual({ html: '<b>hi</b>', mode: 'isolated' });
  });

  it('rejects missing html', async () => {
    const { byName } = setup();
    await expect(byName.get('ai.sketch.show')!.run({}, opts)).rejects.toThrow(/missing.*html/);
  });

  it('rejects empty html', async () => {
    const { byName } = setup();
    await expect(byName.get('ai.sketch.show')!.run({ html: '' }, opts)).rejects.toThrow(
      /missing.*html/,
    );
  });

  it('rejects unknown mode', async () => {
    const { byName } = setup();
    await expect(
      byName.get('ai.sketch.show')!.run({ html: 'x', mode: 'oops' }, opts),
    ).rejects.toThrow(/inline.*isolated/);
  });

  it('reports viewOpen=true when isViewOpen returns true', async () => {
    const { byName, setViewOpen } = setup(false);
    setViewOpen(true);
    const out = await byName.get('ai.sketch.show')!.run({ html: 'x' }, opts);
    expect(out).toEqual({ ok: true, viewOpen: true });
  });

  it('signal is accepted but ignored — aborted signal still resolves', async () => {
    const { byName } = setup();
    const ac = new AbortController();
    ac.abort();
    const out = await byName
      .get('ai.sketch.show')!
      .run({ html: 'x' }, { signal: ac.signal });
    expect(out).toEqual({ ok: true, viewOpen: false });
  });
});
