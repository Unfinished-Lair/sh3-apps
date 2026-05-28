import type { TabsNode } from 'sh3-core';
import type { HelpTabContribution, HelpTabVisibilityContext } from './contributions';

/**
 * Build a TabsNode layout descriptor from a set of help-tab contributions.
 * The result is suitable for `sh3.float.openWithContent({ content, ... })`.
 *
 * Filtering rules:
 *  - duplicate ids: first wins, rest dropped
 *  - visible(ctx) returning false drops the entry
 *
 * Ordering:
 *  - by (priority ?? 100) ascending
 *  - ties broken by registration order
 */
export function buildTabsContent(
  contributions: readonly HelpTabContribution[],
  ctx: HelpTabVisibilityContext,
): TabsNode {
  const seen = new Set<string>();
  const ordered = contributions
    .map((c, i) => ({ c, i, prio: c.priority ?? 100 }))
    .filter(({ c }) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return c.visible?.(ctx) ?? true;
    })
    .sort((a, b) => a.prio - b.prio || a.i - b.i);

  return {
    type: 'tabs',
    activeTab: 0,
    tabs: ordered.map(({ c }) => ({
      slotId: `help-hub:${c.id}`,
      viewId: c.viewId,
      label: c.label,
      icon: c.icon,
    })),
  };
}
