export type ProjectImage = { src: string; alt: string; width: number; height: number };
export type Project = {
  slug: string;
  title: string;
  category: string;
  status: "Portfolio Concept" | "Demo Project";
  description: string;
  overview: string;
  objective: string;
  approach: string;
  highlights: string[];
  considerations: string[];
  /** Only list technologies that are genuinely used by the project. */
  technologies: string[];
  /** Leave empty until the real deployed URL is available. */
  liveUrl: string;
  featuredImage: ProjectImage;
  gallery: ProjectImage[];
};
export type Service = { title: string; description: string; home?: boolean };
export type ProcessStep = { title: string; description: string };
export type SocialHandle = { handle: string; url: string };
export type ContactInformation = {
  email: string;
  altEmail: string;
  whatsapp: string; // international format, digits only
  whatsappDisplay: string;
  location: string;
  instagram: SocialHandle;
  linkedin: SocialHandle;
};
export type NavLink = { label: string; href: string };
