import type { MatchingConfig, BracketMatch, IndentMatch } from '../types';

/**
 * Find the matching bracket for the bracket at `position` in `text`.
 * Returns null if the character at position is not a configured bracket
 * or no match is found.
 */
export function findBracketMatch(
  text: string,
  position: number,
  config: MatchingConfig,
): BracketMatch | null {
  if (!config.brackets || config.brackets.length === 0) return null;

  const char = text[position];
  if (!char) return null;

  for (const [open, close] of config.brackets) {
    if (char === open) {
      const closePos = scanForward(text, position, open, close);
      if (closePos !== -1) return { open: position, close: closePos };
    }
    if (char === close) {
      const openPos = scanBackward(text, position, open, close);
      if (openPos !== -1) return { open: openPos, close: position };
    }
  }

  return null;
}

function scanForward(text: string, start: number, open: string, close: string): number {
  let depth = 1;
  for (let i = start + 1; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function scanBackward(text: string, start: number, open: string, close: string): number {
  let depth = 1;
  for (let i = start - 1; i >= 0; i--) {
    if (text[i] === close) depth++;
    else if (text[i] === open) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Find indent-level matches for the line containing `cursorOffset`.
 * Returns the parent line (enclosing lower indent) and sibling lines
 * (same indent level within that parent block).
 */
export function findIndentMatch(
  text: string,
  cursorOffset: number,
  config: MatchingConfig,
): IndentMatch | null {
  if (!config.indentBased) return null;

  const unit = config.indentUnit ?? 2;
  const lines = text.split('\n');

  // Find which line the cursor is on
  let offset = 0;
  let cursorLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (offset + lines[i].length >= cursorOffset) {
      cursorLine = i;
      break;
    }
    offset += lines[i].length + 1;
  }

  const currentIndent = getIndentLevel(lines[cursorLine], unit);
  if (currentIndent === 0) {
    const siblings = lines
      .map((line, i) => ({ i, indent: getIndentLevel(line, unit), empty: line.trim() === '' }))
      .filter((l) => l.indent === 0 && !l.empty)
      .map((l) => l.i);
    return { parentLine: -1, siblingLines: siblings };
  }

  let parentLine = -1;
  for (let i = cursorLine - 1; i >= 0; i--) {
    if (lines[i].trim() === '') continue;
    if (getIndentLevel(lines[i], unit) < currentIndent) {
      parentLine = i;
      break;
    }
  }

  const blockStart = parentLine + 1;
  let blockEnd = lines.length;
  for (let i = cursorLine + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    if (getIndentLevel(lines[i], unit) < currentIndent) {
      blockEnd = i;
      break;
    }
  }

  const siblings: number[] = [];
  for (let i = blockStart; i < blockEnd; i++) {
    if (lines[i].trim() === '') continue;
    if (getIndentLevel(lines[i], unit) === currentIndent) {
      siblings.push(i);
    }
  }

  return { parentLine, siblingLines: siblings };
}

function getIndentLevel(line: string, unit: number): number {
  const match = line.match(/^( *)/);
  if (!match) return 0;
  return Math.floor(match[1].length / unit);
}
