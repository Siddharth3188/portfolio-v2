"use client";
import "./style-playground.css";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import StyleDrawer from "./StyleDrawer";
import { ATTR_KEYS, DEFAULT_CONFIG, STORAGE_KEY, getPreset, isDefault, sanitize, toAttrs, type StyleConfig } from "@/data/stylePresets";

function applyAttrs(config: StyleConfig) {
  const el = document.documentElement;
  if (isDefault(config)) ATTR_KEYS.forEach((k) => el.removeAttribute(k));
  else Object.entries(toAttrs(config)).forEach(([k, v]) => el.setAttribute(k, v));
}
function persist(config: StyleConfig) {
  try {
    if (isDefault(config)) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, attrs: toAttrs(config) }));
  } catch { /* storage unavailable: the style simply won't persist */ }
}
function load(): StyleConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize((JSON.parse(raw) as { config?: unknown }).config) : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}

export default function StylePlayground() {
  const [config, setConfig] = useState<StyleConfig>(DEFAULT_CONFIG);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  // Restore a saved style before paint (SSR always renders the default).
  useLayoutEffect(() => { setConfig(load()); setReady(true); }, []);
  useLayoutEffect(() => { if (ready) { applyAttrs(config); persist(config); } }, [config, ready]);
  // Leaving /process always returns the rest of the site to its default look.
  useLayoutEffect(() => () => applyAttrs(DEFAULT_CONFIG), []);

  const close = useCallback(() => { setOpen(false); trigger.current?.focus(); }, []);
  const reset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  return (
    <section className="border-t border-line py-20">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Design system" title="Explore the visual direction" description="See how the same design system can adapt to different visual directions without losing clarity, usability or personality." />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="inline-flex items-center justify-center rounded-full border border-fg px-6 py-3.5 text-[14.5px] font-semibold tracking-wide text-fg transition duration-300 hover:-translate-y-0.5">Open Style Playground</button>
            <p aria-live="polite" className="text-sm text-mute">{isDefault(config) ? "" : `Current direction: ${getPreset(config.preset).label}`}</p>
          </div>
        </Reveal>
      </div>
      <StyleDrawer open={open} onClose={close} config={config} onChange={setConfig} onReset={reset} />
    </section>
  );
}
