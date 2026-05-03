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

  it('STARTER_VALUE includes one field per 0.13 widget (icon-toggle omitted — Snippet-only)', () => {
    expect(typeof STARTER_VALUE.displayName).toBe('string');
    expect(typeof STARTER_VALUE.description).toBe('string');
    expect(typeof STARTER_VALUE.age).toBe('number');
    expect(typeof STARTER_VALUE.angle).toBe('number');
    expect(Array.isArray(STARTER_VALUE.bounds)).toBe(true);
    expect(STARTER_VALUE.bounds).toHaveLength(2);
    expect(typeof STARTER_VALUE.levels).toBe('object');
    expect(STARTER_VALUE.levels).toMatchObject({ bass: 0, mid: 0, treble: 0 });
    expect(typeof STARTER_VALUE.theme).toBe('string');
    expect(typeof STARTER_VALUE.category).toBe('string');
    expect(STARTER_VALUE.attachment).toBeNull();
  });

  it('STARTER_META declares meta.widget for every new field', () => {
    const tags = [
      'displayName', 'description', 'age',
      'angle', 'bounds', 'levels',
      'theme', 'category', 'attachment',
    ] as const;
    for (const k of tags) {
      const m = STARTER_META.fields?.[k];
      expect(m, `field ${k} has meta`).toBeDefined();
      expect(m!.type, `field ${k} has meta.type`).toBeDefined();
      expect(m!.widget, `field ${k} has meta.widget`).toBeDefined();
      expect(m!.widget!.type, `field ${k} widget.type matches meta.type`).toBe(m!.type);
    }
  });
});
