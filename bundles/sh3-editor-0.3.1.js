/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1a5ky2k{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1a5ky2k{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1a5ky2k{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1a5ky2k{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1a5ky2k{color:var(--shell-fg-muted)}.seg.svelte-1a5ky2k{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1a5ky2k button:where(.svelte-1a5ky2k){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1a5ky2k button:where(.svelte-1a5ky2k)+button:where(.svelte-1a5ky2k){border-left:1px solid var(--shell-border)}.seg.svelte-1a5ky2k button.active:where(.svelte-1a5ky2k){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1a5ky2k button:where(.svelte-1a5ky2k):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1a5ky2k{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1a5ky2k button:where(.svelte-1a5ky2k){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1a5ky2k button:where(.svelte-1a5ky2k):hover{background:var(--shell-accent)}.actions.svelte-1a5ky2k button.secondary:where(.svelte-1a5ky2k){background:transparent}.actions.svelte-1a5ky2k button.secondary:where(.svelte-1a5ky2k):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}";
  document.head.appendChild(s);
})();
var _e = Object.defineProperty;
var ke = (i, t, n) => t in i ? _e(i, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : i[t] = n;
var R = (i, t, n) => ke(i, typeof t != "symbol" ? t + "" : t, n);
import { mount as le, unmount as ae } from "svelte";
import "svelte/internal/disclose-version";
import * as e from "svelte/internal/client";
import { shell as Ce } from "sh3-core";
const Se = 2, we = "inline";
function Ee(i, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (i == null ? void 0 : i.indentUnit) ?? Se,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (i == null ? void 0 : i.braceStyle) ?? we
  };
}
class xe {
  constructor(t) {
    R(this, "entries", /* @__PURE__ */ new Map());
    R(this, "onClose");
    this.onClose = t;
  }
  open(t, n) {
    if (this.entries.has(t))
      return this.entries.get(t);
    const g = {
      document: {
        id: t,
        content: n.content,
        filePath: n.filePath ?? null,
        cursorStart: 0,
        cursorEnd: 0,
        scrollTop: 0,
        scrollLeft: 0,
        dirty: !1,
        language: n.language ?? null
      },
      options: n,
      prefs: Ee(n.matchingConfig, n.prefs)
    };
    return this.entries.set(t, g), g;
  }
  close(t) {
    const n = this.entries.delete(t);
    return n && this.onClose && this.onClose(t), n;
  }
  get(t) {
    return this.entries.get(t);
  }
  has(t) {
    return this.entries.has(t);
  }
  list() {
    return [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), this.onClose) for (const n of t) this.onClose(n);
  }
}
class Ie {
  constructor(t) {
    R(this, "entries", /* @__PURE__ */ new Map());
    R(this, "onClose");
    this.onClose = t;
  }
  open(t, n) {
    const c = this.entries.get(t);
    if (c) return c;
    const g = {
      value: n.value,
      meta: n.meta,
      options: n
    };
    return this.entries.set(t, g), g;
  }
  close(t) {
    const n = this.entries.delete(t);
    return n && this.onClose && this.onClose(t), n;
  }
  get(t) {
    return this.entries.get(t);
  }
  has(t) {
    return this.entries.has(t);
  }
  list() {
    return [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), this.onClose) for (const n of t) this.onClose(n);
  }
}
const Te = 200;
class De {
  constructor(t = Te) {
    R(this, "undoStack", []);
    R(this, "redoStack", []);
    R(this, "maxDepth");
    R(this, "listeners", /* @__PURE__ */ new Set());
    this.maxDepth = t;
  }
  push(t) {
    t.meta && t.meta.timestamp == null ? t.meta.timestamp = Date.now() : t.meta || (t.meta = { timestamp: Date.now() }), this.undoStack.push(t), this.undoStack.length > this.maxDepth && this.undoStack.shift(), this.redoStack.length = 0, this.emit();
  }
  undo() {
    const t = this.undoStack.pop();
    return t ? (t.revert(), this.redoStack.push(t), this.emit(), !0) : !1;
  }
  redo() {
    const t = this.redoStack.pop();
    return t ? (t.apply(), this.undoStack.push(t), this.emit(), !0) : !1;
  }
  peek() {
    return this.undoStack[this.undoStack.length - 1] ?? null;
  }
  replaceTop(t) {
    return this.undoStack.length === 0 ? !1 : (t.meta && t.meta.timestamp == null ? t.meta.timestamp = Date.now() : t.meta || (t.meta = { timestamp: Date.now() }), this.undoStack[this.undoStack.length - 1] = t, this.emit(), !0);
  }
  clear() {
    this.undoStack.length = 0, this.redoStack.length = 0, this.emit();
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
  onChange(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  emit() {
    for (const t of this.listeners) t();
  }
}
function G(i) {
  const { setter: t, before: n, after: c, cursorBefore: g, cursorAfter: s, now: o } = i;
  return {
    apply: () => t(c, s),
    revert: () => t(n, g),
    meta: {
      kind: "text-swap",
      timestamp: o,
      snapshot: { before: n, after: c, cursorBefore: g, cursorAfter: s }
    }
  };
}
class Ae {
  constructor() {
    R(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let n = this.engines.get(t);
    return n || (n = new De(), this.engines.set(t, n)), n;
  }
  release(t) {
    this.engines.delete(t);
  }
  clear() {
    this.engines.clear();
  }
}
class V {
  constructor() {
    R(this, "listeners", /* @__PURE__ */ new Set());
  }
  on(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  emit(...t) {
    for (const n of this.listeners) n(...t);
  }
  clear() {
    this.listeners.clear();
  }
}
function Re(i, t, n) {
  const c = i.get(t);
  return {
    push(s) {
      c.push(s), n();
    },
    undo() {
      const s = c.undo();
      return s && n(), s;
    },
    redo() {
      const s = c.redo();
      return s && n(), s;
    },
    peek() {
      return c.peek();
    },
    replaceTop(s) {
      const o = c.replaceTop(s);
      return o && n(), o;
    },
    get canUndo() {
      return c.canUndo;
    },
    get canRedo() {
      return c.canRedo;
    },
    clear() {
      c.clear(), n();
    },
    onChange(s) {
      return c.onChange(s);
    }
  };
}
const Be = 300;
function je(i) {
  const t = new V(), n = new V(), c = new V(), g = new V(), s = new V(), o = new Ae(), a = new Ie((r) => {
    o.release(r);
  }), u = /* @__PURE__ */ new Map();
  function f(r) {
    let l = u.get(r);
    if (!l) {
      const v = () => a.has(r);
      l = Re(o, r, () => {
        var S;
        v() && s.emit(r, ((S = a.get(r)) == null ? void 0 : S.value) ?? null);
      }), u.set(r, l);
    }
    return l;
  }
  function h(r) {
    o.release(r), u.delete(r);
  }
  return { api: {
    getContent(r) {
      const l = i.get(r);
      return l ? l.document.content : null;
    },
    isDirty(r) {
      const l = i.get(r);
      return l ? l.document.dirty : !1;
    },
    getDocument(r) {
      const l = i.get(r);
      return l ? l.document : null;
    },
    listInstances() {
      return i.list();
    },
    openDocument(r, l) {
      i.open(r, l);
    },
    closeDocument(r) {
      i.close(r) && h(r);
    },
    updateContent(r, l, v, S) {
      var U, N;
      const E = i.get(r);
      if (!E) return;
      const p = E.document, b = p.content;
      if (b === l) return;
      const w = p.cursorStart, x = (K, H) => {
        p.content = K, p.cursorStart = H, p.cursorEnd = H, t.emit(r, K);
      };
      p.content = l, p.cursorStart = v, p.cursorEnd = S;
      const I = f(r), P = Date.now(), D = I.peek(), A = ((U = D == null ? void 0 : D.meta) == null ? void 0 : U.kind) === "text-swap" ? D.meta.snapshot : void 0, B = Math.abs(l.length - b.length) <= 1, z = A && ((N = D == null ? void 0 : D.meta) == null ? void 0 : N.timestamp) != null && P - D.meta.timestamp < Be;
      A && B && z ? I.replaceTop(G({
        setter: x,
        before: A.before,
        after: l,
        cursorBefore: A.cursorBefore,
        cursorAfter: v,
        now: P
      })) : I.push(G({
        setter: x,
        before: b,
        after: l,
        cursorBefore: w,
        cursorAfter: v,
        now: P
      }));
      const X = p.dirty;
      p.dirty = !0, t.emit(r, l), X || n.emit(r, !0);
    },
    markClean(r) {
      const l = i.get(r);
      l && l.document.dirty && (l.document.dirty = !1, n.emit(r, !1));
    },
    onContentChange(r) {
      return t.on(r);
    },
    onDirtyChange(r) {
      return n.on(r);
    },
    onSave(r) {
      return c.on(r);
    },
    onPrefsChange(r) {
      return g.on(r);
    },
    openInspector(r, l) {
      a.open(r, l);
    },
    closeInspector(r) {
      a.close(r) && h(r);
    },
    getInspectorValue(r) {
      var l;
      return ((l = a.get(r)) == null ? void 0 : l.value) ?? null;
    },
    listInspectorInstances() {
      return a.list();
    },
    onInspectorValueChange(r) {
      return s.on(r);
    },
    history: f
  }, internals: {
    emitSave(r) {
      c.emit(r);
    },
    contentChange: t,
    dirtyChange: n,
    saveEvent: c,
    prefsChange: g,
    inspectorValueChange: s,
    history: f,
    inspectors: a
  }, teardown: () => {
    t.clear(), n.clear(), c.clear(), g.clear(), s.clear(), o.clear(), u.clear(), a.clear();
  } };
}
const oe = "sh3-editor.inspectorRenderer";
let ge = /* @__PURE__ */ new Map();
function ce(i) {
  const t = [...i].sort((c, g) => {
    const s = c.priority ?? 10, o = g.priority ?? 10;
    return s !== o ? o - s : 0;
  }), n = /* @__PURE__ */ new Map();
  for (const c of t)
    n.has(c.type) || n.set(c.type, c);
  ge = n;
}
function Le(i) {
  if (i === null || typeof i != "object") return !1;
  const t = Object.getPrototypeOf(i);
  return t === Object.prototype || t === null;
}
function ue(i) {
  var t;
  return ((t = ge.get(i)) == null ? void 0 : t.component) ?? null;
}
function Me(i, t) {
  if (t != null && t.type) {
    const n = ue(t.type);
    if (n) return { kind: "custom", component: n };
  }
  if (i !== null && typeof i == "object" && typeof i.__type == "string") {
    const n = ue(i.__type);
    if (n) return { kind: "custom", component: n };
  }
  return Le(i) || Array.isArray(i) ? { kind: "walker" } : { kind: "leaf" };
}
function j(i) {
  return i.ctrlKey || i.metaKey;
}
function Pe(i, t, n, c, g = 2) {
  const s = " ".repeat(g);
  if (t === n && !c)
    return {
      content: i.slice(0, t) + s + i.slice(n),
      selectionStart: t + s.length,
      selectionEnd: t + s.length
    };
  const o = i.lastIndexOf(`
`, t - 1) + 1, a = i.slice(o, n).split(`
`);
  let u = t, f = n;
  const h = a.map((y, C) => {
    var r;
    if (c) {
      const l = ((r = y.match(new RegExp(`^ {1,${g}}`))) == null ? void 0 : r[0].length) ?? 0;
      return C === 0 && (u = Math.max(o, t - l)), f -= l, y.slice(l);
    } else
      return C === 0 && (u = t + s.length), f += s.length, s + y;
  });
  return { content: i.slice(0, o) + h.join(`
`) + i.slice(o + a.join(`
`).length), selectionStart: u, selectionEnd: f };
}
function Oe(i, t, n, c, g = 2, s = "inline") {
  if (c === "none") return null;
  const o = i.lastIndexOf(`
`, t - 1) + 1, u = i.slice(o, t).match(/^[ \t]*/)[0], f = " ".repeat(g);
  if (c === "indent") {
    const l = `
` + u;
    return {
      content: i.slice(0, t) + l + i.slice(n),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  }
  const h = t > 0 ? i[t - 1] : "", m = n < i.length ? i[n] : "", y = h === "{";
  if (y && m === "}") {
    if (s === "inline") {
      const b = `
` + u + f + `
` + u, w = t + 1 + u.length + f.length;
      return {
        content: i.slice(0, t) + b + i.slice(n),
        selectionStart: w,
        selectionEnd: w
      };
    }
    const l = i.slice(0, t - 1), v = i.slice(n), S = `
` + u + `{
` + u + f + `
` + u, E = l + S + v, p = l.length + (`
` + u + `{
` + u + f).length;
    return { content: E, selectionStart: p, selectionEnd: p };
  }
  if (y) {
    const l = `
` + u + f;
    return {
      content: i.slice(0, t) + l + i.slice(n),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  }
  const r = `
` + u;
  return {
    content: i.slice(0, t) + r + i.slice(n),
    selectionStart: t + r.length,
    selectionEnd: t + r.length
  };
}
function Ue(i, t, n, c = 2) {
  if (t !== n) return null;
  const g = i.lastIndexOf(`
`, t - 1) + 1, s = i.slice(g, t);
  if (!/^[ \t]*$/.test(s)) return null;
  let o = 0, a = -1;
  for (let m = g - 1; m >= 0; m--) {
    const y = i[m];
    if (y === "}") o++;
    else if (y === "{") {
      if (o === 0) {
        a = m;
        break;
      }
      o--;
    }
  }
  let u;
  if (a === -1) {
    const m = Math.max(0, s.length - c);
    u = s.slice(0, m);
  } else {
    const m = i.lastIndexOf(`
`, a - 1) + 1;
    u = i.slice(m, a).match(/^[ \t]*/)[0];
  }
  if (u.length >= s.length) return null;
  const f = i.slice(0, g) + u + "}" + i.slice(n), h = g + u.length + 1;
  return { content: f, selectionStart: h, selectionEnd: h };
}
var Ke = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), He = e.from_html("<button><!> </button>"), ze = e.from_html("<!> <!>", 1), Ne = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), Ve = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function he(i, t) {
  e.push(t, !0);
  let n = e.prop(t, "filePath", 3, null), c = e.derived(() => {
    const a = [], u = /* @__PURE__ */ new Map();
    for (const f of t.actions) {
      const h = f.group ?? "_default";
      if (!u.has(h)) {
        const m = [];
        u.set(h, m), a.push({ key: h, items: m });
      }
      u.get(h).push(f);
    }
    return a;
  });
  var g = e.comment(), s = e.first_child(g);
  {
    var o = (a) => {
      var u = Ve(), f = e.child(u);
      e.each(f, 17, () => e.get(c), e.index, (y, C, r) => {
        var l = ze(), v = e.first_child(l);
        {
          var S = (p) => {
            var b = Ke();
            e.append(p, b);
          };
          e.if(v, (p) => {
            r > 0 && p(S);
          });
        }
        var E = e.sibling(v, 2);
        e.each(E, 17, () => e.get(C).items, (p) => p.id, (p, b) => {
          var w = He();
          let x;
          var I = e.child(w);
          {
            var P = (A) => {
              var B = e.text();
              e.template_effect(() => e.set_text(B, e.get(b).icon)), e.append(A, B);
            };
            e.if(I, (A) => {
              e.get(b).icon && A(P);
            });
          }
          var D = e.sibling(I, 1, !0);
          e.reset(w), e.template_effect(() => {
            x = e.set_class(w, 1, "toolbar-btn svelte-10sr5yt", null, x, { "toolbar-accent": e.get(b).accent }), w.disabled = e.get(b).disabled, e.set_attribute(w, "title", e.get(b).shortcut ? `${e.get(b).label} (${e.get(b).shortcut})` : e.get(b).label), e.set_text(D, e.get(b).label);
          }), e.delegated("click", w, function(...A) {
            var B;
            (B = e.get(b).onAction) == null || B.apply(this, A);
          }), e.append(p, w);
        }), e.append(y, l);
      });
      var h = e.sibling(f, 2);
      {
        var m = (y) => {
          var C = Ne(), r = e.sibling(e.first_child(C), 2), l = e.child(r, !0);
          e.reset(r), e.template_effect(
            (v) => {
              e.set_attribute(r, "title", n()), e.set_text(l, v);
            },
            [() => n().split(/[/\\]/).pop()]
          ), e.append(y, C);
        };
        e.if(h, (y) => {
          n() && y(m);
        });
      }
      e.reset(u), e.append(a, u);
    };
    e.if(s, (a) => {
      (t.actions.length > 0 || n()) && a(o);
    });
  }
  e.append(i, g), e.pop();
}
e.delegate(["click"]);
var Fe = e.from_html('<div class="row svelte-1a5ky2k"><span class="label svelte-1a5ky2k">Brace style</span> <div class="seg svelte-1a5ky2k"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), We = e.from_html('<div class="body svelte-1a5ky2k"><h2 class="svelte-1a5ky2k">Editor settings</h2> <div class="rows svelte-1a5ky2k"><div class="row svelte-1a5ky2k"><span class="label svelte-1a5ky2k">Indent unit</span> <div class="seg svelte-1a5ky2k"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1a5ky2k"><button type="button" class="secondary svelte-1a5ky2k">Close</button></div></div>');
function Xe(i, t) {
  e.push(t, !0);
  let n = e.proxy({ ...t.prefs });
  function c(S) {
    n.indentUnit = S, t.onChange({ ...n });
  }
  function g(S) {
    n.braceStyle = S, t.onChange({ ...n });
  }
  var s = We(), o = e.sibling(e.child(s), 2), a = e.child(o), u = e.sibling(e.child(a), 2), f = e.child(u);
  let h;
  var m = e.sibling(f, 2);
  let y;
  e.reset(u), e.reset(a);
  var C = e.sibling(a, 2);
  {
    var r = (S) => {
      var E = Fe(), p = e.sibling(e.child(E), 2), b = e.child(p);
      let w;
      var x = e.sibling(b, 2);
      let I;
      e.reset(p), e.reset(E), e.template_effect(() => {
        w = e.set_class(b, 1, "svelte-1a5ky2k", null, w, { active: (n.braceStyle ?? "inline") === "inline" }), I = e.set_class(x, 1, "svelte-1a5ky2k", null, I, { active: (n.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", b, () => g("inline")), e.delegated("click", x, () => g("allman")), e.append(S, E);
    };
    e.if(C, (S) => {
      t.indentType === "brace" && S(r);
    });
  }
  e.reset(o);
  var l = e.sibling(o, 2), v = e.child(l);
  e.reset(l), e.reset(s), e.template_effect(() => {
    h = e.set_class(f, 1, "svelte-1a5ky2k", null, h, { active: (n.indentUnit ?? 2) === 2 }), y = e.set_class(m, 1, "svelte-1a5ky2k", null, y, { active: (n.indentUnit ?? 2) === 4 });
  }), e.delegated("click", f, () => c(2)), e.delegated("click", m, () => c(4)), e.delegated("click", v, function(...S) {
    var E;
    (E = t.close) == null || E.apply(this, S);
  }), e.append(i, s), e.pop();
}
e.delegate(["click"]);
var Ye = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), qe = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function Je(i, t) {
  e.push(t, !0);
  let n = e.prop(t, "entry", 7), c = e.prop(t, "fontSize", 3, 13), g = e.prop(t, "toolbarActions", 19, () => []), s = e.derived(() => n().document), o = e.state(e.proxy(e.get(s).content)), a = e.derived(() => {
    var d, _;
    return ((d = t.matchingConfig) == null ? void 0 : d.indentType) ?? ((_ = t.matchingConfig) != null && _.indentBased ? "indent" : "none");
  }), u = e.derived(() => e.get(a) === "none" ? 0 : e.get(a) === "brace" ? 2 : 1), f = e.derived(() => (t.showSettings ?? !0) && e.get(u) > 0);
  const h = 300, m = (d, _) => {
    e.set(o, d, !0), e.get(s).content = d, e.get(s).cursorStart = _, e.get(s).cursorEnd = _, t.internals.contentChange.emit(e.get(s).id, d), I(_, _);
  };
  function y() {
    Ce.modal.open(Xe, {
      indentType: e.get(a),
      prefs: n().prefs,
      onChange: r
    });
  }
  let C = e.derived(() => {
    if (!e.get(f)) return g();
    const d = {
      id: "sh3-editor:settings",
      label: "Settings",
      icon: "⚙",
      onAction: y,
      group: "_editor_builtin"
    };
    return [...g(), d];
  });
  function r(d) {
    n().prefs = { ...n().prefs, ...d }, t.internals.prefsChange.emit(n().document.id, { ...n().prefs });
  }
  e.user_effect(() => {
    e.set(o, e.get(s).content, !0);
  });
  let l = e.state(void 0), v = e.state(0), S = e.state(0), E = e.derived(() => t.highlight && e.get(s).language ? t.highlight(e.get(o), e.get(s).language) : w(e.get(o))), p = e.derived(() => e.get(o).split(`
`).length), b = e.derived(() => Array.from({ length: e.get(p) }, (d, _) => _ + 1));
  function w(d) {
    return d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function x(d, _, T) {
    var ie, se;
    e.set(o, d, !0);
    const k = e.get(s).id, Q = e.get(s).content;
    if (Q === d) return;
    const me = e.get(s).cursorStart;
    e.get(s).content = d, e.get(s).cursorStart = _, e.get(s).cursorEnd = T;
    const Z = t.internals.history(k), $ = Date.now(), M = Z.peek(), q = ((ie = M == null ? void 0 : M.meta) == null ? void 0 : ie.kind) === "text-swap" ? M.meta.snapshot : void 0, pe = Math.abs(d.length - Q.length) <= 1, ye = q && ((se = M == null ? void 0 : M.meta) == null ? void 0 : se.timestamp) != null && $ - M.meta.timestamp < h;
    q && pe && ye ? Z.replaceTop(G({
      setter: m,
      before: q.before,
      after: d,
      cursorBefore: q.cursorBefore,
      cursorAfter: _,
      now: $
    })) : Z.push(G({
      setter: m,
      before: Q,
      after: d,
      cursorBefore: me,
      cursorAfter: _,
      now: $
    }));
    const be = e.get(s).dirty;
    e.get(s).dirty = !0, t.internals.contentChange.emit(k, d), be || t.internals.dirtyChange.emit(k, !0);
  }
  function I(d, _) {
    requestAnimationFrame(() => {
      e.get(l) && (e.get(l).selectionStart = d, e.get(l).selectionEnd = _);
    });
  }
  function P(d) {
    var _;
    if (d.key === "s" && j(d)) {
      d.preventDefault(), t.internals.emitSave(e.get(s).id);
      return;
    }
    if (d.key.toLowerCase() === "z" && j(d) && !d.shiftKey) {
      d.preventDefault(), t.internals.history(e.get(s).id).undo();
      return;
    }
    if (d.key.toLowerCase() === "y" && j(d) || d.key.toLowerCase() === "z" && j(d) && d.shiftKey) {
      d.preventDefault(), t.internals.history(e.get(s).id).redo();
      return;
    }
    if (d.key === "Enter" && !d.shiftKey && !j(d) && !d.altKey) {
      if (e.get(a) === "none") return;
      const T = d.currentTarget, k = Oe(e.get(o), T.selectionStart, T.selectionEnd, e.get(a), n().prefs.indentUnit, n().prefs.braceStyle);
      k && (d.preventDefault(), x(k.content, k.selectionStart, k.selectionEnd), I(k.selectionStart, k.selectionEnd));
      return;
    }
    if (d.key === "}" && e.get(a) === "brace" && !j(d) && !d.altKey) {
      const T = d.currentTarget, k = Ue(e.get(o), T.selectionStart, T.selectionEnd, n().prefs.indentUnit);
      if (k) {
        d.preventDefault(), x(k.content, k.selectionStart, k.selectionEnd), I(k.selectionStart, k.selectionEnd);
        return;
      }
    }
    if (d.key === "Tab") {
      d.preventDefault();
      const T = d.currentTarget, k = Pe(e.get(o), T.selectionStart, T.selectionEnd, d.shiftKey, (_ = t.matchingConfig) == null ? void 0 : _.indentUnit);
      k && (x(k.content, k.selectionStart, k.selectionEnd), I(k.selectionStart, k.selectionEnd));
      return;
    }
  }
  function D(d) {
    const _ = d.currentTarget;
    x(_.value, _.selectionStart, _.selectionEnd);
  }
  function A(d) {
    const _ = d.currentTarget;
    e.set(v, _.scrollTop, !0), e.set(S, _.scrollLeft, !0);
  }
  function B() {
    e.get(l) && (e.get(s).cursorStart = e.get(l).selectionStart, e.get(s).cursorEnd = e.get(l).selectionEnd);
  }
  var z = qe(), X = e.child(z);
  he(X, {
    get actions() {
      return e.get(C);
    },
    get filePath() {
      return e.get(s).filePath;
    }
  });
  var U = e.sibling(X, 2);
  let N;
  var K = e.child(U), H = e.child(K);
  let te;
  e.each(H, 20, () => e.get(b), (d) => d, (d, _) => {
    var T = Ye(), k = e.child(T, !0);
    e.reset(T), e.template_effect(() => e.set_text(k, _)), e.append(d, T);
  }), e.reset(H), e.reset(K);
  var ne = e.sibling(K, 2), Y = e.child(ne);
  let re;
  e.html(Y, () => e.get(E) + `
`, !0), e.reset(Y);
  var L = e.sibling(Y, 2);
  e.remove_textarea_child(L), e.set_attribute(L, "spellcheck", !1), e.bind_this(L, (d) => e.set(l, d), () => e.get(l)), e.reset(ne), e.reset(U), e.reset(z), e.template_effect(() => {
    N = e.set_style(U, "", N, { "--editor-font-size": `${c() ?? ""}px` }), te = e.set_style(H, "", te, { transform: `translateY(-${e.get(v) ?? ""}px)` }), re = e.set_style(Y, "", re, {
      top: `-${e.get(v) ?? ""}px`,
      left: `-${e.get(S) ?? ""}px`
    }), e.set_value(L, e.get(o));
  }), e.delegated("keydown", L, P), e.delegated("input", L, D), e.event("scroll", L, A), e.event("select", L, B), e.append(i, z), e.pop();
}
e.delegate(["keydown", "input"]);
var Ge = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function de(i, t) {
  let n = e.prop(t, "readonly", 3, !1);
  var c = Ge();
  let g;
  var s = e.child(c), o = e.child(s, !0);
  e.reset(s);
  var a = e.sibling(s, 2), u = e.child(a);
  e.snippet(u, () => t.children), e.reset(a), e.reset(c), e.template_effect(() => {
    g = e.set_class(c, 1, "field svelte-2gtehg", null, g, { readonly: n() }), e.set_text(o, t.label);
  }), e.append(i, c);
}
var Qe = e.from_html('<input type="checkbox"/>'), Ze = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function $e(i, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), c = e.state(e.proxy(g(t.value)));
  e.user_effect(() => {
    e.set(c, g(t.value), !0);
  });
  function g(r) {
    return r === null ? "null" : r === void 0 ? "" : typeof r == "boolean" ? r ? "true" : "false" : String(r);
  }
  function s(r, l) {
    if (l === "boolean") return r === "true";
    if (l === "number") {
      const v = Number(r);
      return Number.isFinite(v) ? v : t.value;
    }
    return r;
  }
  let o = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function a() {
    if (n() || !t.onCommit) return;
    const r = s(e.get(c), e.get(o));
    r !== null && r !== t.value && t.onCommit(r);
  }
  function u(r) {
    if (n() || !t.onCommit) return;
    const l = r.target.checked;
    l !== t.value && t.onCommit(l);
  }
  function f(r) {
    r.key === "Enter" ? r.currentTarget.blur() : r.key === "Escape" && (e.set(c, g(t.value), !0), r.currentTarget.blur());
  }
  var h = e.comment(), m = e.first_child(h);
  {
    var y = (r) => {
      var l = Qe();
      e.remove_input_defaults(l), e.template_effect(
        (v) => {
          e.set_checked(l, v), l.disabled = n();
        },
        [() => !!t.value]
      ), e.delegated("change", l, u), e.append(r, l);
    }, C = (r) => {
      var l = Ze();
      e.remove_input_defaults(l), e.template_effect(() => {
        e.set_attribute(l, "type", e.get(o) === "number" ? "number" : "text"), l.disabled = n();
      }), e.event("blur", l, a), e.delegated("keydown", l, f), e.bind_value(l, () => e.get(c), (v) => e.set(c, v)), e.append(r, l);
    };
    e.if(m, (r) => {
      e.get(o) === "boolean" ? r(y) : r(C, -1);
    });
  }
  e.append(i, h), e.pop();
}
e.delegate(["change", "keydown"]);
var et = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function tt(i, t) {
  e.push(t, !0);
  function n(o) {
    return o == null || typeof o == "string" || typeof o == "number" || typeof o == "boolean";
  }
  function c(o, a, u) {
    const f = o[a], h = {
      apply() {
        o[a] = u;
      },
      revert() {
        o[a] = f;
      },
      meta: { kind: "walker-edit", label: String(a) }
    };
    t.api.push(h), o[a] = u;
  }
  let g = e.derived(() => Array.isArray(t.value) ? t.value.map((o, a) => {
    var u;
    return { key: a, child: o, fieldMeta: (u = t.meta) == null ? void 0 : u.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((o) => {
    var a, u;
    return {
      key: o,
      child: t.value[o],
      fieldMeta: (u = (a = t.meta) == null ? void 0 : a.fields) == null ? void 0 : u[o]
    };
  }) : []);
  var s = et();
  e.each(s, 21, () => e.get(g), (o) => o.key, (o, a) => {
    var u = e.comment(), f = e.first_child(u);
    {
      var h = (m) => {
        const y = e.derived(() => {
          var p;
          return ((p = e.get(a).fieldMeta) == null ? void 0 : p.label) ?? (typeof e.get(a).key == "number" ? `[${e.get(a).key}]` : String(e.get(a).key));
        }), C = e.derived(() => {
          var p;
          return (((p = e.get(a).fieldMeta) == null ? void 0 : p.readonly) ?? !1) || t.api.readonly;
        });
        var r = e.comment(), l = e.first_child(r);
        {
          var v = (p) => {
            de(p, {
              get label() {
                return e.get(y);
              },
              get readonly() {
                return e.get(C);
              },
              children: (b, w) => {
                $e(b, {
                  get value() {
                    return e.get(a).child;
                  },
                  get readonly() {
                    return e.get(C);
                  },
                  onCommit: (x) => c(t.value, e.get(a).key, x)
                });
              },
              $$slots: { default: !0 }
            });
          }, S = e.derived(() => n(e.get(a).child)), E = (p) => {
            de(p, {
              get label() {
                return e.get(y);
              },
              get readonly() {
                return e.get(C);
              },
              children: (b, w) => {
                ve(b, {
                  get value() {
                    return e.get(a).child;
                  },
                  get meta() {
                    return e.get(a).fieldMeta;
                  },
                  get api() {
                    return t.api;
                  }
                });
              },
              $$slots: { default: !0 }
            });
          };
          e.if(l, (p) => {
            e.get(S) ? p(v) : p(E, -1);
          });
        }
        e.append(m, r);
      };
      e.if(f, (m) => {
        var y;
        (y = e.get(a).fieldMeta) != null && y.hidden || m(h);
      });
    }
    e.append(o, u);
  }), e.reset(s), e.append(i, s), e.pop();
}
var nt = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function rt(i, t) {
  function n(s) {
    if (s === null) return "null";
    if (s === void 0) return "undefined";
    if (typeof s == "string") return `"${s}"`;
    if (typeof s == "number" || typeof s == "boolean") return String(s);
    try {
      return JSON.stringify(s);
    } catch {
      return String(s);
    }
  }
  var c = nt(), g = e.child(c, !0);
  e.reset(c), e.template_effect((s) => e.set_text(g, s), [() => n(t.value)]), e.append(i, c);
}
function ve(i, t) {
  e.push(t, !0);
  let n = e.derived(() => Me(t.value, t.meta));
  var c = e.comment(), g = e.first_child(c);
  {
    var s = (f) => {
    }, o = (f) => {
      const h = e.derived(() => e.get(n).component);
      var m = e.comment(), y = e.first_child(m);
      e.component(y, () => e.get(h), (C, r) => {
        r(C, {
          get value() {
            return t.value;
          },
          get meta() {
            return t.meta;
          },
          get api() {
            return t.api;
          }
        });
      }), e.append(f, m);
    }, a = (f) => {
      tt(f, {
        get value() {
          return t.value;
        },
        get meta() {
          return t.meta;
        },
        get api() {
          return t.api;
        }
      });
    }, u = (f) => {
      rt(f, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(g, (f) => {
      var h;
      (h = t.meta) != null && h.hidden ? f(s) : e.get(n).kind === "custom" ? f(o, 1) : e.get(n).kind === "walker" ? f(a, 2) : f(u, -1);
    });
  }
  e.append(i, c), e.pop();
}
var it = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function st(i, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), c = e.prop(t, "toolbarActions", 19, () => []), g = e.derived(() => t.entry ? t.entry.value : t.adHocValue), s = e.derived(() => t.entry ? t.entry.meta : t.adHocMeta), o = e.derived(() => t.entry ? !!t.entry.options.readonly : n());
  const a = t.internals.history(t.instanceId), u = {
    push(v) {
      e.get(o) || (a.push(v), t.internals.inspectorValueChange.emit(t.instanceId, e.get(g)));
    },
    get readonly() {
      return e.get(o);
    },
    history: a
  };
  e.user_effect(() => {
    const v = a.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(g));
    });
    return () => v();
  });
  let f = e.state(void 0);
  function h(v) {
    if (v.key.toLowerCase() === "z" && j(v) && !v.shiftKey) {
      v.preventDefault(), a.undo();
      return;
    }
    if (v.key.toLowerCase() === "y" && j(v) || v.key.toLowerCase() === "z" && j(v) && v.shiftKey) {
      v.preventDefault(), a.redo();
      return;
    }
  }
  var m = it(), y = e.child(m);
  {
    var C = (v) => {
      he(v, {
        get actions() {
          return c();
        },
        filePath: null
      });
    };
    e.if(y, (v) => {
      c().length > 0 && v(C);
    });
  }
  var r = e.sibling(y, 2), l = e.child(r);
  ve(l, {
    get value() {
      return e.get(g);
    },
    get meta() {
      return e.get(s);
    },
    get api() {
      return u;
    }
  }), e.reset(r), e.reset(m), e.bind_this(m, (v) => e.set(f, v), () => e.get(f)), e.delegated("keydown", m, h), e.append(i, m), e.pop();
}
e.delegate(["keydown"]);
let O = null, ee = null, J = null, F = null, W = null;
function ut() {
  return ee;
}
const fe = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [
      { id: "sh3-editor:editor", label: "Editor", standalone: !0 },
      { id: "sh3-editor:inspector", label: "Inspector", standalone: !0 }
    ]
  },
  activate(i) {
    O = new xe();
    const { api: t, internals: n, teardown: c } = je(O);
    ee = t, J = n, F = c, fe.api = t;
    const g = () => {
      ce(i.contributions.list(oe));
    };
    g(), W = i.contributions.onChange(oe, g);
    const s = {};
    i.registerView("sh3-editor:editor", {
      mount(o, a) {
        const u = a.slotId, f = O.get(u), h = (f == null ? void 0 : f.options) || s, m = le(Je, {
          target: o,
          props: {
            entry: f,
            internals: J,
            highlight: h.highlight,
            matchingConfig: h.matchingConfig,
            fontSize: h.fontSize,
            toolbarActions: h.toolbarActions,
            showSettings: h.showSettings
          }
        });
        return {
          closable: !0,
          unmount() {
            ae(m);
          }
        };
      }
    }), i.registerView("sh3-editor:inspector", {
      mount(o, a) {
        const u = a.slotId, f = n.inspectors.get(u), h = a.meta, m = le(st, {
          target: o,
          props: {
            instanceId: u,
            entry: f,
            adHocValue: h == null ? void 0 : h.value,
            adHocMeta: h == null ? void 0 : h.meta,
            adHocReadonly: (h == null ? void 0 : h.readonly) ?? !1,
            internals: J,
            toolbarActions: (f == null ? void 0 : f.options.toolbarActions) ?? []
          }
        });
        return {
          closable: !0,
          unmount() {
            ae(m);
          }
        };
      }
    });
  },
  deactivate() {
    W == null || W(), W = null, F == null || F(), O == null || O.clear(), ce([]), O = null, ee = null, J = null, F = null, fe.api = null;
  }
};
export {
  ut as getApi,
  fe as shard
};
