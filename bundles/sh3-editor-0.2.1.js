/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1a5ky2k{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1a5ky2k{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1a5ky2k{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1a5ky2k{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1a5ky2k{color:var(--shell-fg-muted)}.seg.svelte-1a5ky2k{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1a5ky2k button:where(.svelte-1a5ky2k){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1a5ky2k button:where(.svelte-1a5ky2k)+button:where(.svelte-1a5ky2k){border-left:1px solid var(--shell-border)}.seg.svelte-1a5ky2k button.active:where(.svelte-1a5ky2k){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1a5ky2k button:where(.svelte-1a5ky2k):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1a5ky2k{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1a5ky2k button:where(.svelte-1a5ky2k){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1a5ky2k button:where(.svelte-1a5ky2k):hover{background:var(--shell-accent)}.actions.svelte-1a5ky2k button.secondary:where(.svelte-1a5ky2k){background:transparent}.actions.svelte-1a5ky2k button.secondary:where(.svelte-1a5ky2k):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}";
  document.head.appendChild(s);
})();
var W = Object.defineProperty;
var Z = (r, e, n) => e in r ? W(r, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[e] = n;
var j = (r, e, n) => Z(r, typeof e != "symbol" ? e + "" : e, n);
import { mount as R, unmount as $ } from "svelte";
import "svelte/internal/disclose-version";
import * as t from "svelte/internal/client";
import { shell as tt } from "sh3-core";
const et = 300, nt = 200;
class rt {
  constructor(e = nt) {
    j(this, "undoStack", []);
    j(this, "redoStack", []);
    j(this, "maxDepth");
    this.maxDepth = e;
  }
  /**
   * Record a content change. Consecutive single-character edits within
   * COALESCE_MS are merged into one undo entry.
   */
  push(e, n, p, u) {
    const a = Date.now(), o = this.undoStack[this.undoStack.length - 1], s = Math.abs(n.length - e.length) <= 1;
    if (o && s && a - o.timestamp < et) {
      o.after = n, o.cursorAfter = u, o.timestamp = a, this.redoStack.length = 0;
      return;
    }
    this.undoStack.push({ before: e, after: n, cursorBefore: p, cursorAfter: u, timestamp: a }), this.undoStack.length > this.maxDepth && this.undoStack.shift(), this.redoStack.length = 0;
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
const st = 2, it = "inline";
function lt(r, e) {
  return {
    indentUnit: (e == null ? void 0 : e.indentUnit) ?? (r == null ? void 0 : r.indentUnit) ?? st,
    braceStyle: (e == null ? void 0 : e.braceStyle) ?? (r == null ? void 0 : r.braceStyle) ?? it
  };
}
class at {
  constructor() {
    j(this, "entries", /* @__PURE__ */ new Map());
  }
  open(e, n) {
    if (this.entries.has(e))
      return this.entries.get(e);
    const u = {
      document: {
        id: e,
        content: n.content,
        filePath: n.filePath ?? null,
        cursorStart: 0,
        cursorEnd: 0,
        scrollTop: 0,
        scrollLeft: 0,
        dirty: !1,
        language: n.language ?? null
      },
      history: new rt(),
      options: n,
      prefs: lt(n.matchingConfig, n.prefs)
    };
    return this.entries.set(e, u), u;
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
class M {
  constructor() {
    j(this, "listeners", /* @__PURE__ */ new Set());
  }
  on(e) {
    return this.listeners.add(e), () => {
      this.listeners.delete(e);
    };
  }
  emit(...e) {
    for (const n of this.listeners) n(...e);
  }
  clear() {
    this.listeners.clear();
  }
}
function ot(r) {
  const e = new M(), n = new M(), p = new M(), u = new M();
  return { api: {
    getContent(s) {
      const i = r.get(s);
      return i ? i.document.content : null;
    },
    isDirty(s) {
      const i = r.get(s);
      return i ? i.document.dirty : !1;
    },
    getDocument(s) {
      const i = r.get(s);
      return i ? i.document : null;
    },
    listInstances() {
      return r.list();
    },
    openDocument(s, i) {
      r.open(s, i);
    },
    closeDocument(s) {
      r.close(s);
    },
    updateContent(s, i, d, b) {
      const g = r.get(s);
      if (!g) return;
      const h = g.document, y = h.content;
      if (y === i) return;
      g.history.push(y, i, h.cursorStart, d), h.content = i, h.cursorStart = d, h.cursorEnd = b;
      const k = h.dirty;
      h.dirty = !0, e.emit(s, i), k || n.emit(s, !0);
    },
    markClean(s) {
      const i = r.get(s);
      i && i.document.dirty && (i.document.dirty = !1, n.emit(s, !1));
    },
    onContentChange(s) {
      return e.on(s);
    },
    onDirtyChange(s) {
      return n.on(s);
    },
    onSave(s) {
      return p.on(s);
    },
    onPrefsChange(s) {
      return u.on(s);
    }
  }, internals: {
    emitSave(s) {
      p.emit(s);
    },
    contentChange: e,
    dirtyChange: n,
    saveEvent: p,
    prefsChange: u
  } };
}
function K(r) {
  return r.ctrlKey || r.metaKey;
}
function ct(r, e, n, p, u = 2) {
  const a = " ".repeat(u);
  if (e === n && !p)
    return {
      content: r.slice(0, e) + a + r.slice(n),
      selectionStart: e + a.length,
      selectionEnd: e + a.length
    };
  const o = r.lastIndexOf(`
`, e - 1) + 1, s = r.slice(o, n).split(`
`);
  let i = e, d = n;
  const b = s.map((h, y) => {
    var k;
    if (p) {
      const f = ((k = h.match(new RegExp(`^ {1,${u}}`))) == null ? void 0 : k[0].length) ?? 0;
      return y === 0 && (i = Math.max(o, e - f)), d -= f, h.slice(f);
    } else
      return y === 0 && (i = e + a.length), d += a.length, a + h;
  });
  return { content: r.slice(0, o) + b.join(`
`) + r.slice(o + s.join(`
`).length), selectionStart: i, selectionEnd: d };
}
function ut(r, e, n, p, u = 2, a = "inline") {
  if (p === "none") return null;
  const o = r.lastIndexOf(`
`, e - 1) + 1, i = r.slice(o, e).match(/^[ \t]*/)[0], d = " ".repeat(u);
  if (p === "indent") {
    const f = `
` + i;
    return {
      content: r.slice(0, e) + f + r.slice(n),
      selectionStart: e + f.length,
      selectionEnd: e + f.length
    };
  }
  const b = e > 0 ? r[e - 1] : "", g = n < r.length ? r[n] : "", h = b === "{";
  if (h && g === "}") {
    if (a === "inline") {
      const m = `
` + i + d + `
` + i, S = e + 1 + i.length + d.length;
      return {
        content: r.slice(0, e) + m + r.slice(n),
        selectionStart: S,
        selectionEnd: S
      };
    }
    const f = r.slice(0, e - 1), D = r.slice(n), C = `
` + i + `{
` + i + d + `
` + i, w = f + C + D, E = f.length + (`
` + i + `{
` + i + d).length;
    return { content: w, selectionStart: E, selectionEnd: E };
  }
  if (h) {
    const f = `
` + i + d;
    return {
      content: r.slice(0, e) + f + r.slice(n),
      selectionStart: e + f.length,
      selectionEnd: e + f.length
    };
  }
  const k = `
` + i;
  return {
    content: r.slice(0, e) + k + r.slice(n),
    selectionStart: e + k.length,
    selectionEnd: e + k.length
  };
}
function dt(r, e, n, p = 2) {
  if (e !== n) return null;
  const u = r.lastIndexOf(`
`, e - 1) + 1, a = r.slice(u, e);
  if (!/^[ \t]*$/.test(a)) return null;
  let o = 0, s = -1;
  for (let g = u - 1; g >= 0; g--) {
    const h = r[g];
    if (h === "}") o++;
    else if (h === "{") {
      if (o === 0) {
        s = g;
        break;
      }
      o--;
    }
  }
  let i;
  if (s === -1) {
    const g = Math.max(0, a.length - p);
    i = a.slice(0, g);
  } else {
    const g = r.lastIndexOf(`
`, s - 1) + 1;
    i = r.slice(g, s).match(/^[ \t]*/)[0];
  }
  if (i.length >= a.length) return null;
  const d = r.slice(0, u) + i + "}" + r.slice(n), b = u + i.length + 1;
  return { content: d, selectionStart: b, selectionEnd: b };
}
var ht = t.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), gt = t.from_html("<button><!> </button>"), ft = t.from_html("<!> <!>", 1), vt = t.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), pt = t.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function mt(r, e) {
  t.push(e, !0);
  let n = t.prop(e, "filePath", 3, null), p = t.derived(() => {
    const s = [], i = /* @__PURE__ */ new Map();
    for (const d of e.actions) {
      const b = d.group ?? "_default";
      if (!i.has(b)) {
        const g = [];
        i.set(b, g), s.push({ key: b, items: g });
      }
      i.get(b).push(d);
    }
    return s;
  });
  var u = t.comment(), a = t.first_child(u);
  {
    var o = (s) => {
      var i = pt(), d = t.child(i);
      t.each(d, 17, () => t.get(p), t.index, (h, y, k) => {
        var f = ft(), D = t.first_child(f);
        {
          var C = (E) => {
            var m = ht();
            t.append(E, m);
          };
          t.if(D, (E) => {
            k > 0 && E(C);
          });
        }
        var w = t.sibling(D, 2);
        t.each(w, 17, () => t.get(y).items, (E) => E.id, (E, m) => {
          var S = gt();
          let L;
          var U = t.child(S);
          {
            var z = (T) => {
              var A = t.text();
              t.template_effect(() => t.set_text(A, t.get(m).icon)), t.append(T, A);
            };
            t.if(U, (T) => {
              t.get(m).icon && T(z);
            });
          }
          var O = t.sibling(U, 1, !0);
          t.reset(S), t.template_effect(() => {
            L = t.set_class(S, 1, "toolbar-btn svelte-10sr5yt", null, L, { "toolbar-accent": t.get(m).accent }), S.disabled = t.get(m).disabled, t.set_attribute(S, "title", t.get(m).shortcut ? `${t.get(m).label} (${t.get(m).shortcut})` : t.get(m).label), t.set_text(O, t.get(m).label);
          }), t.delegated("click", S, function(...T) {
            var A;
            (A = t.get(m).onAction) == null || A.apply(this, T);
          }), t.append(E, S);
        }), t.append(h, f);
      });
      var b = t.sibling(d, 2);
      {
        var g = (h) => {
          var y = vt(), k = t.sibling(t.first_child(y), 2), f = t.child(k, !0);
          t.reset(k), t.template_effect(
            (D) => {
              t.set_attribute(k, "title", n()), t.set_text(f, D);
            },
            [() => n().split(/[/\\]/).pop()]
          ), t.append(h, y);
        };
        t.if(b, (h) => {
          n() && h(g);
        });
      }
      t.reset(i), t.append(s, i);
    };
    t.if(a, (s) => {
      (e.actions.length > 0 || n()) && s(o);
    });
  }
  t.append(r, u), t.pop();
}
t.delegate(["click"]);
var yt = t.from_html('<div class="row svelte-1a5ky2k"><span class="label svelte-1a5ky2k">Brace style</span> <div class="seg svelte-1a5ky2k"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), _t = t.from_html('<div class="body svelte-1a5ky2k"><h2 class="svelte-1a5ky2k">Editor settings</h2> <div class="rows svelte-1a5ky2k"><div class="row svelte-1a5ky2k"><span class="label svelte-1a5ky2k">Indent unit</span> <div class="seg svelte-1a5ky2k"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1a5ky2k"><button type="button" class="secondary svelte-1a5ky2k">Close</button></div></div>');
function bt(r, e) {
  t.push(e, !0);
  let n = t.proxy({ ...e.prefs });
  function p(C) {
    n.indentUnit = C, e.onChange({ ...n });
  }
  function u(C) {
    n.braceStyle = C, e.onChange({ ...n });
  }
  var a = _t(), o = t.sibling(t.child(a), 2), s = t.child(o), i = t.sibling(t.child(s), 2), d = t.child(i);
  let b;
  var g = t.sibling(d, 2);
  let h;
  t.reset(i), t.reset(s);
  var y = t.sibling(s, 2);
  {
    var k = (C) => {
      var w = yt(), E = t.sibling(t.child(w), 2), m = t.child(E);
      let S;
      var L = t.sibling(m, 2);
      let U;
      t.reset(E), t.reset(w), t.template_effect(() => {
        S = t.set_class(m, 1, "svelte-1a5ky2k", null, S, { active: (n.braceStyle ?? "inline") === "inline" }), U = t.set_class(L, 1, "svelte-1a5ky2k", null, U, { active: (n.braceStyle ?? "inline") === "allman" });
      }), t.delegated("click", m, () => u("inline")), t.delegated("click", L, () => u("allman")), t.append(C, w);
    };
    t.if(y, (C) => {
      e.indentType === "brace" && C(k);
    });
  }
  t.reset(o);
  var f = t.sibling(o, 2), D = t.child(f);
  t.reset(f), t.reset(a), t.template_effect(() => {
    b = t.set_class(d, 1, "svelte-1a5ky2k", null, b, { active: (n.indentUnit ?? 2) === 2 }), h = t.set_class(g, 1, "svelte-1a5ky2k", null, h, { active: (n.indentUnit ?? 2) === 4 });
  }), t.delegated("click", d, () => p(2)), t.delegated("click", g, () => p(4)), t.delegated("click", D, function(...C) {
    var w;
    (w = e.close) == null || w.apply(this, C);
  }), t.append(r, a), t.pop();
}
t.delegate(["click"]);
var kt = t.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), St = t.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function Ct(r, e) {
  t.push(e, !0);
  let n = t.prop(e, "entry", 7), p = t.prop(e, "fontSize", 3, 13), u = t.prop(e, "toolbarActions", 19, () => []), a = t.derived(() => n().document), o = t.state(t.proxy(t.get(a).content)), s = t.derived(() => {
    var l, _;
    return ((l = e.matchingConfig) == null ? void 0 : l.indentType) ?? ((_ = e.matchingConfig) != null && _.indentBased ? "indent" : "none");
  }), i = t.derived(() => t.get(s) === "none" ? 0 : t.get(s) === "brace" ? 2 : 1), d = t.derived(() => (e.showSettings ?? !0) && t.get(i) > 0);
  function b() {
    tt.modal.open(bt, {
      indentType: t.get(s),
      prefs: n().prefs,
      onChange: h
    });
  }
  let g = t.derived(() => {
    if (!t.get(d)) return u();
    const l = {
      id: "sh3-editor:settings",
      label: "Settings",
      icon: "⚙",
      onAction: b,
      group: "_editor_builtin"
    };
    return [...u(), l];
  });
  function h(l) {
    n().prefs = { ...n().prefs, ...l }, e.internals.prefsChange.emit(n().document.id, { ...n().prefs });
  }
  t.user_effect(() => {
    t.set(o, t.get(a).content, !0);
  });
  let y = t.state(void 0), k = t.state(0), f = t.state(0), D = t.derived(() => e.highlight && t.get(a).language ? e.highlight(t.get(o), t.get(a).language) : E(t.get(o))), C = t.derived(() => t.get(o).split(`
`).length), w = t.derived(() => Array.from({ length: t.get(C) }, (l, _) => _ + 1));
  function E(l) {
    return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function m(l, _, c) {
    t.set(o, l, !0);
    const v = t.get(a).id, G = t.get(a).content;
    if (G === l) return;
    n().history.push(G, l, t.get(a).cursorStart, _), t.get(a).content = l, t.get(a).cursorStart = _, t.get(a).cursorEnd = c;
    const Q = t.get(a).dirty;
    t.get(a).dirty = !0, e.internals.contentChange.emit(v, l), Q || e.internals.dirtyChange.emit(v, !0);
  }
  function S(l, _) {
    requestAnimationFrame(() => {
      t.get(y) && (t.get(y).selectionStart = l, t.get(y).selectionEnd = _);
    });
  }
  function L(l) {
    var _;
    if (l.key === "s" && K(l)) {
      l.preventDefault(), e.internals.emitSave(t.get(a).id);
      return;
    }
    if (l.key.toLowerCase() === "z" && K(l) && !l.shiftKey) {
      l.preventDefault();
      const c = n().history.undo();
      c && (t.set(o, c.content, !0), t.get(a).content = c.content, t.get(a).cursorStart = c.cursor, t.get(a).cursorEnd = c.cursor, e.internals.contentChange.emit(t.get(a).id, c.content), S(c.cursor, c.cursor));
      return;
    }
    if (l.key.toLowerCase() === "y" && K(l) || l.key.toLowerCase() === "z" && K(l) && l.shiftKey) {
      l.preventDefault();
      const c = n().history.redo();
      c && (t.set(o, c.content, !0), t.get(a).content = c.content, t.get(a).cursorStart = c.cursor, t.get(a).cursorEnd = c.cursor, e.internals.contentChange.emit(t.get(a).id, c.content), S(c.cursor, c.cursor));
      return;
    }
    if (l.key === "Enter" && !l.shiftKey && !K(l) && !l.altKey) {
      if (t.get(s) === "none") return;
      const c = l.currentTarget, v = ut(t.get(o), c.selectionStart, c.selectionEnd, t.get(s), n().prefs.indentUnit, n().prefs.braceStyle);
      v && (l.preventDefault(), m(v.content, v.selectionStart, v.selectionEnd), S(v.selectionStart, v.selectionEnd));
      return;
    }
    if (l.key === "}" && t.get(s) === "brace" && !K(l) && !l.altKey) {
      const c = l.currentTarget, v = dt(t.get(o), c.selectionStart, c.selectionEnd, n().prefs.indentUnit);
      if (v) {
        l.preventDefault(), m(v.content, v.selectionStart, v.selectionEnd), S(v.selectionStart, v.selectionEnd);
        return;
      }
    }
    if (l.key === "Tab") {
      l.preventDefault();
      const c = l.currentTarget, v = ct(t.get(o), c.selectionStart, c.selectionEnd, l.shiftKey, (_ = e.matchingConfig) == null ? void 0 : _.indentUnit);
      v && (m(v.content, v.selectionStart, v.selectionEnd), S(v.selectionStart, v.selectionEnd));
      return;
    }
  }
  function U(l) {
    const _ = l.currentTarget;
    m(_.value, _.selectionStart, _.selectionEnd);
  }
  function z(l) {
    const _ = l.currentTarget;
    t.set(k, _.scrollTop, !0), t.set(f, _.scrollLeft, !0);
  }
  function O() {
    t.get(y) && (t.get(a).cursorStart = t.get(y).selectionStart, t.get(a).cursorEnd = t.get(y).selectionEnd);
  }
  var T = St(), A = t.child(T);
  mt(A, {
    get actions() {
      return t.get(g);
    },
    get filePath() {
      return t.get(a).filePath;
    }
  });
  var F = t.sibling(A, 2);
  let V;
  var N = t.child(F), H = t.child(N);
  let Y;
  t.each(H, 20, () => t.get(w), (l) => l, (l, _) => {
    var c = kt(), v = t.child(c, !0);
    t.reset(c), t.template_effect(() => t.set_text(v, _)), t.append(l, c);
  }), t.reset(H), t.reset(N);
  var q = t.sibling(N, 2), P = t.child(q);
  let X;
  t.html(P, () => t.get(D) + `
`, !0), t.reset(P);
  var I = t.sibling(P, 2);
  t.remove_textarea_child(I), t.set_attribute(I, "spellcheck", !1), t.bind_this(I, (l) => t.set(y, l), () => t.get(y)), t.reset(q), t.reset(F), t.reset(T), t.template_effect(() => {
    V = t.set_style(F, "", V, { "--editor-font-size": `${p() ?? ""}px` }), Y = t.set_style(H, "", Y, { transform: `translateY(-${t.get(k) ?? ""}px)` }), X = t.set_style(P, "", X, {
      top: `-${t.get(k) ?? ""}px`,
      left: `-${t.get(f) ?? ""}px`
    }), t.set_value(I, t.get(o));
  }), t.delegated("keydown", I, L), t.delegated("input", I, U), t.event("scroll", I, z), t.event("select", I, O), t.append(r, T), t.pop();
}
t.delegate(["keydown", "input"]);
let B = null, x = null;
const J = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [{ id: "sh3-editor:editor", label: "Editor", standalone: !0 }]
  },
  activate(r) {
    B = new at();
    const { api: e, internals: n } = ot(B);
    x = n, J.api = e;
    const p = {};
    r.registerView("sh3-editor:editor", {
      mount(u, a) {
        const o = a.slotId, s = B.get(o), i = (s == null ? void 0 : s.options) || p, d = R(Ct, {
          target: u,
          props: {
            entry: s,
            internals: x,
            highlight: i.highlight,
            matchingConfig: i.matchingConfig,
            fontSize: i.fontSize,
            toolbarActions: i.toolbarActions,
            showSettings: i.showSettings
          }
        });
        return {
          closable: !0,
          unmount() {
            $(d);
          }
        };
      }
    });
  },
  deactivate() {
    x == null || x.contentChange.clear(), x == null || x.dirtyChange.clear(), x == null || x.saveEvent.clear(), x == null || x.prefsChange.clear(), B == null || B.clear(), B = null, x = null, J.api = null;
  }
};
export {
  J as shard
};
