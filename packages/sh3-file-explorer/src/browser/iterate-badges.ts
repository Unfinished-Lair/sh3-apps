import type { Badge, BadgeDoc, DocumentBadgeProvider } from '../contributions';

export function iterateBadges(
  providers: readonly DocumentBadgeProvider[],
  doc: BadgeDoc,
  onError: (providerId: string, err: unknown) => void = () => {},
): Array<{ providerId: string; badge: Badge }> {
  const out: Array<{ providerId: string; badge: Badge }> = [];
  for (const provider of providers) {
    let badge: Badge | null;
    try {
      badge = provider.getBadge(doc);
    } catch (err) {
      onError(provider.id, err);
      continue;
    }
    if (badge) out.push({ providerId: provider.id, badge });
  }
  return out;
}
