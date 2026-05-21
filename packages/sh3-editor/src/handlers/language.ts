const MAP: Record<string, string> = {
  '.md': 'markdown',
  '.json': 'json',
  '.jsonl': 'json',
  '.txt': 'plaintext',
};

export function languageFromExtension(path: string): string {
  const dotIdx = path.lastIndexOf('.');
  if (dotIdx < 0) return 'plaintext';
  const ext = path.slice(dotIdx).toLowerCase();
  return MAP[ext] ?? 'plaintext';
}
