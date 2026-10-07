"use client";
import "./style-playground.css";
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import StyleDrawer from "./StyleDrawer";
import { ATTR_KEYS, DEFAULT_CONFIG, STORAGE_KEY, STORAGE_VERSION, isDefault, sanitize, toAttrs, type StyleConfig } from "@/data/stylePresets";

type Ctx = { config: StyleConfig; setConfig: Dispatch<SetStateAction<StyleConfig>>; open: boolean; openDrawer: () => void; closeDrawer: () => void; reset: () => void };
const StyleContext = createContext<Ctx | null>(null);

export function useStyle(): Ctx {
  const ctx = useContext(StyleContext);
  if (!ctx) throw new Error("useStyle must be used inside <StyleProvider>");
  return ctx;
}

function applyAttrs(config: StyleConfig) {
  const el = document.documentElement;
  const attrs = isDefault(config) ? {} : toAttrs(config);
  ATTR_KEYS.forEach((k) => (k in attrs ? el.setAttribute(k, attrs[k]) : el.removeAttribute(k)));
}
function persist(config: StyleConfig) {
  try {
    if (isDefault(config)) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STORAGE_VERSION, config, attrs: toAttrs(config) }));
  } catch { /* storage unavailable: the style simply won't persist */ }
}
function load(): StyleConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { v?: number; config?: unknown }) : null;
    return parsed && parsed.v === STORAGE_VERSION ? sanitize(parsed.config) : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}

/** One shared style engine: state lives here (in the root layout) so a style survives navigation. */
export default function StyleProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StyleConfig>(DEFAULT_CONFIG); // SSR + first client render are always the default
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => { setConfig(load()); setReady(true); }, []);
  useLayoutEffect(() => { if (ready) { applyAttrs(config); persist(config); } }, [config, ready]);

  const openDrawer = useCallback(() => { opener.current = document.activeElement as HTMLElement | null; setOpen(true); }, []);
  const closeDrawer = useCallback(() => {
    setOpen(false);
    const el = opener.current;
    opener.current = null;
    if (el && document.contains(el)) el.focus();
  }, []);
  const reset = useCallback(() => setConfig(DEFAULT_CONFIG), []);
  const value = useMemo(() => ({ config, setConfig, open, openDrawer, closeDrawer, reset }), [config, open, openDrawer, closeDrawer, reset]);

  return (
    <StyleContext.Provider value={value}>
      {children}
      <StyleDrawer />
    </StyleContext.Provider>
  );
}
