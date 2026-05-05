import type { InspectorMeta } from '@unfinished-lair/sh3-editor/inspector/contributions';

export const STARTER_VALUE = {
  // — Existing demo fields (kept as-is) —
  name: 'Salepate',
  count: 0,
  enabled: true,
  fg: '#ff5577',
  tags: ['alpha', 'beta'],
  secret: 'hidden-from-walker',
  nested: { x: 1, y: 2 },

  // — 0.13 widget showcase —
  // Drop-in family
  displayName: 'Hello, widget',                        // 'string' → Field
  description: 'Multi-line text demo.\nTwo lines.',    // 'text'   → Textarea
  age: 33,                                             // 'number' → NumberInput

  // Slider family
  angle: 90,                                           // 'slider'        → Slider 0..360
  bounds: [10, 75] as [number, number],                // 'range'         → RangeSlider
  levels: { bass: 0, mid: 0, treble: 0 },              // 'slider-group'  → SliderGroup

  // Structured-value family
  // (icon-toggle omitted from the JSON-driven showcase: its `icon` field is
  // a Svelte Snippet, which can only be declared in a .svelte host.)
  theme: 'dark',                                       // 'segmented' → Segmented
  category: 'docs',                                    // 'select'    → Select

  // File family
  attachment: null as File | File[] | null,            // 'file' → FilePicker
};

export const STARTER_META: InspectorMeta = {
  label: 'Settings',
  fields: {
    // — Existing demo fields —
    name:   { label: 'Display name' },
    count:  { readonly: true },
    fg:     { type: 'color' },
    tags:   { item: { label: 'Tag' } },
    secret: { hidden: true },
    nested: { fields: { x: { label: 'X' }, y: { label: 'Y' } } },

    // — Drop-in family —
    displayName: {
      label: 'Display name (Field)',
      type:  'string',
      widget: { type: 'string', placeholder: 'Type here…', size: 'sm' },
    },
    description: {
      label: 'Description (Textarea)',
      type:  'text',
      widget: { type: 'text', rows: 3, placeholder: 'Multi-line…' },
    },
    age: {
      label: 'Age (NumberInput)',
      type:  'number',
      widget: { type: 'number', min: 0, max: 150, step: 1 },
    },

    // — Slider family (gesture coalescing) —
    angle: {
      label: 'Angle (Slider)',
      type:  'slider',
      widget: { type: 'slider', min: 0, max: 360, step: 1 },
    },
    bounds: {
      label: 'Bounds (RangeSlider)',
      type:  'range',
      widget: { type: 'range', min: 0, max: 100, step: 1 },
    },
    levels: {
      label: 'Levels (SliderGroup)',
      type:  'slider-group',
      widget: {
        type: 'slider-group',
        channels: [
          { id: 'bass',   label: 'Bass',   min: -10, max: 10, step: 1 },
          { id: 'mid',    label: 'Mid',    min: -10, max: 10, step: 1 },
          { id: 'treble', label: 'Treble', min: -10, max: 10, step: 1 },
        ],
      },
    },

    // — Structured-value family —
    theme: {
      label: 'Theme (Segmented)',
      type:  'segmented',
      widget: {
        type: 'segmented',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark',  label: 'Dark' },
          { value: 'auto',  label: 'Auto' },
        ],
      },
    },
    category: {
      label: 'Category (Select)',
      type:  'select',
      widget: {
        type: 'select',
        options: [
          { value: 'docs',  label: 'Docs' },
          { value: 'code',  label: 'Code' },
          { value: 'media', label: 'Media' },
        ],
      },
    },

    // — File family —
    attachment: {
      label: 'Attachment (FilePicker)',
      type:  'file',
      widget: { type: 'file', accept: 'image/*' },
    },
  },
};

export const STARTER_VALUE_TEXT = JSON.stringify(STARTER_VALUE, null, 2);
export const STARTER_META_TEXT  = JSON.stringify(STARTER_META,  null, 2);
