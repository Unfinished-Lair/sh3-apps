<script lang="ts">
  import { shell } from 'sh3-core';
  import type { MatchingConfig, ToolbarAction, UserPrefs } from '../types';
  import type { RegistryEntry } from '../model/instance-registry';
  import type { ApiInternals } from '../model/api';
  import { isModKey, applyIndent, applyEnter, applyClosingBrace } from '../util/keybindings';
  import Toolbar from './Toolbar.svelte';
  import EditorSettings from './EditorSettings.svelte';

  interface Props {
    entry: RegistryEntry;
    internals: ApiInternals;
    highlight?: (text: string, language: string) => string;
    matchingConfig?: MatchingConfig;
    fontSize?: number;
    toolbarActions?: ToolbarAction[];
    showSettings?: boolean;
  }

  let {
    entry,
    internals,
    highlight,
    matchingConfig,
    fontSize = 13,
    toolbarActions = [],
    showSettings,
  }: Props = $props();

  let doc = $derived(entry.document);
  let local = $state(doc.content);

  let indentType = $derived(
    matchingConfig?.indentType ?? (matchingConfig?.indentBased ? 'indent' : 'none'),
  );

  let userOptionCount = $derived(
    indentType === 'none' ? 0 : indentType === 'brace' ? 2 : 1,
  );

  let gearVisible = $derived(
    (showSettings ?? true) && userOptionCount > 0,
  );

  function openSettingsModal() {
    shell.modal.open(EditorSettings, {
      indentType,
      prefs: entry.prefs,
      onChange: handlePrefsChange,
    });
  }

  let mergedToolbarActions = $derived.by(() => {
    if (!gearVisible) return toolbarActions;
    const gear: ToolbarAction = {
      id: 'sh3-editor:settings',
      label: 'Settings',
      icon: '⚙',
      onAction: openSettingsModal,
      group: '_editor_builtin',
    };
    return [...toolbarActions, gear];
  });

  function handlePrefsChange(next: UserPrefs) {
    entry.prefs = { ...entry.prefs, ...next } as typeof entry.prefs;
    internals.prefsChange.emit(entry.document.id, { ...entry.prefs });
  }

  // Sync from document when content changes externally
  $effect(() => {
    local = doc.content;
  });

  let textareaEl: HTMLTextAreaElement | undefined = $state();
  let scrollTop = $state(0);
  let scrollLeft = $state(0);

  let highlighted = $derived(
    highlight && doc.language
      ? highlight(local, doc.language)
      : escapeHtml(local),
  );

  let lineCount = $derived(local.split('\n').length);
  let lineNumbers = $derived(
    Array.from({ length: lineCount }, (_, i) => i + 1),
  );

  function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function pushContent(newContent: string, cursorStart: number, cursorEnd: number) {
    local = newContent;
    const id = doc.id;
    const before = doc.content;
    if (before === newContent) return;
    entry.history.push(before, newContent, doc.cursorStart, cursorStart);
    doc.content = newContent;
    doc.cursorStart = cursorStart;
    doc.cursorEnd = cursorEnd;
    const wasDirty = doc.dirty;
    doc.dirty = true;
    internals.contentChange.emit(id, newContent);
    if (!wasDirty) internals.dirtyChange.emit(id, true);
  }

  function setCursor(start: number, end: number) {
    requestAnimationFrame(() => {
      if (textareaEl) {
        textareaEl.selectionStart = start;
        textareaEl.selectionEnd = end;
      }
    });
  }

  function handleKeydown(e: KeyboardEvent) {
    // Save
    if (e.key === 's' && isModKey(e)) {
      e.preventDefault();
      internals.emitSave(doc.id);
      return;
    }

    // Undo
    if (e.key.toLowerCase() === 'z' && isModKey(e) && !e.shiftKey) {
      e.preventDefault();
      const result = entry.history.undo();
      if (result) {
        local = result.content;
        doc.content = result.content;
        doc.cursorStart = result.cursor;
        doc.cursorEnd = result.cursor;
        internals.contentChange.emit(doc.id, result.content);
        setCursor(result.cursor, result.cursor);
      }
      return;
    }

    // Redo
    if ((e.key.toLowerCase() === 'y' && isModKey(e)) || (e.key.toLowerCase() === 'z' && isModKey(e) && e.shiftKey)) {
      e.preventDefault();
      const result = entry.history.redo();
      if (result) {
        local = result.content;
        doc.content = result.content;
        doc.cursorStart = result.cursor;
        doc.cursorEnd = result.cursor;
        internals.contentChange.emit(doc.id, result.content);
        setCursor(result.cursor, result.cursor);
      }
      return;
    }

    // Enter: optional auto-indent based on indentType.
    if (e.key === 'Enter' && !e.shiftKey && !isModKey(e) && !e.altKey) {
      if (indentType === 'none') return;
      const el = e.currentTarget as HTMLTextAreaElement;
      const result = applyEnter(
        local,
        el.selectionStart,
        el.selectionEnd,
        indentType,
        entry.prefs.indentUnit,
        entry.prefs.braceStyle,
      );
      if (result) {
        e.preventDefault();
        pushContent(result.content, result.selectionStart, result.selectionEnd);
        setCursor(result.selectionStart, result.selectionEnd);
      }
      return;
    }

    // `}` on whitespace-only line: dedent to enclosing `{`'s indent (brace mode only).
    if (e.key === '}' && indentType === 'brace' && !isModKey(e) && !e.altKey) {
      const el = e.currentTarget as HTMLTextAreaElement;
      const result = applyClosingBrace(
        local,
        el.selectionStart,
        el.selectionEnd,
        entry.prefs.indentUnit,
      );
      if (result) {
        e.preventDefault();
        pushContent(result.content, result.selectionStart, result.selectionEnd);
        setCursor(result.selectionStart, result.selectionEnd);
        return;
      }
    }

    // Tab / Shift+Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget as HTMLTextAreaElement;
      const result = applyIndent(local, el.selectionStart, el.selectionEnd, e.shiftKey, matchingConfig?.indentUnit);
      if (result) {
        pushContent(result.content, result.selectionStart, result.selectionEnd);
        setCursor(result.selectionStart, result.selectionEnd);
      }
      return;
    }
  }

  function handleInput(e: Event) {
    const el = e.currentTarget as HTMLTextAreaElement;
    pushContent(el.value, el.selectionStart, el.selectionEnd);
  }

  function handleScroll(e: Event) {
    const el = e.currentTarget as HTMLTextAreaElement;
    scrollTop = el.scrollTop;
    scrollLeft = el.scrollLeft;
  }

  function handleSelect() {
    if (textareaEl) {
      doc.cursorStart = textareaEl.selectionStart;
      doc.cursorEnd = textareaEl.selectionEnd;
    }
  }
