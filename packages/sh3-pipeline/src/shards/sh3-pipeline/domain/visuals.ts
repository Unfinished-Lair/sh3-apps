import type { NodeVisuals } from '@unfinished-lair/sh3-editor/graph/types';
import { PORT_COLORS } from './data-types';

const BASE = {
  defaultWidth: 200,
  defaultHeight: 80,
  portColors: PORT_COLORS,
} as const;

export const VISUALS: Record<string, NodeVisuals> = {
  start:    { ...BASE, label: 'Start',    borderColor: '#22c55e' },
  end:      { ...BASE, label: 'End',      borderColor: '#ef4444' },
  branch:   { ...BASE, label: 'Branch',   borderColor: '#f59e0b' },
  sequence: { ...BASE, label: 'Sequence', borderColor: '#f59e0b' },
  comment:  { ...BASE, label: 'Comment',  borderColor: '#525252', defaultHeight: 60 },
  'literal.string':  { ...BASE, label: 'String',  borderColor: '#22d3ee' },
  'literal.number':  { ...BASE, label: 'Number',  borderColor: '#a3e635' },
  'literal.boolean': { ...BASE, label: 'Boolean', borderColor: '#fbbf24' },
  setVar:         { ...BASE, label: 'Set Var',    borderColor: '#c4b5fd' },
  getVar:         { ...BASE, label: 'Get Var',    borderColor: '#c4b5fd' },
  'record.build': { ...BASE, label: 'Record',     borderColor: '#c4b5fd' },
  'record.get':   { ...BASE, label: 'Record Get', borderColor: '#c4b5fd' },
};

export const VERB_VISUAL: NodeVisuals = {
  ...BASE,
  label: 'Verb',
  borderColor: '#3b82f6',
};
