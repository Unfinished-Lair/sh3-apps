import { describe, it, expect } from 'vitest';
import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';
import { deriveInterface, PIPELINE_DOC_VERSION, DOMAIN_ID } from './format';

function emptyAsset(): GraphAsset {
  return {
    id: 'g',
    name: '',
    domain: DOMAIN_ID,
    version: 1,
    nodes: [],
    edges: [],
  };
}

describe('document/format', () => {
  it('exposes constants', () => {
    expect(PIPELINE_DOC_VERSION).toBe(1);
    expect(DOMAIN_ID).toBe('sh3-pipeline:control-graph');
  });

  it('derives empty interface from an empty asset', () => {
    expect(deriveInterface(emptyAsset())).toEqual({ inputs: [], outputs: [] });
  });

  it('derives inputs from pipeline:start params', () => {
    const asset: GraphAsset = {
      ...emptyAsset(),
      nodes: [
        {
          id: 's',
          type: 'start',
          config: {
            params: [
              { name: 'topic', dataType: 'string' },
              { name: 'count', dataType: 'number' },
            ],
          },
          position: { x: 0, y: 0 },
          ports: [],
        },
      ],
    };
    expect(deriveInterface(asset).inputs).toEqual([
      { name: 'topic', dataType: 'string' },
      { name: 'count', dataType: 'number' },
    ]);
  });

  it('derives outputs from pipeline:end returns', () => {
    const asset: GraphAsset = {
      ...emptyAsset(),
      nodes: [
        {
          id: 'e',
          type: 'end',
          config: { returns: [{ name: 'result', dataType: 'string' }] },
          position: { x: 0, y: 0 },
          ports: [],
        },
      ],
    };
    expect(deriveInterface(asset).outputs).toEqual([
      { name: 'result', dataType: 'string' },
    ]);
  });

  it('returns empty arrays when start/end configs are missing or malformed', () => {
    const asset: GraphAsset = {
      ...emptyAsset(),
      nodes: [
        { id: 's', type: 'start', config: {},               position: { x: 0, y: 0 }, ports: [] },
        { id: 'e', type: 'end',   config: { returns: 'no' }, position: { x: 0, y: 0 }, ports: [] },
      ],
    };
    expect(deriveInterface(asset)).toEqual({ inputs: [], outputs: [] });
  });
});
