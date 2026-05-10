import { describe, it, expect } from 'vitest';
import { makeTemperatureTools, type TemperatureToolDeps } from './tools';

function makeDeps(initial: number | null = null): TemperatureToolDeps & { value: number | null } {
  let value = initial;
  return {
    get value() { return value; },
    set value(v: number | null) { value = v; },
    get: () => value,
    set: (v) => { value = v; },
  };
}

function tools(deps: TemperatureToolDeps) {
  const list = makeTemperatureTools(deps);
  expect(list).toHaveLength(2);
  const get = list.find((t) => t.name === 'ai.temperature.get')!;
  const set = list.find((t) => t.name === 'ai.temperature.set')!;
  expect(get).toBeDefined();
  expect(set).toBeDefined();
  return { get, set };
}

const signal = new AbortController().signal;

describe('ai.temperature.get', () => {
  it('returns the current temperature (null by default)', async () => {
    const deps = makeDeps();
    const { get } = tools(deps);
    await expect(get.run({}, { signal })).resolves.toEqual({ temperature: null });
  });

  it('returns the current temperature (number when set)', async () => {
    const deps = makeDeps(0.7);
    const { get } = tools(deps);
    await expect(get.run({}, { signal })).resolves.toEqual({ temperature: 0.7 });
  });

  it('source and schema shape', () => {
    const { get } = tools(makeDeps());
    expect(get.source).toBe('sh3-ai.tool');
    expect((get.inputSchema as Record<string, unknown>).type).toBe('object');
  });
});

describe('ai.temperature.set', () => {
  it('writes a number through deps and echoes it back', async () => {
    const deps = makeDeps();
    const { set } = tools(deps);
    await expect(set.run({ temperature: 0.7 }, { signal })).resolves.toEqual({ temperature: 0.7 });
    expect(deps.value).toBe(0.7);
  });

  it('accepts null to revert to API default', async () => {
    const deps = makeDeps(0.7);
    const { set } = tools(deps);
    await expect(set.run({ temperature: null }, { signal })).resolves.toEqual({ temperature: null });
    expect(deps.value).toBeNull();
  });

  it('accepts boundary values 0 and 2', async () => {
    const deps = makeDeps();
    const { set } = tools(deps);
    await set.run({ temperature: 0 }, { signal });
    expect(deps.value).toBe(0);
    await set.run({ temperature: 2 }, { signal });
    expect(deps.value).toBe(2);
  });

  it('rejects values below 0', async () => {
    const { set } = tools(makeDeps());
    await expect(set.run({ temperature: -0.1 }, { signal })).rejects.toThrow(/between 0 and 2/);
  });

  it('rejects values above 2', async () => {
    const { set } = tools(makeDeps());
    await expect(set.run({ temperature: 2.1 }, { signal })).rejects.toThrow(/between 0 and 2/);
  });

  it('rejects non-numeric, non-null temperature', async () => {
    const { set } = tools(makeDeps());
    await expect(set.run({ temperature: '0.7' }, { signal })).rejects.toThrow(/finite number or null/);
  });

  it('rejects NaN / Infinity', async () => {
    const { set } = tools(makeDeps());
    await expect(set.run({ temperature: NaN }, { signal })).rejects.toThrow(/finite number or null/);
    await expect(set.run({ temperature: Infinity }, { signal })).rejects.toThrow(/finite number or null/);
  });

  it('rejects missing temperature field', async () => {
    const { set } = tools(makeDeps());
    await expect(set.run({}, { signal })).rejects.toThrow(/missing required field/);
  });

  it('rejects non-object arguments', async () => {
    const { set } = tools(makeDeps());
    await expect(set.run(null, { signal })).rejects.toThrow(/must be an object/);
  });

  it('source and schema shape', () => {
    const { set } = tools(makeDeps());
    expect(set.source).toBe('sh3-ai.tool');
    const schema = set.inputSchema as Record<string, unknown>;
    expect(schema.type).toBe('object');
    expect(schema.required).toEqual(['temperature']);
  });
});
