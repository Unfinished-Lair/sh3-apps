import { describe, it, expect } from 'vitest';
import { decideCoalesce, makeCoalesceState } from './coalesce';

describe('coalesce decision', () => {
  it('first call with any key → push', () => {
    const s = makeCoalesceState();
    const r = decideCoalesce(s, 'p.0', 'k-A', 100);
    expect(r.action).toBe('push');
    expect(r.before).toBe(100);
  });

  it('same key after first call → replaceTop with original before', () => {
    const s = makeCoalesceState();
    decideCoalesce(s, 'p.0', 'k-A', 100);   // captures before=100
    const r = decideCoalesce(s, 'p.0', 'k-A', 200);
    expect(r.action).toBe('replaceTop');
    expect(r.before).toBe(100);
  });

  it('different key on same path → push (new gesture, fresh before)', () => {
    const s = makeCoalesceState();
    decideCoalesce(s, 'p.0', 'k-A', 100);
    const r = decideCoalesce(s, 'p.0', 'k-B', 50);
    expect(r.action).toBe('push');
    expect(r.before).toBe(50);
    // Verify the overwrite stuck — k-B is now the live entry, not k-A.
    const r2 = decideCoalesce(s, 'p.0', 'k-B', 99);
    expect(r2.action).toBe('replaceTop');
    expect(r2.before).toBe(50);
  });

  it('clear() drops the entry; next call on same key behaves as first', () => {
    const s = makeCoalesceState();
    decideCoalesce(s, 'p.0', 'k-A', 100);
    s.clear('p.0');
    const r = decideCoalesce(s, 'p.0', 'k-A', 200);
    expect(r.action).toBe('push');
    expect(r.before).toBe(200);
  });

  it('two paths track independently', () => {
    const s = makeCoalesceState();
    decideCoalesce(s, 'p.0', 'k-A', 1);
    decideCoalesce(s, 'p.1', 'k-A', 2);
    const a = decideCoalesce(s, 'p.0', 'k-A', 11);
    const b = decideCoalesce(s, 'p.1', 'k-A', 22);
    expect(a).toEqual({ action: 'replaceTop', before: 1 });
    expect(b).toEqual({ action: 'replaceTop', before: 2 });
  });
});
