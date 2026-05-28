# Authoring Help Tabs

The sh3-editor Help hub is the F1-triggered reference surface for SH3 apps. As of 0.19, F1 opens a float wrapping a `TabsNode` populated from contributions. Each tab mounts a regular registered view — drag a tab out of the strip and it docks like any other view.

## What ships in the box

| Tab id                              | View id                          | Priority |
|-------------------------------------|----------------------------------|----------|
| `sh3-editor:help-tab:hotkeys`       | `sh3-editor:help-hotkeys`        | 0        |
| `sh3-editor:help-tab:settings`      | `sh3-editor:help-settings`       | 50       |
| `sh3-editor:help-tab:quick-access`  | `sh3-editor:help-quick-access`   | 60       |

`sh3-editor:settings` (the standalone view id long pinned in App.initialLayout) is now an alias for `sh3-editor:help-settings` — the contract is unchanged.

`help-quick-access` is visible only when at least one graph domain is registered.

## Authoring a tab

A help tab is a **view + a tab contribution**. The view lives in your shard's manifest and registers via `ctx.registerView`. The contribution names the view by id and configures label / priority / visibility.

### 1. Register the view

```ts
// in your manifest:
views: [
  { id: 'my-shard:help-tab:guide', label: 'Guide' },
],

// in activate():
ctx.registerView('my-shard:help-tab:guide', {
  mount(container) {
    const cmp = mount(GuideTab, { target: container, props: {} });
    return { closable: false, unmount() { unmount(cmp); } };
  },
});
```

### 2. Register the contribution

```ts
import {
  HELP_TABS_CONTRIBUTION_POINT_ID,
  type HelpTabContribution,
} from '@unfinished-lair/sh3-editor/help/contributions';

ctx.contributions.register<HelpTabContribution>(HELP_TABS_CONTRIBUTION_POINT_ID, {
  id: 'my-shard:help-tab:guide',
  label: 'Guide',
  priority: 100,
  viewId: 'my-shard:help-tab:guide',
  // Optional: hide unless the pipeline app is active.
  visible: (ctx) => ctx.activeAppId === 'sh3-pipeline',
});
```

That's it. Next time the user opens the hub (F1), your tab appears in the strip.

### Reading the open snapshot

When the user opens the hub, sh3-editor publishes a `HelpSnapshot` describing the activeAppId / focusedViewId / selection at open-time. Subscribe from any tab view:

```ts
import {
  getHelpSnapshot,
  onHelpSnapshotChange,
} from '@unfinished-lair/sh3-editor/help/snapshot';

let snap = getHelpSnapshot();
onHelpSnapshotChange((s) => { snap = s; });
```

The snapshot is cleared when the float is closed.

## Contract & conventions

### Ids

Format: `<shardId>:help-tab:<slug>`. Ids must be globally unique. If two contributors register the same id, the first wins and the second is silently dropped.

### Priority

Lower priority = earlier tab.

| Range     | Use                                                                |
|-----------|--------------------------------------------------------------------|
| 0–9       | Reserved for built-in tabs (Hotkeys = 0).                          |
| 10–999    | Community contributions; built-in non-hotkeys tabs occupy 50, 60.  |
| 1000+     | Admin / emergency tabs.                                            |

Default (when omitted) is 100. Ties are broken by registration order — first-registered appears first.

### What to put in a tab

**Yes:**
- Integrated guides and tutorials.
- Changelogs and release notes.
- Cheatsheets, glossaries, quick-reference tables.
- Editor surfaces that genuinely belong with Help (e.g. Quick-Access variant editor).

**No:**
- Document-mutating tools. Those belong in their own registered view, not in the Help hub. (If you really need to, register the view standalone and link it from your help tab.)

### Visibility predicate

`visible(ctx)` is called whenever the contribution list changes. Keep it cheap — it runs once per registered tab per hub-open. The only field is `activeAppId`.

### Cleanup

Your view's `unmount` fires when the user drags the tab out, closes it, or closes the hub float. Same lifecycle as any other registered view.

## Lifecycle

```
User presses F1
   ↓
sh3-editor publishes HelpSnapshot via setHelpSnapshot(...)
   ↓
sh3-editor reads ctx.contributions.list('sh3-editor:help.tabs')
   ↓
buildTabsContent(contributions, { activeAppId }) → TabsNode
   ↓
sh3.float.openWithContent({ content: <TabsNode>, title: 'Help', size })
   ↓
Each TabEntry's viewId mounts as a regular slot when its tab activates
   ↓
User can drag any tab out — the slot survives and docks where dropped
   ↓
Float closed → tab views unmount; clearHelpSnapshot() runs
```

## Troubleshooting

### "My tab never appears"

1. **Contribution registered after the user pressed F1.** `buildTabsContent` is called at open-time. Late registrations appear next open.
2. **Duplicate id.** First registration wins. Inspect `ctx.contributions.list('sh3-editor:help.tabs')` to confirm.
3. **`visible(ctx)` returned false.** Add a console.log to confirm the predicate's return value.
4. **viewId not declared in your shard manifest.** `ctx.registerView` will throw at activation time if the id is missing from `manifest.views`.

### "My tab is empty / errors on mount"

The view factory ran but threw or returned nothing useful. Check your shard's mount path the same way you would for any other view — there is nothing help-specific about a tab's view lifecycle.
