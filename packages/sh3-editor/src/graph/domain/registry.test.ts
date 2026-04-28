import { describe, it, expect } from 'vitest';
import { createDomainRegistry } from './registry';
import type { GraphDomain, GraphDomainHost } from './types';

function fakeDomain(id: string): GraphDomain {
  return {
    id, label: id,
    edgeSemantics: 'oriented',
    useNodePalette: true, showMeta: true,
    defaultNodeWidth: 100, defaultNodeHeight: 60,
    getTemplates: () => [],
    getTemplatesByCategory: () => new Map(),
    addTemplate: () => {},
    getNodeVisuals: () => ({ label: id, borderColor: '#000' }),
    addVisuals: () => {},
    resolveLabel: (t) => t,
  };
}

describe('createDomainRegistry', () => {
  it('returns null for an unregistered id', () => {
    const r = createDomainRegistry();
    expect(r.get('nope')).toBeNull();
  });

  it('caches a factory: factory runs at most once per id', () => {
    const r = createDomainRegistry();
    let calls = 0;
    r.register({ id: 'd', factory: () => { calls++; return fakeDomain('d'); } });
    r.get('d'); r.get('d'); r.get('d');
    expect(calls).toBe(1);
  });

  it('list() reflects registered ids', () => {
    const r = createDomainRegistry();
    r.register({ id: 'a', factory: () => fakeDomain('a') });
    r.register({ id: 'b', factory: () => fakeDomain('b') });
    expect(r.list().map((d) => d.id).sort()).toEqual(['a', 'b']);
  });

  it('list() returns lazy stubs without instantiating', () => {
    const r = createDomainRegistry();
    let calls = 0;
    r.register({ id: 'a', factory: () => { calls++; return fakeDomain('a'); } });
    r.list();
    expect(calls).toBe(0);
  });

  it('clear() drops cached instances and registrations', () => {
    const r = createDomainRegistry();
    let calls = 0;
    r.register({ id: 'a', factory: () => { calls++; return fakeDomain('a'); } });
    r.get('a');
    r.clear();
    expect(r.get('a')).toBeNull();
    r.register({ id: 'a', factory: () => { calls++; return fakeDomain('a'); } });
    r.get('a');
    expect(calls).toBe(2);
  });

  it('passes a host to the factory', () => {
    const r = createDomainRegistry();
    let receivedHost: GraphDomainHost | null = null;
    r.register({ id: 'a', factory: (h) => { receivedHost = h; return fakeDomain('a'); } });
    r.get('a');
    expect(receivedHost).not.toBeNull();
    expect(typeof receivedHost!.log).toBe('function');
  });
});
