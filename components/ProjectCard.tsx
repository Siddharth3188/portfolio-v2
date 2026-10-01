import Link from "next/link";
import type { Project } from "@/data/types";
import { projectHref } from "@/data/projects";
import ProjectImage from "./ProjectImage";
import Reveal from "./Reveal";

export default function ProjectCard({ project, flip, detailed }: { project: Project; flip?: boolean; detailed?: boolean }) {
  const href = projectHref(project);
  return (
    <Reveal>
      <article className={`grid items-center gap-6 border-t border-line py-12 md:gap-12 ${flip ? "md:grid-cols-[1fr_1.3fr]" : "md:grid-cols-[1.3fr_1fr]"}`}>
        <Link href={href} aria-label={`View ${project.title}`} className={`group block overflow-hidden rounded-lg border border-line bg-card ${flip ? "md:order-2" : ""}`}>
          <ProjectImage image={project.featuredImage} className="transition duration-500 group-hover:scale-[1.03]" />
        </Link>
        <div>
          <p className="mb-3 text-[12.5px] font-medium uppercase tracking-[0.14em] text-mute">{project.category} · {project.status}</p>
          <h3 className="font-display text-3xl leading-tight">{project.title}</h3>
          <p className="mt-4 text-mute">{detailed ? project.overview : project.description}</p>
          {detailed && <p className="mt-4 text-[15px] text-mute">{project.highlights.join(" · ")}</p>}
          <Link href={href} className="mt-6 inline-block text-[14.5px] font-semibold tracking-wide underline-offset-4 hover:underline">View project →</Link>
        </div>
      </article>
    </Reveal>
  );
}
