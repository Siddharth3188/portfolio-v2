"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import StylePresetCard from "./StylePresetCard";
import { useStyle } from "./StyleProvider";
import { isDefault, presets, withPreset } from "@/data/stylePresets";

const SEEN_KEY = "sp:intro-seen";
const HEADER_OFFSET = 88; // sticky navbar + breathing room
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const readSeen = () => { try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch { return false; } };
const writeSeen = () => { try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ } };

/** Classic pixel-art pointing hand (white fill, black outline), drawn from an ASCII map with crisp edges. X = outline, W = fill. */
const HAND = [
  ".....XX.........",
  "....XWWX........",
  "....XWWX........",
  "....XWWX........",
  "....XWWXXX......",
  "....XWWXWWXXX...",
  ".XX.XWWXWWXWWXX.",
  "XWWXXWWWWWWWWWWX",
  ".XWWWWWWWWWWWWWX",
  "..XWWWWWWWWWWWWX",
  "..XWWWWWWWWWWWX.",
  "...XWWWWWWWWWWX.",
  "...XWWWWWWWWWX..",
  "....XWWWWWWWWX..",
  "....XXXXXXXXXX..",
];
const PX = 2.75; // CSS px per art pixel
const HAND_RECTS = (() => {
  const out: { x: number; y: number; w: number; c: string }[] = [];
  HAND.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") { x++; continue; }
      let w = 1;
      while (row[x + w] === c) w++;
      out.push({ x, y, w, c });
      x += w;
    }
  });
  return out;
})();
const Pointer = () => (
  <svg width={16 * PX} height={HAND.length * PX} viewBox={`0 0 16 ${HAND.length}`} shapeRendering="crispEdges" aria-hidden="true">
    {HAND_RECTS.map((r) => <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.c === "X" ? "#000" : "#fff"} />)}
  </svg>
);

/** Rounded-rect hole as an even-odd clip path over the whole viewport: a true spotlight cutout. */
const holePath = (W: number, H: number, x: number, y: number, w: number, h: number, r: number) => {
  const f = (n: number) => Math.round(n * 10) / 10;
  return `path(evenodd,"M0 0H${W}V${H}H0Z M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z")`;
};

/**
 * Home / Work entry point to the shared Style Playground.
 * With `spotlight` (Home only) it plays a short, once-per-session intro: a hand pointer "clicks" the style cards
 * while the rest of the page is softly dimmed. The overlay never captures pointer events, scrolling or focus.
 */
