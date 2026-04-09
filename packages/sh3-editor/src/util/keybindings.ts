/** Check if Ctrl (Windows/Linux) or Cmd (Mac) is held. */
export function isModKey(e: KeyboardEvent): boolean {
  return e.ctrlKey || e.metaKey;
}

/**
 * Apply a 2-space indent or dedent to the textarea content.
 * Returns the new content and selection range, or null if no change.
 */
export function applyIndent(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  dedent: boolean,
): { content: string; selectionStart: number; selectionEnd: number } | null {
  const indent = '  ';

  // Single cursor, inserting indent
  if (selectionStart === selectionEnd && !dedent) {
    return {
      content: content.slice(0, selectionStart) + indent + content.slice(selectionEnd),
      selectionStart: selectionStart + indent.length,
      selectionEnd: selectionStart + indent.length,
    };
  }

  // Block indent/dedent
  const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1;
  const lines = content.slice(lineStart, selectionEnd).split('\n');
  let newStart = selectionStart;
  let newEnd = selectionEnd;

  const transformed = lines.map((line, i) => {
    if (dedent) {
      const removed = line.match(/^ {1,2}/)?.[0].length ?? 0;
      if (i === 0) newStart = Math.max(lineStart, selectionStart - removed);
      newEnd -= removed;
      return line.slice(removed);
    } else {
      if (i === 0) newStart = selectionStart + indent.length;
      newEnd += indent.length;
      return indent + line;
    }
  });

  const newContent =
    content.slice(0, lineStart) +
    transformed.join('\n') +
    content.slice(lineStart + lines.join('\n').length);

  return { content: newContent, selectionStart: newStart, selectionEnd: newEnd };
}
