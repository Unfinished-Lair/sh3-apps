import type { ColorPalette } from '../types';

/** Eight built-in palettes. Ported verbatim from GraphLive's colorPalettes.ts.
 *  These are a module-level constant; they are not stored in User state. */
export const DEFAULT_PALETTES: ColorPalette[] = [
  {
    id: 'pastel',
    label: 'Pastel',
    colors: [
      '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9',
      '#bae1ff', '#e8baff', '#ffb3de', '#c9baff',
      '#baf2ff', '#ffdab3',
    ],
    builtin: true,
  },
  {
    id: 'neon',
    label: 'Neon',
    colors: [
      '#ff0080', '#ff00ff', '#8000ff', '#0040ff',
      '#00ffff', '#00ff40', '#80ff00', '#ffff00',
      '#ff8000', '#ff0040',
    ],
    builtin: true,
  },
  {
    id: 'earth',
    label: 'Earth Tones',
    colors: [
      '#8b4513', '#a0522d', '#cd853f', '#deb887',
      '#d2b48c', '#bc8f8f', '#808000', '#6b8e23',
      '#556b2f', '#8fbc8f',
    ],
    builtin: true,
  },
  {
    id: 'web1',
    label: 'Web 1.0',
    colors: [
      '#ff0000', '#00ff00', '#0000ff', '#ffff00',
      '#ff00ff', '#00ffff', '#ff6600', '#663399',
      '#009900', '#cc0000', '#336699', '#ffffff',
    ],
    builtin: true,
  },
  {
    id: 'mono',
    label: 'Monochrome',
    colors: [
      '#000000', '#1a1a1a', '#333333', '#4d4d4d',
      '#666666', '#808080', '#999999', '#b3b3b3',
      '#cccccc', '#e6e6e6', '#f2f2f2', '#ffffff',
    ],
    builtin: true,
  },
  {
    id: 'ocean',
    label: 'Ocean',
    colors: [
      '#001f3f', '#003366', '#005b96', '#0077b6',
      '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4',
      '#caf0f8', '#023e8a',
    ],
    builtin: true,
  },
  {
    id: 'sunset',
    label: 'Sunset',
    colors: [
      '#ff6b35', '#ff8c42', '#ffb347', '#ffd700',
      '#ff4500', '#dc143c', '#c71585', '#8b008b',
      '#ff69b4', '#ffa07a',
    ],
    builtin: true,
  },
  {
    id: 'jewel',
    label: 'Jewel Tones',
    colors: [
      '#50c878', '#0f52ba', '#e0115f', '#9966cc',
      '#ff7518', '#4b0082', '#006d6f', '#cf1020',
      '#ffd700', '#228b22',
    ],
    builtin: true,
  },
];
