import type { NavLink } from "./types";
export const site = {
  name: "Siddharth",
  title: "Siddharth — Web Design & Development",
  description: "I design and build modern websites for businesses that want to stand out online.",
  tagline: "Web design · Development · Digital experiences",
  url: "https://siddharth-web-dev.vercel.app",
  ogImage: { url: "/og-image.png", width: 1200, height: 630, alt: "Siddharth — Websites that make your business stand out." },
  socials: [] as NavLink[], // TODO: add real social links only when available
};
export const nav: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
];
