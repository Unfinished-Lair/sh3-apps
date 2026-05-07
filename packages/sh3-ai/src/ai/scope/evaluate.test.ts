import { describe, it, expect } from 'vitest';
import { evaluate } from './evaluate';
import type { ResolvedScope } from './types';

const empty: ResolvedScope = { id: 'empty', whitelist: [], blacklist: [] };
const readOnly: ResolvedScope = { id: 'r', whitelist: ['*.read', '*.list'], blacklist: [] };
const r2backup: ResolvedScope = {
  id: 'b',
  whitelist: ['sh3-r2.*', 'sh3-fe.read', 'sh3-fe.list'],
  blacklist: ['sh3-r2.delete'],
};

describe('evaluate', () => {
  it('denies everything in an empty scope', () => {
    expect(evaluate(empty, 'sh3-fe.read')).toEqual({
      allowed: false, reason: 'not-whitelisted',
    });
  });

  it('allows when a whitelist pattern matches', () => {
    expect(evaluate(readOnly, 'sh3-fe.read')).toEqual({ allowed: true });
    expect(evaluate(readOnly, 'sh3-r2.list')).toEqual({ allowed: true });
  });

  it('denies when no whitelist pattern matches', () => {
    expect(evaluate(readOnly, 'sh3-fe.delete')).toEqual({
      allowed: false, reason: 'not-whitelisted',
    });
  });

  it('blacklist is authoritative even when whitelist would match', () => {
    expect(evaluate(r2backup, 'sh3-r2.delete')).toEqual({
      allowed: false,
      reason: 'blacklisted',
      matchedPattern: 'sh3-r2.delete',
    });
  });

  it('reports the matched blacklist pattern', () => {
    const scope: ResolvedScope = {
      id: 's', whitelist: ['*'], blacklist: ['*.delete'],
    };
    expect(evaluate(scope, 'sh3-fe.delete')).toEqual({
      allowed: false,
      reason: 'blacklisted',
      matchedPattern: '*.delete',
    });
  });

  it('allows a name covered by whitelist when blacklist does not match it', () => {
    expect(evaluate(r2backup, 'sh3-r2.backup')).toEqual({ allowed: true });
  });
});
