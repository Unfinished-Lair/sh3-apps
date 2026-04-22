import { describe, it, expect } from 'vitest';
import { setError, pruneErrors, type Errors } from './errors';

describe('setError', () => {
  it('adds an error for a new shard + key', () => {
    const next = setError({}, 'app-a', 'foo', 'bad');
    expect(next).toEqual({ 'app-a': { foo: 'bad' } });
  });

  it('adds to an existing shard map without mutating the input', () => {
    const prev: Errors = { 'app-a': { foo: 'bad' } };
    const next = setError(prev, 'app-a', 'bar', 'worse');
    expect(next).toEqual({ 'app-a': { foo: 'bad', bar: 'worse' } });
    expect(prev).toEqual({ 'app-a': { foo: 'bad' } });
  });

  it('clears an error when msg is undefined', () => {
    const prev: Errors = { 'app-a': { foo: 'bad', bar: 'worse' } };
    const next = setError(prev, 'app-a', 'foo', undefined);
    expect(next).toEqual({ 'app-a': { bar: 'worse' } });
  });

  it('is a no-op when clearing an error that does not exist', () => {
    const prev: Errors = {};
    const next = setError(prev, 'app-a', 'foo', undefined);
    expect(next).toEqual({ 'app-a': {} });
  });
});

describe('pruneErrors', () => {
  it('removes entries for shards no longer in activeShardIds', () => {
    const prev: Errors = { 'app-a': { foo: 'x' }, 'app-b': { bar: 'y' } };
    expect(pruneErrors(prev, ['app-a'])).toEqual({ 'app-a': { foo: 'x' } });
  });

  it('keeps all entries when every shard is active', () => {
    const prev: Errors = { 'app-a': { foo: 'x' }, 'app-b': { bar: 'y' } };
    expect(pruneErrors(prev, ['app-a', 'app-b'])).toEqual(prev);
  });

  it('returns empty when no shards are active', () => {
    const prev: Errors = { 'app-a': { foo: 'x' } };
    expect(pruneErrors(prev, [])).toEqual({});
  });
});
