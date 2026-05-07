import { describe, it, expect } from 'vitest';
import { parseScopeSaveArgs } from './parse-args';

describe('parseScopeSaveArgs', () => {
  it('parses a minimal save with no flags', () => {
    expect(parseScopeSaveArgs(['my-scope'])).toEqual({
      id: 'my-scope', extends: [], whitelist: [], blacklist: [],
    });
  });

  it('parses --extends a,b,c into an array', () => {
    expect(parseScopeSaveArgs(['s', '--extends', 'a,b,c']))
      .toMatchObject({ extends: ['a', 'b', 'c'] });
  });

  it('parses --whitelist patterns', () => {
    expect(parseScopeSaveArgs(['s', '--whitelist', 'sh3-fe.*,sh3-r2.read']))
      .toMatchObject({ whitelist: ['sh3-fe.*', 'sh3-r2.read'] });
  });

  it('parses --blacklist patterns', () => {
    expect(parseScopeSaveArgs(['s', '--blacklist', '*.delete']))
      .toMatchObject({ blacklist: ['*.delete'] });
  });

  it('parses all flags together', () => {
    expect(parseScopeSaveArgs([
      'my-scope', '--extends', 'a,b', '--whitelist', 'x.*,y.*', '--blacklist', '*.delete',
    ])).toEqual({
      id: 'my-scope',
      extends: ['a', 'b'],
      whitelist: ['x.*', 'y.*'],
      blacklist: ['*.delete'],
    });
  });

  it('throws when id is missing', () => {
    expect(() => parseScopeSaveArgs([])).toThrow(/usage/i);
  });

  it('throws on an unknown flag', () => {
    expect(() => parseScopeSaveArgs(['s', '--bogus', 'x'])).toThrow(/unknown/i);
  });

  it('throws when a flag is missing its value', () => {
    expect(() => parseScopeSaveArgs(['s', '--whitelist'])).toThrow(/missing value/i);
  });

  it('drops empty entries from comma-split lists', () => {
    expect(parseScopeSaveArgs(['s', '--whitelist', 'a,,b,'])).toMatchObject({
      whitelist: ['a', 'b'],
    });
  });
});
