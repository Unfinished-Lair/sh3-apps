/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".sh3-fe-tree.svelte-gk9ydj,.sh3-fe-tree.svelte-gk9ydj ul:where(.svelte-gk9ydj){list-style:none;padding:0;margin:0}.sh3-fe-node.svelte-gk9ydj{background:none;border:0;color:var(--shell-fg);cursor:pointer;padding:2px 4px;text-align:left;width:100%;font:inherit}.sh3-fe-node.svelte-gk9ydj:hover{background:var(--shell-bg-elevated)}.sh3-fe-node.selected.svelte-gk9ydj{background:var(--shell-accent-muted)}.sh3-fe-empty.svelte-gk9ydj{color:var(--shell-fg-muted);padding:8px}.sh3-fe-row.svelte-gk9ydj{display:flex;align-items:center;gap:2px}.sh3-fe-twisty.svelte-gk9ydj{background:none;border:0;color:var(--shell-fg-muted);cursor:pointer;padding:2px 4px;font:inherit;width:1.4em;flex:0 0 auto}.sh3-fe-twisty.svelte-gk9ydj:hover{color:var(--shell-fg)}.sh3-fe-node--folder.svelte-gk9ydj{flex:1 1 auto}.sh3-fe-panel__empty.svelte-1vm0wsq{color:var(--shell-fg-muted)}.sh3-fe-panel__header.svelte-1vm0wsq{border-bottom:1px solid var(--shell-border);padding-bottom:6px;margin-bottom:8px;color:var(--shell-fg)}.sh3-fe-panel__path.svelte-1vm0wsq{font-weight:600}.sh3-fe-panel__shard.svelte-1vm0wsq{font-size:.85em;color:var(--shell-fg-muted)}.sh3-fe-panel__actions.svelte-1vm0wsq{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.sh3-fe-panel__action.svelte-1vm0wsq{background:var(--shell-bg-elevated);color:var(--shell-fg);border:1px solid var(--shell-border);padding:4px 10px;font:inherit;cursor:pointer;border-radius:var(--shell-radius-sm)}.sh3-fe-panel__action.svelte-1vm0wsq:hover{background:var(--shell-accent-muted)}.sh3-fe-panel__action.primary.svelte-1vm0wsq{border-color:var(--shell-accent)}.sh3-fe-panel__action[disabled].svelte-1vm0wsq{opacity:.5;cursor:progress}.sh3-fe-browser.svelte-sykudp{display:grid;grid-template-columns:minmax(240px,1fr) minmax(260px,1fr);height:100%;gap:1px;background:var(--shell-border)}.sh3-fe-browser__tree.svelte-sykudp,.sh3-fe-browser__panel.svelte-sykudp{background:var(--shell-bg);color:var(--shell-fg);overflow:auto;padding:8px}";
  document.head.appendChild(s);
})();
import { mount as W, unmount as z } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
const de = {
  manifest: {
    id: "sh3-file-explorer-app",
    label: "File Explorer",
    requiredShards: ["sh3-file-explorer"],
    layoutVersion: 2,
    permissions: ["documents:browse"]
  },
  initialLayout: {
    type: "slot",
    slotId: "sh3-file-explorer.files",
    viewId: "sh3-file-explorer-browser"
  }
};
class G extends Error {
  constructor() {
    super("sh3-file-explorer requires the documents:browse permission.");
  }
}
function H(h) {
  if (!h.browse)
    return { ctx: h, ready: !1, error: new G() };
  const t = h.browse;
  let u = e.state(null);
  const c = e.proxy({});
  let m = e.state(e.proxy([]));
  function I(_) {
    e.set(u, _, !0);
  }
  function w(_) {
    c[_] ? delete c[_] : c[_] = !0;
  }
  function y(_) {
    return c[_] === !0;
  }
  async function S() {
    e.set(m, await t.listDocuments(), !0);
  }
  function j() {
    return t.watchDocuments((_) => {
      S();
    });
  }
  return {
    ctx: h,
    ready: !0,
    browse: t,
    get selection() {
      return e.get(u);
    },
    get documents() {
      return e.get(m);
    },
    setSelection: I,
    toggleExpanded: w,
    isExpanded: y,
    refreshDocuments: S,
    startWatch: j
  };
}
var J = e.from_html('<ul class="svelte-gk9ydj"></ul>'), K = e.from_html('<div class="sh3-fe-row svelte-gk9ydj"><button class="sh3-fe-twisty svelte-gk9ydj"> </button> <button> </button></div> <!>', 1), Q = e.from_html("<button> </button>"), R = e.from_html("<li><!></li>"), U = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj"> </p>'), X = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj">No documents in this tenant.</p>'), Y = e.from_html('<ul class="sh3-fe-tree svelte-gk9ydj"></ul>');
function Z(h, t) {
  e.push(t, !0);
  const u = (r, s = e.noop, l = e.noop) => {
    var a = R(), i = e.child(a);
    {
      var p = (d) => {
        var o = K(), g = e.first_child(o), v = e.child(g), D = e.child(v, !0);
        e.reset(v);
        var E = e.sibling(v, 2);
        let T;
        var O = e.child(E);
        e.reset(E), e.reset(g);
        var P = e.sibling(g, 2);
        {
          var V = (C) => {
            var F = J();
            e.each(F, 21, () => s().children, (q) => y(q), (q, N) => {
              u(q, () => e.get(N), () => l() + 1);
            }), e.reset(F), e.append(C, F);
          }, B = e.derived(() => t.store.ready && t.store.isExpanded(y(s())));
          e.if(P, (C) => {
            e.get(B) && C(V);
          });
        }
        e.template_effect(
          (C, F) => {
            var q, N, A;
            e.set_style(g, `padding-left: ${l() * 12}px`), e.set_attribute(v, "aria-label", C), e.set_text(D, F), T = e.set_class(E, 1, "sh3-fe-node sh3-fe-node--folder svelte-gk9ydj", null, T, {
              selected: t.store.ready && ((q = t.store.selection) == null ? void 0 : q.shardId) === s().shardId && ((N = t.store.selection) == null ? void 0 : N.path) === s().path && ((A = t.store.selection) == null ? void 0 : A.kind) === "folder"
            }), e.set_text(O, `${(s().name || "(root)") ?? ""}/`);
          },
          [
            () => t.store.ready && t.store.isExpanded(y(s())) ? "Collapse" : "Expand",
            () => t.store.ready && t.store.isExpanded(y(s())) ? "▾" : "▸"
          ]
        ), e.delegated("click", v, () => S(s())), e.delegated("click", E, () => _(s())), e.append(d, o);
      }, b = (d) => {
        var o = Q();
        let g;
        var v = e.child(o, !0);
        e.reset(o), e.template_effect(() => {
          var D, E, T;
          g = e.set_class(o, 1, "sh3-fe-node sh3-fe-node--file svelte-gk9ydj", null, g, {
            selected: t.store.ready && ((D = t.store.selection) == null ? void 0 : D.shardId) === s().shardId && ((E = t.store.selection) == null ? void 0 : E.path) === s().path && ((T = t.store.selection) == null ? void 0 : T.kind) === "file"
          }), e.set_style(o, `padding-left: ${l() * 12}px`), e.set_text(v, s().name);
        }), e.delegated("click", o, () => j(s())), e.append(d, o);
      };
      e.if(i, (d) => {
        s().kind === "folder" ? d(p) : d(b, -1);
      });
    }
    e.reset(a), e.template_effect(() => e.set_style(a, `padding-left: ${l() * 12}px`)), e.append(r, a);
  };
  function c() {
    return { folders: /* @__PURE__ */ new Map(), files: [] };
  }
  function m(r) {
    const s = [...r.folders.values()].map(({ node: a, state: i }) => (a.children = m(i), a));
    s.sort((a, i) => a.name.localeCompare(i.name));
    const l = [...r.files].sort((a, i) => a.name.localeCompare(i.name));
    return [...s, ...l];
  }
  function I(r, s) {
    const l = c();
    for (const a of s) {
      const i = a.path.split("/").filter(Boolean);
      if (i.length === 0) continue;
      let p = l, b = "";
      for (let d = 0; d < i.length; d++) {
        const o = i[d];
        if (b = b ? `${b}/${o}` : o, d === i.length - 1)
          p.files.push({ kind: "file", name: o, path: a.path, shardId: r });
        else {
          let v = p.folders.get(o);
          v || (v = {
            node: { kind: "folder", name: o, path: b, shardId: r, children: [] },
            state: c()
          }, p.folders.set(o, v)), p = v.state;
        }
      }
    }
    return m(l);
  }
  const w = e.derived(() => {
    if (!t.store.ready) return [];
    const r = /* @__PURE__ */ new Map();
    for (const l of t.store.documents) {
      const a = r.get(l.shardId) ?? [];
      a.push(l), r.set(l.shardId, a);
    }
    const s = [];
    for (const [l, a] of [...r.entries()].sort(([i], [p]) => i.localeCompare(p)))
      s.push({
        kind: "folder",
        name: l,
        path: "",
        shardId: l,
        children: I(l, a)
      });
    return s;
  });
  function y(r) {
    return `${r.shardId}:${r.path}`;
  }
  function S(r) {
    r.kind === "folder" && t.store.toggleExpanded(y(r));
  }
  function j(r) {
    t.store.ready && t.store.setSelection({ shardId: r.shardId, path: r.path, kind: "file" });
  }
  function _(r) {
    t.store.ready && t.store.setSelection({ shardId: r.shardId, path: r.path, kind: "folder" });
  }
  var n = e.comment(), f = e.first_child(n);
  {
    var k = (r) => {
      var s = U(), l = e.child(s, !0);
      e.reset(s), e.template_effect(() => e.set_text(l, t.store.error.message)), e.append(r, s);
    }, x = (r) => {
      var s = X();
      e.append(r, s);
    }, L = (r) => {
      var s = Y();
      e.each(s, 21, () => e.get(w), (l) => y(l), (l, a) => {
        u(l, () => e.get(a), () => 0);
      }), e.reset(s), e.append(r, s);
    };
    e.if(f, (r) => {
      t.store.ready ? e.get(w).length === 0 ? r(x, 1) : r(L, -1) : r(k);
    });
  }
  e.append(h, n), e.pop();
}
e.delegate(["click"]);
const M = "sh3-file-explorer.selectionAction";
var $ = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq"> </p>'), ee = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq">Select a file or folder to see details.</p>'), te = e.from_html("<button> </button>"), re = e.from_html('<div class="sh3-fe-panel__actions svelte-1vm0wsq"></div>'), se = e.from_html('<header class="sh3-fe-panel__header svelte-1vm0wsq"><div class="sh3-fe-panel__path svelte-1vm0wsq"> </div> <div class="sh3-fe-panel__shard svelte-1vm0wsq"> </div></header> <!>', 1);
function le(h, t) {
  e.push(t, !0);
  let u = e.state(0);
  e.user_effect(() => t.store.ctx.contributions.onChange(M, () => {
    e.update(u);
  }));
  const c = e.derived(() => {
    if (e.get(u), !t.store.ready || !t.store.selection) return [];
    const n = t.store.selection;
    return t.store.ctx.contributions.list(M).filter((f) => !f.appliesTo || f.appliesTo(n));
  });
  let m = e.proxy({});
  async function I(n, f) {
    if (!t.store.ready || !t.store.selection) return;
    const k = t.store.selection;
    m[n] = !0;
    try {
      await f(k);
    } catch (x) {
      console.error(`[sh3-file-explorer] action "${n}" threw:`, x), alert(`Action "${n}" failed: ${x instanceof Error ? x.message : String(x)}`);
    } finally {
      m[n] = !1;
    }
  }
  var w = e.comment(), y = e.first_child(w);
  {
    var S = (n) => {
      var f = $(), k = e.child(f, !0);
      e.reset(f), e.template_effect(() => e.set_text(k, t.store.error.message)), e.append(n, f);
    }, j = (n) => {
      var f = ee();
      e.append(n, f);
    }, _ = (n) => {
      var f = se(), k = e.first_child(f), x = e.child(k), L = e.child(x, !0);
      e.reset(x);
      var r = e.sibling(x, 2), s = e.child(r, !0);
      e.reset(r), e.reset(k);
      var l = e.sibling(k, 2);
      {
        var a = (i) => {
          var p = re();
          e.each(p, 21, () => e.get(c), (b) => b.id, (b, d) => {
            var o = te();
            let g;
            var v = e.child(o, !0);
            e.reset(o), e.template_effect(() => {
              g = e.set_class(o, 1, "sh3-fe-panel__action svelte-1vm0wsq", null, g, { primary: e.get(d).kind === "primary" }), o.disabled = m[e.get(d).id], e.set_text(v, m[e.get(d).id] ? "…" : e.get(d).label);
            }), e.delegated("click", o, () => I(e.get(d).id, e.get(d).onInvoke)), e.append(b, o);
          }), e.reset(p), e.append(i, p);
        };
        e.if(l, (i) => {
          e.get(c).length > 0 && i(a);
        });
      }
      e.template_effect(() => {
        e.set_text(L, t.store.selection.path || "(shard root)"), e.set_text(s, t.store.selection.shardId);
      }), e.append(n, f);
    };
    e.if(y, (n) => {
      t.store.ready ? t.store.selection ? n(_, -1) : n(j, 1) : n(S);
    });
  }
  e.append(h, w), e.pop();
}
e.delegate(["click"]);
var ae = e.from_html('<div class="sh3-fe-browser svelte-sykudp"><div class="sh3-fe-browser__tree svelte-sykudp"><!></div> <div class="sh3-fe-browser__panel svelte-sykudp"><!></div></div>');
function oe(h, t) {
  var u = ae(), c = e.child(u), m = e.child(c);
  Z(m, {
    get store() {
      return t.store;
    }
  }), e.reset(c);
  var I = e.sibling(c, 2), w = e.child(I);
  le(w, {
    get store() {
      return t.store;
    }
  }), e.reset(I), e.reset(u), e.append(h, u);
}
const ce = {
  manifest: {
    id: "sh3-file-explorer",
    label: "File Explorer",
    views: [
      { id: "sh3-file-explorer-browser", label: "Files", standalone: !0 }
    ],
    permissions: ["documents:browse"]
  },
  activate(h) {
    const t = H(h);
    t.ready && (t.refreshDocuments(), t.startWatch()), h.registerView("sh3-file-explorer-browser", {
      mount(u) {
        const c = W(oe, { target: u, props: { store: t } });
        return { unmount() {
          z(c);
        } };
      }
    });
  }
};
export {
  M as SELECTION_ACTION_POINT,
  de as app,
  ce as shard
};
