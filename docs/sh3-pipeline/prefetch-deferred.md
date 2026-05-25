# Prefetch mode — items deferred to sh3-editor

Tracking doc for work that was scoped out of sh3-pipeline v0.3.0's Prefetch-mode delivery because the required extension point doesn't exist in `@unfinished-lair/sh3-editor` yet. The shipped v1 routes around each gap; v2 reopens the items when the upstream surface lands.

Versions at time of writing: `sh3-editor@0.16.1`, `sh3-pipeline@0.3.0`.

## 1. Node-scoped context-menu contribution point

**Gap.** No contribution point lets a shard register actions on a graph node's right-click menu. The plan's design RFC calls for `[Toggle Prefetch mode]` to appear in the node context menu alongside the inspector button.

**v1 workaround.** Toggle-mode lives only in the inspector — the `Runtime mode` / `Prefetch mode` button at the top of `PrefetchInspector`. The user must select the node, look at the inspector, and click the button.

**Desired upstream shape.**

```ts
ctx.contributions.register('sh3-editor.graph.node-context-menu', {
  id: 'sh3-pipeline:toggle-prefetch',
  label: 'Toggle Prefetch mode',
  appliesTo: (node) => node.type.startsWith('verb:'),
  run: (node, ctrl) => { /* swap node.type, drop incident wires */ },
});
```

**v2 reopen.** When the contribution point lands, register a node-context-menu entry that calls the same `toggleNodeMode` helper currently behind the inspector button.

## 2. Custom node body slot in NodeTemplate

**Gap.** `NodeTemplate` exposes `ports`, `label` (config-aware), `defaultConfig`, `configSchema`, and `visuals` — but no way to render custom UI inside the node body. The design RFC calls for an inline `<select>` directly on the prefetch node so the user can pick a row without opening the inspector.

**v1 workaround.** The picker dropdown lives in the inspector only. The node body is decorated with a `⚡` glyph (via `NodeVisuals.label` callback, which IS config-aware today) and a violet border so prefetch nodes are recognizable at a glance.

**Desired upstream shape.** Two plausible options:

```ts
// Option A — contribution-point shape (aligns with sh3-editor's patterns)
interface NodeTemplate {
  bodyRenderer?: { contributionPointId: string };
}

// Option B — direct callback (simpler but couples NodeTemplate to DOM)
interface NodeTemplate {
  bodySlot?: (config, onCommit) => HTMLElement;
}
```

**v2 reopen.** When either ships, render the same `<select>` from `PrefetchInspector` inside the node body, wired to the same `commitSelectedPrefetchConfig` action.

## 3. NodeTemplate.computePorts(config) hook

**Shipped in sh3-editor 0.16.2** (additive `NodeTemplate.computePorts?: (config) => GraphAssetPort[]`). sh3-pipeline 0.3.1 migrated `verb-adapter.ts` to the collapsed single-template + `computePorts(config.mode)` shape and added a load-time fixup for any `:prefetch`-suffixed nodes carried over from 0.3.0.

---

## Dropped — `Verb.enumerative` flag

Originally proposed alongside the prefetch context-menu modal to gate a "may yield non-deterministic results" warning. Dropped on review:

1. Schema shape (`type:'array', items:{type:'object', properties:{…}}`) is already the affirmative pickerability signal — declaring it IS the authorial act. A redundant boolean creates two sources of truth (what wins on disagreement?).
2. The flag's real intent was **stability/determinism**, not pickerability — conflating those into one boolean is what made the design feel off.
3. The confirm modal is YAGNI: if a verb's list is unstable, the user will discover it through use. No upfront prompt needed.

`isPickerableVerb` stays as the gate; it inspects the schema directly.

---

## How to file the upstream issues

Both v2 unblocks live in `Unfinished-Lair/sh3`. Task 14 of the original implementation plan drafted issue bodies — see `docs/sh3-rfcs/2026-05-25-sh3-pipeline-prefetch-mode-plan.md` (uncommitted, in the working tree) for the drafts. Once filed, replace the `<upstream-issue-link>` placeholders in `control-graph-domain.md` and `verbs.md`.
