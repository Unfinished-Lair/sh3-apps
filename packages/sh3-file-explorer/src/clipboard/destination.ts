export interface Ref {
  shardId: string;
  path: string;
  kind: 'file' | 'folder';
}

function basename(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx < 0 ? path : path.slice(idx + 1);
}

function parentDir(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx < 0 ? '' : path.slice(0, idx);
}

export function computeDestination(source: Ref, target: Ref): { shardId: string; path: string } {
  const folder = target.kind === 'folder' ? target.path : parentDir(target.path);
  const name = basename(source.path);
  const joined = folder ? `${folder}/${name}` : name;
  return { shardId: target.shardId, path: joined };
}

export function addCopySuffix(path: string, attempt: number): string {
  const dirIdx = path.lastIndexOf('/');
  const dir = dirIdx < 0 ? '' : path.slice(0, dirIdx + 1);
  const name = dirIdx < 0 ? path : path.slice(dirIdx + 1);
  const dotIdx = name.lastIndexOf('.');
  const isDotfile = dotIdx === 0;
  const hasExt = dotIdx > 0 && !isDotfile;
  const stem = hasExt ? name.slice(0, dotIdx) : name;
  const ext = hasExt ? name.slice(dotIdx) : '';
  const suffix = attempt <= 1 ? ' (copy)' : ` (copy ${attempt})`;
  return `${dir}${stem}${suffix}${ext}`;
}

export function isPasteIntoSelf(source: Ref, target: Ref): boolean {
  if (source.kind !== 'folder') return false;
  if (source.shardId !== target.shardId) return false;
  if (source.path === target.path) return true;
  const targetFolder = target.kind === 'folder' ? target.path : parentDir(target.path);
  const prefix = source.path === '' ? '' : `${source.path}/`;
  return targetFolder === source.path || targetFolder.startsWith(prefix);
}
