const CONTENT_TYPES: Record<string, string> = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  json: 'application/json',
  txt: 'text/plain',
  guml: 'text/plain',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  csv: 'text/csv',
  xml: 'application/xml',
  svg: 'image/svg+xml',
  yaml: 'application/yaml',
  yml: 'application/yaml',
};

export function buildObjectKey(prefix: string, shardId: string, path: string): string {
  if (!shardId) throw new Error('buildObjectKey: shardId is required');
  const parts = path.split('/');
  if (parts.some((p) => p === '..' || p === '.')) {
    throw new Error(`buildObjectKey: path traversal not allowed: ${path}`);
  }
  const normPath = path.startsWith('/') ? path.slice(1) : path;
  return `${prefix}${shardId}/${normPath}`;
}

export function contentTypeFor(path: string): string {
  const dot = path.lastIndexOf('.');
  if (dot < 0) return 'application/octet-stream';
  const ext = path.slice(dot + 1).toLowerCase();
  return CONTENT_TYPES[ext] ?? 'application/octet-stream';
}