export default function StyleShowcase({ spotlight = false }: { spotlight?: boolean }) {
  const { config, setConfig, open, openDrawer } = useStyle();
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null); // the content block that gets spotlighted
  const overlayRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [lit, setLit] = useState(false); // overlay is mounted (stays mounted while it fades out)
  const [hint, setHint] = useState<number | null>(null);
  const guideRef = useRef<(() => void) | null>(null); // scrolls the spotlighted block back into view
  const cards = presets; // all five themes, default first

  // Retires the intro for this session. It ends only when a theme is actually chosen (a card click, or any theme change).
  // Scrolling, resizing, hovering, focusing and pointer movement never end it.
  const end = useCallback(() => {
    writeSeen();
    setPhase("done");
    setHint(null);
  }, []);

  // Start once, when the section is mostly in view, only if the visitor hasn't seen it and is still on the default style.
  useEffect(() => {
    if (!spotlight || reduce || phase !== "idle" || !isDefault(config) || readSeen()) return;
    const grid = gridRef.current;
    if (!grid) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      const need = Math.min(e.boundingClientRect.height * 0.6, window.innerHeight * 0.5);
      if (e.intersectionRect.height >= need) { timer ??= setTimeout(() => { setLit(true); setTimeout(() => setPhase((p) => (p === "idle" ? "active" : p)), 40); }, 600); }
      else if (timer) { clearTimeout(timer); timer = undefined; }
    }, { threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1] });
    io.observe(grid);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [spotlight, reduce, phase, config]);

  // Choosing a theme anywhere (e.g. inside the Style Playground) completes the tour.
  useEffect(() => { if (phase === "active") end(); }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  // Guidance: if the visitor scrolls (wheel, touch, keys) or resizes so the block is mostly out of view, ease them back
  // once scrolling has settled. Debounced, never during a touch, and never while a guided scroll is still running.
  useEffect(() => {
    if (phase !== "active" || open) return;
    let timer: ReturnType<typeof setTimeout> | undefined, guard: ReturnType<typeof setTimeout> | undefined;
    let guiding = false, touching = false;
    const guide = () => {
      const t = targetRef.current, g = gridRef.current;
      if (!t || !g) return;
      const vh = window.innerHeight, tr = t.getBoundingClientRect();
      const delta = tr.height <= vh - HEADER_OFFSET - 24
        ? tr.top - (HEADER_OFFSET + (vh - HEADER_OFFSET - tr.height) / 2) // short block: centre it
        : g.getBoundingClientRect().top - (HEADER_OFFSET + 72);          // tall block (mobile): keep the cards at the top
      if (Math.abs(delta) < 8) return;
      guiding = true;
      window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
      clearTimeout(guard);
      guard = setTimeout(() => { guiding = false; }, 1100);
    };
    guideRef.current = guide;
    const check = () => {
      if (guiding || touching) return;
      const t = targetRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect(), vh = window.innerHeight;
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, HEADER_OFFSET));
      if (visible < Math.min(r.height, vh - HEADER_OFFSET) * 0.4) guide();
    };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(check, 450); };
    const down = () => { touching = true; };
    const up = () => { touching = false; schedule(); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchend", up, { passive: true });
    window.addEventListener("touchcancel", up, { passive: true });
    return () => {
      guideRef.current = null;
      clearTimeout(timer); clearTimeout(guard);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, [phase, open, reduce]);

  // Onboarding gate. While the tour is active only the theme controls work:
  //  - everything else on the page is made `inert` (not focusable, not clickable, hidden from assistive tech), so keyboard
  //    focus can never land on a control that does nothing; and
  //  - clicks / middle-clicks / form submits on any other interactive element are cancelled in the capture phase, so no
  //    navigation or action can fire even if something slips past `inert`.
  // Scrolling is untouched. Everything is restored the moment the tour ends.
  useEffect(() => {
    if (phase !== "active") return;
    const section = sectionRef.current;
    const inerted: Element[] = [];
    document.querySelectorAll("body > a, body > header, body > footer, main > *").forEach((el) => {
      if (section && (el === section || el.contains(section))) return;
      if (!el.hasAttribute("inert")) { el.setAttribute("inert", ""); inerted.push(el); }
    });
    const guard = (e: Event) => {
      const t = e.target;
      if (!(t instanceof Element) || t.closest("[data-tour-allow],[data-sp-drawer]")) return;
      if (t.closest("a,button,[role='button'],input,select,textarea,summary,label,form")) { e.preventDefault(); e.stopPropagation(); }
    };
    const events = ["click", "auxclick", "submit"] as const;
    events.forEach((ev) => document.addEventListener(ev, guard, true));
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, guard, true));
      inerted.forEach((el) => el.removeAttribute("inert"));
    };
  }, [phase]);

  // Keep the cutout glued to the real position and size of the block (scroll, resize, layout shifts).
  useEffect(() => {
    if (!lit) return;
    let raf = 0;
    const tick = () => {
      const o = overlayRef.current, t = targetRef.current;
      if (o && t) {
        const r = t.getBoundingClientRect(), pad = 20;
        o.style.clipPath = holePath(document.documentElement.clientWidth, window.innerHeight, r.left - pad, r.top - pad, r.width + pad * 2, r.height + pad * 2, 22);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [lit]);

  // Fade the overlay out, then unmount it.
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setLit(false), 500);
    return () => clearTimeout(t);
  }, [phase]);

  // The pointer loop is decorative only: glide to a card, press, release, fade, repeat. It never controls the overlay.
  useEffect(() => {
    if (phase !== "active") return;
    let cancelled = false;
    (async () => {
      await sleep(500);
      while (!cancelled) {
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
      await sleep(2600);
      }
    })();
    return () => { cancelled = true; };
  }, [phase, cards.length, animate]);

  const active = phase === "active";
  return (
    <section ref={sectionRef} className="relative border-t border-line py-24">
      {spotlight && lit && active && !open && (
        <button
          type="button" data-tour-allow=""
          onClick={() => { guideRef.current?.(); gridRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }); }}
          className="fixed bottom-4 left-1/2 z-[36] -translate-x-1/2 rounded-full border border-white/40 bg-black/70 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm"
        >
          Try theme
        </button>
      )}
      {spotlight && lit && (
        <div
          ref={overlayRef} aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-[35] transition-opacity duration-500 ${active && !open ? "opacity-100" : "opacity-0"}`}
          style={{ background: "rgba(6,10,18,.66)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
        />
      )}
      <div ref={targetRef} data-tour-allow="" className="wrap">
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
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              {cards.map((p, i) => (
                <div key={p.id} className={`h-full transition duration-300 hover:-translate-y-1 [&_button]:h-full [&_button]:w-full [&_button]:cursor-pointer ${hint === i ? "-translate-y-1 [&_button]:ring-2 [&_button]:ring-acc" : ""}`}>
                  <StylePresetCard size="lg" preset={p} selected={config.preset === p.id} onSelect={() => { end(); setConfig(withPreset(p.id)); openDrawer(); }} />
                </div>
              ))}
            </div>
            {active && (
              <>
                <span data-ripple="" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -ml-6 -mt-6 h-12 w-12 rounded-full border-2 border-acc bg-acc/20 opacity-0" />
                <span data-pointer="" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 opacity-0" style={{ marginLeft: -5.5 * PX, marginTop: 0, transformOrigin: `${5.5 * PX}px 0px` }}>
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
