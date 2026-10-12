import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

/**
 * `mobileDescriptions` (slug -> shorter text) and `equalHeightMobile` are Home-page-only options;
 * without them the Work page and everything else render exactly as before.
 */
export default function ProjectShowcase({ detailed, mobileDescriptions, equalHeightMobile }: { detailed?: boolean; mobileDescriptions?: Record<string, string>; equalHeightMobile?: boolean }) {
  return (
    <div className={equalHeightMobile ? "max-md:grid max-md:auto-rows-fr" : undefined}>
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} detailed={detailed} mobileDescription={mobileDescriptions?.[p.slug]} equalHeightMobile={equalHeightMobile} />
      ))}
    </div>
  );
}
