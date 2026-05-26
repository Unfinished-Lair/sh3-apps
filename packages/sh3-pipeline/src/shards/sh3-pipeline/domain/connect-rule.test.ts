import { describe, it, expect } from 'vitest';
import type { PortRef } from '@unfinished-lair/sh3-editor/graph/types';
import { resolveConnect } from './connect-rule';

function src(dt: string): PortRef {
  return { nodeId: 'a', portId: 'o', direction: 'output', dataType: dt };
}
function tgt(dt: string): PortRef {
  return { nodeId: 'b', portId: 'i', direction: 'input',  dataType: dt };
}

describe('resolveConnect', () => {
  it('rejects when src is not output', () => {
    expect(resolveConnect(
      { nodeId: 'a', portId: 'i', direction: 'input', dataType: 'run' },
      tgt('run'),
    )).toBe(false);
  });

  it('rejects self-connection', () => {
    const s: PortRef = { nodeId: 'a', portId: 'o', direction: 'output', dataType: 'run' };
    const t: PortRef = { nodeId: 'a', portId: 'i', direction: 'input',  dataType: 'run' };
    expect(resolveConnect(s, t)).toBe(false);
  });

  it('run only connects to run', () => {
    expect(resolveConnect(src('run'),    tgt('run'))).toBe(true);
    expect(resolveConnect(src('run'),    tgt('string'))).toBe(false);
    expect(resolveConnect(src('string'), tgt('run'))).toBe(false);
  });

  it('same-type accepts directly', () => {
    expect(resolveConnect(src('string'), tgt('string'))).toBe(true);
  });

  it('unknown is a free-pass', () => {
    expect(resolveConnect(src('unknown'), tgt('string'))).toBe(true);
    expect(resolveConnect(src('string'), tgt('unknown'))).toBe(true);
  });

  it('number → string routes via adapter', () => {
    expect(resolveConnect(src('number'), tgt('string')))
      .toEqual({ via: 'pipeline:number-to-string' });
  });

  it('boolean ↔ string routes via adapter', () => {
    expect(resolveConnect(src('boolean'), tgt('string')))
      .toEqual({ via: 'pipeline:boolean-to-string' });
    expect(resolveConnect(src('string'), tgt('boolean')))
      .toEqual({ via: 'pipeline:string-to-boolean' });
  });

  it('no adapter declared → reject', () => {
    expect(resolveConnect(src('record'), tgt('array'))).toBe(false);
  });
});
