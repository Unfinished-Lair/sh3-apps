/**
 * Test whether a tool name matches a glob pattern.
 *
 * Pattern syntax:
 * - '*' matches any single segment of [^.]* (does NOT cross dots).
 * - '.' is a literal dot (segment separator).
 * - Plain characters match exactly.
 *
 * Examples:
 *   'sh3-fe.read' matches 'sh3-fe.*' and '*.read' and 'sh3-fe.read'.
 *   'sh3-fe.subns.read' does NOT match 'sh3-fe.*' (single-segment '*').
 */
export function matchesGlob(name: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexBody = escaped.replace(/\*/g, '[^.]*');
  const regex = new RegExp(`^${regexBody}$`);
  return regex.test(name);
}
