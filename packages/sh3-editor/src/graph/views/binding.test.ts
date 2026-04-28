import { describe, it, expect, vi } from 'vitest';
import { pickBinding } from './binding';
import type { GraphAsset } from '../asset/types';
import type { GraphViewDescriptor } from '../contributions';

const sampleAsset: GraphAsset = {
  id: 'g', name: '', domain: 't', version: 1, nodes: [], edges: [],
};

describe('pickBinding', () => {
  it('returns descriptor when one matches the slot', () => {
    const d: GraphViewDescriptor = {
      slotId: 'slot-1', domainId: 't', initial: sampleAsset,
      onChange: () => {},
    };
    const r = pickBinding('slot-1', undefined, [d]);
    expect(r.kind).toBe('descriptor');
    if (r.kind === 'descriptor') expect(r.descriptor).toBe(d);
  });

  it('falls through when descriptors do not match the slot', () => {
    const d: GraphViewDescriptor = {
      slotId: 'other', domainId: 't', initial: sampleAsset,
      onChange: () => {},
    };
    const r = pickBinding('slot-1', undefined, [d]);
    expect(r.kind).toBe('empty');
  });

  it('uses meta when no descriptor matches', () => {
    const r = pickBinding('s', { asset: sampleAsset, domainId: 't' }, []);
    expect(r.kind).toBe('meta');
    if (r.kind === 'meta') {
      expect(r.asset).toBe(sampleAsset);
      expect(r.domainId).toBe('t');
    }
  });

  it('returns empty when neither descriptor nor meta is present', () => {
    expect(pickBinding('s', undefined, []).kind).toBe('empty');
  });

  it('warns and uses first when multiple descriptors match', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const d1: GraphViewDescriptor = { slotId: 's', domainId: 't', initial: sampleAsset, onChange: () => {} };
    const d2: GraphViewDescriptor = { slotId: 's', domainId: 't', initial: sampleAsset, onChange: () => {} };
    const r = pickBinding('s', undefined, [d1, d2]);
    expect(r.kind).toBe('descriptor');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
