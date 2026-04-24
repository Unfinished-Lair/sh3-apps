import { describe, it, expect } from 'vitest';
import { captureHelpSnapshot, type SnapshotInputs } from './captureSnapshot';

function inputs(overrides: Partial<SnapshotInputs> = {}): SnapshotInputs {
  return {
    getActiveApp: () => null,
    listMountedViewIds: () => [],
    readFocusedViewId: () => null,
    getSelection: () => null,
    now: () => 1000,
    ...overrides,
  };
}

describe('captureHelpSnapshot', () => {
  it('collects all inputs into a snapshot', () => {
    const snap = captureHelpSnapshot(inputs({
      getActiveApp: () => 'sh3-demo',
      listMountedViewIds: () => ['sh3-editor:editor', 'sh3-editor:inspector'],
      readFocusedViewId: () => 'sh3-editor:editor',
      getSelection: () => ({ type: 'color', ref: { hex: '#fff' } }),
      now: () => 42,
    }));
    expect(snap).toEqual({
      activeAppId: 'sh3-demo',
      focusedViewId: 'sh3-editor:editor',
      mountedViewIds: ['sh3-editor:editor', 'sh3-editor:inspector'],
      selection: { type: 'color', ref: { hex: '#fff' } },
      capturedAt: 42,
    });
  });

  it('handles all-null inputs cleanly', () => {
    const snap = captureHelpSnapshot(inputs());
    expect(snap.activeAppId).toBeNull();
    expect(snap.focusedViewId).toBeNull();
    expect(snap.selection).toBeNull();
    expect(snap.mountedViewIds).toEqual([]);
    expect(snap.capturedAt).toBe(1000);
  });

  it('mountedViewIds is a readonly copy (does not alias caller)', () => {
    const src = ['a', 'b'];
    const snap = captureHelpSnapshot(inputs({ listMountedViewIds: () => src }));
    src.push('c');
    expect(snap.mountedViewIds).toEqual(['a', 'b']);
  });
});
