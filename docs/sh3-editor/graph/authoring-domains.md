# Authoring a graph domain

A `GraphDomain` is a behavior pack: templates (the node types your graph
contains), visuals (how nodes look), edge semantics (oriented vs adjacency),
and connection rules. sh3-editor calls into a domain to render and validate;
it does not execute the graph — execution is your concern.

## 1. Pick edge semantics

| Choice | When |
|---|---|
| `'oriented'` | Inputs/outputs distinguished. Arrowheads drawn. Default. |
| `'adjacency'` | Bidirectional. No arrowheads. Use for sketching/relationship domains. |

## 2. Decide on palette vs freeform

- `useNodePalette: true` — empty-click opens a category-grouped popover.
  Default.
- `useNodePalette: false` — empty-click adds a freeform node sized to the
  domain's defaults; node body is supplied by visuals.

## 3. Author templates

```ts
import { createGraphDomain } from '@unfinished-lair/sh3-editor/graph/types';

const domain = createGraphDomain({
  id: 'my-app:shader-graph',
  label: 'Shader Graph',
  templates: [
    {
      type: 'math.add',
      category: 'Math',
      label: 'Add',
      ports: [
        { id: 'a',   label: 'A',   direction: 'input',  dataType: 'number' },
        { id: 'b',   label: 'B',   direction: 'input',  dataType: 'number' },
        { id: 'out', label: 'Out', direction: 'output', dataType: 'number' },
      ],
      defaultConfig: {},
    },
  ],
  visuals: {
    'math.add': {
      label: 'Add',
      borderColor: '#7eb',
      portColors: { number: '#7eb' },
    },
  },
});
```

Port-id rules:
- Within a template, port ids are short names (`a`, `out`).
- When a node is created, sh3-editor materializes the port ids as
  `${nodeId}_${shortName}` in the persisted asset. The bridge restores the
  short form for handlers and inspector wiring.

## 4. Connection rules (optional)

```ts
createGraphDomain({
  // ...
  canConnect(src, tgt) {
    // dataType compatibility example:
    return src.dataType === tgt.dataType;
  },
});
```

The default rule (when `canConnect` is omitted): any output → any input on a
different node, regardless of `dataType`.

## 5. Dynamic labels

For nodes whose display name is derived from config (e.g. an `expression`
node showing the expression), supply `resolveLabel`:

```ts
createGraphDomain({
  // ...
  resolveLabel(type, config) {
    if (type === 'math.expression') return String(config.expr ?? '∅');
    return type;
  },
});
```

## 6. Inspector hints

Use `configSchema[].rendererHint` to dispatch a config field to a registered
inspector renderer (e.g. the bundled color renderer):

```ts
{
  type: 'material.color',
  category: 'Material',
  label: 'Color',
  ports: [{ id: 'out', label: 'Out', direction: 'output', dataType: 'color' }],
  defaultConfig: { color: '#ff0000' },
  configSchema: [
    { key: 'color', label: 'Color', type: 'string', rendererHint: 'color' },
  ],
}
```

## 7. Register

```ts
ctx.contributions.register('sh3-editor.graph-domain', {
  id: 'my-app:shader-graph',
  factory: (host) => domain,
});
```

The factory runs at most once per editor activation, regardless of how many
graph slots reference the domain.

## 8. Reference

- `GraphDomain` interface — `dist/graph/types.d.ts`
- Source spec — `docs/claude-plans/sh3-editor/2026-04-28-sh3-editor-graph-flow-design.md`
