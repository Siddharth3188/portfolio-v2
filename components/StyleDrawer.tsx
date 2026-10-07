"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import StylePresetCard from "./StylePresetCard";
import { useStyle } from "./StyleProvider";
import { accents, isDefault, presets, radii, resolveConfig, surfaces, typographies, withOverride, withPreset } from "@/data/stylePresets";

const opt = (on: boolean) => `rounded-md border px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${on ? "border-fg bg-fg text-bg" : "border-line text-fg hover:border-fg"}`;
const Label = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h3 id={id} className="mb-3 text-[12.5px] font-medium uppercase tracking-[0.14em] text-mute">{children}</h3>
);

/** Single shared drawer, mounted once by StyleProvider and opened from anywhere via useStyle().openDrawer(). */
export default function StyleDrawer() {
  const { open, closeDrawer: onClose, config, setConfig, reset } = useStyle();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),input,[href],[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  const r = resolveConfig(config);
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  const off = desktop ? { x: "100%" } : { y: "100%" };
  const t = { duration: reduce ? 0 : 0.3, ease: "easeOut" as const };
  const radiusIdx = Math.max(0, radii.findIndex((x) => x.id === r.radius));

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop" aria-hidden="true" onClick={onClose} className="fixed inset-0 z-40 bg-black/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t} />
          <motion.aside
            key="panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="sp-title" data-sp-drawer=""
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[82dvh] flex-col rounded-t-xl border-t border-line bg-bg text-fg shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none md:border-l md:border-t-0"
            initial={off} animate={{ x: 0, y: 0 }} exit={off} transition={t}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h2 id="sp-title" className="text-[12.5px] font-semibold uppercase tracking-[0.14em]">Style Playground</h2>
                <p className="mt-1 text-sm text-mute">Explore different visual directions.</p>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} className="min-h-11 rounded-md border border-line px-3.5 text-sm font-medium transition-colors hover:border-fg">Close</button>
            </header>

            <div className="flex-1 space-y-8 overflow-y-auto px-5 py-5">
              <section aria-labelledby="sp-direction">
                <Label id="sp-direction">Visual Style</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {presets.map((p, i) => (
                    <StylePresetCard key={p.id} preset={p} selected={config.preset === p.id} onSelect={() => setConfig(withPreset(p.id))} className={i === 0 ? "col-span-2" : ""} />
                  ))}
                </div>
              </section>

              <div className="space-y-7 border-t border-line pt-6">
                <p className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-mute">Fine tune</p>

                <section aria-labelledby="sp-accent">
                  <Label id="sp-accent">Accent</Label>
                  <div className="flex flex-wrap gap-2">
                    {accents.map((a) => (
                      <button key={a.id} type="button" aria-pressed={r.accent === a.id} onClick={() => setConfig(withOverride(config, "accent", a.id))} className={`flex items-center gap-2 ${opt(r.accent === a.id)}`}>
                        <span data-sp-swatch="" data-sp-accent={a.id} data-sp-tone="light" aria-hidden="true" className="h-3.5 w-3.5 rounded-full bg-acc ring-1 ring-black/10" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="sp-surface">
                  <Label id="sp-surface">Surface</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {surfaces.map((s) => (
                      <button key={s.id} type="button" aria-pressed={r.surface === s.id} onClick={() => setConfig(withOverride(config, "surface", s.id))} className={`px-2 ${opt(r.surface === s.id)}`}>{s.label}</button>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="sp-radius">
                  <Label id="sp-radius">Corner Radius</Label>
                  <input
                    type="range" min={0} max={radii.length - 1} step={1} value={radiusIdx}
                    aria-labelledby="sp-radius" aria-valuetext={radii[radiusIdx].label}
                    onChange={(e) => setConfig(withOverride(config, "radius", radii[Number(e.target.value)].id))}
                    className="h-8 w-full cursor-pointer accent-acc"
                  />
                  <div className="mt-1 flex justify-between text-xs text-mute" aria-hidden="true">
                    {radii.map((x, i) => <span key={x.id} className={i === radiusIdx ? "font-semibold text-fg" : ""}>{x.label}</span>)}
                  </div>
                </section>

                <section aria-labelledby="sp-type">
                  <Label id="sp-type">Typography</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {typographies.map((ty) => (
                      <button key={ty.id} type="button" aria-pressed={r.type === ty.id} onClick={() => setConfig(withOverride(config, "type", ty.id))} className={`flex items-baseline gap-3 text-left ${opt(r.type === ty.id)}`}>
                        <span data-sp-typeprev="" data-sp-type={ty.id} aria-hidden="true" className="text-xl leading-none">Aa</span>
                        {ty.label}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <footer className="border-t border-line px-5 py-4">
              <button type="button" onClick={reset} disabled={isDefault(config)} className="min-h-11 w-full rounded-md border border-line text-sm font-medium transition-colors hover:border-fg disabled:cursor-not-allowed disabled:opacity-50">Reset to default</button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
