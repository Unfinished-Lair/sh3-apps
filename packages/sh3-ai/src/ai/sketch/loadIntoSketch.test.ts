import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sh3-core', async () => {
  const actual = await vi.importActual<typeof import('sh3-core')>('sh3-core');
  return {
    ...actual,
    sh3: { toast: { notify: vi.fn() } },
  };
});

import { sh3, PermissionError } from 'sh3-core';
import { loadIntoSketch } from './loadIntoSketch';
import { SketchState } from './state';

function makeDeps(readResult: string | null = '<html></html>') {
  const state = new SketchState();
  const documents = { readText: vi.fn(async () => readResult), readBinary: vi.fn() };
  const focusOrOpenSketch = vi.fn();
  return { state, documents, focusOrOpenSketch };
}

beforeEach(() => vi.clearAllMocks());

describe('loadIntoSketch', () => {
  it('reads via documents.readText(rootedPath) and seeds sketch state', async () => {
    const deps = makeDeps('<html>hi</html>');
    await loadIntoSketch('notes/sketches/a.html', deps);
    expect(deps.documents.readText).toHaveBeenCalledWith('notes/sketches/a.html');
    expect(deps.state.current?.html).toBe('<html>hi</html>');
    expect(deps.focusOrOpenSketch).toHaveBeenCalled();
  });

  it('toasts and bails when content is null (file missing)', async () => {
    const deps = makeDeps(null);
    await loadIntoSketch('notes/sketches/missing.html', deps);
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('missing.html'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(deps.focusOrOpenSketch).not.toHaveBeenCalled();
  });

  it('toasts on read failure', async () => {
    const state = new SketchState();
    const documents = {
      readText: vi.fn(async () => { throw new Error('boom'); }),
      readBinary: vi.fn(),
    };
    const focusOrOpenSketch = vi.fn();
    await loadIntoSketch('notes/sketches/a.html', { state, documents, focusOrOpenSketch });
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('boom'),
      expect.objectContaining({ level: 'error' }),
    );
    expect(focusOrOpenSketch).not.toHaveBeenCalled();
  });

  it('reports a permission failure as a browse-not-granted warning', async () => {
    const state = new SketchState();
    const documents = {
      readText: vi.fn(async () => {
        throw new PermissionError('boundary', 'other/sketches/a.html');
      }),
      readBinary: vi.fn(),
    };
    const focusOrOpenSketch = vi.fn();
    await loadIntoSketch('other/sketches/a.html', { state, documents, focusOrOpenSketch });
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('documents:browse'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(focusOrOpenSketch).not.toHaveBeenCalled();
  });
});
