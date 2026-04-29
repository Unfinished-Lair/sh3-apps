/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".cp-surface.svelte-7v5dlc{display:flex;flex-direction:column;gap:12px;padding:12px;background:var(--shell-bg-elevated);border-radius:6px;font-family:var(--shell-font-ui);width:fit-content}.cp-surface.disabled.svelte-7v5dlc{opacity:.5;pointer-events:none}.cp-main.svelte-7v5dlc{display:flex;gap:16px}.cp-left.svelte-7v5dlc{display:flex;flex-direction:column;gap:10px}.cp-right.svelte-7v5dlc{display:flex;flex-direction:column;min-width:180px}.cp-body.svelte-7v5dlc{display:flex;gap:8px}.cp-square.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:crosshair}.cp-strip.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-mode.svelte-7v5dlc{display:inline-flex;gap:0}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:3px 10px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);cursor:pointer}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):first-child{border-radius:4px 0 0 4px;border-right:none}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):last-child{border-radius:0 4px 4px 0}.cp-mode.svelte-7v5dlc button.active:where(.svelte-7v5dlc){background:var(--shell-accent, #3a7eff);color:var(--shell-bg)}.cp-sliders.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-label.svelte-7v5dlc{width:14px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-value.svelte-7v5dlc{width:40px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-range.svelte-7v5dlc{flex:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:8px;border-radius:4px;background:var(--track-bg, var(--shell-input-bg));outline:none;cursor:pointer}.cp-range.svelte-7v5dlc::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-range.svelte-7v5dlc::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-hex-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-preview.svelte-7v5dlc{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-7v5dlc{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-palette.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-palette-select.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;outline:none}.cp-palette-select.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-swatches.svelte-7v5dlc{display:grid;grid-template-columns:repeat(auto-fill,minmax(24px,1fr));gap:4px}.cp-swatch.svelte-7v5dlc{width:24px;height:24px;border-radius:4px;border:1px solid var(--shell-border);cursor:pointer;padding:0;outline:none}.cp-swatch.active.svelte-7v5dlc{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-palette-actions.svelte-7v5dlc{display:flex;gap:4px}.cp-palette-btn.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-palette-btn.svelte-7v5dlc:hover:not([disabled]){background:var(--shell-bg-sunken)}.cp-palette-btn[disabled].svelte-7v5dlc{opacity:.5;cursor:not-allowed}.cp-save-prompt.svelte-7v5dlc{display:flex;gap:4px;align-items:center}.cp-save-input.svelte-7v5dlc{flex:1;min-width:0;padding:3px 6px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:12px;font-family:inherit;outline:none}.cp-pick-title.svelte-1n3y1cm{font:var(--shell-font-ui);color:var(--shell-text-dim);padding:4px 8px;border-bottom:1px solid var(--shell-border-subtle, rgba(255, 255, 255, .1))}.toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1etykqv{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1etykqv{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1etykqv{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1etykqv{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1etykqv{color:var(--shell-fg-muted)}.seg.svelte-1etykqv{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1etykqv button:where(.svelte-1etykqv)+button:where(.svelte-1etykqv){border-left:1px solid var(--shell-border)}.seg.svelte-1etykqv button.active:where(.svelte-1etykqv){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1etykqv button:where(.svelte-1etykqv):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1etykqv{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1etykqv button:where(.svelte-1etykqv):hover{background:var(--shell-accent)}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv){background:transparent}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}.cp.svelte-f5c5rv{display:flex;flex-direction:column;border:1px solid var(--shell-border);border-radius:6px;width:fit-content}.cp.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact.svelte-f5c5rv{position:relative;display:inline-block;font-family:var(--shell-font-ui)}.cp-compact.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact-row.svelte-f5c5rv{display:flex;align-items:center;gap:6px}.cp-compact-preview.svelte-f5c5rv{width:20px;height:20px;cursor:pointer;border:1px solid var(--shell-border);border-radius:4px;flex-shrink:0;outline:none}.cp-compact-preview.svelte-f5c5rv:focus-visible{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-preview.svelte-f5c5rv{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-f5c5rv{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-f5c5rv:focus{border-color:var(--shell-accent, #3a7eff)}.cp-compact-hex.svelte-f5c5rv{width:90px;font-size:12px}.cp-leaf-fallback.svelte-1tdr2l8{font-family:var(--shell-font-mono, monospace);color:var(--shell-text-dim)}.section.svelte-18qjjuf{padding-bottom:var(--shell-pad-md);margin-bottom:var(--shell-pad-md);border-bottom:1px solid var(--shell-border)}.section.svelte-18qjjuf:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.section-label.svelte-18qjjuf{margin:0 0 var(--shell-pad-sm);font-size:11px;font-weight:600;color:var(--shell-accent);text-transform:uppercase;letter-spacing:.08em;font-family:var(--shell-font-ui)}.rows.svelte-18qjjuf{display:flex;flex-direction:column}.row.svelte-1rh69ln{display:grid;grid-template-columns:200px 1fr;column-gap:var(--shell-pad-md);align-items:center;padding:var(--shell-pad-sm) 0;font-family:var(--shell-font-ui);font-size:13px;color:var(--shell-fg)}.row.disabled.svelte-1rh69ln{opacity:.5;pointer-events:none}.label.svelte-1rh69ln{color:var(--shell-fg)}.desc.svelte-1rh69ln{font-size:11px;color:var(--shell-fg-muted);margin-top:2px}.control.svelte-1rh69ln{display:flex;align-items:center;gap:var(--shell-pad-sm)}.error.svelte-1rh69ln{grid-column:2;font-size:11px;color:var(--shell-error, #ff7a7a);margin-top:4px}.toggle.svelte-ert2i6{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:34px;height:18px;background:var(--shell-border);border:none;border-radius:9px;position:relative;cursor:pointer;padding:0;transition:background .1s}.toggle.on.svelte-ert2i6{background:var(--shell-accent)}.toggle[disabled].svelte-ert2i6{cursor:not-allowed}.knob.svelte-ert2i6{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left .1s}.toggle.on.svelte-ert2i6 .knob:where(.svelte-ert2i6){left:18px}.input.svelte-1jljyjf{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:100%;box-sizing:border-box}.input.svelte-1jljyjf:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1jljyjf{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1jljyjf{cursor:not-allowed}.input.svelte-1be7g0v{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:90px;box-sizing:border-box}.input.svelte-1be7g0v:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1be7g0v{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1be7g0v{cursor:not-allowed}.unit.svelte-1be7g0v{font-size:11px;color:var(--shell-fg-muted)}.slider.svelte-1jyn88{flex:1;accent-color:var(--shell-accent);cursor:pointer}.slider[disabled].svelte-1jyn88{cursor:not-allowed}.slider.error.svelte-1jyn88{accent-color:var(--shell-error, #ff7a7a)}.value.svelte-1jyn88{min-width:56px;text-align:right;font-size:12px;color:var(--shell-accent);font-variant-numeric:tabular-nums}.seg.svelte-iu603z{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.error.svelte-iu603z{border-color:var(--shell-error, #ff7a7a)}.seg.svelte-iu603z button:where(.svelte-iu603z){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 10px;background:var(--shell-bg-sunken);color:var(--shell-fg);border:none;cursor:pointer}.seg.svelte-iu603z button:where(.svelte-iu603z)+button:where(.svelte-iu603z){border-left:1px solid var(--shell-border)}.seg.svelte-iu603z button.active:where(.svelte-iu603z){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-iu603z button:where(.svelte-iu603z):hover:not(.active):not([disabled]){background:var(--shell-bg)}.seg.svelte-iu603z button[disabled]:where(.svelte-iu603z){cursor:not-allowed}.settings.svelte-mrn94a{padding:var(--shell-pad-lg);font-family:var(--shell-font-ui);color:var(--shell-fg);background:var(--shell-bg);min-height:100%;box-sizing:border-box}.title.svelte-mrn94a{margin:0 0 var(--shell-pad-md);font-size:16px;font-weight:600}.empty.svelte-mrn94a{color:var(--shell-fg-muted);font-style:italic;padding:var(--shell-pad-md) 0}.hotkeys-tab.svelte-151qe3m{padding:12px 16px;color:var(--shell-fg)}.ctx.svelte-151qe3m{font-size:12px;opacity:.8;margin-bottom:12px}.ctx.svelte-151qe3m code:where(.svelte-151qe3m){font-family:var(--shell-mono, monospace)}.group.svelte-151qe3m{margin-bottom:16px}.group-title.svelte-151qe3m{font-size:13px;font-weight:600;margin:0 0 6px;opacity:.9}.list.svelte-151qe3m{list-style:none;margin:0;padding:0}.row.svelte-151qe3m{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px solid var(--shell-border, #2a2a2a)}.row.disabled.svelte-151qe3m{opacity:.5}.label.svelte-151qe3m{font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kbd.svelte-151qe3m{font-family:var(--shell-mono, monospace);font-size:12px;padding:2px 6px;border-radius:3px;background:var(--shell-surface-2, #2a2a2a)}.badge.svelte-151qe3m{font-size:11px;opacity:.6;font-family:var(--shell-mono, monospace)}.empty.svelte-151qe3m{opacity:.6;padding:16px 0}.help-root.svelte-udgkd3{display:flex;flex-direction:column;height:100%;min-height:320px;background:var(--shell-surface, #1a1a1a);color:var(--shell-fg)}.modal-surface.svelte-udgkd3{width:640px;max-width:90vw;height:480px;max-height:80vh}.help-header.svelte-udgkd3{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid var(--shell-border, #2a2a2a)}.title.svelte-udgkd3{font-weight:600;flex:1}.close-btn.svelte-udgkd3{background:none;border:none;color:var(--shell-fg);font-size:18px;cursor:pointer;padding:0 8px;line-height:1}.tab-strip.svelte-udgkd3{display:flex;gap:2px;padding:6px 8px 0;border-bottom:1px solid var(--shell-border, #2a2a2a);background:var(--shell-surface-2, transparent)}.tab-btn.svelte-udgkd3{background:transparent;border:none;color:var(--shell-fg);padding:6px 12px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;display:inline-flex;gap:4px;align-items:center}.tab-btn.svelte-udgkd3:hover{background:var(--shell-hover, rgba(255,255,255,.05))}.tab-btn.active.svelte-udgkd3{border-bottom-color:var(--shell-accent, #3ba3ff);font-weight:600}.tab-icon.svelte-udgkd3{font-size:14px}.tab-bodies.svelte-udgkd3{flex:1;overflow:hidden;position:relative}.tab-body.svelte-udgkd3{position:absolute;top:0;right:0;bottom:0;left:0;overflow-y:auto;overflow-x:hidden;display:none}.tab-body.active.svelte-udgkd3{display:block}.loading.svelte-udgkd3{padding:16px;opacity:.6}.graph-node.svelte-y92dsd{position:absolute;background:var(--sh3-surface-1, #1f1f1f);border:1px solid var(--border-color);border-radius:4px;color:var(--text-color);-webkit-user-select:none;user-select:none;box-shadow:0 2px 4px #0000004d}.graph-node.selected.svelte-y92dsd{outline:2px solid var(--sh3-accent, #4a9eff);outline-offset:1px}.header.svelte-y92dsd{padding:4px 8px;cursor:grab;font-weight:600;border-bottom:1px solid var(--border-color);display:flex;gap:6px;align-items:center}.header.svelte-y92dsd:active{cursor:grabbing}.ports.svelte-y92dsd{display:flex;justify-content:space-between;padding:6px 0}.ports-col.svelte-y92dsd{display:flex;flex-direction:column;gap:4px;min-width:50%}.ports-col.inputs.svelte-y92dsd{align-items:flex-start}.ports-col.outputs.svelte-y92dsd{align-items:flex-end}.port.svelte-y92dsd{display:flex;align-items:center;gap:4px;padding:0 4px;font-size:.85em;cursor:crosshair}.port-marker.svelte-y92dsd{width:10px;height:10px;border-radius:50%;background:var(--border-color);border:1px solid rgba(255,255,255,.4)}.input.svelte-y92dsd .port-marker:where(.svelte-y92dsd){margin-left:-10px}.output.svelte-y92dsd .port-marker:where(.svelte-y92dsd){margin-right:-10px}.edge.svelte-1rehop2{cursor:pointer}.line.svelte-1rehop2{fill:none;stroke-width:2}.halo.svelte-1rehop2{fill:none;stroke:var(--sh3-accent, #4a9eff);stroke-width:6;opacity:.4}.selected.svelte-1rehop2 .line:where(.svelte-1rehop2){stroke-width:3}.palette.svelte-lpiq26{position:absolute;z-index:10;background:var(--sh3-surface-2, #2a2a2a);border:1px solid var(--sh3-border, #444);border-radius:4px;padding:4px;width:240px;max-height:320px;display:flex;flex-direction:column;box-shadow:0 4px 12px #0006}.search.svelte-lpiq26{padding:4px;border:1px solid var(--sh3-border, #444);border-radius:3px;background:var(--sh3-surface-1, #1f1f1f);color:var(--sh3-text-primary, #ddd)}.lists.svelte-lpiq26{overflow-y:auto;margin-top:4px}.cat-name.svelte-lpiq26{padding:4px 6px 2px;font-size:.75em;text-transform:uppercase;opacity:.6}.item.svelte-lpiq26{display:block;width:100%;text-align:left;padding:4px 6px;background:transparent;border:0;color:var(--sh3-text-primary, #ddd);cursor:pointer}.item.svelte-lpiq26:hover{background:var(--sh3-hover, #333)}.graph-canvas.svelte-x16tu1{position:relative;width:100%;height:100%;overflow:hidden;background:var(--sh3-surface-0, #161616);background-image:linear-gradient(var(--sh3-grid, #2a2a2a) 1px,transparent 1px),linear-gradient(90deg,var(--sh3-grid, #2a2a2a) 1px,transparent 1px);background-size:20px 20px}.edge-overlay.svelte-x16tu1{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none}.edge-overlay.svelte-x16tu1 g.edge{pointer-events:stroke}.graph-empty.svelte-1dbihe0{padding:1.5rem;color:var(--sh3-text-secondary, #888);font-family:var(--sh3-font-ui, system-ui)}h2.svelte-1dbihe0{margin:0 0 .5rem;color:var(--sh3-text-primary, #ddd)}h3.svelte-1dbihe0{margin:1.5rem 0 .5rem;font-size:.9rem;text-transform:uppercase;letter-spacing:.06em}.hint.svelte-1dbihe0{margin:0 0 .5rem}.domain-list.svelte-1dbihe0{list-style:none;padding:0;margin:0}.domain-list.svelte-1dbihe0 li:where(.svelte-1dbihe0){padding:.25rem 0;font-size:.9rem}.domain-list.svelte-1dbihe0 code:where(.svelte-1dbihe0){color:var(--sh3-text-primary, #ddd)}.dash.svelte-1dbihe0{margin:0 .5em;opacity:.6}.label.svelte-1dbihe0{color:var(--sh3-text-secondary, #aaa)}.warn.svelte-1dbihe0{color:var(--sh3-warn, #d6a13a)}.graph-error.svelte-39j3n{padding:1.5rem;color:var(--sh3-warn, #d6a13a);font-family:var(--sh3-font-ui, system-ui)}.graph-error.svelte-39j3n h2:where(.svelte-39j3n){margin:0 0 .5rem}";
  document.head.appendChild(s);
})();
var Xt = Object.defineProperty;
var Ct = (n) => {
  throw TypeError(n);
};
var Jt = (n, t, r) => t in n ? Xt(n, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[t] = r;
var ee = (n, t, r) => Jt(n, typeof t != "symbol" ? t + "" : t, r), Qt = (n, t, r) => t.has(n) || Ct("Cannot " + r);
var Te = (n, t, r) => (Qt(n, t, "read from private field"), r ? r.call(n) : t.get(n)), nt = (n, t, r) => t.has(n) ? Ct("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, r);
import { shell as Ve, getActiveApp as Zt, COLOR_PICKER_POINT as $t } from "sh3-core";
import { onMount as ze, onDestroy as Ut, mount as _e, unmount as ge } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
const en = 2, tn = "inline";
function nn(n, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (n == null ? void 0 : n.indentUnit) ?? en,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (n == null ? void 0 : n.braceStyle) ?? tn
  };
}
class rn {
  constructor(t) {
    ee(this, "entries", /* @__PURE__ */ new Map());
    ee(this, "onClose");
    this.onClose = t;
  }
  open(t, r) {
    if (this.entries.has(t))
      return this.entries.get(t);
    const s = {
      document: {
        id: t,
        content: r.content,
        filePath: r.filePath ?? null,
        cursorStart: 0,
        cursorEnd: 0,
        scrollTop: 0,
        scrollLeft: 0,
        dirty: !1,
        language: r.language ?? null
      },
      options: r,
      prefs: nn(r.matchingConfig, r.prefs)
    };
    return this.entries.set(t, s), s;
  }
  close(t) {
    const r = this.entries.delete(t);
    return r && this.onClose && this.onClose(t), r;
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
    if (this.entries.clear(), this.onClose) for (const r of t) this.onClose(r);
  }
}
var Re;
class an {
  constructor(t) {
    ee(this, "entries", /* @__PURE__ */ new Map());
    nt(this, Re, e.state(0));
    ee(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Te(this, Re));
  }
  set version(t) {
    e.set(Te(this, Re), t, !0);
  }
  open(t, r) {
    const a = this.entries.get(t);
    if (a) return a;
    const s = { value: r.value, meta: r.meta, options: r };
    return this.entries.set(t, s), this.version++, s;
  }
  close(t) {
    const r = this.entries.delete(t);
    return r && (this.version++, this.onClose && this.onClose(t)), r;
  }
  get(t) {
    return this.version, this.entries.get(t);
  }
  has(t) {
    return this.version, this.entries.has(t);
  }
  list() {
    return this.version, [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const r of t) this.onClose(r);
  }
}
Re = new WeakMap();
const ln = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
function ke({ h: n, s: t, v: r }) {
  const a = t / 100, s = r / 100, i = s * a, l = i * (1 - Math.abs(n / 60 % 2 - 1)), g = s - i;
  let o = 0, d = 0, f = 0;
  return n < 60 ? (o = i, d = l) : n < 120 ? (o = l, d = i) : n < 180 ? (d = i, f = l) : n < 240 ? (d = l, f = i) : n < 300 ? (o = l, f = i) : (o = i, f = l), {
    r: Math.round((o + g) * 255),
    g: Math.round((d + g) * 255),
    b: Math.round((f + g) * 255)
  };
}
function sn({ r: n, g: t, b: r }) {
  const a = n / 255, s = t / 255, i = r / 255, l = Math.max(a, s, i), g = Math.min(a, s, i), o = l - g;
  let d = 0;
  o !== 0 && (l === a ? d = 60 * ((s - i) / o % 6) : l === s ? d = 60 * ((i - a) / o + 2) : d = 60 * ((a - s) / o + 4)), d < 0 && (d += 360);
  const f = l === 0 ? 0 : o / l * 100, h = l * 100;
  return { h: Math.round(d), s: Math.round(f), v: Math.round(h) };
}
function we({ r: n, g: t, b: r }) {
  const a = (s) => s.toString(16).padStart(2, "0");
  return `#${a(n)}${a(t)}${a(r)}`;
}
function on(n) {
  let t = n.replace(/^#/, "");
  t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
  const r = parseInt(t, 16);
  return { r: r >> 16 & 255, g: r >> 8 & 255, b: r & 255 };
}
function Ee(n) {
  return we(ke(n));
}
function me(n) {
  return sn(on(n));
}
function dn(n) {
  return ln.test(n);
}
function ie(n) {
  if (!dn(n)) return null;
  let t = n.replace(/^#/, "").toLowerCase();
  return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), `#${t}`;
}
var Be;
class cn {
  constructor(t) {
    ee(this, "entries", /* @__PURE__ */ new Map());
    nt(this, Be, e.state(0));
    ee(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Te(this, Be));
  }
  set version(t) {
    e.set(Te(this, Be), t, !0);
  }
  open(t, r) {
    const a = this.entries.get(t);
    if (a) return a;
    const i = { value: ie(r.value) ?? "#000000", options: r };
    return this.entries.set(t, i), this.version++, i;
  }
  close(t) {
    const r = this.entries.delete(t);
    return r && (this.version++, this.onClose && this.onClose(t)), r;
  }
  get(t) {
    return this.version, this.entries.get(t);
  }
  has(t) {
    return this.version, this.entries.has(t);
  }
  list() {
    return this.version, [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const r of t) this.onClose(r);
  }
}
Be = new WeakMap();
const un = 200;
class fn {
  constructor(t = un) {
    ee(this, "undoStack", []);
    ee(this, "redoStack", []);
    ee(this, "maxDepth");
    ee(this, "listeners", /* @__PURE__ */ new Set());
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
function je(n) {
  const { setter: t, before: r, after: a, cursorBefore: s, cursorAfter: i, now: l } = n;
  return {
    apply: () => t(a, i),
    revert: () => t(r, s),
    meta: {
      kind: "text-swap",
      timestamp: l,
      snapshot: { before: r, after: a, cursorBefore: s, cursorAfter: i }
    }
  };
}
class gn {
  constructor() {
    ee(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let r = this.engines.get(t);
    return r || (r = new fn(), this.engines.set(t, r)), r;
  }
  release(t) {
    this.engines.delete(t);
  }
  clear() {
    this.engines.clear();
  }
}
class pe {
  constructor() {
    ee(this, "listeners", /* @__PURE__ */ new Set());
  }
  on(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  emit(...t) {
    for (const r of this.listeners) r(...t);
  }
  clear() {
    this.listeners.clear();
  }
}
function vn(n, t, r) {
  const a = n.get(t);
  return {
    push(i) {
      a.push(i), r();
    },
    undo() {
      const i = a.undo();
      return i && r(), i;
    },
    redo() {
      const i = a.redo();
      return i && r(), i;
    },
    peek() {
      return a.peek();
    },
    replaceTop(i) {
      const l = a.replaceTop(i);
      return l && r(), l;
    },
    get canUndo() {
      return a.canUndo;
    },
    get canRedo() {
      return a.canRedo;
    },
    clear() {
      a.clear(), r();
    },
    onChange(i) {
      return a.onChange(i);
    }
  };
}
const hn = 300;
function mn(n) {
  const t = new pe(), r = new pe(), a = new pe(), s = new pe(), i = new pe(), l = new pe(), g = new pe(), o = new gn(), d = new an((c) => {
    o.release(c);
  }), f = new cn((c) => {
    o.release(c);
  }), h = /* @__PURE__ */ new Map();
  function k(c) {
    let v = h.get(c);
    return v || (v = vn(o, c, () => {
      var I;
      if (d.has(c) && i.emit(c, ((I = d.get(c)) == null ? void 0 : I.value) ?? null), f.has(c)) {
        const P = f.get(c);
        P && l.emit(c, P.value);
      }
    }), h.set(c, v)), v;
  }
  function b(c) {
    o.release(c), h.delete(c);
  }
  return { api: {
    getContent(c) {
      const v = n.get(c);
      return v ? v.document.content : null;
    },
    isDirty(c) {
      const v = n.get(c);
      return v ? v.document.dirty : !1;
    },
    getDocument(c) {
      const v = n.get(c);
      return v ? v.document : null;
    },
    listInstances() {
      return n.list();
    },
    openDocument(c, v) {
      n.open(c, v);
    },
    closeDocument(c) {
      n.close(c) && b(c);
    },
    updateContent(c, v, I, P) {
      var G, y;
      const S = n.get(c);
      if (!S) return;
      const D = S.document, T = D.content;
      if (T === v) return;
      const A = D.cursorStart, V = (w, U) => {
        D.content = w, D.cursorStart = U, D.cursorEnd = U, t.emit(c, w);
      };
      D.content = v, D.cursorStart = I, D.cursorEnd = P;
      const M = k(c), L = Date.now(), j = M.peek(), E = ((G = j == null ? void 0 : j.meta) == null ? void 0 : G.kind) === "text-swap" ? j.meta.snapshot : void 0, R = Math.abs(v.length - T.length) <= 1, z = E && ((y = j == null ? void 0 : j.meta) == null ? void 0 : y.timestamp) != null && L - j.meta.timestamp < hn;
      E && R && z ? M.replaceTop(je({
        setter: V,
        before: E.before,
        after: v,
        cursorBefore: E.cursorBefore,
        cursorAfter: I,
        now: L
      })) : M.push(je({
        setter: V,
        before: T,
        after: v,
        cursorBefore: A,
        cursorAfter: I,
        now: L
      }));
      const O = D.dirty;
      D.dirty = !0, t.emit(c, v), O || r.emit(c, !0);
    },
    markClean(c) {
      const v = n.get(c);
      v && v.document.dirty && (v.document.dirty = !1, r.emit(c, !1));
    },
    onContentChange(c) {
      return t.on(c);
    },
    onDirtyChange(c) {
      return r.on(c);
    },
    onSave(c) {
      return a.on(c);
    },
    onPrefsChange(c) {
      return s.on(c);
    },
    openInspector(c, v) {
      d.open(c, v);
    },
    closeInspector(c) {
      d.close(c) && b(c);
    },
    getInspectorValue(c) {
      var v;
      return ((v = d.get(c)) == null ? void 0 : v.value) ?? null;
    },
    listInspectorInstances() {
      return d.list();
    },
    onInspectorValueChange(c) {
      return i.on(c);
    },
    openColorPicker(c, v) {
      f.open(c, v);
    },
    closeColorPicker(c) {
      f.close(c) && b(c);
    },
    getColorPickerValue(c) {
      var v;
      return ((v = f.get(c)) == null ? void 0 : v.value) ?? null;
    },
    listColorPickerInstances() {
      return f.list();
    },
    onColorPickerValueChange(c) {
      return l.on(c);
    },
    onColorPickerPrefsChange(c) {
      return g.on(c);
    },
    history: k
  }, internals: {
    emitSave(c) {
      a.emit(c);
    },
    contentChange: t,
    dirtyChange: r,
    saveEvent: a,
    prefsChange: s,
    inspectorValueChange: i,
    colorPickerValueChange: l,
    colorPickerPrefsChange: g,
    history: k,
    inspectors: d,
    colorPickers: f
  }, teardown: () => {
    t.clear(), r.clear(), a.clear(), s.clear(), i.clear(), l.clear(), g.clear(), o.clear(), h.clear(), d.clear(), f.clear();
  } };
}
const rt = "sh3-editor.inspectorRenderer", it = [
  {
    id: "pastel",
    label: "Pastel",
    colors: [
      "#ffb3ba",
      "#ffdfba",
      "#ffffba",
      "#baffc9",
      "#bae1ff",
      "#e8baff",
      "#ffb3de",
      "#c9baff",
      "#baf2ff",
      "#ffdab3"
    ],
    builtin: !0
  },
  {
    id: "neon",
    label: "Neon",
    colors: [
      "#ff0080",
      "#ff00ff",
      "#8000ff",
      "#0040ff",
      "#00ffff",
      "#00ff40",
      "#80ff00",
      "#ffff00",
      "#ff8000",
      "#ff0040"
    ],
    builtin: !0
  },
  {
    id: "earth",
    label: "Earth Tones",
    colors: [
      "#8b4513",
      "#a0522d",
      "#cd853f",
      "#deb887",
      "#d2b48c",
      "#bc8f8f",
      "#808000",
      "#6b8e23",
      "#556b2f",
      "#8fbc8f"
    ],
    builtin: !0
  },
  {
    id: "web1",
    label: "Web 1.0",
    colors: [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff6600",
      "#663399",
      "#009900",
      "#cc0000",
      "#336699",
      "#ffffff"
    ],
    builtin: !0
  },
  {
    id: "mono",
    label: "Monochrome",
    colors: [
      "#000000",
      "#1a1a1a",
      "#333333",
      "#4d4d4d",
      "#666666",
      "#808080",
      "#999999",
      "#b3b3b3",
      "#cccccc",
      "#e6e6e6",
      "#f2f2f2",
      "#ffffff"
    ],
    builtin: !0
  },
  {
    id: "ocean",
    label: "Ocean",
    colors: [
      "#001f3f",
      "#003366",
      "#005b96",
      "#0077b6",
      "#00b4d8",
      "#48cae4",
      "#90e0ef",
      "#ade8f4",
      "#caf0f8",
      "#023e8a"
    ],
    builtin: !0
  },
  {
    id: "sunset",
    label: "Sunset",
    colors: [
      "#ff6b35",
      "#ff8c42",
      "#ffb347",
      "#ffd700",
      "#ff4500",
      "#dc143c",
      "#c71585",
      "#8b008b",
      "#ff69b4",
      "#ffa07a"
    ],
    builtin: !0
  },
  {
    id: "jewel",
    label: "Jewel Tones",
    colors: [
      "#50c878",
      "#0f52ba",
      "#e0115f",
      "#9966cc",
      "#ff7518",
      "#4b0082",
      "#006d6f",
      "#cf1020",
      "#ffd700",
      "#228b22"
    ],
    builtin: !0
  }
];
var pn = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">H</span> <input type="range" min="0" max="360" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">S</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">V</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), bn = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">R</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">G</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">B</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), _n = e.from_html("<option> </option>"), yn = e.from_html('<button type="button"></button>'), kn = e.from_html('<div class="cp-save-prompt svelte-7v5dlc"><input type="text" class="cp-save-input svelte-7v5dlc" placeholder="Palette name"/> <button type="button" class="cp-palette-btn svelte-7v5dlc">OK</button> <button type="button" class="cp-palette-btn svelte-7v5dlc">Cancel</button></div>'), wn = e.from_html('<div role="group" aria-label="Color picker"><div class="cp-main svelte-7v5dlc"><div class="cp-left svelte-7v5dlc"><div class="cp-body svelte-7v5dlc"><canvas class="cp-square svelte-7v5dlc" role="slider" aria-label="Saturation and value"></canvas> <canvas class="cp-strip svelte-7v5dlc" role="slider" aria-label="Hue"></canvas></div> <div class="cp-mode svelte-7v5dlc"><button type="button">HSV</button> <button type="button">RGB</button></div> <!> <div class="cp-hex-row svelte-7v5dlc"><div class="cp-preview svelte-7v5dlc"></div> <input type="text" class="cp-hex-input svelte-7v5dlc" aria-label="Hex value"/></div></div> <div class="cp-right svelte-7v5dlc"><div class="cp-palette svelte-7v5dlc"><select class="cp-palette-select svelte-7v5dlc" aria-label="Palette"></select> <div class="cp-swatches svelte-7v5dlc"></div> <div class="cp-palette-actions svelte-7v5dlc"><button type="button" class="cp-palette-btn svelte-7v5dlc" title="Save current color to a palette">+ Save</button> <button type="button" class="cp-palette-btn cp-delete svelte-7v5dlc">Delete</button></div> <!></div></div></div></div>');
function st(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "readonly", 3, !1), a = e.prop(t, "initialMode", 3, "hsv"), s = e.prop(t, "userPalettes", 19, () => []);
  const i = 180, l = 20, g = ie(t.value) ?? "#000000";
  let o = e.state(e.proxy(me(g))), d = g, f = e.state(e.proxy(a()));
  e.user_effect(() => {
    const p = ie(t.value) ?? "#000000";
    p !== d && (e.set(o, me(p), !0), d = p, e.set(N, p.toUpperCase(), !0));
  });
  function h(p) {
    const C = ie(p);
    C && C !== d && (d = C, t.onChange(C));
  }
  function k() {
    h(Ee(e.get(o)));
  }
  let b = e.state(void 0), m = e.state(void 0);
  const u = typeof window < "u" && window.devicePixelRatio || 1;
  function _() {
    if (!e.get(b)) return;
    const p = i, C = i;
    e.get(b).width = p * u, e.get(b).height = C * u, e.get(b).style.width = p + "px", e.get(b).style.height = C + "px";
    const H = e.get(b).getContext("2d"), F = H.createImageData(p * u, C * u), W = F.data;
    for (let Y = 0; Y < C * u; Y++)
      for (let Z = 0; Z < p * u; Z++) {
        const X = Z / u / p * 100, re = (1 - Y / u / C) * 100, $ = ke({ h: e.get(o).h, s: X, v: re }), ce = (Y * p * u + Z) * 4;
        W[ce] = $.r, W[ce + 1] = $.g, W[ce + 2] = $.b, W[ce + 3] = 255;
      }
    H.putImageData(F, 0, 0), c();
  }
  function c() {
    if (!e.get(b)) return;
    const p = e.get(b).getContext("2d"), C = e.get(o).s / 100 * i, H = (1 - e.get(o).v / 100) * i;
    p.save(), p.scale(u, u), p.beginPath(), p.arc(C, H, 6, 0, Math.PI * 2), p.strokeStyle = "#ffffff", p.lineWidth = 2, p.stroke(), p.beginPath(), p.arc(C, H, 7, 0, Math.PI * 2), p.strokeStyle = "#000000", p.lineWidth = 1, p.stroke(), p.restore();
  }
  function v() {
    if (!e.get(m)) return;
    const p = l, C = i;
    e.get(m).width = p * u, e.get(m).height = C * u, e.get(m).style.width = p + "px", e.get(m).style.height = C + "px";
    const H = e.get(m).getContext("2d"), F = H.createImageData(p * u, C * u), W = F.data;
    for (let Y = 0; Y < C * u; Y++) {
      const Z = Y / (C * u) * 360, X = ke({ h: Z, s: 100, v: 100 });
      for (let re = 0; re < p * u; re++) {
        const $ = (Y * p * u + re) * 4;
        W[$] = X.r, W[$ + 1] = X.g, W[$ + 2] = X.b, W[$ + 3] = 255;
      }
    }
    H.putImageData(F, 0, 0), I();
  }
  function I() {
    if (!e.get(m)) return;
    const p = e.get(m).getContext("2d"), C = e.get(o).h / 360 * i;
    p.save(), p.scale(u, u), p.beginPath(), p.moveTo(0, C), p.lineTo(l, C), p.strokeStyle = "#ffffff", p.lineWidth = 2, p.stroke(), p.beginPath(), p.moveTo(0, C), p.lineTo(l, C), p.strokeStyle = "#000000", p.lineWidth = 1, p.stroke(), p.restore();
  }
  ze(() => {
    _(), v();
  });
  let P = e.state(e.proxy(e.get(o).h));
  e.user_effect(() => {
    e.get(o).h !== e.get(P) ? (e.set(P, e.get(o).h, !0), _(), v()) : _();
  });
  let S = e.state(!1), D = e.state(!1);
  function T(p) {
    if (r() || !e.get(b)) return;
    const C = e.get(b).getBoundingClientRect(), H = Math.max(0, Math.min(i, p.clientX - C.left)), F = Math.max(0, Math.min(i, p.clientY - C.top)), W = H / i * 100, Y = (1 - F / i) * 100;
    e.set(o, { h: e.get(o).h, s: Math.round(W), v: Math.round(Y) }, !0);
  }
  function A(p) {
    if (r() || !e.get(m)) return;
    const C = e.get(m).getBoundingClientRect(), F = Math.max(0, Math.min(i, p.clientY - C.top)) / i * 360;
    e.set(o, { h: Math.round(F), s: e.get(o).s, v: e.get(o).v }, !0);
  }
  function V(p) {
    r() || (e.set(S, !0), T(p), window.addEventListener("mousemove", L), window.addEventListener("mouseup", j));
  }
  function M(p) {
    r() || (e.set(D, !0), A(p), window.addEventListener("mousemove", L), window.addEventListener("mouseup", j));
  }
  function L(p) {
    e.get(S) ? T(p) : e.get(D) && A(p);
  }
  function j() {
    (e.get(S) || e.get(D)) && h(Ee(e.get(o))), e.set(S, !1), e.set(D, !1), window.removeEventListener("mousemove", L), window.removeEventListener("mouseup", j);
  }
  const E = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)", R = e.derived(() => `linear-gradient(to right, #ffffff, ${we(ke({ h: e.get(o).h, s: 100, v: e.get(o).v }))})`), z = e.derived(() => `linear-gradient(to right, #000000, ${we(ke({ h: e.get(o).h, s: e.get(o).s, v: 100 }))})`), O = e.derived(() => ke(e.get(o)));
  function G(p) {
    e.set(o, { ...e.get(o), h: +p.target.value }, !0);
  }
  function y(p) {
    e.set(o, { ...e.get(o), s: +p.target.value }, !0);
  }
  function w(p) {
    e.set(o, { ...e.get(o), v: +p.target.value }, !0);
  }
  function U(p) {
    const C = +p.target.value;
    e.set(o, me(we({ r: C, g: e.get(O).g, b: e.get(O).b })), !0);
  }
  function q(p) {
    const C = +p.target.value;
    e.set(o, me(we({ r: e.get(O).r, g: C, b: e.get(O).b })), !0);
  }
  function B(p) {
    const C = +p.target.value;
    e.set(o, me(we({ r: e.get(O).r, g: e.get(O).g, b: C })), !0);
  }
  function x(p) {
    var C;
    e.get(f) !== p && (e.set(f, p, !0), (C = t.onModeChange) == null || C.call(t, p));
  }
  let N = e.state(e.proxy(g.toUpperCase()));
  e.user_effect(() => {
    e.set(N, Ee(e.get(o)).toUpperCase(), !0);
  });
  function J() {
    if (r()) return;
    const p = e.get(N).trim(), C = ie(p);
    if (!C) {
      e.set(N, Ee(e.get(o)).toUpperCase(), !0);
      return;
    }
    e.set(o, me(C), !0), h(C);
  }
  function K(p) {
    p.key === "Enter" && (p.preventDefault(), p.currentTarget.blur());
  }
  const ne = e.derived(() => Ee(e.get(o))), ve = e.derived(() => [...it, ...s()]);
  let ae = e.state(e.proxy(it[0].id));
  const Q = e.derived(() => e.get(ve).find((p) => p.id === e.get(ae)) ?? e.get(ve)[0]);
  function le(p) {
    if (r()) return;
    const C = ie(p);
    C && (e.set(o, me(C), !0), h(C));
  }
  let oe = e.state(!1), de = e.state("");
  function We() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "u-" + Math.random().toString(36).slice(2, 10);
  }
  function Ge() {
    var C, H;
    if (r()) return;
    if ((C = e.get(Q)) != null && C.builtin) {
      e.set(de, ""), e.set(oe, !0);
      return;
    }
    if (!e.get(Q)) return;
    const p = {
      ...e.get(Q),
      colors: [...e.get(Q).colors, e.get(ne)]
    };
    (H = t.onSaveUserPalette) == null || H.call(t, p);
  }
  function xe() {
    var H;
    if (r()) return;
    const p = e.get(de).trim();
    if (!p) return;
    const C = { id: "user-" + We(), label: p, colors: [e.get(ne)] };
    (H = t.onSaveUserPalette) == null || H.call(t, C), e.set(ae, C.id, !0), e.set(oe, !1), e.set(de, "");
  }
  function Ce() {
    e.set(oe, !1), e.set(de, "");
  }
  function Ft() {
    var C;
    if (r() || !e.get(Q) || e.get(Q).builtin) return;
    const p = e.get(Q).id;
    (C = t.onDeleteUserPalette) == null || C.call(t, p), e.set(ae, it[0].id, !0);
  }
  function jt(p) {
    const C = p.target, H = p.shiftKey ? 10 : 1;
    if (C === e.get(b)) {
      if (p.key === "ArrowLeft") {
        p.preventDefault(), e.set(o, { ...e.get(o), s: Math.max(0, e.get(o).s - H) }, !0), k();
        return;
      }
      if (p.key === "ArrowRight") {
        p.preventDefault(), e.set(o, { ...e.get(o), s: Math.min(100, e.get(o).s + H) }, !0), k();
        return;
      }
      if (p.key === "ArrowUp") {
        p.preventDefault(), e.set(o, { ...e.get(o), v: Math.min(100, e.get(o).v + H) }, !0), k();
        return;
      }
      if (p.key === "ArrowDown") {
        p.preventDefault(), e.set(o, { ...e.get(o), v: Math.max(0, e.get(o).v - H) }, !0), k();
        return;
      }
    } else if (C === e.get(m)) {
      if (p.key === "ArrowUp") {
        p.preventDefault(), e.set(o, { ...e.get(o), h: Math.max(0, e.get(o).h - H) }, !0), k();
        return;
      }
      if (p.key === "ArrowDown") {
        p.preventDefault(), e.set(o, { ...e.get(o), h: Math.min(360, e.get(o).h + H) }, !0), k();
        return;
      }
    }
  }
  var Pe = wn();
  let gt;
  var vt = e.child(Pe), Ye = e.child(vt), Xe = e.child(Ye), he = e.child(Xe);
  e.set_attribute(he, "aria-valuemin", 0), e.set_attribute(he, "aria-valuemax", 100), e.bind_this(he, (p) => e.set(b, p), () => e.get(b));
  var ye = e.sibling(he, 2);
  e.set_attribute(ye, "aria-valuemin", 0), e.set_attribute(ye, "aria-valuemax", 360), e.bind_this(ye, (p) => e.set(m, p), () => e.get(m)), e.reset(Xe);
  var Je = e.sibling(Xe, 2), Oe = e.child(Je);
  let ht;
  var Qe = e.sibling(Oe, 2);
  let mt;
  e.reset(Je);
  var pt = e.sibling(Je, 2);
  {
    var Kt = (p) => {
      var C = pn(), H = e.child(C), F = e.sibling(e.child(H), 2);
      e.remove_input_defaults(F), e.set_style(F, "", {}, { "--track-bg": E });
      var W = e.sibling(F, 2), Y = e.child(W);
      e.reset(W), e.reset(H);
      var Z = e.sibling(H, 2), X = e.sibling(e.child(Z), 2);
      e.remove_input_defaults(X);
      let re;
      var $ = e.sibling(X, 2), ce = e.child($);
      e.reset($), e.reset(Z);
      var ue = e.sibling(Z, 2), se = e.sibling(e.child(ue), 2);
      e.remove_input_defaults(se);
      let qe;
      var xt = e.sibling(se, 2), Yt = e.child(xt);
      e.reset(xt), e.reset(ue), e.reset(C), e.template_effect(() => {
        e.set_value(F, e.get(o).h), F.disabled = r(), e.set_text(Y, `${e.get(o).h ?? ""}°`), e.set_value(X, e.get(o).s), X.disabled = r(), re = e.set_style(X, "", re, { "--track-bg": e.get(R) }), e.set_text(ce, `${e.get(o).s ?? ""}%`), e.set_value(se, e.get(o).v), se.disabled = r(), qe = e.set_style(se, "", qe, { "--track-bg": e.get(z) }), e.set_text(Yt, `${e.get(o).v ?? ""}%`);
      }), e.delegated("input", F, G), e.delegated("change", F, k), e.delegated("input", X, y), e.delegated("change", X, k), e.delegated("input", se, w), e.delegated("change", se, k), e.append(p, C);
    }, zt = (p) => {
      var C = bn(), H = e.child(C), F = e.sibling(e.child(H), 2);
      e.remove_input_defaults(F);
      var W = e.sibling(F, 2), Y = e.child(W, !0);
      e.reset(W), e.reset(H);
      var Z = e.sibling(H, 2), X = e.sibling(e.child(Z), 2);
      e.remove_input_defaults(X);
      var re = e.sibling(X, 2), $ = e.child(re, !0);
      e.reset(re), e.reset(Z);
      var ce = e.sibling(Z, 2), ue = e.sibling(e.child(ce), 2);
      e.remove_input_defaults(ue);
      var se = e.sibling(ue, 2), qe = e.child(se, !0);
      e.reset(se), e.reset(ce), e.reset(C), e.template_effect(() => {
        e.set_value(F, e.get(O).r), F.disabled = r(), e.set_text(Y, e.get(O).r), e.set_value(X, e.get(O).g), X.disabled = r(), e.set_text($, e.get(O).g), e.set_value(ue, e.get(O).b), ue.disabled = r(), e.set_text(qe, e.get(O).b);
      }), e.delegated("input", F, U), e.delegated("change", F, k), e.delegated("input", X, q), e.delegated("change", X, k), e.delegated("input", ue, B), e.delegated("change", ue, k), e.append(p, C);
    };
    e.if(pt, (p) => {
      e.get(f) === "hsv" ? p(Kt) : p(zt, -1);
    });
  }
  var bt = e.sibling(pt, 2), _t = e.child(bt);
  let yt;
  var Ie = e.sibling(_t, 2);
  e.remove_input_defaults(Ie), e.reset(bt), e.reset(Ye);
  var kt = e.sibling(Ye, 2), wt = e.child(kt), Se = e.child(wt);
  e.each(Se, 21, () => e.get(ve), (p) => p.id, (p, C) => {
    var H = _n(), F = e.child(H);
    e.reset(H);
    var W = {};
    e.template_effect(() => {
      e.set_text(F, `${e.get(C).label ?? ""}${e.get(C).builtin ? "" : " (user)"}`), W !== (W = e.get(C).id) && (H.value = (H.__value = e.get(C).id) ?? "");
    }), e.append(p, H);
  }), e.reset(Se);
  var Ze = e.sibling(Se, 2);
  e.each(Ze, 21, () => {
    var p;
    return ((p = e.get(Q)) == null ? void 0 : p.colors) ?? [];
  }, e.index, (p, C) => {
    var H = yn();
    let F, W;
    e.template_effect(
      (Y, Z, X) => {
        F = e.set_class(H, 1, "cp-swatch svelte-7v5dlc", null, F, Y), e.set_attribute(H, "title", Z), e.set_attribute(H, "aria-label", X), H.disabled = r(), W = e.set_style(H, "", W, { "background-color": e.get(C) });
      },
      [
        () => ({
          active: e.get(C).toLowerCase() === e.get(ne).toLowerCase()
        }),
        () => e.get(C).toUpperCase(),
        () => e.get(C).toUpperCase()
      ]
    ), e.delegated("click", H, () => le(e.get(C))), e.append(p, H);
  }), e.reset(Ze);
  var $e = e.sibling(Ze, 2), et = e.child($e), tt = e.sibling(et, 2);
  e.reset($e);
  var Wt = e.sibling($e, 2);
  {
    var Gt = (p) => {
      var C = kn(), H = e.child(C);
      e.remove_input_defaults(H);
      var F = e.sibling(H, 2), W = e.sibling(F, 2);
      e.reset(C), e.template_effect((Y) => F.disabled = Y, [() => !e.get(de).trim()]), e.delegated("keydown", H, (Y) => {
        Y.key === "Enter" && xe(), Y.key === "Escape" && Ce();
      }), e.bind_value(H, () => e.get(de), (Y) => e.set(de, Y)), e.delegated("click", F, xe), e.delegated("click", W, Ce), e.append(p, C);
    };
    e.if(Wt, (p) => {
      e.get(oe) && p(Gt);
    });
  }
  e.reset(wt), e.reset(kt), e.reset(vt), e.reset(Pe), e.template_effect(() => {
    var p, C;
    gt = e.set_class(Pe, 1, "cp-surface svelte-7v5dlc", null, gt, { disabled: r() }), e.set_attribute(he, "aria-valuenow", e.get(o).v), e.set_attribute(he, "tabindex", r() ? -1 : 0), e.set_attribute(ye, "aria-valuenow", e.get(o).h), e.set_attribute(ye, "tabindex", r() ? -1 : 0), Oe.disabled = r(), ht = e.set_class(Oe, 1, "svelte-7v5dlc", null, ht, { active: e.get(f) === "hsv" }), Qe.disabled = r(), mt = e.set_class(Qe, 1, "svelte-7v5dlc", null, mt, { active: e.get(f) === "rgb" }), yt = e.set_style(_t, "", yt, { "background-color": e.get(ne) }), Ie.disabled = r(), Se.disabled = r(), et.disabled = r(), tt.disabled = r() || (((p = e.get(Q)) == null ? void 0 : p.builtin) ?? !0), e.set_attribute(tt, "title", (C = e.get(Q)) != null && C.builtin ? "Built-in palettes cannot be deleted" : "Delete palette");
  }), e.delegated("keydown", Pe, jt), e.delegated("mousedown", he, V), e.delegated("mousedown", ye, M), e.delegated("click", Oe, () => x("hsv")), e.delegated("click", Qe, () => x("rgb")), e.event("blur", Ie, J), e.delegated("keydown", Ie, K), e.bind_value(Ie, () => e.get(N), (p) => e.set(N, p)), e.bind_select_value(Se, () => e.get(ae), (p) => e.set(ae, p)), e.delegated("click", et, Ge), e.delegated("click", tt, Ft), e.append(n, Pe), e.pop();
}
e.delegate(["keydown", "mousedown", "click", "input", "change"]);
var xn = e.from_html('<div class="cp-pick-title svelte-1n3y1cm"> </div>'), Cn = e.from_html("<!> <!>", 1);
function Pn(n, t) {
  e.push(t, !0);
  let r = e.state(e.proxy(t.initial)), a = !1, s = !1, i = !1;
  function l(b) {
    i || (i = !0, t.onResolve(b));
  }
  function g(b) {
    b.key === "Escape" && (a = !0);
  }
  ze(() => {
    document.addEventListener("keydown", g, !0);
  }), Ut(() => {
    document.removeEventListener("keydown", g, !0), l(In({
      escapePressed: a,
      userTouched: s,
      currentValue: e.get(r)
    }));
  });
  function o(b) {
    s = !0, e.set(r, b, !0);
  }
  var d = Cn(), f = e.first_child(d);
  {
    var h = (b) => {
      var m = xn(), u = e.child(m, !0);
      e.reset(m), e.template_effect(() => e.set_text(u, t.title)), e.append(b, m);
    };
    e.if(f, (b) => {
      t.title && b(h);
    });
  }
  var k = e.sibling(f, 2);
  st(k, {
    get value() {
      return e.get(r);
    },
    initialMode: "hsv",
    get userPalettes() {
      return t.userPalettes;
    },
    onChange: o,
    onModeChange: () => {
    },
    get onSaveUserPalette() {
      return t.onSaveUserPalette;
    },
    get onDeleteUserPalette() {
      return t.onDeleteUserPalette;
    }
  }), e.append(n, d), e.pop();
}
function In(n) {
  return n.escapePressed || !n.userTouched ? null : n.currentValue;
}
function Sn(n) {
  return n && /^#[0-9a-f]{6}$/i.test(n) ? n : "#000000";
}
function Tn(n, t) {
  return new Promise((r) => {
    const a = n.anchor ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    Ve.popup.show(
      Pn,
      { anchor: a },
      {
        initial: Sn(n.initial),
        title: n.title,
        userPalettes: t.userPalettes,
        onSaveUserPalette: t.onSaveUserPalette,
        onDeleteUserPalette: t.onDeleteUserPalette,
        onResolve: r
      }
    );
  });
}
const En = "sh3-editor.color-panel";
function An(n, t, r, a) {
  if (t) return { kind: "entry", entry: t };
  const s = r.find((i) => i.slotId === n);
  return s ? { kind: "descriptor", descriptor: s } : {
    kind: "adhoc",
    adHocValue: a == null ? void 0 : a.value,
    adHocReadonly: (a == null ? void 0 : a.readonly) ?? !1
  };
}
let Rt = /* @__PURE__ */ new Map();
function Pt(n) {
  const t = [...n].sort((a, s) => {
    const i = a.priority ?? 10, l = s.priority ?? 10;
    return i !== l ? l - i : 0;
  }), r = /* @__PURE__ */ new Map();
  for (const a of t)
    r.has(a.type) || r.set(a.type, a);
  Rt = r;
}
function Dn(n) {
  if (n === null || typeof n != "object") return !1;
  const t = Object.getPrototypeOf(n);
  return t === Object.prototype || t === null;
}
function It(n) {
  var t;
  return ((t = Rt.get(n)) == null ? void 0 : t.component) ?? null;
}
function Mn(n, t) {
  if (t != null && t.type) {
    const r = It(t.type);
    if (r) return { kind: "custom", component: r };
  }
  if (n !== null && typeof n == "object" && typeof n.__type == "string") {
    const r = It(n.__type);
    if (r) return { kind: "custom", component: r };
  }
  return Dn(n) || Array.isArray(n) ? { kind: "walker" } : { kind: "leaf" };
}
let Bt = null;
function St(n) {
  Bt = n;
}
function Nn() {
  return Bt;
}
const Vt = "sh3-editor:help.tabs";
function te(n) {
  return n.ctrlKey || n.metaKey;
}
function Hn(n, t, r, a, s = 2) {
  const i = " ".repeat(s);
  if (t === r && !a)
    return {
      content: n.slice(0, t) + i + n.slice(r),
      selectionStart: t + i.length,
      selectionEnd: t + i.length
    };
  const l = n.lastIndexOf(`
`, t - 1) + 1, g = n.slice(l, r).split(`
`);
  let o = t, d = r;
  const f = g.map((k, b) => {
    var m;
    if (a) {
      const u = ((m = k.match(new RegExp(`^ {1,${s}}`))) == null ? void 0 : m[0].length) ?? 0;
      return b === 0 && (o = Math.max(l, t - u)), d -= u, k.slice(u);
    } else
      return b === 0 && (o = t + i.length), d += i.length, i + k;
  });
  return { content: n.slice(0, l) + f.join(`
`) + n.slice(l + g.join(`
`).length), selectionStart: o, selectionEnd: d };
}
function Un(n, t, r, a, s = 2, i = "inline") {
  if (a === "none") return null;
  const l = n.lastIndexOf(`
`, t - 1) + 1, o = n.slice(l, t).match(/^[ \t]*/)[0], d = " ".repeat(s);
  if (a === "indent") {
    const u = `
` + o;
    return {
      content: n.slice(0, t) + u + n.slice(r),
      selectionStart: t + u.length,
      selectionEnd: t + u.length
    };
  }
  const f = t > 0 ? n[t - 1] : "", h = r < n.length ? n[r] : "", k = f === "{";
  if (k && h === "}") {
    if (i === "inline") {
      const P = `
` + o + d + `
` + o, S = t + 1 + o.length + d.length;
      return {
        content: n.slice(0, t) + P + n.slice(r),
        selectionStart: S,
        selectionEnd: S
      };
    }
    const u = n.slice(0, t - 1), _ = n.slice(r), c = `
` + o + `{
` + o + d + `
` + o, v = u + c + _, I = u.length + (`
` + o + `{
` + o + d).length;
    return { content: v, selectionStart: I, selectionEnd: I };
  }
  if (k) {
    const u = `
` + o + d;
    return {
      content: n.slice(0, t) + u + n.slice(r),
      selectionStart: t + u.length,
      selectionEnd: t + u.length
    };
  }
  const m = `
` + o;
  return {
    content: n.slice(0, t) + m + n.slice(r),
    selectionStart: t + m.length,
    selectionEnd: t + m.length
  };
}
function Rn(n, t, r, a = 2) {
  if (t !== r) return null;
  const s = n.lastIndexOf(`
`, t - 1) + 1, i = n.slice(s, t);
  if (!/^[ \t]*$/.test(i)) return null;
  let l = 0, g = -1;
  for (let h = s - 1; h >= 0; h--) {
    const k = n[h];
    if (k === "}") l++;
    else if (k === "{") {
      if (l === 0) {
        g = h;
        break;
      }
      l--;
    }
  }
  let o;
  if (g === -1) {
    const h = Math.max(0, i.length - a);
    o = i.slice(0, h);
  } else {
    const h = n.lastIndexOf(`
`, g - 1) + 1;
    o = n.slice(h, g).match(/^[ \t]*/)[0];
  }
  if (o.length >= i.length) return null;
  const d = n.slice(0, s) + o + "}" + n.slice(r), f = s + o.length + 1;
  return { content: d, selectionStart: f, selectionEnd: f };
}
var Bn = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), Vn = e.from_html("<button><!> </button>"), Ln = e.from_html("<!> <!>", 1), On = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), qn = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function ut(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "filePath", 3, null), a = e.derived(() => {
    const g = [], o = /* @__PURE__ */ new Map();
    for (const d of t.actions) {
      const f = d.group ?? "_default";
      if (!o.has(f)) {
        const h = [];
        o.set(f, h), g.push({ key: f, items: h });
      }
      o.get(f).push(d);
    }
    return g;
  });
  var s = e.comment(), i = e.first_child(s);
  {
    var l = (g) => {
      var o = qn(), d = e.child(o);
      e.each(d, 17, () => e.get(a), e.index, (k, b, m) => {
        var u = Ln(), _ = e.first_child(u);
        {
          var c = (I) => {
            var P = Bn();
            e.append(I, P);
          };
          e.if(_, (I) => {
            m > 0 && I(c);
          });
        }
        var v = e.sibling(_, 2);
        e.each(v, 17, () => e.get(b).items, (I) => I.id, (I, P) => {
          var S = Vn();
          let D;
          var T = e.child(S);
          {
            var A = (M) => {
              var L = e.text();
              e.template_effect(() => e.set_text(L, e.get(P).icon)), e.append(M, L);
            };
            e.if(T, (M) => {
              e.get(P).icon && M(A);
            });
          }
          var V = e.sibling(T, 1, !0);
          e.reset(S), e.template_effect(() => {
            D = e.set_class(S, 1, "toolbar-btn svelte-10sr5yt", null, D, { "toolbar-accent": e.get(P).accent }), S.disabled = e.get(P).disabled, e.set_attribute(S, "title", e.get(P).shortcut ? `${e.get(P).label} (${e.get(P).shortcut})` : e.get(P).label), e.set_text(V, e.get(P).label);
          }), e.delegated("click", S, function(...M) {
            var L;
            (L = e.get(P).onAction) == null || L.apply(this, M);
          }), e.append(I, S);
        }), e.append(k, u);
      });
      var f = e.sibling(d, 2);
      {
        var h = (k) => {
          var b = On(), m = e.sibling(e.first_child(b), 2), u = e.child(m, !0);
          e.reset(m), e.template_effect(
            (_) => {
              e.set_attribute(m, "title", r()), e.set_text(u, _);
            },
            [() => r().split(/[/\\]/).pop()]
          ), e.append(k, b);
        };
        e.if(f, (k) => {
          r() && k(h);
        });
      }
      e.reset(o), e.append(g, o);
    };
    e.if(i, (g) => {
      (t.actions.length > 0 || r()) && g(l);
    });
  }
  e.append(n, s), e.pop();
}
e.delegate(["click"]);
var Fn = e.from_html('<div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Brace style</span> <div class="seg svelte-1etykqv"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), jn = e.from_html('<div class="body svelte-1etykqv"><h2 class="svelte-1etykqv">Editor settings</h2> <div class="rows svelte-1etykqv"><div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Indent unit</span> <div class="seg svelte-1etykqv"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1etykqv"><button type="button" class="secondary svelte-1etykqv">Close</button></div></div>');
function Kn(n, t) {
  e.push(t, !0);
  let r = e.proxy({ ...t.prefs });
  function a(c) {
    r.indentUnit = c, t.onChange({ ...r });
  }
  function s(c) {
    r.braceStyle = c, t.onChange({ ...r });
  }
  var i = jn(), l = e.sibling(e.child(i), 2), g = e.child(l), o = e.sibling(e.child(g), 2), d = e.child(o);
  let f;
  var h = e.sibling(d, 2);
  let k;
  e.reset(o), e.reset(g);
  var b = e.sibling(g, 2);
  {
    var m = (c) => {
      var v = Fn(), I = e.sibling(e.child(v), 2), P = e.child(I);
      let S;
      var D = e.sibling(P, 2);
      let T;
      e.reset(I), e.reset(v), e.template_effect(() => {
        S = e.set_class(P, 1, "svelte-1etykqv", null, S, { active: (r.braceStyle ?? "inline") === "inline" }), T = e.set_class(D, 1, "svelte-1etykqv", null, T, { active: (r.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", P, () => s("inline")), e.delegated("click", D, () => s("allman")), e.append(c, v);
    };
    e.if(b, (c) => {
      t.indentType === "brace" && c(m);
    });
  }
  e.reset(l);
  var u = e.sibling(l, 2), _ = e.child(u);
  e.reset(u), e.reset(i), e.template_effect(() => {
    f = e.set_class(d, 1, "svelte-1etykqv", null, f, { active: (r.indentUnit ?? 2) === 2 }), k = e.set_class(h, 1, "svelte-1etykqv", null, k, { active: (r.indentUnit ?? 2) === 4 });
  }), e.delegated("click", d, () => a(2)), e.delegated("click", h, () => a(4)), e.delegated("click", _, function(...c) {
    var v;
    (v = t.close) == null || v.apply(this, c);
  }), e.append(n, i), e.pop();
}
e.delegate(["click"]);
var zn = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), Wn = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function Gn(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "entry", 7), a = e.prop(t, "fontSize", 3, 13), s = e.prop(t, "toolbarActions", 19, () => []), i = e.derived(() => r().document), l = e.state(e.proxy(e.get(i).content)), g = e.derived(() => {
    var x, N;
    return ((x = t.matchingConfig) == null ? void 0 : x.indentType) ?? ((N = t.matchingConfig) != null && N.indentBased ? "indent" : "none");
  }), o = e.derived(() => e.get(g) === "none" ? 0 : e.get(g) === "brace" ? 2 : 1), d = e.derived(() => (t.showSettings ?? !0) && e.get(o) > 0);
  const f = 300, h = (x, N) => {
    e.set(l, x, !0), e.get(i).content = x, e.get(i).cursorStart = N, e.get(i).cursorEnd = N, t.internals.contentChange.emit(e.get(i).id, x), T(N, N);
  };
  function k() {
    Ve.modal.open(Kn, {
      indentType: e.get(g),
      prefs: r().prefs,
      onChange: m
    });
  }
  let b = e.derived(() => {
    if (!e.get(d)) return s();
    const x = {
      id: "sh3-editor:toolbar",
      label: "Settings",
      icon: "⚙",
      onAction: k,
      group: "_editor_builtin"
    };
    return [...s(), x];
  });
  function m(x) {
    r().prefs = { ...r().prefs, ...x }, t.internals.prefsChange.emit(r().document.id, { ...r().prefs });
  }
  e.user_effect(() => {
    e.set(l, e.get(i).content, !0);
  });
  let u = e.state(void 0), _ = e.state(0), c = e.state(0), v = e.derived(() => t.highlight && e.get(i).language ? t.highlight(e.get(l), e.get(i).language) : S(e.get(l))), I = e.derived(() => e.get(l).split(`
`).length), P = e.derived(() => Array.from({ length: e.get(I) }, (x, N) => N + 1));
  function S(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function D(x, N, J) {
    var xe, Ce;
    e.set(l, x, !0);
    const K = e.get(i).id, ne = e.get(i).content;
    if (ne === x) return;
    const ve = e.get(i).cursorStart;
    e.get(i).content = x, e.get(i).cursorStart = N, e.get(i).cursorEnd = J;
    const ae = t.internals.history(K), Q = Date.now(), le = ae.peek(), oe = ((xe = le == null ? void 0 : le.meta) == null ? void 0 : xe.kind) === "text-swap" ? le.meta.snapshot : void 0, de = Math.abs(x.length - ne.length) <= 1, We = oe && ((Ce = le == null ? void 0 : le.meta) == null ? void 0 : Ce.timestamp) != null && Q - le.meta.timestamp < f;
    oe && de && We ? ae.replaceTop(je({
      setter: h,
      before: oe.before,
      after: x,
      cursorBefore: oe.cursorBefore,
      cursorAfter: N,
      now: Q
    })) : ae.push(je({
      setter: h,
      before: ne,
      after: x,
      cursorBefore: ve,
      cursorAfter: N,
      now: Q
    }));
    const Ge = e.get(i).dirty;
    e.get(i).dirty = !0, t.internals.contentChange.emit(K, x), Ge || t.internals.dirtyChange.emit(K, !0);
  }
  function T(x, N) {
    requestAnimationFrame(() => {
      e.get(u) && (e.get(u).selectionStart = x, e.get(u).selectionEnd = N);
    });
  }
  function A(x) {
    var N;
    if (x.key === "s" && te(x)) {
      x.preventDefault(), t.internals.emitSave(e.get(i).id);
      return;
    }
    if (x.key.toLowerCase() === "z" && te(x) && !x.shiftKey) {
      x.preventDefault(), t.internals.history(e.get(i).id).undo();
      return;
    }
    if (x.key.toLowerCase() === "y" && te(x) || x.key.toLowerCase() === "z" && te(x) && x.shiftKey) {
      x.preventDefault(), t.internals.history(e.get(i).id).redo();
      return;
    }
    if (x.key === "Enter" && !x.shiftKey && !te(x) && !x.altKey) {
      if (e.get(g) === "none") return;
      const J = x.currentTarget, K = Un(e.get(l), J.selectionStart, J.selectionEnd, e.get(g), r().prefs.indentUnit, r().prefs.braceStyle);
      K && (x.preventDefault(), D(K.content, K.selectionStart, K.selectionEnd), T(K.selectionStart, K.selectionEnd));
      return;
    }
    if (x.key === "}" && e.get(g) === "brace" && !te(x) && !x.altKey) {
      const J = x.currentTarget, K = Rn(e.get(l), J.selectionStart, J.selectionEnd, r().prefs.indentUnit);
      if (K) {
        x.preventDefault(), D(K.content, K.selectionStart, K.selectionEnd), T(K.selectionStart, K.selectionEnd);
        return;
      }
    }
    if (x.key === "Tab") {
      x.preventDefault();
      const J = x.currentTarget, K = Hn(e.get(l), J.selectionStart, J.selectionEnd, x.shiftKey, (N = t.matchingConfig) == null ? void 0 : N.indentUnit);
      K && (D(K.content, K.selectionStart, K.selectionEnd), T(K.selectionStart, K.selectionEnd));
      return;
    }
  }
  function V(x) {
    const N = x.currentTarget;
    D(N.value, N.selectionStart, N.selectionEnd);
  }
  function M(x) {
    const N = x.currentTarget;
    e.set(_, N.scrollTop, !0), e.set(c, N.scrollLeft, !0);
  }
  function L() {
    e.get(u) && (e.get(i).cursorStart = e.get(u).selectionStart, e.get(i).cursorEnd = e.get(u).selectionEnd);
  }
  var j = Wn(), E = e.child(j);
  ut(E, {
    get actions() {
      return e.get(b);
    },
    get filePath() {
      return e.get(i).filePath;
    }
  });
  var R = e.sibling(E, 2);
  let z;
  var O = e.child(R), G = e.child(O);
  let y;
  e.each(G, 20, () => e.get(P), (x) => x, (x, N) => {
    var J = zn(), K = e.child(J, !0);
    e.reset(J), e.template_effect(() => e.set_text(K, N)), e.append(x, J);
  }), e.reset(G), e.reset(O);
  var w = e.sibling(O, 2), U = e.child(w);
  let q;
  e.html(U, () => e.get(v) + `
`, !0), e.reset(U);
  var B = e.sibling(U, 2);
  e.remove_textarea_child(B), e.set_attribute(B, "spellcheck", !1), e.bind_this(B, (x) => e.set(u, x), () => e.get(u)), e.reset(w), e.reset(R), e.reset(j), e.template_effect(() => {
    z = e.set_style(R, "", z, { "--editor-font-size": `${a() ?? ""}px` }), y = e.set_style(G, "", y, { transform: `translateY(-${e.get(_) ?? ""}px)` }), q = e.set_style(U, "", q, {
      top: `-${e.get(_) ?? ""}px`,
      left: `-${e.get(c) ?? ""}px`
    }), e.set_value(B, e.get(l));
  }), e.delegated("keydown", B, A), e.delegated("input", B, V), e.event("scroll", B, M), e.event("select", B, L), e.append(n, j), e.pop();
}
e.delegate(["keydown", "input"]);
function Lt(n, t, r, a) {
  return n && n(t, r) === !0 ? !0 : (a(), !1);
}
var Yn = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function at(n, t) {
  let r = e.prop(t, "readonly", 3, !1);
  var a = Yn();
  let s;
  var i = e.child(a), l = e.child(i, !0);
  e.reset(i);
  var g = e.sibling(i, 2), o = e.child(g);
  e.snippet(o, () => t.children), e.reset(g), e.reset(a), e.template_effect(() => {
    s = e.set_class(a, 1, "field svelte-2gtehg", null, s, { readonly: r() }), e.set_text(l, t.label);
  }), e.append(n, a);
}
var Xn = e.from_html('<input type="checkbox"/>'), Jn = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function Qn(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "readonly", 3, !1), a = e.state(e.proxy(s(t.value)));
  e.user_effect(() => {
    e.set(a, s(t.value), !0);
  });
  function s(m) {
    return m === null ? "null" : m === void 0 ? "" : typeof m == "boolean" ? m ? "true" : "false" : String(m);
  }
  function i(m, u) {
    if (u === "boolean") return m === "true";
    if (u === "number") {
      const _ = Number(m);
      return Number.isFinite(_) ? _ : t.value;
    }
    return m;
  }
  let l = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function g() {
    if (r() || !t.onCommit) return;
    const m = i(e.get(a), e.get(l));
    m !== null && m !== t.value && t.onCommit(m);
  }
  function o(m) {
    if (r() || !t.onCommit) return;
    const u = m.target.checked;
    u !== t.value && t.onCommit(u);
  }
  function d(m) {
    m.key === "Enter" ? m.currentTarget.blur() : m.key === "Escape" && (e.set(a, s(t.value), !0), m.currentTarget.blur());
  }
  var f = e.comment(), h = e.first_child(f);
  {
    var k = (m) => {
      var u = Xn();
      e.remove_input_defaults(u), e.template_effect(
        (_) => {
          e.set_checked(u, _), u.disabled = r();
        },
        [() => !!t.value]
      ), e.delegated("change", u, o), e.append(m, u);
    }, b = (m) => {
      var u = Jn();
      e.remove_input_defaults(u), e.template_effect(() => {
        e.set_attribute(u, "type", e.get(l) === "number" ? "number" : "text"), u.disabled = r();
      }), e.event("blur", u, g), e.delegated("keydown", u, d), e.bind_value(u, () => e.get(a), (_) => e.set(a, _)), e.append(m, u);
    };
    e.if(h, (m) => {
      e.get(l) === "boolean" ? m(k) : m(b, -1);
    });
  }
  e.append(n, f), e.pop();
}
e.delegate(["change", "keydown"]);
var Zn = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function $n(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "basePath", 19, () => []);
  function a(d) {
    return d == null || typeof d == "string" || typeof d == "number" || typeof d == "boolean";
  }
  function s(d, f, h) {
    const k = d[f], b = {
      apply() {
        d[f] = h;
      },
      revert() {
        d[f] = k;
      },
      meta: { kind: "walker-edit", label: String(f) }
    };
    t.api.push(b), d[f] = h;
  }
  function i(d) {
    return (f) => {
      Lt(t.walkerOnCommit, [...r(), d], f, () => s(t.value, d, f));
    };
  }
  function l(d) {
    return (f) => s(t.value, d, f);
  }
  let g = e.derived(() => Array.isArray(t.value) ? t.value.map((d, f) => {
    var h;
    return { key: f, child: d, fieldMeta: (h = t.meta) == null ? void 0 : h.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((d) => {
    var f, h;
    return {
      key: d,
      child: t.value[d],
      fieldMeta: (h = (f = t.meta) == null ? void 0 : f.fields) == null ? void 0 : h[d]
    };
  }) : []);
  var o = Zn();
  e.each(o, 21, () => e.get(g), (d) => d.key, (d, f) => {
    var h = e.comment(), k = e.first_child(h);
    {
      var b = (m) => {
        const u = e.derived(() => {
          var T;
          return ((T = e.get(f).fieldMeta) == null ? void 0 : T.label) ?? (typeof e.get(f).key == "number" ? `[${e.get(f).key}]` : String(e.get(f).key));
        }), _ = e.derived(() => {
          var T;
          return (((T = e.get(f).fieldMeta) == null ? void 0 : T.readonly) ?? !1) || t.api.readonly;
        });
        var c = e.comment(), v = e.first_child(c);
        {
          var I = (T) => {
            at(T, {
              get label() {
                return e.get(u);
              },
              get readonly() {
                return e.get(_);
              },
              children: (A, V) => {
                {
                  let M = e.derived(() => e.get(_) ? void 0 : l(e.get(f).key)), L = e.derived(() => [...r(), e.get(f).key]);
                  ot(A, {
                    get value() {
                      return e.get(f).child;
                    },
                    get meta() {
                      return e.get(f).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(M);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(L);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, P = (T) => {
            at(T, {
              get label() {
                return e.get(u);
              },
              get readonly() {
                return e.get(_);
              },
              children: (A, V) => {
                {
                  let M = e.derived(() => e.get(_) ? void 0 : i(e.get(f).key));
                  Qn(A, {
                    get value() {
                      return e.get(f).child;
                    },
                    get readonly() {
                      return e.get(_);
                    },
                    get onCommit() {
                      return e.get(M);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, S = e.derived(() => a(e.get(f).child)), D = (T) => {
            at(T, {
              get label() {
                return e.get(u);
              },
              get readonly() {
                return e.get(_);
              },
              children: (A, V) => {
                {
                  let M = e.derived(() => e.get(_) ? void 0 : l(e.get(f).key)), L = e.derived(() => [...r(), e.get(f).key]);
                  ot(A, {
                    get value() {
                      return e.get(f).child;
                    },
                    get meta() {
                      return e.get(f).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(M);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(L);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          };
          e.if(v, (T) => {
            var A;
            (A = e.get(f).fieldMeta) != null && A.type ? T(I) : e.get(S) ? T(P, 1) : T(D, -1);
          });
        }
        e.append(m, c);
      };
      e.if(k, (m) => {
        var u;
        (u = e.get(f).fieldMeta) != null && u.hidden || m(b);
      });
    }
    e.append(d, h);
  }), e.reset(o), e.append(n, o), e.pop();
}
var er = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function tr(n, t) {
  function r(i) {
    if (i === null) return "null";
    if (i === void 0) return "undefined";
    if (typeof i == "string") return `"${i}"`;
    if (typeof i == "number" || typeof i == "boolean") return String(i);
    try {
      return JSON.stringify(i);
    } catch {
      return String(i);
    }
  }
  var a = er(), s = e.child(a, !0);
  e.reset(a), e.template_effect((i) => e.set_text(s, i), [() => r(t.value)]), e.append(n, a);
}
function ot(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "basePath", 19, () => []), a = e.derived(() => Mn(t.value, t.meta)), s = e.derived(() => {
    const h = t.onCommit, k = t.walkerOnCommit;
    if (h !== void 0)
      return k === void 0 ? h : (b) => {
        Lt(k, r(), b, () => h(b));
      };
  });
  var i = e.comment(), l = e.first_child(i);
  {
    var g = (h) => {
    }, o = (h) => {
      const k = e.derived(() => e.get(a).component);
      var b = e.comment(), m = e.first_child(b);
      e.component(m, () => e.get(k), (u, _) => {
        _(u, {
          get value() {
            return t.value;
          },
          get meta() {
            return t.meta;
          },
          get api() {
            return t.api;
          },
          get onCommit() {
            return e.get(s);
          }
        });
      }), e.append(h, b);
    }, d = (h) => {
      $n(h, {
        get value() {
          return t.value;
        },
        get meta() {
          return t.meta;
        },
        get api() {
          return t.api;
        },
        get walkerOnCommit() {
          return t.walkerOnCommit;
        },
        get basePath() {
          return r();
        }
      });
    }, f = (h) => {
      tr(h, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(l, (h) => {
      var k;
      (k = t.meta) != null && k.hidden ? h(g) : e.get(a).kind === "custom" ? h(o, 1) : e.get(a).kind === "walker" ? h(d, 2) : h(f, -1);
    });
  }
  e.append(n, i), e.pop();
}
var nr = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function rr(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "adHocReadonly", 3, !1), a = e.derived(() => t.internals.inspectors.get(t.instanceId)), s = e.derived(() => e.get(a) ? e.get(a).value : t.adHocValue), i = e.derived(() => e.get(a) ? e.get(a).meta : t.adHocMeta), l = e.derived(() => e.get(a) ? !!e.get(a).options.readonly : r()), g = e.derived(() => e.get(a) ? e.get(a).options.onCommit : void 0), o = e.derived(() => {
    var v;
    return ((v = e.get(a)) == null ? void 0 : v.options.toolbarActions) ?? [];
  });
  const d = t.internals.history(t.instanceId), f = {
    push(v) {
      e.get(l) || (d.push(v), t.internals.inspectorValueChange.emit(t.instanceId, e.get(s)));
    },
    get readonly() {
      return e.get(l);
    },
    history: d
  };
  e.user_effect(() => {
    const v = d.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(s));
    });
    return () => v();
  });
  let h = e.state(void 0);
  function k(v) {
    if (v.key.toLowerCase() === "z" && te(v) && !v.shiftKey) {
      v.preventDefault(), d.undo();
      return;
    }
    if (v.key.toLowerCase() === "y" && te(v) || v.key.toLowerCase() === "z" && te(v) && v.shiftKey) {
      v.preventDefault(), d.redo();
      return;
    }
  }
  var b = nr(), m = e.child(b);
  {
    var u = (v) => {
      ut(v, {
        get actions() {
          return e.get(o);
        },
        filePath: null
      });
    };
    e.if(m, (v) => {
      e.get(o).length > 0 && v(u);
    });
  }
  var _ = e.sibling(m, 2), c = e.child(_);
  ot(c, {
    get value() {
      return e.get(s);
    },
    get meta() {
      return e.get(i);
    },
    get api() {
      return f;
    },
    get walkerOnCommit() {
      return e.get(g);
    },
    basePath: []
  }), e.reset(_), e.reset(b), e.bind_this(b, (v) => e.set(h, v), () => e.get(h)), e.delegated("keydown", b, k), e.append(n, b), e.pop();
}
e.delegate(["keydown"]);
var ir = e.from_html('<div role="region" aria-label="Color picker"><div class="cp-compact-row svelte-f5c5rv"><div class="cp-preview cp-compact-preview svelte-f5c5rv" role="button" aria-label="Open full color picker" aria-haspopup="true"></div> <input type="text" class="cp-hex-input cp-compact-hex svelte-f5c5rv" aria-label="Hex value"/></div></div>'), ar = e.from_html('<div tabindex="-1" role="region" aria-label="Color picker"><!> <!></div>');
function Ot(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "adHocReadonly", 3, !1), a = e.prop(t, "userPalettes", 19, () => []), s = e.prop(t, "prefs", 19, () => ({ mode: "hsv" })), i = e.prop(t, "compact", 3, !1), l = e.derived(() => t.internals.colorPickers.get(t.instanceId)), g = e.derived(() => {
    var E;
    return ((E = e.get(l)) == null ? void 0 : E.options.toolbarActions) ?? [];
  }), o = e.state(e.proxy(t.descriptorBinding ? ie(t.descriptorBinding.initial) ?? "#000000" : "#000000")), d = e.derived(() => e.get(l) ? e.get(l).value : t.descriptorBinding ? e.get(o) : ie(t.adHocValue ?? "") ?? "#000000"), f = e.derived(() => e.get(l) ? !!e.get(l).options.readonly : r());
  const h = t.internals.history(t.instanceId);
  function k(E) {
    if (e.get(f)) return;
    const R = ie(E);
    if (!R) return;
    if (t.onExternalCommit) {
      t.onExternalCommit(R);
      return;
    }
    const z = e.get(d);
    if (z === R) return;
    const O = (G) => {
      e.get(l) ? e.get(l).value = G : t.descriptorBinding && e.set(o, G, !0);
    };
    h.push({
      apply: () => O(R),
      revert: () => O(z),
      meta: { kind: "color", timestamp: Date.now() }
    }), O(R), t.internals.colorPickerValueChange.emit(t.instanceId, R), t.descriptorBinding && !e.get(l) && t.descriptorBinding.onChange(R);
  }
  e.user_effect(() => {
    const E = h.onChange(() => {
      t.internals.colorPickerValueChange.emit(t.instanceId, e.get(d)), t.descriptorBinding && !e.get(l) && t.descriptorBinding.onChange(e.get(d));
    });
    return () => E();
  });
  function b(E) {
    t.internals.colorPickerPrefsChange.emit(t.instanceId, { mode: E });
  }
  const m = e.derived(() => /^#[0-9a-f]{6}$/i.test(e.get(d)) ? e.get(d).toUpperCase() : e.get(d));
  let u = e.state(e.proxy(e.get(m)));
  e.user_effect(() => {
    e.set(u, e.get(m), !0);
  });
  function _() {
    if (e.get(f)) return;
    const E = ie(e.get(u).trim());
    if (!E) {
      e.set(u, e.get(m), !0);
      return;
    }
    k(E);
  }
  function c(E) {
    E.key === "Enter" && (E.preventDefault(), E.currentTarget.blur());
  }
  let v = e.state(void 0);
  function I() {
    e.get(f) || !e.get(v) || Ve.popup.show(st, { anchor: e.get(v) }, {
      value: e.get(d),
      readonly: e.get(f),
      initialMode: s().mode,
      userPalettes: a(),
      onChange: (E) => k(E),
      onModeChange: b,
      onSaveUserPalette: t.onSaveUserPalette,
      onDeleteUserPalette: t.onDeleteUserPalette
    });
  }
  function P(E) {
    (E.key === "Enter" || E.key === " ") && (E.preventDefault(), I());
  }
  let S = e.state(void 0);
  function D(E) {
    if (E.key.toLowerCase() === "z" && te(E) && !E.shiftKey) {
      E.preventDefault(), h.undo();
      return;
    }
    if (E.key.toLowerCase() === "y" && te(E) || E.key.toLowerCase() === "z" && te(E) && E.shiftKey) {
      E.preventDefault(), h.redo();
      return;
    }
  }
  let T = !1;
  function A(E) {
    if (T || !t.descriptorBinding || e.get(
      l
      // descriptor mode only
    )) return;
    const R = ie(E) ?? "#000000", z = e.get(o);
    z !== R && (h.push({
      apply: () => {
        e.set(o, R, !0);
      },
      revert: () => {
        e.set(o, z, !0);
      },
      meta: { kind: "color", timestamp: Date.now(), source: "controller" }
    }), e.set(o, R, !0));
  }
  ze(() => {
    var E, R;
    if (t.descriptorBinding)
      return (R = (E = t.descriptorBinding).bind) == null || R.call(E, { setValue: A }), () => {
        T = !0;
      };
  });
  var V = e.comment(), M = e.first_child(V);
  {
    var L = (E) => {
      var R = ir();
      let z;
      var O = e.child(R), G = e.child(O);
      let y;
      e.bind_this(G, (U) => e.set(v, U), () => e.get(v));
      var w = e.sibling(G, 2);
      e.remove_input_defaults(w), e.reset(O), e.reset(R), e.template_effect(() => {
        z = e.set_class(R, 1, "cp-compact svelte-f5c5rv", null, z, { disabled: e.get(f) }), e.set_attribute(G, "tabindex", e.get(f) ? -1 : 0), y = e.set_style(G, "", y, { "background-color": e.get(d) }), w.disabled = e.get(f);
      }), e.delegated("click", G, I), e.delegated("keydown", G, P), e.event("blur", w, _), e.delegated("keydown", w, c), e.bind_value(w, () => e.get(u), (U) => e.set(u, U)), e.append(E, R);
    }, j = (E) => {
      var R = ar();
      let z;
      var O = e.child(R);
      {
        var G = (w) => {
          ut(w, {
            get actions() {
              return e.get(g);
            },
            filePath: null
          });
        };
        e.if(O, (w) => {
          e.get(g).length > 0 && w(G);
        });
      }
      var y = e.sibling(O, 2);
      st(y, {
        get value() {
          return e.get(d);
        },
        get readonly() {
          return e.get(f);
        },
        get initialMode() {
          return s().mode;
        },
        get userPalettes() {
          return a();
        },
        onChange: k,
        onModeChange: b,
        get onSaveUserPalette() {
          return t.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return t.onDeleteUserPalette;
        }
      }), e.reset(R), e.bind_this(R, (w) => e.set(S, w), () => e.get(S)), e.template_effect(() => z = e.set_class(R, 1, "cp svelte-f5c5rv", null, z, { disabled: e.get(f) })), e.delegated("keydown", R, D), e.append(E, R);
    };
    e.if(M, (E) => {
      i() ? E(L) : E(j, -1);
    });
  }
  e.append(n, V), e.pop();
}
e.delegate(["click", "keydown"]);
var lr = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>'), sr = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>');
function or(n, t) {
  e.push(t, !0);
  const r = Nn();
  let a = e.derived(() => typeof t.value == "string" ? t.value : null);
  var s = e.comment(), i = e.first_child(s);
  {
    var l = (d) => {
      var f = lr(), h = e.child(f, !0);
      e.reset(f), e.template_effect((k) => e.set_text(h, k), [() => String(t.value)]), e.append(d, f);
    }, g = (d) => {
      var f = sr(), h = e.child(f, !0);
      e.reset(f), e.template_effect(() => e.set_text(h, e.get(a))), e.append(d, f);
    }, o = (d) => {
      Ot(d, {
        instanceId: "inspector-color",
        get internals() {
          return r.internals;
        },
        compact: !0,
        get adHocValue() {
          return e.get(a);
        },
        get adHocReadonly() {
          return t.api.readonly;
        },
        get userPalettes() {
          return r.userPalettes;
        },
        get onSaveUserPalette() {
          return r.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return r.onDeleteUserPalette;
        },
        onExternalCommit: (f) => {
          var h;
          return (h = t.onCommit) == null ? void 0 : h.call(t, f);
        }
      });
    };
    e.if(i, (d) => {
      e.get(a) === null ? d(l) : r ? d(o, -1) : d(g, 1);
    });
  }
  e.append(n, s), e.pop();
}
const lt = "sh3-editor.settings";
function Tt(n, t, r, a) {
  const s = { ...n[t] ?? {} };
  return a === void 0 ? delete s[r] : s[r] = a, { ...n, [t]: s };
}
function dr(n, t) {
  const r = Object.keys(n);
  if (r.length === 0) return n;
  const a = new Set(t);
  let s = !1;
  for (const l of r)
    if (!a.has(l)) {
      s = !0;
      break;
    }
  if (!s) return n;
  const i = {};
  for (const l of r)
    a.has(l) && (i[l] = n[l]);
  return i;
}
var cr = e.from_html('<h3 class="section-label svelte-18qjjuf"> </h3>'), ur = e.from_html('<section class="section svelte-18qjjuf"><!> <div class="rows svelte-18qjjuf"><!></div></section>');
function fr(n, t) {
  var r = ur(), a = e.child(r);
  {
    var s = (g) => {
      var o = cr(), d = e.child(o, !0);
      e.reset(o), e.template_effect(() => e.set_text(d, t.label)), e.append(g, o);
    };
    e.if(a, (g) => {
      t.showHeader && g(s);
    });
  }
  var i = e.sibling(a, 2), l = e.child(i);
  e.snippet(l, () => t.children), e.reset(i), e.reset(r), e.append(n, r);
}
var gr = e.from_html('<div class="desc svelte-1rh69ln"> </div>'), vr = e.from_html('<div class="error svelte-1rh69ln"> </div>'), hr = e.from_html('<div><div class="label-col"><div class="label svelte-1rh69ln"> </div> <!></div> <div class="control svelte-1rh69ln"><!></div> <!></div>');
function Le(n, t) {
  let r = e.prop(t, "disabled", 3, !1);
  var a = hr();
  let s;
  var i = e.child(a), l = e.child(i), g = e.child(l, !0);
  e.reset(l);
  var o = e.sibling(l, 2);
  {
    var d = (m) => {
      var u = gr(), _ = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(_, t.description)), e.append(m, u);
    };
    e.if(o, (m) => {
      t.description && m(d);
    });
  }
  e.reset(i);
  var f = e.sibling(i, 2), h = e.child(f);
  e.snippet(h, () => t.children), e.reset(f);
  var k = e.sibling(f, 2);
  {
    var b = (m) => {
      var u = vr(), _ = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(_, t.error)), e.append(m, u);
    };
    e.if(k, (m) => {
      t.error && m(b);
    });
  }
  e.reset(a), e.template_effect(() => {
    s = e.set_class(a, 1, "row svelte-1rh69ln", null, s, { disabled: r() }), e.set_text(g, t.label);
  }), e.append(n, a);
}
var mr = e.from_html('<button type="button"><span class="knob svelte-ert2i6"></span></button>');
function pr(n, t) {
  e.push(t, !0);
  const r = e.derived(() => !!t.value);
  Le(n, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (a, s) => {
      var i = mr();
      let l;
      e.template_effect(() => {
        l = e.set_class(i, 1, "toggle svelte-ert2i6", null, l, { on: e.get(r) }), i.disabled = t.field.disabled, e.set_attribute(i, "aria-pressed", e.get(r)), e.set_attribute(i, "aria-label", t.field.label);
      }), e.delegated("click", i, () => t.onEdit(!e.get(r))), e.append(a, i);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
var br = e.from_html('<input type="text"/>');
function _r(n, t) {
  e.push(t, !0);
  const r = e.derived(() => t.value == null ? "" : String(t.value));
  Le(n, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (a, s) => {
      var i = br();
      e.remove_input_defaults(i);
      let l;
      e.template_effect(() => {
        l = e.set_class(i, 1, "input svelte-1jljyjf", null, l, { error: !!t.error }), e.set_attribute(i, "placeholder", t.field.placeholder ?? ""), i.disabled = t.field.disabled, e.set_value(i, e.get(r));
      }), e.delegated("change", i, (g) => t.onEdit(g.currentTarget.value)), e.append(a, i);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var yr = e.from_html('<span class="unit svelte-1be7g0v"> </span>'), kr = e.from_html('<input type="number"/> <!>', 1);
function wr(n, t) {
  e.push(t, !0);
  const r = e.derived(() => typeof t.value == "number" ? String(t.value) : "");
  function a(s) {
    const i = s.currentTarget.value, l = Number(i);
    i === "" || Number.isNaN(l) || t.onEdit(l);
  }
  Le(n, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (s, i) => {
      var l = kr(), g = e.first_child(l);
      e.remove_input_defaults(g);
      let o;
      var d = e.sibling(g, 2);
      {
        var f = (h) => {
          var k = yr(), b = e.child(k, !0);
          e.reset(k), e.template_effect(() => e.set_text(b, t.field.unit)), e.append(h, k);
        };
        e.if(d, (h) => {
          t.field.unit && h(f);
        });
      }
      e.template_effect(() => {
        o = e.set_class(g, 1, "input svelte-1be7g0v", null, o, { error: !!t.error }), e.set_attribute(g, "min", t.field.min), e.set_attribute(g, "max", t.field.max), e.set_attribute(g, "step", t.field.step ?? 1), g.disabled = t.field.disabled, e.set_value(g, e.get(r));
      }), e.delegated("change", g, a), e.append(s, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var xr = e.from_html('<input type="range"/> <span class="value svelte-1jyn88"> </span>', 1);
function Cr(n, t) {
  e.push(t, !0);
  const r = e.derived(() => a(typeof t.value == "number" ? t.value : t.field.min, t.field.min, t.field.max));
  function a(i, l, g) {
    return Math.min(g, Math.max(l, i));
  }
  function s(i) {
    const l = Number(i.currentTarget.value);
    Number.isNaN(l) || t.onEdit(a(l, t.field.min, t.field.max));
  }
  Le(n, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (i, l) => {
      var g = xr(), o = e.first_child(g);
      e.remove_input_defaults(o);
      let d;
      var f = e.sibling(o, 2), h = e.child(f);
      e.reset(f), e.template_effect(() => {
        d = e.set_class(o, 1, "slider svelte-1jyn88", null, d, { error: !!t.error }), e.set_attribute(o, "min", t.field.min), e.set_attribute(o, "max", t.field.max), e.set_attribute(o, "step", t.field.step ?? 1), o.disabled = t.field.disabled, e.set_value(o, e.get(r)), e.set_text(h, `${e.get(r) ?? ""}${t.field.unit ? ` ${t.field.unit}` : ""}`);
      }), e.delegated("input", o, s), e.append(i, g);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["input"]);
var Pr = e.from_html('<button type="button"> </button>'), Ir = e.from_html("<div></div>");
function Sr(n, t) {
  e.push(t, !0);
  const r = e.derived(() => typeof t.value == "string" ? t.value : "");
  Le(n, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (a, s) => {
      var i = Ir();
      let l;
      e.each(i, 21, () => t.field.options, (g) => g.value, (g, o) => {
        var d = Pr();
        let f;
        var h = e.child(d, !0);
        e.reset(d), e.template_effect(() => {
          d.disabled = t.field.disabled, f = e.set_class(d, 1, "svelte-iu603z", null, f, { active: e.get(r) === e.get(o).value }), e.set_text(h, e.get(o).label);
        }), e.delegated("click", d, () => t.onEdit(e.get(o).value)), e.append(g, d);
      }), e.reset(i), e.template_effect(() => l = e.set_class(i, 1, "seg svelte-iu603z", null, l, { error: !!t.error })), e.append(a, i);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
const Tr = {
  boolean: pr,
  string: _r,
  number: wr,
  "number-range": Cr,
  enum: Sr
};
var Er = e.from_html('<p class="empty svelte-mrn94a">No settings available.</p>'), Ar = e.from_html('<div class="settings svelte-mrn94a"><h2 class="title svelte-mrn94a">Settings</h2> <!></div>');
function Dr(n, t) {
  e.push(t, !0);
  let r = e.state(e.proxy(t.ctx.contributions.list(lt))), a = e.state(e.proxy({})), s = e.state(e.proxy({}));
  e.user_effect(() => t.ctx.contributions.onChange(lt, () => {
    e.set(r, t.ctx.contributions.list(lt), !0);
  })), e.user_effect(() => {
    var k;
    const f = [], h = {};
    for (const b of e.get(r)) {
      h[b.shardId] = b.getValues();
      const m = (k = b.subscribe) == null ? void 0 : k.call(b, () => {
        e.set(a, { ...e.get(a), [b.shardId]: b.getValues() }, !0);
      });
      m && f.push(m);
    }
    return e.set(a, h, !0), e.set(s, dr(e.get(s), e.get(r).map((b) => b.shardId)), !0), () => f.forEach((b) => b());
  });
  async function i(f, h, k) {
    try {
      await f.onEdit(h, k), e.set(s, Tt(e.get(s), f.shardId, h, void 0), !0);
    } catch (b) {
      e.set(s, Tt(e.get(s), f.shardId, h, b.message || "Invalid value"), !0);
    } finally {
      e.set(a, { ...e.get(a), [f.shardId]: f.getValues() }, !0);
    }
  }
  var l = Ar(), g = e.sibling(e.child(l), 2);
  {
    var o = (f) => {
      var h = Er();
      e.append(f, h);
    }, d = (f) => {
      var h = e.comment(), k = e.first_child(h);
      e.each(k, 17, () => e.get(r), (b) => b.shardId, (b, m) => {
        {
          let u = e.derived(() => e.get(r).length > 1);
          fr(b, {
            get label() {
              return e.get(m).label;
            },
            get showHeader() {
              return e.get(u);
            },
            children: (_, c) => {
              var v = e.comment(), I = e.first_child(v);
              e.each(I, 17, () => e.get(m).schema, (P) => P.key, (P, S) => {
                var D = e.comment(), T = e.first_child(D);
                {
                  let A = e.derived(() => {
                    var M;
                    return (M = e.get(a)[e.get(m).shardId]) == null ? void 0 : M[e.get(S).key];
                  }), V = e.derived(() => {
                    var M;
                    return (M = e.get(s)[e.get(m).shardId]) == null ? void 0 : M[e.get(S).key];
                  });
                  e.component(T, () => Tr[e.get(S).type], (M, L) => {
                    L(M, {
                      get field() {
                        return e.get(S);
                      },
                      get value() {
                        return e.get(A);
                      },
                      get error() {
                        return e.get(V);
                      },
                      onEdit: (j) => i(e.get(m), e.get(S).key, j)
                    });
                  });
                }
                e.append(P, D);
              }), e.append(_, v);
            }
          });
        }
      }), e.append(f, h);
    };
    e.if(g, (f) => {
      e.get(r).length === 0 ? f(o) : f(d, -1);
    });
  }
  e.reset(l), e.append(n, l), e.pop();
}
function Mr(n, t = {}) {
  const r = t.warn ?? ((i) => console.warn(i)), a = /* @__PURE__ */ new Set(), s = [];
  for (let i = 0; i < n.length; i++) {
    const l = n[i];
    if (a.has(l.id)) {
      r(`[sh3-editor] duplicate help tab id "${l.id}" — first registration kept, this one ignored.`);
      continue;
    }
    a.add(l.id), s.push({ c: l, i });
  }
  return s.sort((i, l) => {
    const g = i.c.priority ?? 100, o = l.c.priority ?? 100;
    return g !== o ? g - o : i.i - l.i;
  }), s.map((i) => i.c);
}
function Nr(n) {
  return {
    activeAppId: n.getActiveApp(),
    focusedViewId: n.readFocusedViewId(),
    mountedViewIds: [...n.listMountedViewIds()],
    selection: n.getSelection(),
    capturedAt: n.now()
  };
}
function Hr(n) {
  const t = n.doc ?? (typeof document < "u" ? document : void 0);
  return {
    getActiveApp: () => n.getActiveAppId(),
    listMountedViewIds: () => {
      if (!t) return [];
      const r = t.querySelectorAll("[data-sh3-view]"), a = /* @__PURE__ */ new Set();
      return r.forEach((s) => {
        const i = s.getAttribute("data-sh3-view");
        i && a.add(i);
      }), [...a];
    },
    readFocusedViewId: () => {
      if (!t || !t.activeElement) return null;
      const r = t.activeElement.closest("[data-sh3-view]");
      return (r == null ? void 0 : r.getAttribute("data-sh3-view")) ?? null;
    },
    getSelection: () => n.getSelection(),
    now: () => Date.now()
  };
}
const Ur = {
  Meta: "⌘",
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧"
};
function Rr(n, t) {
  if (!n) return "—";
  const r = n.split("+");
  if (t === "mac") {
    let a = "";
    for (let s = 0; s < r.length; s++) {
      const i = r[s];
      a += Ur[i] ?? i;
    }
    return a;
  }
  return n;
}
function Br() {
  return typeof navigator > "u" ? "other" : (navigator.platform || navigator.userAgent || "").includes("Mac") ? "mac" : "other";
}
var Vr = e.from_html('<span>App: <code class="svelte-151qe3m"> </code></span>'), Lr = e.from_html('<span>Focused view: <code class="svelte-151qe3m"> </code></span>'), Or = e.from_html('<header class="ctx svelte-151qe3m"><!> <!> <!></header>'), qr = e.from_html('<p class="empty svelte-151qe3m">No hotkeys active in this context.</p>'), Fr = e.from_html('<span class="badge svelte-151qe3m"> </span>'), jr = e.from_html('<li><span class="label svelte-151qe3m"> </span> <kbd class="kbd svelte-151qe3m"> </kbd> <!></li>'), Kr = e.from_html('<section class="group svelte-151qe3m"><h3 class="group-title svelte-151qe3m"> </h3> <ul class="list svelte-151qe3m"></ul></section>'), zr = e.from_html('<div class="hotkeys-tab svelte-151qe3m"><!> <!></div>');
function Wr(n, t) {
  e.push(t, !0);
  const r = Br(), a = {
    home: "Global",
    app: "App",
    view: "View",
    focus: "Focus",
    element: "Selection"
  };
  function s(u) {
    if (u.scope === "home") return "home";
    if (u.scope === "app") return "app";
    if (typeof u.scope == "string") {
      if (u.scope.startsWith("view:")) return "view";
      if (u.scope.startsWith("focus:")) return "focus";
    }
    return "element";
  }
  const i = ["home", "app", "view", "focus", "element"], l = e.derived(() => {
    const u = /* @__PURE__ */ new Map();
    for (const _ of t.actions) {
      const c = s(_), v = u.get(c) ?? [];
      v.push(_), u.set(c, v);
    }
    for (const _ of u.values())
      _.sort((c, v) => {
        const I = c.group ?? "", P = v.group ?? "";
        return I !== P ? I.localeCompare(P) : c.label.localeCompare(v.label);
      });
    return i.map((_) => ({ tier: _, label: a[_], items: u.get(_) ?? [] })).filter((_) => _.items.length > 0);
  }), { snapshot: g } = t.tabCtx, o = g.activeAppId !== null || g.focusedViewId !== null;
  var d = zr(), f = e.child(d);
  {
    var h = (u) => {
      var _ = Or(), c = e.child(_);
      {
        var v = (T) => {
          var A = Vr(), V = e.sibling(e.child(A)), M = e.child(V, !0);
          e.reset(V), e.reset(A), e.template_effect(() => e.set_text(M, g.activeAppId)), e.append(T, A);
        };
        e.if(c, (T) => {
          g.activeAppId && T(v);
        });
      }
      var I = e.sibling(c, 2);
      {
        var P = (T) => {
          var A = e.text("·");
          e.append(T, A);
        };
        e.if(I, (T) => {
          g.activeAppId && g.focusedViewId && T(P);
        });
      }
      var S = e.sibling(I, 2);
      {
        var D = (T) => {
          var A = Lr(), V = e.sibling(e.child(A)), M = e.child(V, !0);
          e.reset(V), e.reset(A), e.template_effect(() => e.set_text(M, g.focusedViewId)), e.append(T, A);
        };
        e.if(S, (T) => {
          g.focusedViewId && T(D);
        });
      }
      e.reset(_), e.append(u, _);
    };
    e.if(f, (u) => {
      o && u(h);
    });
  }
  var k = e.sibling(f, 2);
  {
    var b = (u) => {
      var _ = qr();
      e.append(u, _);
    }, m = (u) => {
      var _ = e.comment(), c = e.first_child(_);
      e.each(c, 17, () => e.get(l), (v) => v.tier, (v, I) => {
        var P = Kr(), S = e.child(P), D = e.child(S, !0);
        e.reset(S);
        var T = e.sibling(S, 2);
        e.each(T, 21, () => e.get(I).items, (A) => A.id, (A, V) => {
          var M = jr();
          let L;
          var j = e.child(M), E = e.child(j, !0);
          e.reset(j);
          var R = e.sibling(j, 2), z = e.child(R, !0);
          e.reset(R);
          var O = e.sibling(R, 2);
          {
            var G = (y) => {
              var w = Fr(), U = e.child(w, !0);
              e.reset(w), e.template_effect(() => e.set_text(U, e.get(V).scopeBadge)), e.append(y, w);
            };
            e.if(O, (y) => {
              e.get(V).scopeBadge && y(G);
            });
          }
          e.reset(M), e.template_effect(
            (y) => {
              L = e.set_class(M, 1, "row svelte-151qe3m", null, L, { disabled: e.get(V).effectiveShortcut === null }), e.set_text(E, e.get(V).label), e.set_text(z, y);
            },
            [
              () => Rr(e.get(V).effectiveShortcut, r)
            ]
          ), e.append(A, M);
        }), e.reset(T), e.reset(P), e.template_effect(() => e.set_text(D, e.get(I).label)), e.append(v, P);
      }), e.append(u, _);
    };
    e.if(k, (u) => {
      e.get(l).length === 0 ? u(b) : u(m, -1);
    });
  }
  e.reset(d), e.append(n, d), e.pop();
}
var Gr = e.from_html('<button class="close-btn svelte-udgkd3" aria-label="Close help">×</button>'), Yr = e.from_html('<header class="help-header svelte-udgkd3"><span class="title svelte-udgkd3">Help</span> <!></header>'), Xr = e.from_html('<span class="tab-icon svelte-udgkd3"> </span>'), Jr = e.from_html('<button role="tab"><!> <span> </span></button>'), Qr = e.from_html('<div role="tabpanel"></div>'), Zr = e.from_html('<div class="tab-strip svelte-udgkd3" role="tablist"></div> <div class="tab-bodies svelte-udgkd3"></div>', 1), $r = e.from_html('<p class="loading svelte-udgkd3">Loading…</p>'), ei = e.from_html('<div data-sh3-view="sh3-editor:help"><!> <!></div>');
function Et(n, t) {
  e.push(t, !0);
  let r = e.state(null), a = e.state([]), s = [], i = e.state(0);
  const l = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  function o(c) {
    if (l.has(c.id)) return;
    const v = g.get(c.id);
    if (!v || !e.get(r)) return;
    const I = {
      surface: t.surface,
      snapshot: e.get(r),
      close: t.surface === "modal" ? t.close : void 0
    };
    if (c.id === "sh3-editor:help-tab:hotkeys") {
      const P = _e(Wr, {
        target: v,
        props: { tabCtx: I, actions: s }
      });
      l.set(c.id, { unmount: () => ge(P) });
    } else
      l.set(c.id, c.mount(v, I));
  }
  ze(() => {
    const c = Zt(), v = Hr({
      getActiveAppId: () => (c == null ? void 0 : c.id) ?? null,
      getSelection: () => t.ctx.actions.selection.get()
    });
    e.set(r, Nr(v)), s = Ve.actions.listActive();
    const I = t.ctx.contributions.list(Vt);
    e.set(a, Mr(I));
  }), Ut(() => {
    var c;
    for (const v of l.values())
      try {
        v.unmount();
      } catch (I) {
        console.warn("[sh3-editor] Help tab unmount error:", I);
      }
    l.clear(), g.clear(), (c = t.onClose) == null || c.call(t);
  }), e.user_effect(() => {
    if (!e.get(r)) return;
    const c = e.get(a)[e.get(i)];
    c && queueMicrotask(() => o(c));
  });
  function d(c, v) {
    g.set(v, c);
    const I = e.get(a)[e.get(i)];
    return I && I.id === v && e.get(r) && o(I), {
      destroy() {
        g.delete(v);
      }
    };
  }
  var f = ei();
  let h;
  var k = e.child(f);
  {
    var b = (c) => {
      var v = Yr(), I = e.sibling(e.child(v), 2);
      {
        var P = (S) => {
          var D = Gr();
          e.delegated("click", D, function(...T) {
            var A;
            (A = t.close) == null || A.apply(this, T);
          }), e.append(S, D);
        };
        e.if(I, (S) => {
          t.close && S(P);
        });
      }
      e.reset(v), e.append(c, v);
    };
    e.if(k, (c) => {
      t.surface === "modal" && c(b);
    });
  }
  var m = e.sibling(k, 2);
  {
    var u = (c) => {
      var v = Zr(), I = e.first_child(v);
      e.each(I, 23, () => e.get(a), (S) => S.id, (S, D, T) => {
        var A = Jr();
        let V;
        var M = e.child(A);
        {
          var L = (R) => {
            var z = Xr(), O = e.child(z, !0);
            e.reset(z), e.template_effect(() => e.set_text(O, e.get(D).icon)), e.append(R, z);
          };
          e.if(M, (R) => {
            e.get(D).icon && R(L);
          });
        }
        var j = e.sibling(M, 2), E = e.child(j, !0);
        e.reset(j), e.reset(A), e.template_effect(() => {
          V = e.set_class(A, 1, "tab-btn svelte-udgkd3", null, V, { active: e.get(T) === e.get(i) }), e.set_attribute(A, "aria-selected", e.get(T) === e.get(i)), e.set_text(E, e.get(D).label);
        }), e.delegated("click", A, () => e.set(i, e.get(T), !0)), e.append(S, A);
      }), e.reset(I);
      var P = e.sibling(I, 2);
      e.each(P, 23, () => e.get(a), (S) => S.id, (S, D, T) => {
        var A = Qr();
        let V;
        e.action(A, (M, L) => d == null ? void 0 : d(M, L), () => e.get(D).id), e.template_effect(() => V = e.set_class(A, 1, "tab-body svelte-udgkd3", null, V, { active: e.get(T) === e.get(i) })), e.append(S, A);
      }), e.reset(P), e.append(c, v);
    }, _ = (c) => {
      var v = $r();
      e.append(c, v);
    };
    e.if(m, (c) => {
      e.get(a).length > 0 ? c(u) : c(_, -1);
    });
  }
  e.reset(f), e.template_effect(() => h = e.set_class(f, 1, "help-root svelte-udgkd3", null, h, { "modal-surface": t.surface === "modal" })), e.append(n, f), e.pop();
}
e.delegate(["click"]);
var ti = e.from_html('<span class="icon"> </span>'), ni = e.from_html('<div class="port input svelte-y92dsd"><span class="port-marker svelte-y92dsd"></span> <span class="port-label"> </span></div>'), ri = e.from_html('<div class="port output svelte-y92dsd"><span class="port-label"> </span> <span class="port-marker svelte-y92dsd"></span></div>'), ii = e.from_html('<div role="button" tabindex="0"><div class="header svelte-y92dsd"><!> <span class="label"> </span></div> <div class="ports svelte-y92dsd"><div class="ports-col inputs svelte-y92dsd"></div> <div class="ports-col outputs svelte-y92dsd"></div></div></div>');
function ai(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => t.node.ports.filter((u) => u.direction === "input")), a = e.derived(() => t.node.ports.filter((u) => u.direction === "output"));
  var s = ii();
  let i, l;
  var g = e.child(s), o = e.child(g);
  {
    var d = (u) => {
      var _ = ti(), c = e.child(_, !0);
      e.reset(_), e.template_effect(() => e.set_text(c, t.visuals.icon)), e.append(u, _);
    };
    e.if(o, (u) => {
      t.visuals.icon && u(d);
    });
  }
  var f = e.sibling(o, 2), h = e.child(f, !0);
  e.reset(f), e.reset(g);
  var k = e.sibling(g, 2), b = e.child(k);
  e.each(b, 21, () => e.get(r), (u) => u.shortId, (u, _) => {
    var c = ni(), v = e.sibling(e.child(c), 2), I = e.child(v, !0);
    e.reset(v), e.reset(c), e.template_effect(() => {
      e.set_attribute(c, "data-port-id", e.get(_).shortId), e.set_attribute(c, "data-data-type", e.get(_).dataType ?? ""), e.set_text(I, e.get(_).label);
    }), e.delegated("pointerdown", c, (P) => {
      var S;
      return (S = t.onPortPointerDown) == null ? void 0 : S.call(t, e.get(_), P);
    }), e.delegated("pointerup", c, (P) => {
      var S;
      return (S = t.onPortPointerUp) == null ? void 0 : S.call(t, e.get(_), P);
    }), e.append(u, c);
  }), e.reset(b);
  var m = e.sibling(b, 2);
  e.each(m, 21, () => e.get(a), (u) => u.shortId, (u, _) => {
    var c = ri(), v = e.child(c), I = e.child(v, !0);
    e.reset(v), e.next(2), e.reset(c), e.template_effect(() => {
      e.set_attribute(c, "data-port-id", e.get(_).shortId), e.set_attribute(c, "data-data-type", e.get(_).dataType ?? ""), e.set_text(I, e.get(_).label);
    }), e.delegated("pointerdown", c, (P) => {
      var S;
      return (S = t.onPortPointerDown) == null ? void 0 : S.call(t, e.get(_), P);
    }), e.delegated("pointerup", c, (P) => {
      var S;
      return (S = t.onPortPointerUp) == null ? void 0 : S.call(t, e.get(_), P);
    }), e.append(u, c);
  }), e.reset(m), e.reset(k), e.reset(s), e.template_effect(() => {
    i = e.set_class(s, 1, "graph-node svelte-y92dsd", null, i, { selected: t.selected }), e.set_attribute(s, "data-node-id", t.node.id), l = e.set_style(s, "", l, {
      left: `${t.node.position.x ?? ""}px`,
      top: `${t.node.position.y ?? ""}px`,
      width: `${t.node.width ?? ""}px`,
      "min-height": `${t.node.height ?? ""}px`,
      "--border-color": t.visuals.borderColor,
      "--text-color": t.visuals.textColor ?? "var(--sh3-text-primary, #ddd)"
    }), e.set_text(h, t.node.label);
  }), e.delegated("click", s, (u) => {
    var _;
    return (_ = t.onSelectClick) == null ? void 0 : _.call(t, u);
  }), e.delegated("pointerdown", g, (u) => {
    var _;
    return (_ = t.onHeaderPointerDown) == null ? void 0 : _.call(t, u);
  }), e.append(n, s), e.pop();
}
e.delegate(["click", "pointerdown", "pointerup"]);
function li(n, t) {
  const r = Math.abs(t.x - n.x), a = Math.max(40, Math.min(160, r * 0.5)), s = { x: n.x + a, y: n.y }, i = { x: t.x - a, y: t.y };
  return `M ${n.x} ${n.y} C ${s.x} ${s.y} ${i.x} ${i.y} ${t.x} ${t.y}`;
}
var si = e.from_svg('<path class="halo svelte-1rehop2"></path>'), oi = e.from_svg('<defs><marker markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z"></path></marker></defs>'), di = e.from_svg('<g role="presentation"><!><path class="line svelte-1rehop2"></path><!></g>');
function ci(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => li(t.source, t.target));
  var a = di();
  let s;
  var i = e.child(a);
  {
    var l = (f) => {
      var h = si();
      e.template_effect(() => e.set_attribute(h, "d", e.get(r))), e.append(f, h);
    };
    e.if(i, (f) => {
      t.selected && f(l);
    });
  }
  var g = e.sibling(i), o = e.sibling(g);
  {
    var d = (f) => {
      var h = oi(), k = e.child(h), b = e.child(k);
      e.reset(k), e.reset(h), e.template_effect(() => {
        e.set_attribute(k, "id", `arrow-${t.id ?? ""}`), e.set_attribute(b, "fill", t.color);
      }), e.append(f, h);
    };
    e.if(o, (f) => {
      t.oriented && f(d);
    });
  }
  e.reset(a), e.template_effect(() => {
    s = e.set_class(a, 0, "edge svelte-1rehop2", null, s, { selected: t.selected }), e.set_attribute(g, "d", e.get(r)), e.set_attribute(g, "stroke", t.color), e.set_attribute(g, "marker-end", t.oriented ? `url(#arrow-${t.id})` : null);
  }), e.delegated("click", a, (f) => {
    var h;
    return (h = t.onClick) == null ? void 0 : h.call(t, f);
  }), e.append(n, a), e.pop();
}
e.delegate(["click"]);
var ui = e.from_html('<button class="item svelte-lpiq26"> </button>'), fi = e.from_html('<div class="cat"><div class="cat-name svelte-lpiq26"> </div> <!></div>'), gi = e.from_html('<div class="palette svelte-lpiq26"><input class="search svelte-lpiq26" type="text" placeholder="Search node types…"/> <div class="lists svelte-lpiq26"></div></div>');
function vi(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  let r = e.state("");
  const a = e.derived(() => {
    if (!e.get(r)) return t.byCategory;
    const d = e.get(r).toLowerCase(), f = /* @__PURE__ */ new Map();
    for (const [h, k] of t.byCategory) {
      const b = k.filter((m) => m.label.toLowerCase().includes(d) || m.type.toLowerCase().includes(d));
      b.length > 0 && f.set(h, b);
    }
    return f;
  });
  function s(d) {
    d.key === "Escape" && t.onClose();
  }
  var i = gi();
  e.event("keydown", e.window, s);
  let l;
  var g = e.child(i);
  e.remove_input_defaults(g), e.autofocus(g, !0);
  var o = e.sibling(g, 2);
  e.each(o, 21, () => [...e.get(a)], ([d, f]) => d, (d, f) => {
    var h = e.derived(() => e.to_array(e.get(f), 2));
    let k = () => e.get(h)[0], b = () => e.get(h)[1];
    var m = fi(), u = e.child(m), _ = e.child(u, !0);
    e.reset(u);
    var c = e.sibling(u, 2);
    e.each(c, 17, b, (v) => v.type, (v, I) => {
      var P = ui(), S = e.child(P, !0);
      e.reset(P), e.template_effect(() => e.set_text(S, e.get(I).label)), e.delegated("click", P, () => t.onPick(e.get(I))), e.append(v, P);
    }), e.reset(m), e.template_effect(() => e.set_text(_, k())), e.append(d, m);
  }), e.reset(o), e.reset(i), e.template_effect(() => l = e.set_style(i, "", l, { left: `${t.x ?? ""}px`, top: `${t.y ?? ""}px` })), e.bind_value(g, () => e.get(r), (d) => e.set(r, d)), e.append(n, i), e.pop();
}
e.delegate(["click"]);
function Fe(n, t) {
  const r = `${n}_`;
  return t.startsWith(r) ? t.slice(r.length) : t;
}
function hi(n, t, r) {
  const a = t.getNodeVisuals(n.type), s = n.ports.map((g) => ({
    ...g,
    shortId: Fe(n.id, g.id)
  })), i = t.getTemplates().find((g) => g.type === n.type), l = i ? ft(i, n.config, r) : [];
  return {
    id: n.id,
    type: n.type,
    label: t.resolveLabel(n.type, n.config),
    ports: s,
    config: { ...n.config },
    configFields: l,
    position: { ...n.position },
    width: a.defaultWidth ?? t.defaultNodeWidth,
    height: a.defaultHeight ?? t.defaultNodeHeight
  };
}
function dt(n, t) {
  const r = /* @__PURE__ */ new Map();
  for (const l of n.nodes)
    r.set(l.id, new Set(l.ports.map((g) => g.id)));
  const a = /* @__PURE__ */ new Map();
  for (const l of n.edges) {
    const g = r.get(l.targetNodeId), o = r.get(l.sourceNodeId);
    if (!(g != null && g.has(l.targetPortId)) || !(o != null && o.has(l.sourcePortId))) continue;
    let d = a.get(l.targetNodeId);
    d || (d = /* @__PURE__ */ new Set(), a.set(l.targetNodeId, d)), d.add(Fe(l.targetNodeId, l.targetPortId));
  }
  const s = /* @__PURE__ */ new Map();
  for (const l of n.nodes) {
    const g = a.get(l.id) ?? /* @__PURE__ */ new Set();
    s.set(l.id, hi(l, t, g));
  }
  const i = /* @__PURE__ */ new Map();
  for (const l of n.edges) {
    const g = r.get(l.targetNodeId), o = r.get(l.sourceNodeId);
    if (!(g != null && g.has(l.targetPortId)) || !(o != null && o.has(l.sourcePortId))) {
      console.warn(`graph: dropping edge ${l.id} with missing endpoint`, l);
      continue;
    }
    i.set(l.id, {
      id: l.id,
      sourceNodeId: l.sourceNodeId,
      sourcePortId: Fe(l.sourceNodeId, l.sourcePortId),
      targetNodeId: l.targetNodeId,
      targetPortId: Fe(l.targetNodeId, l.targetPortId)
    });
  }
  return {
    id: n.id,
    domainId: n.domain,
    name: n.name,
    version: n.version,
    nodes: s,
    edges: i,
    metadata: { ...n.metadata ?? {} },
    readonly: !1,
    selection: /* @__PURE__ */ new Set()
  };
}
const mi = {
  number: "number",
  boolean: "boolean",
  string: "string"
};
function ft(n, t, r) {
  const a = [], s = /* @__PURE__ */ new Set();
  for (const i of n.configSchema ?? []) {
    s.add(i.key);
    const l = {
      key: i.key,
      label: i.label,
      type: i.type
    };
    i.options && (l.options = i.options), i.rendererHint && (l.rendererHint = i.rendererHint), r.has(i.key) && (l.disabled = !0), a.push(l);
  }
  for (const i of n.ports) {
    if (i.direction !== "input" || s.has(i.id)) continue;
    const l = i.dataType ? mi[i.dataType] : void 0;
    l && a.push({
      key: i.id,
      label: i.label,
      type: l,
      disabled: r.has(i.id)
    });
  }
  return a;
}
function At(n, t) {
  return t.startsWith(`${n}_`) ? t : `${n}_${t}`;
}
function qt(n) {
  const t = [];
  for (const s of n.nodes.values())
    t.push({
      id: s.id,
      type: s.type,
      position: { ...s.position },
      config: { ...s.config },
      ports: s.ports.map((i) => ({
        id: i.id,
        // already in full form (asset → state preserves p.id)
        label: i.label,
        direction: i.direction,
        ...i.dataType !== void 0 ? { dataType: i.dataType } : {}
      }))
    });
  const r = [];
  for (const s of n.edges.values())
    r.push({
      id: s.id,
      sourceNodeId: s.sourceNodeId,
      sourcePortId: At(s.sourceNodeId, s.sourcePortId),
      targetNodeId: s.targetNodeId,
      targetPortId: At(s.targetNodeId, s.targetPortId)
    });
  const a = {
    id: n.id,
    name: n.name,
    domain: n.domainId,
    version: n.version,
    nodes: t,
    edges: r
  };
  return Object.keys(n.metadata).length > 0 && (a.metadata = { ...n.metadata }), a;
}
function pi(n, t) {
  const r = `${n}_`;
  return t.startsWith(r) ? t.slice(r.length) : t;
}
function bi(n, t, r) {
  const a = t.getNodeVisuals(n.type), s = n.ports.map((l) => ({ ...l, shortId: pi(n.id, l.id) })), i = t.getTemplates().find((l) => l.type === n.type);
  return {
    id: n.id,
    type: n.type,
    label: t.resolveLabel(n.type, n.config),
    ports: s,
    config: { ...n.config },
    configFields: i ? ft(i, n.config, r) : [],
    position: { ...n.position },
    width: a.defaultWidth ?? t.defaultNodeWidth,
    height: a.defaultHeight ?? t.defaultNodeHeight
  };
}
function Ke(n, t, r) {
  const a = n.nodes.get(r);
  if (!a) return;
  const s = /* @__PURE__ */ new Set();
  for (const l of n.edges.values())
    l.targetNodeId === r && s.add(l.targetPortId);
  const i = t.getTemplates().find((l) => l.type === a.type);
  a.configFields = i ? ft(i, a.config, s) : [], a.label = t.resolveLabel(a.type, a.config);
}
function Dt(n, t, r) {
  return {
    meta: { kind: "add-node" },
    apply() {
      n.nodes.set(r.id, bi(r, t, /* @__PURE__ */ new Set()));
    },
    revert() {
      n.nodes.delete(r.id), n.selection.delete(r.id);
    }
  };
}
function _i(n, t, r, a) {
  return {
    meta: { kind: "move-node" },
    apply() {
      const s = n.nodes.get(t);
      s && (s.position = { ...a });
    },
    revert() {
      const s = n.nodes.get(t);
      s && (s.position = { ...r });
    }
  };
}
function yi(n, t, r, a, s, i) {
  function l(g, o) {
    if (a.length === 0) return;
    let d = g.config;
    for (let f = 0; f < a.length - 1; f++) d = d[a[f]];
    d[a[a.length - 1]] = o;
  }
  return {
    meta: { kind: "set-node-config" },
    apply() {
      const g = n.nodes.get(r);
      g && (l(g, i), Ke(n, t, r));
    },
    revert() {
      const g = n.nodes.get(r);
      g && (l(g, s), Ke(n, t, r));
    }
  };
}
function ki(n, t) {
  return {
    meta: { kind: "add-edge" },
    apply() {
      n.edges.set(t.id, { ...t });
    },
    revert() {
      n.edges.delete(t.id), n.selection.delete(t.id);
    }
  };
}
function wi(n, t, r) {
  let a = [], s = [];
  return {
    meta: { kind: "remove-selection" },
    apply() {
      a = [], s = [];
      const i = new Set(r);
      for (const l of i) {
        const g = n.edges.get(l);
        g && (s.push(g), n.edges.delete(l));
      }
      for (const l of i) {
        const g = n.nodes.get(l);
        if (g) {
          for (const [o, d] of n.edges)
            (d.sourceNodeId === l || d.targetNodeId === l) && (s.push(d), n.edges.delete(o));
          a.push(g), n.nodes.delete(l);
        }
      }
      n.selection.clear();
      for (const l of s) Ke(n, t, l.targetNodeId);
    },
    revert() {
      for (const i of a) n.nodes.set(i.id, i);
      for (const i of s) n.edges.set(i.id, i);
      for (const i of s) Ke(n, t, i.targetNodeId);
    }
  };
}
function xi(n, t, r) {
  let a = null;
  return {
    meta: { kind: "replace-asset" },
    apply() {
      a = qt(n);
      const s = dt(r, t);
      n.id = s.id, n.domainId = s.domainId, n.name = s.name, n.version = s.version, n.metadata = s.metadata, n.nodes.clear();
      for (const [i, l] of s.nodes) n.nodes.set(i, l);
      n.edges.clear();
      for (const [i, l] of s.edges) n.edges.set(i, l);
      n.selection.clear();
    },
    revert() {
      if (!a) return;
      const s = dt(a, t);
      n.id = s.id, n.domainId = s.domainId, n.name = s.name, n.version = s.version, n.metadata = s.metadata, n.nodes.clear();
      for (const [i, l] of s.nodes) n.nodes.set(i, l);
      n.edges.clear();
      for (const [i, l] of s.edges) n.edges.set(i, l);
      n.selection.clear();
    }
  };
}
var Ci = e.from_svg('<path class="edge-ghost" stroke="var(--sh3-accent, #4a9eff)" fill="none" stroke-dasharray="4 3"></path>'), Pi = e.from_html('<div class="graph-canvas svelte-x16tu1"><svg class="edge-overlay svelte-x16tu1"><!><!></svg> <!> <!></div>');
function Ii(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  function r(y) {
    return t.domain.getNodeVisuals(y.type);
  }
  function a(y, w, U) {
    const q = y.ports.find((Q) => Q.shortId === w);
    if (!q) return { x: y.position.x, y: y.position.y };
    const B = y.ports.filter((Q) => Q.direction === "input"), x = y.ports.filter((Q) => Q.direction === "output"), J = (U === "input" ? B : x).indexOf(q), K = 26, ne = 22, ve = y.position.y + K + 8 + J * ne + ne / 2;
    return { x: U === "output" ? y.position.x + y.width : y.position.x, y: ve };
  }
  function s(y) {
    const w = t.state.nodes.get(y.sourceNodeId);
    return w ? a(w, y.sourcePortId, "output") : { x: 0, y: 0 };
  }
  function i(y) {
    const w = t.state.nodes.get(y.targetNodeId);
    return w ? a(w, y.targetPortId, "input") : { x: 0, y: 0 };
  }
  function l(y) {
    var q;
    const w = t.state.nodes.get(y.sourceNodeId);
    if (!w) return "#888";
    const U = w.ports.find((B) => B.shortId === y.sourcePortId);
    return U != null && U.dataType ? ((q = r(w).portColors) == null ? void 0 : q[U.dataType]) ?? "#888" : "#888";
  }
  function g(y, w) {
    var U;
    w ? t.state.selection.has(y) ? t.state.selection.delete(y) : t.state.selection.add(y) : t.state.selection = /* @__PURE__ */ new Set([y]), (U = t.onSelectionChange) == null || U.call(t, Array.from(t.state.selection));
  }
  function o() {
    var y;
    t.state.selection.size !== 0 && (t.state.selection = /* @__PURE__ */ new Set(), (y = t.onSelectionChange) == null || y.call(t, []));
  }
  let d = e.state(null);
  function f(y, w) {
    t.state.readonly || (w.stopPropagation(), w.currentTarget.setPointerCapture(w.pointerId), e.set(
      d,
      {
        nodeId: y.id,
        start: { x: w.clientX, y: w.clientY },
        origin: { ...y.position }
      },
      !0
    ));
  }
  function h(y) {
    if (!e.get(d)) return;
    const w = t.state.nodes.get(e.get(d).nodeId);
    w && (w.position = {
      x: e.get(d).origin.x + (y.clientX - e.get(d).start.x),
      y: e.get(d).origin.y + (y.clientY - e.get(d).start.y)
    });
  }
  function k(y) {
    var U;
    if (!e.get(d)) return;
    const w = t.state.nodes.get(e.get(d).nodeId);
    if (w && (w.position.x !== e.get(d).origin.x || w.position.y !== e.get(d).origin.y)) {
      const q = _i(t.state, e.get(d).nodeId, e.get(d).origin, { ...w.position });
      t.history.push(q), (U = t.onAssetChanged) == null || U.call(t);
    }
    e.set(d, null);
  }
  let b = e.state(null);
  function m(y, w, U) {
    t.state.readonly || (U.stopPropagation(), U.currentTarget.setPointerCapture(U.pointerId), e.set(
      b,
      {
        source: {
          nodeId: y.id,
          portId: w.shortId,
          direction: w.direction,
          dataType: w.dataType
        },
        cursor: { x: U.clientX, y: U.clientY }
      },
      !0
    ));
  }
  function u(y) {
    h(y), e.get(b) && (e.get(b).cursor = { x: y.clientX, y: y.clientY });
  }
  function _(y, w, U) {
    var N;
    if (!e.get(b)) return;
    U.stopPropagation();
    const q = e.get(b).source;
    if (e.set(b, null), w.direction !== "input" || t.domain.edgeSemantics === "oriented" && q.direction !== "output" || q.nodeId === y.id || t.domain.canConnect && !t.domain.canConnect(
      {
        nodeId: q.nodeId,
        portId: q.portId,
        direction: q.direction,
        dataType: q.dataType
      },
      {
        nodeId: y.id,
        portId: w.shortId,
        direction: w.direction,
        dataType: w.dataType
      }
    )) return;
    const B = `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, x = ki(t.state, {
      id: B,
      sourceNodeId: q.nodeId,
      sourcePortId: q.portId,
      targetNodeId: y.id,
      targetPortId: w.shortId
    });
    x.apply(), t.history.push(x), (N = t.onAssetChanged) == null || N.call(t);
  }
  function c(y) {
    k(), e.set(b, null);
  }
  let v = e.state(null);
  function I(y) {
    if (!t.state.readonly && y.target === y.currentTarget)
      if (t.domain.useNodePalette) {
        const w = y.currentTarget.getBoundingClientRect();
        e.set(v, { x: y.clientX - w.left, y: y.clientY - w.top }, !0);
      } else
        P(y);
  }
  function P(y) {
    var x;
    const w = y.currentTarget.getBoundingClientRect(), q = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "",
      position: { x: y.clientX - w.left, y: y.clientY - w.top },
      config: {},
      ports: []
    }, B = Dt(t.state, t.domain, q);
    B.apply(), t.history.push(B), (x = t.onAssetChanged) == null || x.call(t);
  }
  function S(y) {
    var x;
    if (!e.get(v)) return;
    const w = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, U = y.ports.map((N) => ({ ...N, id: `${w}_${N.id}` })), q = {
      id: w,
      type: y.type,
      position: { ...e.get(v) },
      config: { ...y.defaultConfig },
      ports: U
    }, B = Dt(t.state, t.domain, q);
    B.apply(), t.history.push(B), (x = t.onAssetChanged) == null || x.call(t), e.set(v, null);
  }
  function D(y) {
    var w, U, q, B;
    if (!t.state.readonly)
      if (y.key === "Delete" || y.key === "Backspace") {
        if (t.state.selection.size === 0) return;
        const x = Array.from(t.state.selection), N = wi(t.state, t.domain, x);
        N.apply(), t.history.push(N), (w = t.onSelectionChange) == null || w.call(t, []), (U = t.onAssetChanged) == null || U.call(t);
      } else (y.ctrlKey || y.metaKey) && y.key === "z" ? (y.shiftKey ? t.history.redo() : t.history.undo(), (q = t.onAssetChanged) == null || q.call(t), y.preventDefault()) : (y.ctrlKey || y.metaKey) && y.key === "y" && (t.history.redo(), (B = t.onAssetChanged) == null || B.call(t), y.preventDefault());
  }
  const T = e.derived(() => Array.from(t.state.nodes.values())), A = e.derived(() => Array.from(t.state.edges.values())), V = e.derived(() => t.domain.edgeSemantics === "oriented");
  var M = Pi();
  e.event("keydown", e.window, D);
  var L = e.child(M), j = e.child(L);
  e.each(j, 17, () => e.get(A), (y) => y.id, (y, w) => {
    {
      let U = e.derived(() => s(e.get(w))), q = e.derived(() => i(e.get(w))), B = e.derived(() => l(e.get(w))), x = e.derived(() => t.state.selection.has(e.get(w).id));
      ci(y, {
        get id() {
          return e.get(w).id;
        },
        get source() {
          return e.get(U);
        },
        get target() {
          return e.get(q);
        },
        get color() {
          return e.get(B);
        },
        get oriented() {
          return e.get(V);
        },
        get selected() {
          return e.get(x);
        },
        onClick: (N) => {
          N.stopPropagation(), g(e.get(w).id, N.ctrlKey || N.metaKey);
        }
      });
    }
  });
  var E = e.sibling(j);
  {
    var R = (y) => {
      const w = e.derived(() => t.state.nodes.get(e.get(b).source.nodeId));
      var U = e.comment(), q = e.first_child(U);
      {
        var B = (x) => {
          const N = e.derived(() => a(e.get(w), e.get(b).source.portId, e.get(b).source.direction === "output" ? "output" : "input"));
          var J = Ci();
          e.template_effect(() => e.set_attribute(J, "d", `M ${e.get(N).x} ${e.get(N).y} L ${e.get(b).cursor.x} ${e.get(b).cursor.y}`)), e.append(x, J);
        };
        e.if(q, (x) => {
          e.get(w) && x(B);
        });
      }
      e.append(y, U);
    };
    e.if(E, (y) => {
      e.get(b) && y(R);
    });
  }
  e.reset(L);
  var z = e.sibling(L, 2);
  e.each(z, 17, () => e.get(T), (y) => y.id, (y, w) => {
    {
      let U = e.derived(() => r(e.get(w))), q = e.derived(() => t.state.selection.has(e.get(w).id));
      ai(y, {
        get node() {
          return e.get(w);
        },
        get visuals() {
          return e.get(U);
        },
        get selected() {
          return e.get(q);
        },
        onSelectClick: (B) => {
          B.stopPropagation(), g(e.get(w).id, B.ctrlKey || B.metaKey);
        },
        onHeaderPointerDown: (B) => f(e.get(w), B),
        onPortPointerDown: (B, x) => m(e.get(w), B, x),
        onPortPointerUp: (B, x) => _(e.get(w), B, x)
      });
    }
  });
  var O = e.sibling(z, 2);
  {
    var G = (y) => {
      {
        let w = e.derived(() => t.domain.getTemplatesByCategory());
        vi(y, {
          get byCategory() {
            return e.get(w);
          },
          get x() {
            return e.get(v).x;
          },
          get y() {
            return e.get(v).y;
          },
          onPick: S,
          onClose: () => e.set(v, null)
        });
      }
    };
    e.if(O, (y) => {
      e.get(v) && y(G);
    });
  }
  e.reset(M), e.delegated("pointermove", M, u), e.delegated("pointerup", M, c), e.event("pointercancel", M, c), e.delegated("click", M, (y) => {
    y.target === y.currentTarget && (o(), e.set(v, null), I(y));
  }), e.append(n, M), e.pop();
}
e.delegate(["pointermove", "pointerup", "click"]);
var Si = e.from_html('<li class="svelte-1dbihe0"><code class="svelte-1dbihe0"> </code><span class="dash svelte-1dbihe0">—</span><span class="label svelte-1dbihe0"> </span></li>'), Ti = e.from_html('<h3 class="svelte-1dbihe0">Registered domains</h3> <ul class="domain-list svelte-1dbihe0"></ul>', 1), Ei = e.from_html('<p class="warn svelte-1dbihe0">No graph domains registered. Install or activate a shard that provides one.</p>'), Ai = e.from_html('<div class="graph-empty svelte-1dbihe0"><h2 class="svelte-1dbihe0">No graph open</h2> <p class="hint svelte-1dbihe0">A consumer shard binds a graph by registering a <code>GraphViewDescriptor</code> at <code>sh3-editor.graph-view</code>.</p> <!></div>');
function Di(n, t) {
  e.push(t, !0);
  var r = Ai(), a = e.sibling(e.child(r), 4);
  {
    var s = (l) => {
      var g = Ti(), o = e.sibling(e.first_child(g), 2);
      e.each(o, 21, () => t.domains, (d) => d.id, (d, f) => {
        var h = Si(), k = e.child(h), b = e.child(k, !0);
        e.reset(k);
        var m = e.sibling(k, 2), u = e.child(m, !0);
        e.reset(m), e.reset(h), e.template_effect(() => {
          e.set_text(b, e.get(f).id), e.set_text(u, e.get(f).label);
        }), e.append(d, h);
      }), e.reset(o), e.append(l, g);
    }, i = (l) => {
      var g = Ei();
      e.append(l, g);
    };
    e.if(a, (l) => {
      t.domains.length > 0 ? l(s) : l(i, -1);
    });
  }
  e.reset(r), e.append(n, r), e.pop();
}
function Mi(n, t, r) {
  const a = r.filter((s) => s.slotId === n);
  return a.length > 1 && console.warn(`graph: multiple GraphViewDescriptor matches for slot ${n}; using first`, a), a.length >= 1 ? { kind: "descriptor", descriptor: a[0] } : t && t.asset && t.domainId ? {
    kind: "meta",
    asset: t.asset,
    domainId: t.domainId,
    onChange: t.onChange,
    readonly: t.readonly
  } : { kind: "empty" };
}
function Ni(n) {
  const t = { fields: {} };
  for (const r of n) {
    const a = { label: r.label };
    r.rendererHint && (a.type = r.rendererHint), r.disabled && (a.readonly = !0), t.fields[r.key] = a;
  }
  return t;
}
function Hi(n, t) {
  let r = n;
  for (const a of t) r = r == null ? void 0 : r[a];
  return r;
}
function Ui(n, t, r, a, s, i) {
  return (l, g) => {
    if ((s == null ? void 0 : s(n, l, g)) === !0) return !0;
    const d = t.nodes.get(n);
    if (!d) return !0;
    const f = Hi(d.config, l);
    if (f === g) return !0;
    const h = yi(t, r, n, l, f, g);
    return h.apply(), a.push(h), i(), !0;
  };
}
function Ri() {
  const n = [], t = [], r = /* @__PURE__ */ new Set();
  function a() {
    for (const s of r) s();
  }
  return {
    push(s) {
      n.push(s), t.length = 0, a();
    },
    undo() {
      const s = n.pop();
      return s ? (s.revert(), t.push(s), a(), !0) : !1;
    },
    redo() {
      const s = t.pop();
      return s ? (s.apply(), n.push(s), a(), !0) : !1;
    },
    peek() {
      return n[n.length - 1] ?? null;
    },
    replaceTop(s) {
      return n.length === 0 ? !1 : (n[n.length - 1] = s, a(), !0);
    },
    get canUndo() {
      return n.length > 0;
    },
    get canRedo() {
      return t.length > 0;
    },
    clear() {
      n.length = 0, t.length = 0, a();
    },
    onChange(s) {
      return r.add(s), () => r.delete(s);
    }
  };
}
function Bi(n, t, r, a, s) {
  const i = Ri();
  let l = !0;
  const g = /* @__PURE__ */ new Set();
  function o() {
    const d = Array.from(n.selection);
    for (const f of g) f(d);
  }
  return {
    setAsset(d) {
      if (!l) return;
      const f = xi(n, t, d);
      f.apply(), i.push(f);
    },
    getAsset() {
      return qt(n);
    },
    select(d) {
      l && (n.selection = new Set(d), o());
    },
    clearSelection() {
      if (l) {
        if (n.selection.size === 0) {
          o();
          return;
        }
        n.selection = /* @__PURE__ */ new Set(), o();
      }
    },
    focus(d) {
    },
    fitToContent() {
    },
    history: i,
    onSelectionChange(d) {
      return g.add(d), () => g.delete(d);
    },
    getSelectedInspectorBinding() {
      if (!l) return null;
      const d = Array.from(n.selection);
      if (d.length !== 1) return null;
      const f = d[0], h = n.nodes.get(f);
      return h ? {
        value: h.config,
        meta: Ni(h.configFields),
        onCommit: Ui(
          h.id,
          n,
          t,
          i,
          r == null ? void 0 : r.onCommit,
          a
        )
      } : null;
    },
    _isAlive() {
      return l;
    },
    _kill() {
      l = !1;
    }
  };
}
var Vi = e.from_html('<div class="graph-error svelte-39j3n"><h2 class="svelte-39j3n">Graph error</h2> <p> </p></div>');
function Li(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => Mi(t.slotId, t.meta, t.descriptors));
  let a = e.state(null), s = e.state(null), i = e.state(null), l = e.state(null);
  e.user_effect(() => {
    var b, m, u;
    if (e.get(r).kind === "descriptor" || e.get(r).kind === "meta") {
      const _ = e.get(r).kind === "descriptor" ? e.get(r).descriptor.domainId : e.get(r).domainId, c = t.domains.get(_);
      if (!c) {
        e.set(l, `Domain "${_}" is not registered. Install or activate the shard that provides it.`), e.set(a, null), e.set(s, null), e.set(i, null);
        return;
      }
      e.set(l, null), e.set(s, c, !0);
      const v = e.get(r).kind === "descriptor" ? e.get(r).descriptor.initial : e.get(r).asset, I = dt(v, c);
      e.set(a, I, !0);
      const P = () => {
        var T, A;
        if (e.get(r).kind === "descriptor")
          try {
            e.get(r).descriptor.onChange(e.get(i).getAsset());
          } catch (V) {
            console.warn("graph: onChange threw", V);
          }
        else e.get(r).kind === "meta" && ((A = (T = e.get(r)).onChange) == null || A.call(T, e.get(i).getAsset()));
      }, S = e.get(r).kind === "descriptor" ? e.get(r).descriptor : void 0, D = Bi(I, c, S, P);
      if (e.set(i, D, !0), e.get(r).kind === "descriptor")
        try {
          (m = (b = e.get(r).descriptor).bind) == null || m.call(b, D);
        } catch (T) {
          console.warn("graph: descriptor.bind threw", T);
        }
      (u = t.onControllerReady) == null || u.call(t, D);
    } else
      e.set(a, null), e.set(s, null), e.set(i, null), e.set(l, null);
    return () => {
      var _;
      (_ = e.get(i)) == null || _._kill(), e.set(i, null);
    };
  });
  const g = e.derived(() => {
    const b = e.get(i);
    return b ? b.history : null;
  });
  var o = e.comment(), d = e.first_child(o);
  {
    var f = (b) => {
      var m = Vi(), u = e.sibling(e.child(m), 2), _ = e.child(u, !0);
      e.reset(u), e.reset(m), e.template_effect(() => e.set_text(_, e.get(l))), e.append(b, m);
    }, h = (b) => {
      {
        let m = e.derived(() => t.domains.list());
        Di(b, {
          get domains() {
            return e.get(m);
          }
        });
      }
    }, k = (b) => {
      Ii(b, {
        get state() {
          return e.get(a);
        },
        get domain() {
          return e.get(s);
        },
        get history() {
          return e.get(g);
        },
        onSelectionChange: () => {
        }
      });
    };
    e.if(d, (b) => {
      e.get(l) ? b(f) : e.get(r).kind === "empty" ? b(h, 1) : e.get(a) && e.get(s) && e.get(g) && b(k, 2);
    });
  }
  e.append(n, o), e.pop();
}
function Oi(n) {
  return {
    log: (t, r, ...a) => {
      (t === "debug" ? console.debug : t === "info" ? console.info : t === "warn" ? console.warn : console.error)(`[graph:${n}] ${r}`, ...a);
    }
  };
}
function qi() {
  const n = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  return {
    register(r) {
      n.set(r.id, r.factory);
    },
    unregister(r) {
      n.delete(r), t.delete(r);
    },
    get(r) {
      const a = t.get(r);
      if (a) return a;
      const s = n.get(r);
      if (!s) return null;
      const i = s(Oi(r));
      return t.set(r, i), i;
    },
    list() {
      return Array.from(n.keys()).map((r) => ({ id: r, label: r }));
    },
    clear() {
      n.clear(), t.clear();
    }
  };
}
const Mt = "sh3-editor.graph-domain", Nt = "sh3-editor.graph-view";
let be = null, ct = null, Ae = null, De = null, Me = null, Ne = null, He = null, fe = null, Ue = null;
function Wi() {
  return ct;
}
const Ht = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [
      { id: "sh3-editor:editor", label: "Editor", standalone: !0 },
      { id: "sh3-editor:inspector", label: "Inspector", standalone: !0 },
      { id: "sh3-editor:color-picker", label: "Color Picker", standalone: !0 },
      { id: "sh3-editor:settings", label: "Settings", standalone: !0 },
      { id: "sh3-editor:help", label: "Help", standalone: !0 },
      { id: "sh3-editor:graph", label: "Graph", standalone: !0 }
    ]
  },
  activate(n) {
    be = new rn();
    const { api: t, internals: r, teardown: a } = mn(be);
    ct = t, Ae = r, De = a, Ht.api = t;
    const s = () => {
      Pt(n.contributions.list(rt));
    };
    s(), Me = n.contributions.onChange(rt, s);
    const i = n.state({
      user: { colorPickerPalettes: [] }
    });
    function l(m) {
      const u = i.user.colorPickerPalettes, _ = u.findIndex((c) => c.id === m.id);
      _ === -1 ? u.push(m) : u[_] = m;
    }
    function g(m) {
      const u = i.user.colorPickerPalettes, _ = u.findIndex((c) => c.id === m);
      _ !== -1 && u.splice(_, 1);
    }
    St({
      internals: r,
      userPalettes: i.user.colorPickerPalettes,
      onSaveUserPalette: l,
      onDeleteUserPalette: g
    });
    const o = {
      id: "sh3-editor:color",
      type: "color",
      component: or,
      priority: 10
    };
    Ne = n.contributions.register(rt, o);
    const d = {
      id: "sh3-editor:color-picker",
      priority: 10,
      open: (m) => Tn(m, {
        userPalettes: i.user.colorPickerPalettes,
        onSaveUserPalette: l,
        onDeleteUserPalette: g
      })
    };
    He = n.contributions.register($t, d);
    const f = {};
    n.registerView("sh3-editor:editor", {
      mount(m, u) {
        const _ = u.slotId, c = be.get(_), v = (c == null ? void 0 : c.options) || f, I = _e(Gn, {
          target: m,
          props: {
            entry: c,
            internals: Ae,
            highlight: v.highlight,
            matchingConfig: v.matchingConfig,
            fontSize: v.fontSize,
            toolbarActions: v.toolbarActions,
            showSettings: v.showSettings
          }
        });
        return {
          closable: !0,
          unmount() {
            ge(I);
          }
        };
      }
    }), n.registerView("sh3-editor:inspector", {
      mount(m, u) {
        const _ = u.slotId, c = u.meta, v = _e(rr, {
          target: m,
          props: {
            instanceId: _,
            adHocValue: c == null ? void 0 : c.value,
            adHocMeta: c == null ? void 0 : c.meta,
            adHocReadonly: (c == null ? void 0 : c.readonly) ?? !1,
            internals: Ae
          }
        });
        return {
          closable: !0,
          unmount() {
            ge(v);
          }
        };
      }
    }), n.registerView("sh3-editor:color-picker", {
      mount(m, u) {
        const _ = u.slotId, c = r.colorPickers.get(_), v = u.meta, I = n.contributions.list(En), P = An(_, c, I, v), S = _e(Ot, {
          target: m,
          props: {
            instanceId: _,
            adHocValue: P.kind === "adhoc" ? P.adHocValue : void 0,
            adHocReadonly: P.kind === "adhoc" ? P.adHocReadonly : !1,
            internals: Ae,
            prefs: (c == null ? void 0 : c.options.prefs) ?? { mode: "hsv" },
            compact: (c == null ? void 0 : c.options.compact) ?? !1,
            userPalettes: i.user.colorPickerPalettes,
            onSaveUserPalette: l,
            onDeleteUserPalette: g,
            descriptorBinding: P.kind === "descriptor" ? P.descriptor : void 0
          }
        });
        return {
          closable: !0,
          unmount() {
            ge(S);
          }
        };
      }
    }), fe = qi();
    const h = () => {
      fe.clear();
      const m = n.contributions.list(Mt);
      for (const u of m) fe.register(u);
    };
    h(), Ue = n.contributions.onChange(Mt, h), n.registerView("sh3-editor:graph", {
      mount(m, u) {
        const _ = u.slotId, c = u.meta;
        let v = null;
        const I = () => {
          v && (ge(v), v = null);
          const S = n.contributions.list(Nt);
          v = _e(Li, {
            target: m,
            props: {
              slotId: _,
              meta: c,
              descriptors: S,
              domains: fe
            }
          });
        };
        I();
        const P = n.contributions.onChange(Nt, I);
        return {
          closable: !0,
          unmount() {
            P(), v && (ge(v), v = null);
          }
        };
      }
    }), n.registerView("sh3-editor:settings", {
      mount(m) {
        const u = _e(Dr, {
          target: m,
          props: { ctx: n }
        });
        return {
          closable: !0,
          unmount() {
            ge(u);
          }
        };
      }
    }), n.registerView("sh3-editor:help", {
      mount(m) {
        const u = _e(Et, {
          target: m,
          props: { surface: "view", ctx: n }
        });
        return {
          closable: !0,
          unmount() {
            ge(u);
          }
        };
      }
    });
    const k = {
      id: "sh3-editor:help-tab:hotkeys",
      label: "Hotkeys",
      priority: 0,
      mount() {
        return { unmount() {
        } };
      }
    };
    n.contributions.register(
      Vt,
      k
    );
    let b = !1;
    n.actions.register({
      id: "sh3-editor:help.open",
      label: "Open Help",
      scope: ["home", "app"],
      defaultShortcut: "F1",
      allowInInputs: !0,
      paletteItem: !0,
      contextItem: !1,
      group: "Help",
      run() {
        b || (b = !0, Ve.modal.open(
          Et,
          { surface: "modal", ctx: n, onClose: () => {
            b = !1;
          } },
          { dismissOnBackdrop: !0 }
        ));
      }
    }), n.actions.register({
      id: "sh3-editor:settings.open",
      label: "Open Editor Settings",
      scope: "view:sh3-editor:settings",
      paletteItem: !0,
      contextItem: !1,
      group: "Editor",
      run() {
      }
    });
  },
  deactivate() {
    Ue == null || Ue(), Ue = null, fe == null || fe.clear(), fe = null, Ne == null || Ne(), Ne = null, He == null || He(), He = null, St(null), Me == null || Me(), Me = null, De == null || De(), be == null || be.clear(), Pt([]), be = null, ct = null, Ae = null, De = null, Ht.api = null;
  }
};
export {
  Wi as getApi,
  Ht as shard
};
