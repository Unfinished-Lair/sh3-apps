import { describe, it, expect } from 'vitest';
import { hybridConnectRule } from './connect-rule';

function port(direction: 'input' | 'output', dataType: string, nodeId = 'a', portId = 'p') {
  return { nodeId, portId, direction, dataType };
}

describe('hybridConnectRule', () => {
  it('allows control output → control input', () => {
    expect(hybridConnectRule(port('output', 'control', 'a'), port('input', 'control', 'b'))).toBe(true);
  });

  it('rejects control output → typed input', () => {
    expect(hybridConnectRule(port('output', 'control', 'a'), port('input', 'string', 'b'))).toBe(false);
  });

  it('rejects typed output → control input', () => {
    expect(hybridConnectRule(port('output', 'string', 'a'), port('input', 'control', 'b'))).toBe(false);
  });

  it('allows matching typed dataTypes', () => {
    expect(hybridConnectRule(port('output', 'string', 'a'), port('input', 'string', 'b'))).toBe(true);
  });

  it('rejects mismatched typed dataTypes', () => {
    expect(hybridConnectRule(port('output', 'string', 'a'), port('input', 'number', 'b'))).toBe(false);
  });

  it('allows unknown on either side (escape hatch)', () => {
    expect(hybridConnectRule(port('output', 'unknown', 'a'), port('input', 'string', 'b'))).toBe(true);
    expect(hybridConnectRule(port('output', 'string', 'a'), port('input', 'unknown', 'b'))).toBe(true);
  });

  it('rejects same-node self-loops', () => {
    expect(hybridConnectRule(port('output', 'control', 'a'), port('input', 'control', 'a'))).toBe(false);
  });

  it('rejects wrong direction (input→output)', () => {
    expect(hybridConnectRule(port('input', 'control', 'a'), port('output', 'control', 'b'))).toBe(false);
  });
});
