import { describe, it, expect, vi } from 'vitest';
import { iterateBadges } from './iterate-badges';
import type { BadgeDoc, DocumentBadgeProvider } from '../contributions';

const doc: BadgeDoc = { shardId: 'notes', path: 'a.md', kind: 'file' };

describe('iterateBadges', () => {
  it('returns providerId+badge for every provider that returns non-null', () => {
    const providers: DocumentBadgeProvider[] = [
      { id: 'p1', getBadge: () => ({ icon: '☁' }) },
      { id: 'p2', getBadge: () => ({ icon: '✓' }) },
    ];
    expect(iterateBadges(providers, doc)).toEqual([
      { providerId: 'p1', badge: { icon: '☁' } },
      { providerId: 'p2', badge: { icon: '✓' } },
    ]);
  });

  it('skips providers that return null', () => {
    const providers: DocumentBadgeProvider[] = [
      { id: 'p1', getBadge: () => null },
      { id: 'p2', getBadge: () => ({ icon: '✓' }) },
    ];
    expect(iterateBadges(providers, doc)).toEqual([
      { providerId: 'p2', badge: { icon: '✓' } },
    ]);
  });

  it('isolates a throwing provider — others still produce badges', () => {
    const onError = vi.fn();
    const providers: DocumentBadgeProvider[] = [
      { id: 'broken', getBadge: () => { throw new Error('boom'); } },
      { id: 'ok', getBadge: () => ({ icon: '✓' }) },
    ];
    expect(iterateBadges(providers, doc, onError)).toEqual([
      { providerId: 'ok', badge: { icon: '✓' } },
    ]);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBe('broken');
    expect(onError.mock.calls[0][1]).toBeInstanceOf(Error);
  });

  it('omits onError defaults to no-op', () => {
    const providers: DocumentBadgeProvider[] = [
      { id: 'broken', getBadge: () => { throw new Error('boom'); } },
    ];
    expect(() => iterateBadges(providers, doc)).not.toThrow();
    expect(iterateBadges(providers, doc)).toEqual([]);
  });
});
