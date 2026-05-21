import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sh3-core', async () => {
  const actual = await vi.importActual<typeof import('sh3-core')>('sh3-core');
  return {
    ...actual,
    sh3: { toast: { notify: vi.fn() } },
  };
});

import { sh3 } from 'sh3-core';
import { loadIntoSketch } from './loadIntoSketch';
import { SketchState } from './state';

function makeDeps(readResult: string | null = '<html></html>') {
  const state = new SketchState();
  const browse = { readFrom: vi.fn(async () => readResult) };
  const focusOrOpenSketch = vi.fn();
  return { state, browse, focusOrOpenSketch };
}

beforeEach(() => vi.clearAllMocks());

describe('loadIntoSketch', () => {
  it('reads via browse.readFrom(shardId, relPath) and seeds sketch state', async () => {
    const deps = makeDeps('<html>hi</html>');
    await loadIntoSketch('notes', 'sketches/a.html', deps);
    expect(deps.browse.readFrom).toHaveBeenCalledWith('notes', 'sketches/a.html');
    expect(deps.state.current?.html).toBe('<html>hi</html>');
    expect(deps.focusOrOpenSketch).toHaveBeenCalled();
  });

  it('toasts and bails when content is null (file missing)', async () => {
    const deps = makeDeps(null);
    await loadIntoSketch('notes', 'sketches/missing.html', deps);
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('missing.html'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(deps.focusOrOpenSketch).not.toHaveBeenCalled();
  });

  it('toasts on read failure', async () => {
    const state = new SketchState();
    const browse = { readFrom: vi.fn(async () => { throw new Error('boom'); }) };
    const focusOrOpenSketch = vi.fn();
    await loadIntoSketch('notes', 'sketches/a.html', { state, browse, focusOrOpenSketch });
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('boom'),
      expect.objectContaining({ level: 'error' }),
    );
    expect(focusOrOpenSketch).not.toHaveBeenCalled();
  });
});
