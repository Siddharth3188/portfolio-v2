import type { NavLink } from "./types";
export const site = {
  name: "Siddharth",
  title: "Siddharth — Web Designer & Developer",
  description: "I design and build modern, responsive websites for businesses, organizations and brands.",
  tagline: "Web design · Development · Digital experiences",
  url: "https://example.com", // TODO: replace with the real domain
  socials: [] as NavLink[], // TODO: add real social links only when available
};
export const nav: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
];
