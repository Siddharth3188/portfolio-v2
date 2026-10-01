import type { Project, ProjectImage } from "./types";
const img = (dir: string, file: string, alt: string): ProjectImage => ({ src: `/images/portfolio/${dir}/${file}.svg`, alt, width: 1600, height: 1000 });
// Swap the .svg placeholders for real screenshots (e.g. featured.webp) and update `img` above.
export const projects: Project[] = [
  {
    slug: "bytezone",
    title: "ByteZone Computers",
    category: "Starter website",
    status: "Portfolio Concept",
    description: "A clean, responsive website concept for a local computer and laptop business, focused on services, enquiries and a straightforward customer experience.",
    overview: "A straightforward, conversion-focused website created for a local computer business.",
    objective: "Give a local computer and laptop business a clear online presence where customers can see what it offers and get in touch easily.",
    approach: "A simple structure, readable typography and clear calls to action, laid out to work comfortably on phones as well as desktops.",
    highlights: ["Home", "Services", "About", "Contact", "Responsive design"],
    considerations: ["Clear service descriptions", "Easy ways to enquire", "Responsive layout across devices"],
    technologies: [], // TODO: list only what the deployed demo actually uses
    liveUrl: "", // TODO: add deployed demo URL
    featuredImage: img("bytezone", "featured", "ByteZone Computers website preview (placeholder)"),
    gallery: [img("bytezone", "gallery-1", "ByteZone Computers screen 1 (placeholder)"), img("bytezone", "gallery-2", "ByteZone Computers screen 2 (placeholder)")],
  },
  {
    slug: "sakthi-sudar-foundation",
    title: "Sakthi Sudar Foundation",
    category: "Business website",
    status: "Portfolio Concept",
    description: "A content-rich organizational website designed to communicate programs, objectives and community initiatives clearly.",
    overview: "A content-rich website designed to make a growing organization's information easier to understand and navigate.",
    objective: "Present an organization's programs, objectives and initiatives in a way that is easy to follow.",
    approach: "Content organized into clearly separated sections with consistent navigation, so visitors can find programs, team and contact information quickly.",
    highlights: ["Homepage", "Programs", "Objectives", "Gallery", "Team", "Contact", "Organizational content"],
    considerations: ["A large amount of organizational content", "Clear navigation hierarchy", "Gallery and team sections"],
    technologies: [],
    liveUrl: "",
    featuredImage: img("ssf", "featured", "Sakthi Sudar Foundation website preview (placeholder)"),
    gallery: [img("ssf", "gallery-1", "Sakthi Sudar Foundation screen 1 (placeholder)"), img("ssf", "gallery-2", "Sakthi Sudar Foundation screen 2 (placeholder)")],
  },
  {
    slug: "atelier",
    title: "Atelier",
    category: "Premium website",
    status: "Demo Project",
    description: "A high-end editorial website concept created for an interior architecture and design studio.",
    overview: "An editorial digital experience created for a fictional interior architecture and design studio.",
    objective: "Explore how far an editorial, image-led website can go for a fictional interior architecture studio.",
    approach: "Generous spacing, large imagery and restrained typography to give the site a gallery-like feel.",
    highlights: ["Homepage", "Projects", "Project detail", "Studio", "Services", "Journal", "Contact"],
    considerations: ["Image-led presentation", "Typographic hierarchy", "Project detail storytelling"],
    technologies: [],
    liveUrl: "",
    featuredImage: img("atelier", "featured", "Atelier website preview (placeholder)"),
    gallery: [img("atelier", "gallery-1", "Atelier screen 1 (placeholder)"), img("atelier", "gallery-2", "Atelier screen 2 (placeholder)")],
  },
];
export const getProject = (slug: string): Project => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project: ${slug}`);
  return p;
};
export const projectHref = (p: Project) => `/work/${p.slug}`;
