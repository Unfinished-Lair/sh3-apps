import { describe, it, expect } from 'vitest';
import {
  STARTER_VALUE,
  STARTER_META,
  STARTER_VALUE_TEXT,
  STARTER_META_TEXT,
} from './starter';

describe('starter content', () => {
  it('STARTER_VALUE round-trips through JSON', () => {
    expect(JSON.parse(JSON.stringify(STARTER_VALUE))).toEqual(STARTER_VALUE);
  });

  it('STARTER_META round-trips through JSON', () => {
    expect(JSON.parse(JSON.stringify(STARTER_META))).toEqual(STARTER_META);
  });

  it('STARTER_VALUE_TEXT parses to STARTER_VALUE', () => {
    expect(JSON.parse(STARTER_VALUE_TEXT)).toEqual(STARTER_VALUE);
  });

  it('STARTER_META_TEXT parses to STARTER_META', () => {
    expect(JSON.parse(STARTER_META_TEXT)).toEqual(STARTER_META);
  });

  it('STARTER_VALUE exercises the inspector features documented in the spec', () => {
    // primitive editing
    expect(typeof STARTER_VALUE.name).toBe('string');
    expect(typeof STARTER_VALUE.enabled).toBe('boolean');
    // readonly leaf
    expect(STARTER_META.fields?.count?.readonly).toBe(true);
    // color renderer dispatch
    expect(STARTER_META.fields?.fg?.type).toBe('color');
    // array item meta
    expect(STARTER_META.fields?.tags?.item?.label).toBe('Tag');
    // hidden field
    expect(STARTER_META.fields?.secret?.hidden).toBe(true);
    // nested object meta
    expect(STARTER_META.fields?.nested?.fields?.x?.label).toBe('X');
  });
});
