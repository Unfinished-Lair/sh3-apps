# Authoring Help Tabs

The sh3-editor Help view is the F1-triggered reference surface for SH3 apps. It hosts tabs contributed by any shard — use it to ship integrated guides, cheatsheets, changelogs, and similar read-only reference content alongside the built-in Hotkeys tab.

## What ships in the box

- **Hotkeys tab** (`sh3-editor:help-tab:hotkeys`, priority 0) — lists actions currently active in the snapshot context, grouped by scope tier (Global / App / View / Focus / Selection).

Everything else is opt-in via contributions.

## Authoring a tab

### 1. Import the contribution types

```ts
import type {
  HelpTabContribution,
  HelpTabContext,
} from '@unfinished-lair/sh3-editor/help/contributions';
import { HELP_TABS_CONTRIBUTION_POINT_ID } from '@unfinished-lair/sh3-editor/help/contributions';
```

### 2. Write your tab component

```svelte
<!-- GuideTab.svelte -->
<script lang="ts">
  import type { HelpTabContext } from '@unfinished-lair/sh3-editor/help/contributions';
  let { tabCtx }: { tabCtx: HelpTabContext } = $props();
</script>

<div class="guide">
  <h2>My Shard — Quick Start</h2>
  <p>Active app: {tabCtx.snapshot.activeAppId ?? '(home)'}</p>
  <!-- …your content… -->
</div>
```

### 3. Register the contribution in your shard's `activate`

```ts
import { mount as svelteMount, unmount as svelteUnmount } from 'svelte';
import GuideTab from './GuideTab.svelte';

ctx.contributions.register<HelpTabContribution>(HELP_TABS_CONTRIBUTION_POINT_ID, {
  id: 'my-shard:help-tab:guide',
  label: 'Guide',
  priority: 50,
  mount(container, tabCtx) {
    const cmp = svelteMount(GuideTab, { target: container, props: { tabCtx } });
    return { unmount: () => svelteUnmount(cmp) };
  },
});
```

That's it. Next time the user opens Help (F1), your tab appears in the strip.

## Contract & conventions

### Ids

Format: `<shardId>:help-tab:<slug>`. Ids must be globally unique. If two contributors register the same id, the first wins and a warning is logged; the second is dropped.

### Priority

Lower priority = earlier tab.

| Range     | Use                                        |
|-----------|--------------------------------------------|
| 0–9       | Reserved for built-in tabs (Hotkeys = 0).  |
| 10–999    | Community contributions.                   |
| 1000+     | Admin / emergency tabs.                    |

Default (when omitted) is 100. Ties are broken by registration order — first-registered appears first.

### What to put in a tab

**Yes:**
- Integrated guides and tutorials.
- Changelogs and release notes for your shard.
- Cheatsheets, glossaries, quick-reference tables.
- Troubleshooting flowcharts.

**No:**
- Interactive tools that modify app/document state. Those belong in their own registered view, not inside Help.
- Long forms or wizards. Help is a read surface; wizards deserve dedicated views.

### Snapshot semantics

Your tab receives a `HelpSnapshot` captured at the moment Help opened. It does not update. If your tab needs live data (e.g. counts that change as the user works), subscribe inside your component — but remember Help is typically open only briefly.

### Cleanup

Your `mount` must return an `unmount` handle. The Help shell calls it when Help itself closes. Release any subscriptions, timers, or DOM listeners inside `unmount`. Make it idempotent — the shell may call it multiple times in edge cases.

## Lifecycle

```
User presses F1
   ↓
shell.modal.open(Help, ...)
   ↓
Help captures HelpSnapshot (activeApp, focusedView, mountedViews, selection)
   ↓
Help reads ctx.contributions.list('sh3-editor:help.tabs')
   ↓
Help renders tab strip; no tab bodies mounted yet
   ↓
User clicks tab (or Hotkeys is auto-selected as first tab)
   ↓
tab.mount(container, { snapshot, surface, close? })  ← YOUR CODE RUNS
   ↓
Tab lives while Help is open (state preserved across tab switches)
   ↓
User presses Escape / clicks backdrop / clicks ×
   ↓
Help closes; tab.unmount() fires for every mounted tab
```

## Troubleshooting

### "My tab never appears"

Three common causes:

1. **Registered too late.** Contributions must be registered during your shard's `activate`. Help reads the list at open-time; late registrations appear only on the next Help open.
2. **Duplicate id.** Check the console for a `[sh3-editor] duplicate help tab id …` warning. Another contributor beat you to the id.
3. **Shard not activated.** Your shard has to be running for its contributions to be visible.

### "My tab's state resets every time I click it"

Tab bodies are mounted lazily (on first visibility) but then persist for the life of the Help modal. If state resets, you're destroying it inside your component on some effect — Help itself doesn't re-mount the tab across switches.

### "My tab's snapshot is stale"

By design. The snapshot is captured once per Help open. Reopen Help to get fresh context.
