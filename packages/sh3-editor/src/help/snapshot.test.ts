import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHelpSnapshot, setHelpSnapshot, clearHelpSnapshot, onHelpSnapshotChange,
  type HelpSnapshot,
} from './snapshot';

const sample: HelpSnapshot = {
  activeAppId: 'sh3-pipeline',
  focusedViewId: 'sh3-editor:graph',
  mountedViewIds: ['sh3-editor:graph'],
  selection: null,
  capturedAt: 1000,
};

beforeEach(() => clearHelpSnapshot());

describe('help snapshot pub/sub', () => {
  it('returns null when no snapshot is set', () => {
    expect(getHelpSnapshot()).toBeNull();
  });

  it('round-trips a set snapshot', () => {
    setHelpSnapshot(sample);
    expect(getHelpSnapshot()).toEqual(sample);
  });

  it('notifies subscribers on set and clear', () => {
    const seen: Array<HelpSnapshot | null> = [];
    const off = onHelpSnapshotChange((s) => seen.push(s));
    setHelpSnapshot(sample);
    clearHelpSnapshot();
    off();
    setHelpSnapshot(sample);
    expect(seen).toEqual([sample, null]);
  });
});
