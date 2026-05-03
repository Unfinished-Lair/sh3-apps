import type { InspectorMeta } from '@unfinished-lair/sh3-editor/inspector/contributions';

export const STARTER_VALUE = {
  name: 'Salepate',
  count: 0,
  enabled: true,
  fg: '#ff5577',
  tags: ['alpha', 'beta'],
  secret: 'hidden-from-walker',
  nested: { x: 1, y: 2 },
};

export const STARTER_META: InspectorMeta = {
  label: 'Settings',
  fields: {
    name:   { label: 'Display name' },
    count:  { readonly: true },
    fg:     { type: 'color' },
    tags:   { item: { label: 'Tag' } },
    secret: { hidden: true },
    nested: { fields: { x: { label: 'X' }, y: { label: 'Y' } } },
  },
};

export const STARTER_VALUE_TEXT = JSON.stringify(STARTER_VALUE, null, 2);
export const STARTER_META_TEXT  = JSON.stringify(STARTER_META,  null, 2);
