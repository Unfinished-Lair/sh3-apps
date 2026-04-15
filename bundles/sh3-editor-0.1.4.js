/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}";
  document.head.appendChild(s);
})();
var N = Object.defineProperty;
var V = (l, e, i) => e in l ? N(l, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : l[e] = i;
var z = (l, e, i) => V(l, typeof e != "symbol" ? e + "" : e, i);
import { mount as X, unmount as Y } from "svelte";
import "svelte/internal/disclose-version";
import * as t from "svelte/internal/client";
const G = 300, J = 200;
class Q {
  constructor(e = J) {
    z(this, "undoStack", []);
    z(this, "redoStack", []);
    z(this, "maxDepth");
    this.maxDepth = e;
  }
  /**
   * Record a content change. Consecutive single-character edits within
   * COALESCE_MS are merged into one undo entry.
   */
  push(e, i, h, s) {
    const a = Date.now(), n = this.undoStack[this.undoStack.length - 1], r = Math.abs(i.length - e.length) <= 1;
    if (n && r && a - n.timestamp < G) {
      n.after = i, n.cursorAfter = s, n.timestamp = a, this.redoStack.length = 0;
      return;
    }
    this.undoStack.push({ before: e, after: i, cursorBefore: h, cursorAfter: s, timestamp: a }), this.undoStack.length > this.maxDepth && this.undoStack.shift(), this.redoStack.length = 0;
  }
  undo() {
    const e = this.undoStack.pop();
    return e ? (this.redoStack.push(e), { content: e.before, cursor: e.cursorBefore }) : null;
  }
  redo() {
    const e = this.redoStack.pop();
    return e ? (this.undoStack.push(e), { content: e.after, cursor: e.cursorAfter }) : null;
  }
  clear() {
    this.undoStack.length = 0, this.redoStack.length = 0;
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
}
class W {
  constructor() {
    z(this, "entries", /* @__PURE__ */ new Map());
  }
  open(e, i) {
    if (this.entries.has(e))
      return this.entries.get(e);
    const s = {
      document: {
        id: e,
        content: i.content,
        filePath: i.filePath ?? null,
        cursorStart: 0,
        cursorEnd: 0,
        scrollTop: 0,
        scrollLeft: 0,
        dirty: !1,
        language: i.language ?? null
      },
      history: new Q(),
      options: i
    };
    return this.entries.set(e, s), s;
  }
  close(e) {
    return this.entries.delete(e);
  }
  get(e) {
    return this.entries.get(e);
  }
  has(e) {
    return this.entries.has(e);
  }
  list() {
    return [...this.entries.keys()];
  }
  clear() {
    this.entries.clear();
  }
}
class B {
  constructor() {
    z(this, "listeners", /* @__PURE__ */ new Set());
  }
  on(e) {
    return this.listeners.add(e), () => {
      this.listeners.delete(e);
    };
  }
  emit(...e) {
    for (const i of this.listeners) i(...e);
  }
  clear() {
    this.listeners.clear();
  }
}
function Z(l) {
  const e = new B(), i = new B(), h = new B();
  return { api: {
    getContent(n) {
      const r = l.get(n);
      return r ? r.document.content : null;
    },
    isDirty(n) {
      const r = l.get(n);
      return r ? r.document.dirty : !1;
    },
    getDocument(n) {
      const r = l.get(n);
      return r ? r.document : null;
    },
    listInstances() {
      return l.list();
    },
    openDocument(n, r) {
      l.open(n, r);
    },
    closeDocument(n) {
      l.close(n);
    },
    updateContent(n, r, u, p) {
      const v = l.get(n);
      if (!v) return;
      const g = v.document, m = g.content;
      if (m === r) return;
      v.history.push(m, r, g.cursorStart, u), g.content = r, g.cursorStart = u, g.cursorEnd = p;
      const y = g.dirty;
      g.dirty = !0, e.emit(n, r), y || i.emit(n, !0);
    },
    markClean(n) {
      const r = l.get(n);
      r && r.document.dirty && (r.document.dirty = !1, i.emit(n, !1));
    },
    onContentChange(n) {
      return e.on(n);
    },
    onDirtyChange(n) {
      return i.on(n);
    },
    onSave(n) {
      return h.on(n);
    }
  }, internals: {
    emitSave(n) {
      h.emit(n);
    },
    contentChange: e,
    dirtyChange: i,
    saveEvent: h
  } };
}
function M(l) {
  return l.ctrlKey || l.metaKey;
}
function R(l, e, i, h, s = 2) {
  const a = " ".repeat(s);
  if (e === i && !h)
    return {
      content: l.slice(0, e) + a + l.slice(i),
      selectionStart: e + a.length,
      selectionEnd: e + a.length
    };
  const n = l.lastIndexOf(`
`, e - 1) + 1, r = l.slice(n, i).split(`
`);
  let u = e, p = i;
  const v = r.map((m, y) => {
    var _;
    if (h) {
      const E = ((_ = m.match(new RegExp(`^ {1,${s}}`))) == null ? void 0 : _[0].length) ?? 0;
      return y === 0 && (u = Math.max(n, e - E)), p -= E, m.slice(E);
    } else
      return y === 0 && (u = e + a.length), p += a.length, a + m;
  });
  return { content: l.slice(0, n) + v.join(`
`) + l.slice(n + r.join(`
`).length), selectionStart: u, selectionEnd: p };
}
var $ = t.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), tt = t.from_html("<button><!> </button>"), et = t.from_html("<!> <!>", 1), nt = t.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), rt = t.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function st(l, e) {
  t.push(e, !0);
  let i = t.prop(e, "filePath", 3, null), h = t.derived(() => {
    const r = [], u = /* @__PURE__ */ new Map();
    for (const p of e.actions) {
      const v = p.group ?? "_default";
      if (!u.has(v)) {
        const g = [];
        u.set(v, g), r.push({ key: v, items: g });
      }
      u.get(v).push(p);
    }
    return r;
  });
  var s = t.comment(), a = t.first_child(s);
  {
    var n = (r) => {
      var u = rt(), p = t.child(u);
      t.each(p, 17, () => t.get(h), t.index, (m, y, _) => {
        var E = et(), j = t.first_child(E);
        {
          var P = (S) => {
            var f = $();
            t.append(S, f);
          };
          t.if(j, (S) => {
            _ > 0 && S(P);
          });
        }
        var H = t.sibling(j, 2);
        t.each(H, 17, () => t.get(y).items, (S) => S.id, (S, f) => {
          var k = tt();
          let L;
          var T = t.child(k);
          {
            var I = (w) => {
              var C = t.text();
              t.template_effect(() => t.set_text(C, t.get(f).icon)), t.append(w, C);
            };
            t.if(T, (w) => {
              t.get(f).icon && w(I);
            });
          }
          var K = t.sibling(T, 1, !0);
          t.reset(k), t.template_effect(() => {
            L = t.set_class(k, 1, "toolbar-btn svelte-10sr5yt", null, L, { "toolbar-accent": t.get(f).accent }), k.disabled = t.get(f).disabled, t.set_attribute(k, "title", t.get(f).shortcut ? `${t.get(f).label} (${t.get(f).shortcut})` : t.get(f).label), t.set_text(K, t.get(f).label);
          }), t.delegated("click", k, function(...w) {
            var C;
            (C = t.get(f).onAction) == null || C.apply(this, w);
          }), t.append(S, k);
        }), t.append(m, E);
      });
      var v = t.sibling(p, 2);
      {
        var g = (m) => {
          var y = nt(), _ = t.sibling(t.first_child(y), 2), E = t.child(_, !0);
          t.reset(_), t.template_effect(
            (j) => {
              t.set_attribute(_, "title", i()), t.set_text(E, j);
            },
            [() => i().split(/[/\\]/).pop()]
          ), t.append(m, y);
        };
        t.if(v, (m) => {
          i() && m(g);
        });
      }
      t.reset(u), t.append(r, u);
    };
    t.if(a, (r) => {
      (e.actions.length > 0 || i()) && r(n);
    });
  }
  t.append(l, s), t.pop();
}
t.delegate(["click"]);
var ot = t.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), it = t.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function lt(l, e) {
  t.push(e, !0);
  let i = t.prop(e, "fontSize", 3, 13), h = t.prop(e, "toolbarActions", 19, () => []), s = t.derived(() => e.entry.document), a = t.state(t.proxy(t.get(s).content));
  t.user_effect(() => {
    t.set(a, t.get(s).content, !0);
  });
  let n = t.state(void 0), r = t.state(0), u = t.state(0), p = t.derived(() => e.highlight && t.get(s).language ? e.highlight(t.get(a), t.get(s).language) : m(t.get(a))), v = t.derived(() => t.get(a).split(`
`).length), g = t.derived(() => Array.from({ length: t.get(v) }, (o, d) => d + 1));
  function m(o) {
    return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function y(o, d, c) {
    t.set(a, o, !0);
    const x = t.get(s).id, O = t.get(s).content;
    if (O === o) return;
    e.entry.history.push(O, o, t.get(s).cursorStart, d), t.get(s).content = o, t.get(s).cursorStart = d, t.get(s).cursorEnd = c;
    const q = t.get(s).dirty;
    t.get(s).dirty = !0, e.internals.contentChange.emit(x, o), q || e.internals.dirtyChange.emit(x, !0);
  }
  function _(o, d) {
    requestAnimationFrame(() => {
      t.get(n) && (t.get(n).selectionStart = o, t.get(n).selectionEnd = d);
    });
  }
  function E(o) {
    var d;
    if (o.key === "s" && M(o)) {
      o.preventDefault(), e.internals.emitSave(t.get(s).id);
      return;
    }
    if (o.key.toLowerCase() === "z" && M(o) && !o.shiftKey) {
      o.preventDefault();
      const c = e.entry.history.undo();
      c && (t.set(a, c.content, !0), t.get(s).content = c.content, t.get(s).cursorStart = c.cursor, t.get(s).cursorEnd = c.cursor, e.internals.contentChange.emit(t.get(s).id, c.content), _(c.cursor, c.cursor));
      return;
    }
    if (o.key.toLowerCase() === "y" && M(o) || o.key.toLowerCase() === "z" && M(o) && o.shiftKey) {
      o.preventDefault();
      const c = e.entry.history.redo();
      c && (t.set(a, c.content, !0), t.get(s).content = c.content, t.get(s).cursorStart = c.cursor, t.get(s).cursorEnd = c.cursor, e.internals.contentChange.emit(t.get(s).id, c.content), _(c.cursor, c.cursor));
      return;
    }
    if (o.key === "Tab") {
      o.preventDefault();
      const c = o.currentTarget, x = R(t.get(a), c.selectionStart, c.selectionEnd, o.shiftKey, (d = e.matchingConfig) == null ? void 0 : d.indentUnit);
      x && (y(x.content, x.selectionStart, x.selectionEnd), _(x.selectionStart, x.selectionEnd));
      return;
    }
  }
  function j(o) {
    const d = o.currentTarget;
    y(d.value, d.selectionStart, d.selectionEnd);
  }
  function P(o) {
    const d = o.currentTarget;
    t.set(r, d.scrollTop, !0), t.set(u, d.scrollLeft, !0);
  }
  function H() {
    t.get(n) && (t.get(s).cursorStart = t.get(n).selectionStart, t.get(s).cursorEnd = t.get(n).selectionEnd);
  }
  var S = it(), f = t.child(S);
  st(f, {
    get actions() {
      return h();
    },
    get filePath() {
      return t.get(s).filePath;
    }
  });
  var k = t.sibling(f, 2);
  let L;
  var T = t.child(k), I = t.child(T);
  let K;
  t.each(I, 20, () => t.get(g), (o) => o, (o, d) => {
    var c = ot(), x = t.child(c, !0);
    t.reset(c), t.template_effect(() => t.set_text(x, d)), t.append(o, c);
  }), t.reset(I), t.reset(T);
  var w = t.sibling(T, 2), C = t.child(w);
  let F;
  t.html(C, () => t.get(p) + `
`, !0), t.reset(C);
  var D = t.sibling(C, 2);
  t.remove_textarea_child(D), t.set_attribute(D, "spellcheck", !1), t.bind_this(D, (o) => t.set(n, o), () => t.get(n)), t.reset(w), t.reset(k), t.reset(S), t.template_effect(() => {
    L = t.set_style(k, "", L, { "--editor-font-size": `${i() ?? ""}px` }), K = t.set_style(I, "", K, { transform: `translateY(-${t.get(r) ?? ""}px)` }), F = t.set_style(C, "", F, {
      top: `-${t.get(r) ?? ""}px`,
      left: `-${t.get(u) ?? ""}px`
    }), t.set_value(D, t.get(a));
  }), t.delegated("keydown", D, E), t.delegated("input", D, j), t.event("scroll", D, P), t.event("select", D, H), t.append(l, S), t.pop();
}
t.delegate(["keydown", "input"]);
let A = null, b = null;
const U = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [{ id: "sh3-editor:editor", label: "Editor", standalone: !0 }]
  },
  activate(l) {
    A = new W();
    const { api: e, internals: i } = Z(A);
    b = i, U.api = e, l.registerView("sh3-editor:editor", {
      mount(h, s) {
        const a = s.slotId, n = A.get(a);
        if (!n)
          return h.textContent = `Editor: no document for "${a}"`, { unmount() {
          } };
        const r = n.options, u = X(lt, {
          target: h,
          props: {
            entry: n,
            internals: b,
            highlight: r.highlight,
            matchingConfig: r.matchingConfig,
            fontSize: r.fontSize,
            toolbarActions: r.toolbarActions
          }
        });
        return {
          closable: !0,
          unmount() {
            Y(u);
          }
        };
      }
    });
  },
  deactivate() {
    b == null || b.contentChange.clear(), b == null || b.dirtyChange.clear(), b == null || b.saveEvent.clear(), A == null || A.clear(), A = null, b = null, U.api = null;
  }
};
export {
  U as shard
};
