import { describe, it, expect } from 'vitest';
import { buildTabsContent } from './buildTabsContent';
import type { HelpTabContribution } from './contributions';

const tab = (id: string, viewId: string, opts: Partial<HelpTabContribution> = {}): HelpTabContribution =>
  ({ id, label: id, viewId, ...opts });

describe('buildTabsContent', () => {
  it('produces a TabsNode descriptor with one tab per visible contribution', () => {
    const out = buildTabsContent(
      [tab('a', 'view-a'), tab('b', 'view-b')],
      { activeAppId: null },
    );
    expect(out.type).toBe('tabs');
    expect(out.activeTab).toBe(0);
    expect(out.tabs.map((t) => t.viewId)).toEqual(['view-a', 'view-b']);
  });

  it('assigns a stable slotId per tab', () => {
    const out = buildTabsContent(
      [tab('a', 'view-a'), tab('b', 'view-b')],
      { activeAppId: null },
    );
    expect(out.tabs[0].slotId).toBeTruthy();
    expect(out.tabs[1].slotId).toBeTruthy();
    expect(out.tabs[0].slotId).not.toBe(out.tabs[1].slotId);
  });

  it('orders by priority ascending; ties break by registration order', () => {
    const out = buildTabsContent(
      [
        tab('a', 'view-a', { priority: 100 }),
        tab('b', 'view-b', { priority: 0 }),
        tab('c', 'view-c', { priority: 100 }),
      ],
      { activeAppId: null },
    );
    expect(out.tabs.map((t) => t.viewId)).toEqual(['view-b', 'view-a', 'view-c']);
  });

  it('drops entries whose visible() returns false', () => {
    const out = buildTabsContent(
      [
        tab('a', 'view-a'),
        tab('b', 'view-b', { visible: () => false }),
        tab('c', 'view-c', { visible: () => true }),
      ],
      { activeAppId: null },
    );
    expect(out.tabs.map((t) => t.viewId)).toEqual(['view-a', 'view-c']);
  });

  it('passes activeAppId into visible()', () => {
    let seen: string | null | '__unset' = '__unset';
    buildTabsContent(
      [tab('a', 'view-a', { visible: (ctx) => { seen = ctx.activeAppId; return true; } })],
      { activeAppId: 'pipeline' },
    );
    expect(seen).toBe('pipeline');
  });

  it('drops duplicate ids — first wins', () => {
    const out = buildTabsContent(
      [tab('a', 'view-1'), tab('a', 'view-2')],
      { activeAppId: null },
    );
    expect(out.tabs.map((t) => t.viewId)).toEqual(['view-1']);
  });
});
