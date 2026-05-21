import { describe, it, expect } from 'vitest';
import { languageFromExtension } from './language';

describe('languageFromExtension', () => {
  it('maps .md → markdown', () => {
    expect(languageFromExtension('notes.md')).toBe('markdown');
  });

  it('maps .json and .jsonl → json', () => {
    expect(languageFromExtension('config.json')).toBe('json');
    expect(languageFromExtension('events.jsonl')).toBe('json');
  });

  it('maps .txt → plaintext', () => {
    expect(languageFromExtension('readme.txt')).toBe('plaintext');
  });

  it('falls back to plaintext for unknown extensions', () => {
    expect(languageFromExtension('binary.dat')).toBe('plaintext');
  });

  it('is case-insensitive', () => {
    expect(languageFromExtension('NOTES.MD')).toBe('markdown');
  });

  it('handles paths with no extension', () => {
    expect(languageFromExtension('LICENSE')).toBe('plaintext');
  });
});