</script>

<div class="editor-container">
  <Toolbar actions={mergedToolbarActions} filePath={doc.filePath} />

  <div class="editor-wrap" style:--editor-font-size="{fontSize}px">
    <div class="gutter">
      <div class="gutter-inner" style:transform="translateY(-{scrollTop}px)">
        {#each lineNumbers as n (n)}
          <div class="line-num">{n}</div>
        {/each}
      </div>
    </div>

    <div class="editor-body">
      <pre
        class="highlight-layer"
        aria-hidden="true"
        style:top="-{scrollTop}px"
        style:left="-{scrollLeft}px"
      >{@html highlighted + '\n'}</pre>

      <textarea
        bind:this={textareaEl}
        class="input-layer"
        value={local}
        spellcheck={false}
        autocapitalize="off"
        onkeydown={handleKeydown}
        oninput={handleInput}
        onscroll={handleScroll}
        onselect={handleSelect}
      ></textarea>
    </div>
  </div>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .editor-wrap {
    display: flex;
    height: 100%;
    overflow: hidden;
    background: var(--shell-bg-sunken);
    font-family: var(--shell-font-mono);
    font-size: var(--editor-font-size, 13px);
    line-height: 1.6;
    color: var(--shell-fg);
  }

  .gutter {
    flex-shrink: 0;
    width: 3.5em;
    background: var(--shell-bg-sunken);
    border-right: 1px solid var(--shell-border);
    overflow: hidden;
    color: var(--shell-fg-muted);
    font-size: inherit;
    line-height: inherit;
    user-select: none;
  }

  .gutter-inner {
    text-align: right;
    padding: 0 0.5em 0 0;
  }

  .line-num {
    font-size: 0.85em;
    height: 1lh;
    line-height: 1lh;
  }

  .editor-body {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  .highlight-layer {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0 0.75em;
    white-space: pre;
    word-wrap: normal;
    overflow: visible;
    pointer-events: none;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: var(--shell-fg);
    tab-size: 2;
  }

  .input-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 0.75em;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: transparent;
    caret-color: var(--shell-fg);
    white-space: pre;
    word-wrap: normal;
    overflow: auto;
    tab-size: 2;
    box-sizing: border-box;
  }

  .input-layer::selection {
    background: rgba(97, 175, 239, 0.25);
  }

  /* Syntax token colors */
  :global(.hl-keyword) { color: #c678dd; }
  :global(.hl-type) { color: #e5c07b; }
  :global(.hl-string) { color: #98c379; }
  :global(.hl-number) { color: #d19a66; }
  :global(.hl-bool) { color: #d19a66; }
  :global(.hl-comment) { color: #5c6370; font-style: italic; }
  :global(.hl-key) { color: #e06c75; }
  :global(.hl-context) { color: #56b6c2; }
  :global(.hl-parent) { color: #61afef; }
  :global(.hl-ref) { color: #61afef; }
  :global(.hl-punct) { color: var(--shell-fg-muted); }
  :global(.hl-code) { color: #abb2bf; }
  :global(.hl-heading) { color: #e5c07b; font-weight: 600; }
  :global(.hl-bold) { font-weight: 600; }
</style>
