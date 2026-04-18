import type { EditorIndentType, BraceStyle } from '../types';

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
  indentUnit: number = 2,
): { content: string; selectionStart: number; selectionEnd: number } | null {
  const indent = ' '.repeat(indentUnit);

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
      const removed = line.match(new RegExp(`^ {1,${indentUnit}}`))?.[0].length ?? 0;
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

export interface EnterResult {
  content: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Compute the result of pressing Enter given the current content, cursor, and
 * active indent config. Returns null when the default newline behavior is desired.
 */
export function applyEnter(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  indentType: EditorIndentType,
  indentUnit: number = 2,
  braceStyle: BraceStyle = 'inline',
): EnterResult | null {
  if (indentType === 'none') return null;

  const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1;
  const currentLine = content.slice(lineStart, selectionStart);
  const leading = currentLine.match(/^[ \t]*/)![0];
  const unit = ' '.repeat(indentUnit);

  if (indentType === 'indent') {
    const insert = '\n' + leading;
    return {
      content: content.slice(0, selectionStart) + insert + content.slice(selectionEnd),
      selectionStart: selectionStart + insert.length,
      selectionEnd: selectionStart + insert.length,
    };
  }

  const charBefore = selectionStart > 0 ? content[selectionStart - 1] : '';
  const charAfter = selectionEnd < content.length ? content[selectionEnd] : '';
  const openedBrace = charBefore === '{';
  const splitBraces = openedBrace && charAfter === '}';

  if (splitBraces) {
    if (braceStyle === 'inline') {
      const insert = '\n' + leading + unit + '\n' + leading;
      const caret = selectionStart + 1 + leading.length + unit.length;
      return {
        content: content.slice(0, selectionStart) + insert + content.slice(selectionEnd),
        selectionStart: caret,
        selectionEnd: caret,
      };
    }
    const preBrace = content.slice(0, selectionStart - 1);
    const trailing = content.slice(selectionEnd);
    const insert = '\n' + leading + '{\n' + leading + unit + '\n' + leading;
    const newContent = preBrace + insert + trailing;
    const caret = preBrace.length + ('\n' + leading + '{\n' + leading + unit).length;
    return { content: newContent, selectionStart: caret, selectionEnd: caret };
  }

  if (openedBrace) {
    const insert = '\n' + leading + unit;
    return {
      content: content.slice(0, selectionStart) + insert + content.slice(selectionEnd),
      selectionStart: selectionStart + insert.length,
      selectionEnd: selectionStart + insert.length,
    };
  }

  const insert = '\n' + leading;
  return {
    content: content.slice(0, selectionStart) + insert + content.slice(selectionEnd),
    selectionStart: selectionStart + insert.length,
    selectionEnd: selectionStart + insert.length,
  };
}

export interface ClosingBraceResult {
  content: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * When the user types `}` on a line whose content so far is only whitespace,
 * dedent the line by one indentUnit before inserting the `}`, aligning with
 * the enclosing `{`'s indent when findable. Returns null when no change is warranted.
 */
export function applyClosingBrace(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  indentUnit: number = 2,
): ClosingBraceResult | null {
  if (selectionStart !== selectionEnd) return null;

  const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1;
  const currentLine = content.slice(lineStart, selectionStart);
  if (!/^[ \t]*$/.test(currentLine)) return null;

  let depth = 0;
  let matchIdx = -1;
  for (let i = lineStart - 1; i >= 0; i--) {
    const ch = content[i];
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) { matchIdx = i; break; }
      depth--;
    }
  }

  let targetIndent: string;
  if (matchIdx === -1) {
    const trimmed = Math.max(0, currentLine.length - indentUnit);
    targetIndent = currentLine.slice(0, trimmed);
  } else {
    const matchLineStart = content.lastIndexOf('\n', matchIdx - 1) + 1;
    targetIndent = content.slice(matchLineStart, matchIdx).match(/^[ \t]*/)![0];
  }

  if (targetIndent.length >= currentLine.length) return null;

  const replaced =
    content.slice(0, lineStart) +
    targetIndent + '}' +
    content.slice(selectionEnd);
  const caret = lineStart + targetIndent.length + 1;

  return { content: replaced, selectionStart: caret, selectionEnd: caret };
}
