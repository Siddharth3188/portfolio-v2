"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import StylePresetCard from "./StylePresetCard";
import { useStyle } from "./StyleProvider";
import { isDefault, presets, withPreset } from "@/data/stylePresets";

const SEEN_KEY = "sp:intro-seen";
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const readSeen = () => { try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch { return false; } };
const writeSeen = () => { try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ } };

/** Hand-pointer icon; the fingertip is at (8,2) of the 24px viewBox. */
const Pointer = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))" }}>
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15V4a2 2 0 0 1 4 0v6.5" fill="#fff" />
    <path d="M18 11v-1a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /><path d="M14 10V9a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1" />
  </svg>
);

/**
 * Home / Work entry point to the shared Style Playground.
 * With `spotlight` (Home only) it plays a short, once-per-session intro: a hand pointer "clicks" the style cards
 * while the rest of the page is softly dimmed. The overlay never captures pointer events, scrolling or focus.
 */
export default function StyleShowcase({ spotlight = false }: { spotlight?: boolean }) {
  const { config, setConfig, openDrawer } = useStyle();
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [lit, setLit] = useState(false); // keeps the section raised while the overlay fades out
  const [hint, setHint] = useState<number | null>(null);
  const cards = presets.filter((p) => p.engine);

  // Any interaction (or Escape / scrolling away) permanently retires the intro for this session.
  const end = useCallback(() => {
    writeSeen();
    setPhase("done");
    setHint(null);
  }, []);

  // Start once, when the section is mostly in view, only if the visitor hasn't seen it and is still on the default style.
  useEffect(() => {
    if (!spotlight || reduce || phase !== "idle" || !isDefault(config) || readSeen()) return;
    const el = sectionRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.55) { timer ??= setTimeout(() => { setLit(true); setPhase("active"); }, 600); }
      else if (timer) { clearTimeout(timer); timer = undefined; }
    }, { threshold: [0, 0.15, 0.55] });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [spotlight, reduce, phase, config]);

  // While active: end on Escape or when the section scrolls out of view. Never blocks anything.
  useEffect(() => {
    if (phase !== "active") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") end(); };
    document.addEventListener("keydown", onKey);
    const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio < 0.15) end(); }, { threshold: [0.15] });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => { document.removeEventListener("keydown", onKey); io.disconnect(); };
  }, [phase, end]);

  // Fade the overlay out, then drop the raised stacking.
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setLit(false), 600);
    return () => clearTimeout(t);
  }, [phase]);

  // The pointer loop: glide to a card, press, release, fade; repeat across the cards a few times.
  useEffect(() => {
    if (phase !== "active") return;
    let cancelled = false;
    (async () => {
      await sleep(500);
      for (let i = 0; i < cards.length && !cancelled; i++) {
        const grid = gridRef.current, card = grid?.children[i] as HTMLElement | undefined;
        if (!grid || !card) break;
        const g = grid.getBoundingClientRect(), r = card.getBoundingClientRect();
        const tx = r.left - g.left + r.width * 0.62, ty = r.top - g.top + r.height * 0.5;
        await animate("[data-pointer]", { x: tx - 90, y: ty + 80, opacity: 0, scale: 1 }, { duration: 0 });
        await animate("[data-pointer]", { x: tx, y: ty, opacity: 1 }, { duration: 1, ease: "easeInOut" });
        if (cancelled) return;
        setHint(i);
        await animate("[data-pointer]", { scale: 0.84 }, { duration: 0.12 });
        await animate("[data-ripple]", { x: tx, y: ty, scale: 0.2, opacity: 0.6 }, { duration: 0 });
        animate("[data-ripple]", { scale: 1.8, opacity: 0 }, { duration: 0.6, ease: "easeOut" });
        await animate("[data-pointer]", { scale: 1 }, { duration: 0.16 });
        await sleep(650);
        if (cancelled) return;
        await animate("[data-pointer]", { opacity: 0 }, { duration: 0.3 });
        setHint(null);
        await sleep(900);
      }
      if (!cancelled) end();
    })();
    return () => { cancelled = true; };
  }, [phase, cards.length, animate, end]);

  const active = phase === "active";
  return (
    <section ref={sectionRef} className={`relative border-t border-line py-24 ${lit ? "z-40" : ""}`}>
      {spotlight && (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`} style={{ boxShadow: "0 0 0 100vmax rgba(6,10,18,.55)" }} />
      )}
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Design system" title="Design has more than one direction." description="Explore how the same digital system can evolve across different visual languages." />
        </Reveal>
        <Reveal delay={0.05} className="mt-10">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
            <span aria-hidden="true">↓</span> Click to try
          </p>
          <div ref={scope} className="relative">
            <div
              ref={gridRef}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              onPointerEnter={end} onPointerDown={end} onFocusCapture={end}
            >
              {cards.map((p, i) => (
                <div key={p.id} className={`h-full transition duration-300 hover:-translate-y-1 [&_button]:h-full [&_button]:w-full [&_button]:cursor-pointer ${hint === i ? "-translate-y-1 [&_button]:ring-2 [&_button]:ring-acc" : ""}`}>
                  <StylePresetCard size="lg" preset={p} selected={config.preset === p.id} onSelect={() => { setConfig(withPreset(p.id)); openDrawer(); }} />
                </div>
              ))}
            </div>
            {active && (
              <>
                <span data-ripple="" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -ml-6 -mt-6 h-12 w-12 rounded-full border-2 border-acc bg-acc/20 opacity-0" />
                <span data-pointer="" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 opacity-0" style={{ marginLeft: -12, marginTop: -3 }}>
                  <Pointer />
                </span>
              </>
            )}
          </div>
          <div className="mt-8">
            <button type="button" data-btn="primary" onClick={openDrawer} aria-haspopup="dialog" className="inline-flex items-center justify-center rounded-full border border-acc bg-acc px-6 py-3.5 text-[14.5px] font-semibold tracking-wide text-accfg transition duration-300 hover:-translate-y-0.5">Explore visual styles →</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
