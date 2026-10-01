import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectShowcase({ detailed }: { detailed?: boolean }) {
  return (
    <div>
      {projects.map((p, i) => <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} detailed={detailed} />)}
    </div>
  );
}
