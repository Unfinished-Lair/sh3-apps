/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".sh3-fe-tree.svelte-gk9ydj,.sh3-fe-tree.svelte-gk9ydj ul:where(.svelte-gk9ydj){list-style:none;padding:0;margin:0}.sh3-fe-node.svelte-gk9ydj{background:none;border:0;color:inherit;cursor:pointer;padding:2px 4px;text-align:left;width:100%;font:inherit}.sh3-fe-node.svelte-gk9ydj:hover{background:var(--sh3-hover, #1e1e1e)}.sh3-fe-node.selected.svelte-gk9ydj{background:var(--sh3-selection, #2d4a7a)}.sh3-fe-empty.svelte-gk9ydj{color:var(--sh3-muted, #888);padding:8px}.sh3-fe-panel__empty.svelte-1vm0wsq,.sh3-fe-panel__muted.svelte-1vm0wsq{color:var(--sh3-muted, #888)}.sh3-fe-panel__header.svelte-1vm0wsq{border-bottom:1px solid var(--sh3-border, #2a2a2a);padding-bottom:6px;margin-bottom:8px}.sh3-fe-panel__path.svelte-1vm0wsq{font-weight:600}.sh3-fe-panel__shard.svelte-1vm0wsq{font-size:.85em;color:var(--sh3-muted, #888)}.sh3-fe-panel__section.svelte-1vm0wsq{margin-top:12px}.sh3-fe-panel__section.svelte-1vm0wsq h4:where(.svelte-1vm0wsq){margin:0 0 4px;font-size:.85em;text-transform:uppercase;letter-spacing:.5px;color:var(--sh3-muted, #888)}.sh3-fe-panel__picker.svelte-1vm0wsq{margin-top:12px;padding:8px;border:1px solid var(--sh3-border, #2a2a2a);border-radius:4px}.sh3-fe-browser.svelte-sykudp{display:grid;grid-template-columns:minmax(240px,1fr) minmax(260px,1fr);height:100%;gap:1px;background:var(--sh3-border, #2a2a2a)}.sh3-fe-browser__tree.svelte-sykudp,.sh3-fe-browser__panel.svelte-sykudp{background:var(--sh3-bg, #111);overflow:auto;padding:8px}.sh3-fe-row.svelte-1ccqts7{border:1px solid var(--sh3-border, #2a2a2a);border-radius:4px;padding:8px}.sh3-fe-row__head.svelte-1ccqts7{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.sh3-fe-row__head.svelte-1ccqts7 span:where(.svelte-1ccqts7){color:var(--sh3-muted, #888);font-size:.9em}.sh3-fe-row__scopes.svelte-1ccqts7{list-style:none;padding:8px 0 0;margin:0;display:flex;flex-direction:column;gap:4px}.sh3-fe-row__scopes.svelte-1ccqts7 li:where(.svelte-1ccqts7){display:flex;justify-content:space-between;align-items:center;gap:8px}.sh3-fe-row__scopes.svelte-1ccqts7 code:where(.svelte-1ccqts7){font-size:.9em}.sh3-fe-connectors.svelte-1ezpj13{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px}.sh3-fe-empty.svelte-1ezpj13{color:var(--sh3-muted, #888);padding:8px}";
  document.head.appendChild(s);
})();
import { mount as H, unmount as J } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
import { SyncGrantPicker as Q } from "sh3-core";
const Ve = {
  manifest: {
    id: "sh3-file-explorer-app",
    label: "File Explorer",
    requiredShards: ["sh3-file-explorer"],
    layoutVersion: 1,
    permissions: ["documents:browse"]
  },
  initialLayout: {
    type: "tabs",
    activeTab: 0,
    tabs: [
      { slotId: "sh3-file-explorer.files", viewId: "sh3-file-explorer-browser", label: "Files" },
      { slotId: "sh3-file-explorer.connectors", viewId: "sh3-file-explorer-connectors", label: "Connectors" }
    ]
  }
};
class U extends Error {
  constructor() {
    super("sh3-file-explorer requires the documents:browse permission.");
  }
}
function X(l) {
  if (!l.browse || !l.syncRegistry)
    return { ctx: l, ready: !1, error: new U() };
  const t = l.browse, i = l.syncRegistry();
  let o = e.state(null);
  const f = e.proxy({});
  let m = e.state(e.proxy([])), u = e.state(e.proxy([])), b = e.state(e.proxy([]));
  function _(r) {
    e.set(o, r, !0);
  }
  function v(r) {
    f[r] ? delete f[r] : f[r] = !0;
  }
  function g(r) {
    return f[r] === !0;
  }
  async function k() {
    e.set(m, await t.listDocuments(), !0);
  }
  async function S() {
    const [r, s] = await Promise.all([i.list(), i.listAllConnectorIds()]);
    e.set(u, r, !0), e.set(b, s, !0);
  }
  function C() {
    return t.watchDocuments((r) => {
      k();
    });
  }
  function V(r) {
    return r ? e.get(u).filter((s) => {
      const n = s.scope;
      return n.kind === "tenant" ? !0 : n.kind === "shard" ? n.shardId === r.shardId : n.kind === "path" ? n.shardId === r.shardId && r.path.startsWith(n.prefix) : !1;
    }) : [];
  }
  return {
    ctx: l,
    ready: !0,
    browse: t,
    registry: i,
    get selection() {
      return e.get(o);
    },
    get documents() {
      return e.get(m);
    },
    get grants() {
      return e.get(u);
    },
    get connectorIds() {
      return e.get(b);
    },
    setSelection: _,
    toggleExpanded: v,
    isExpanded: g,
    coverageFor: V,
    refreshDocuments: k,
    refreshGrants: S,
    startWatch: C
  };
}
var Y = e.from_html('<ul class="svelte-gk9ydj"></ul>'), Z = e.from_html('<button class="sh3-fe-node svelte-gk9ydj"> </button> <!>', 1), $ = e.from_html("<button> </button>"), ee = e.from_html("<li><!></li>"), te = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj"> </p>'), re = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj">No documents in this tenant.</p>'), se = e.from_html('<ul class="sh3-fe-tree svelte-gk9ydj"></ul>');
function ne(l, t) {
  e.push(t, !0);
  const i = (r, s = e.noop, n = e.noop) => {
    var c = ee(), h = e.child(c);
    {
      var x = (a) => {
        var d = Z(), y = e.first_child(d), w = e.child(y);
        e.reset(y);
        var I = e.sibling(y, 2);
        {
          var q = (G) => {
            var P = Y();
            e.each(P, 21, () => s().children, (M) => b(M), (M, p) => {
              i(M, () => e.get(p), () => n() + 1);
            }), e.reset(P), e.append(G, P);
          }, z = e.derived(() => t.store.ready && t.store.isExpanded(b(s())));
          e.if(I, (G) => {
            e.get(z) && G(q);
          });
        }
        e.template_effect((G) => e.set_text(w, `${G ?? ""} ${(s().name || "(root)") ?? ""}/`), [
          () => t.store.ready && t.store.isExpanded(b(s())) ? "▾" : "▸"
        ]), e.delegated("click", y, () => _(s())), e.append(a, d);
      }, j = (a) => {
        var d = $();
        let y;
        var w = e.child(d, !0);
        e.reset(d), e.template_effect(() => {
          var I, q;
          y = e.set_class(d, 1, "sh3-fe-node sh3-fe-node--file svelte-gk9ydj", null, y, {
            selected: t.store.ready && ((I = t.store.selection) == null ? void 0 : I.shardId) === s().shardId && ((q = t.store.selection) == null ? void 0 : q.path) === s().path
          }), e.set_text(w, s().name);
        }), e.delegated("click", d, () => v(s())), e.append(a, d);
      };
      e.if(h, (a) => {
        s().kind === "folder" ? a(x) : a(j, -1);
      });
    }
    e.reset(c), e.template_effect(() => e.set_style(c, `padding-left: ${n() * 12}px`)), e.append(r, c);
  };
  function o() {
    return { folders: /* @__PURE__ */ new Map(), files: [] };
  }
  function f(r) {
    const s = [...r.folders.values()].map(({ node: c, state: h }) => (c.children = f(h), c));
    s.sort((c, h) => c.name.localeCompare(h.name));
    const n = [...r.files].sort((c, h) => c.name.localeCompare(h.name));
    return [...s, ...n];
  }
  function m(r, s) {
    const n = o();
    for (const c of s) {
      const h = c.path.split("/").filter(Boolean);
      if (h.length === 0) continue;
      let x = n, j = "";
      for (let a = 0; a < h.length; a++) {
        const d = h[a];
        if (j = j ? `${j}/${d}` : d, a === h.length - 1)
          x.files.push({ kind: "file", name: d, path: c.path, shardId: r });
        else {
          let w = x.folders.get(d);
          w || (w = {
            node: { kind: "folder", name: d, path: j, shardId: r, children: [] },
            state: o()
          }, x.folders.set(d, w)), x = w.state;
        }
      }
    }
    return f(n);
  }
  const u = e.derived(() => {
    if (!t.store.ready) return [];
    const r = /* @__PURE__ */ new Map();
    for (const n of t.store.documents) {
      const c = r.get(n.shardId) ?? [];
      c.push(n), r.set(n.shardId, c);
    }
    const s = [];
    for (const [n, c] of [...r.entries()].sort(([h], [x]) => h.localeCompare(x)))
      s.push({
        kind: "folder",
        name: n,
        path: "",
        shardId: n,
        children: m(n, c)
      });
    return s;
  });
  function b(r) {
    return `${r.shardId}:${r.path}`;
  }
  function _(r) {
    r.kind === "folder" && t.store.toggleExpanded(b(r));
  }
  function v(r) {
    t.store.ready && t.store.setSelection({ shardId: r.shardId, path: r.path });
  }
  var g = e.comment(), k = e.first_child(g);
  {
    var S = (r) => {
      var s = te(), n = e.child(s, !0);
      e.reset(s), e.template_effect(() => e.set_text(n, t.store.error.message)), e.append(r, s);
    }, C = (r) => {
      var s = re();
      e.append(r, s);
    }, V = (r) => {
      var s = se();
      e.each(s, 21, () => e.get(u), (n) => b(n), (n, c) => {
        i(n, () => e.get(c), () => 0);
      }), e.reset(s), e.append(r, s);
    };
    e.if(k, (r) => {
      t.store.ready ? e.get(u).length === 0 ? r(C, 1) : r(V, -1) : r(S);
    });
  }
  e.append(l, g), e.pop();
}
e.delegate(["click"]);
function W(l) {
  return l.kind === "tenant" ? "tenant" : l.kind === "shard" ? `shard: ${l.shardId}` : `path: ${l.shardId}/${l.prefix}`;
}
var oe = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq"> </p>'), ae = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq">Select a file or folder to see actions.</p>'), le = e.from_html('<p class="sh3-fe-panel__muted svelte-1vm0wsq">Not synced</p>'), ie = e.from_html("<li> </li>"), ce = e.from_html("<ul></ul>"), de = e.from_html('<p class="sh3-fe-panel__muted svelte-1vm0wsq">No sync connectors installed.</p>'), fe = e.from_html("<option> </option>"), ve = e.from_html("Grant <code> </code> access to <code> </code>.", 1), he = e.from_html('<div class="sh3-fe-panel__picker svelte-1vm0wsq"><label>Connector: <select></select></label> <!></div>'), ue = e.from_html('<header class="sh3-fe-panel__header svelte-1vm0wsq"><div class="sh3-fe-panel__path svelte-1vm0wsq"> </div> <div class="sh3-fe-panel__shard svelte-1vm0wsq"> </div></header> <section class="sh3-fe-panel__section svelte-1vm0wsq"><h4 class="svelte-1vm0wsq">Sync coverage</h4> <!></section> <section class="sh3-fe-panel__section svelte-1vm0wsq"><h4 class="svelte-1vm0wsq">Actions</h4> <button>Sync this path…</button> <!></section> <!>', 1);
function _e(l, t) {
  e.push(t, !0);
  let i = e.state(!1), o = e.state(null);
  const f = e.derived(() => t.store.ready ? t.store.coverageFor(t.store.selection) : []), m = e.derived(() => t.store.ready && t.store.selection ? {
    kind: "path",
    shardId: t.store.selection.shardId,
    prefix: t.store.selection.path
  } : null), u = e.derived(() => t.store.ready ? t.store.connectorIds : []);
  function b() {
    e.set(o, e.get(u)[0] ?? null, !0), e.set(i, !0);
  }
  function _() {
    e.set(i, !1);
  }
  async function v() {
    t.store.ready && await t.store.refreshGrants(), e.set(i, !1);
  }
  var g = e.comment(), k = e.first_child(g);
  {
    var S = (r) => {
      var s = oe(), n = e.child(s, !0);
      e.reset(s), e.template_effect(() => e.set_text(n, t.store.error.message)), e.append(r, s);
    }, C = (r) => {
      var s = ae();
      e.append(r, s);
    }, V = (r) => {
      var s = ue(), n = e.first_child(s), c = e.child(n), h = e.child(c, !0);
      e.reset(c);
      var x = e.sibling(c, 2), j = e.child(x, !0);
      e.reset(x), e.reset(n);
      var a = e.sibling(n, 2), d = e.sibling(e.child(a), 2);
      {
        var y = (p) => {
          var E = le();
          e.append(p, E);
        }, w = (p) => {
          var E = ce();
          e.each(E, 21, () => e.get(f), e.index, (T, D) => {
            var A = ie(), N = e.child(A);
            e.reset(A), e.template_effect((R) => e.set_text(N, `${e.get(D).connectorId ?? ""} (${R ?? ""})`), [() => W(e.get(D).scope)]), e.append(T, A);
          }), e.reset(E), e.append(p, E);
        };
        e.if(d, (p) => {
          e.get(f).length === 0 ? p(y) : p(w, -1);
        });
      }
      e.reset(a);
      var I = e.sibling(a, 2), q = e.sibling(e.child(I), 2), z = e.sibling(q, 2);
      {
        var G = (p) => {
          var E = de();
          e.append(p, E);
        };
        e.if(z, (p) => {
          e.get(u).length === 0 && p(G);
        });
      }
      e.reset(I);
      var P = e.sibling(I, 2);
      {
        var M = (p) => {
          var E = he(), T = e.child(E), D = e.sibling(e.child(T));
          e.each(D, 21, () => e.get(u), e.index, (N, R) => {
            var F = fe(), L = e.child(F, !0);
            e.reset(F);
            var O = {};
            e.template_effect(() => {
              e.set_text(L, e.get(R)), O !== (O = e.get(R)) && (F.value = (F.__value = e.get(R)) ?? "");
            }), e.append(N, F);
          }), e.reset(D), e.reset(T);
          var A = e.sibling(T, 2);
          Q(A, {
            get connectorId() {
              return e.get(o);
            },
            get proposedScope() {
              return e.get(m);
            },
            onGranted: v,
            onCancel: _,
            rationale: (R) => {
              e.next();
              var F = ve(), L = e.sibling(e.first_child(F)), O = e.child(L, !0);
              e.reset(L);
              var B = e.sibling(L, 2), K = e.child(B);
              e.reset(B), e.next(), e.template_effect(() => {
                e.set_text(O, e.get(o)), e.set_text(K, `${t.store.selection.shardId ?? ""}:${(t.store.selection.path || "/") ?? ""}`);
              }), e.append(R, F);
            },
            $$slots: { rationale: !0 }
          }), e.reset(E), e.bind_select_value(D, () => e.get(o), (N) => e.set(o, N)), e.append(p, E);
        };
        e.if(P, (p) => {
          e.get(i) && e.get(m) && e.get(o) && p(M);
        });
      }
      e.template_effect(() => {
        e.set_text(h, t.store.selection.path || "(shard root)"), e.set_text(j, t.store.selection.shardId), q.disabled = e.get(u).length === 0;
      }), e.delegated("click", q, b), e.append(r, s);
    };
    e.if(k, (r) => {
      t.store.ready ? t.store.selection ? r(V, -1) : r(C, 1) : r(S);
    });
  }
  e.append(l, g), e.pop();
}
e.delegate(["click"]);
var ge = e.from_html('<div class="sh3-fe-browser svelte-sykudp"><div class="sh3-fe-browser__tree svelte-sykudp"><!></div> <div class="sh3-fe-browser__panel svelte-sykudp"><!></div></div>');
function me(l, t) {
  var i = ge(), o = e.child(i), f = e.child(o);
  ne(f, {
    get store() {
      return t.store;
    }
  }), e.reset(o);
  var m = e.sibling(o, 2), u = e.child(m);
  _e(u, {
    get store() {
      return t.store;
    }
  }), e.reset(m), e.reset(i), e.append(l, i);
}
function pe(l, t) {
  return null;
}
var be = e.from_html("<button>Open setup…</button>"), ye = e.from_html('<li class="svelte-1ccqts7"><code class="svelte-1ccqts7"> </code> <button>Revoke</button></li>'), xe = e.from_html('<ul class="sh3-fe-row__scopes svelte-1ccqts7"></ul>'), we = e.from_html('<div class="sh3-fe-row svelte-1ccqts7"><div class="sh3-fe-row__head svelte-1ccqts7"><strong> </strong> <span class="svelte-1ccqts7"> </span> <button> </button> <button>Revoke all</button> <!></div> <!></div>');
function ke(l, t) {
  e.push(t, !0);
  let i = e.state(!1), o = e.state(!1);
  const f = e.derived(() => t.store.ready ? t.store.grants.filter((a) => a.connectorId === t.connectorId) : []), m = e.derived(() => pe(t.store, t.connectorId));
  async function u(a) {
    if (!(!t.store.ready || e.get(o))) {
      e.set(o, !0);
      try {
        await t.store.registry.revoke(t.connectorId, a), await t.store.refreshGrants();
      } finally {
        e.set(o, !1);
      }
    }
  }
  async function b() {
    if (!(!t.store.ready || e.get(o)) && confirm(`Revoke all ${e.get(f).length} scopes for ${t.connectorId}?`)) {
      e.set(o, !0);
      try {
        for (const a of e.get(f)) await t.store.registry.revoke(t.connectorId, a.scope);
        await t.store.refreshGrants();
      } finally {
        e.set(o, !1);
      }
    }
  }
  function _() {
    e.get(m) && console.warn("[sh3-file-explorer] Open setup… not wired yet", e.get(m));
  }
  var v = we(), g = e.child(v), k = e.child(g), S = e.child(k, !0);
  e.reset(k);
  var C = e.sibling(k, 2), V = e.child(C);
  e.reset(C);
  var r = e.sibling(C, 2), s = e.child(r, !0);
  e.reset(r);
  var n = e.sibling(r, 2), c = e.sibling(n, 2);
  {
    var h = (a) => {
      var d = be();
      e.delegated("click", d, _), e.append(a, d);
    };
    e.if(c, (a) => {
      e.get(m) && a(h);
    });
  }
  e.reset(g);
  var x = e.sibling(g, 2);
  {
    var j = (a) => {
      var d = xe();
      e.each(d, 21, () => e.get(f), (y) => W(y.scope), (y, w) => {
        var I = ye(), q = e.child(I), z = e.child(q, !0);
        e.reset(q);
        var G = e.sibling(q, 2);
        e.reset(I), e.template_effect(
          (P) => {
            e.set_text(z, P), G.disabled = e.get(o);
          },
          [() => W(e.get(w).scope)]
        ), e.delegated("click", G, () => u(e.get(w).scope)), e.append(y, I);
      }), e.reset(d), e.append(a, d);
    };
    e.if(x, (a) => {
      e.get(i) && e.get(f).length > 0 && a(j);
    });
  }
  e.reset(v), e.template_effect(() => {
    e.set_text(S, t.connectorId), e.set_text(V, `${e.get(f).length ?? ""} scope${e.get(f).length === 1 ? "" : "s"} granted`), r.disabled = e.get(f).length === 0, e.set_text(s, e.get(i) ? "Hide" : "Manage"), n.disabled = e.get(f).length === 0 || e.get(o);
  }), e.delegated("click", r, () => e.set(i, !e.get(i))), e.delegated("click", n, b), e.append(l, v), e.pop();
}
e.delegate(["click"]);
var Ie = e.from_html('<p class="sh3-fe-empty svelte-1ezpj13"> </p>'), qe = e.from_html('<p class="sh3-fe-empty svelte-1ezpj13">No sync connectors installed.</p>'), Se = e.from_html("<li><!></li>"), Ce = e.from_html('<ul class="sh3-fe-connectors svelte-1ezpj13"></ul>');
function Ee(l, t) {
  e.push(t, !0);
  const i = e.derived(() => t.store.ready ? t.store.connectorIds : []);
  var o = e.comment(), f = e.first_child(o);
  {
    var m = (_) => {
      var v = Ie(), g = e.child(v, !0);
      e.reset(v), e.template_effect(() => e.set_text(g, t.store.error.message)), e.append(_, v);
    }, u = (_) => {
      var v = qe();
      e.append(_, v);
    }, b = (_) => {
      var v = Ce();
      e.each(v, 20, () => e.get(i), (g) => g, (g, k) => {
        var S = Se(), C = e.child(S);
        ke(C, {
          get store() {
            return t.store;
          },
          get connectorId() {
            return k;
          }
        }), e.reset(S), e.append(g, S);
      }), e.reset(v), e.append(_, v);
    };
    e.if(f, (_) => {
      t.store.ready ? e.get(i).length === 0 ? _(u, 1) : _(b, -1) : _(m);
    });
  }
  e.append(l, o), e.pop();
}
const Pe = {
  manifest: {
    id: "sh3-file-explorer",
    label: "File Explorer",
    views: [
      { id: "sh3-file-explorer-browser", label: "Files", standalone: !0 },
      { id: "sh3-file-explorer-connectors", label: "Connectors" }
    ],
    permissions: ["documents:browse"]
  },
  activate(l) {
    const t = X(l);
    t.ready && (t.refreshDocuments(), t.refreshGrants(), t.startWatch()), l.registerView("sh3-file-explorer-browser", {
      mount(i) {
        const o = H(me, { target: i, props: { store: t } });
        return { unmount() {
          J(o);
        } };
      }
    }), l.registerView("sh3-file-explorer-connectors", {
      mount(i) {
        const o = H(Ee, { target: i, props: { store: t } });
        return { unmount() {
          J(o);
        } };
      }
    });
  }
};
export {
  Ve as app,
  Pe as shard
};
