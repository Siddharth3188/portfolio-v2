"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/data/site";

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const isActive = (href: string) => path === href || path.startsWith(href + "/");
  const link = (href: string) => `block py-3.5 text-[17px] md:py-0 md:text-[14.5px] ${isActive(href) ? "text-fg" : "text-mute hover:text-fg"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="wrap flex h-[68px] items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-[0.2em]">SIDDHARTH</Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {nav.map((n) => <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={link(n.href)}>{n.label}</Link>)}
          <Link href="/contact" className="rounded-full bg-acc px-5 py-2.5 text-[14.5px] font-semibold text-accfg">Contact</Link>
        </nav>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-xl md:hidden">
          {open ? "✕" : "☰"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label={`${site.name} mobile`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-line bg-bg md:hidden">
            <div className="wrap pb-5 pt-2">
              {nav.map((n) => <Link key={n.href} href={n.href} className={link(n.href)}>{n.label}</Link>)}
              <Link href="/contact" className="mt-3 block rounded-full bg-acc py-3.5 text-center font-semibold text-accfg">Contact</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
