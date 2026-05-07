import { describe, it, expect, vi } from 'vitest';
import { firstMessageTitle, llmSummarizeTitle } from './title-strategy';

describe('firstMessageTitle', () => {
  it('returns short text unchanged after trim', () => {
    expect(firstMessageTitle('  hello world  ')).toBe('hello world');
  });

  it('truncates with ellipsis when over the cap', () => {
    const long = 'a'.repeat(120);
    const out = firstMessageTitle(long, 60);
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out.endsWith('…')).toBe(true);
  });

  it('collapses internal newlines into spaces', () => {
    expect(firstMessageTitle('line one\nline two')).toBe('line one line two');
  });

  it('collapses multiple whitespace runs into one space', () => {
    expect(firstMessageTitle('a    b\t\tc')).toBe('a b c');
  });

  it('returns "Untitled" when input is empty or whitespace', () => {
    expect(firstMessageTitle('')).toBe('Untitled');
    expect(firstMessageTitle('   \n\t  ')).toBe('Untitled');
  });
});

describe('llmSummarizeTitle', () => {
  it('asks the LLM with both messages and returns the cleaned title', async () => {
    const ask = vi.fn().mockResolvedValue('Auth bug investigation\n');
    const out = await llmSummarizeTitle(ask, 'why does login redirect', 'because…',
      new AbortController().signal);
    expect(out).toBe('Auth bug investigation');
    const [prompt] = ask.mock.calls[0];
    expect(prompt).toContain('why does login redirect');
    expect(prompt).toContain('because');
  });

  it('strips surrounding quotes', async () => {
    const ask = vi.fn().mockResolvedValue('"My quoted title"');
    const out = await llmSummarizeTitle(ask, 'q', 'a', new AbortController().signal);
    expect(out).toBe('My quoted title');
  });

  it('strips trailing punctuation', async () => {
    const ask = vi.fn().mockResolvedValue('Refactor sync logic.');
    const out = await llmSummarizeTitle(ask, 'q', 'a', new AbortController().signal);
    expect(out).toBe('Refactor sync logic');
  });

  it('truncates if model overshoots the cap', async () => {
    const ask = vi.fn().mockResolvedValue('x'.repeat(120));
    const out = await llmSummarizeTitle(ask, 'q', 'a', new AbortController().signal);
    expect(out.length).toBeLessThanOrEqual(60);
  });

  it('falls back to firstMessageTitle on ask rejection', async () => {
    const ask = vi.fn().mockRejectedValue(new Error('network'));
    const out = await llmSummarizeTitle(ask, 'why does login redirect', 'a',
      new AbortController().signal);
    expect(out).toBe('why does login redirect');
  });

  it('falls back to firstMessageTitle on empty response', async () => {
    const ask = vi.fn().mockResolvedValue('   \n');
    const out = await llmSummarizeTitle(ask, 'why', 'a', new AbortController().signal);
    expect(out).toBe('why');
  });
});
