import ProjectDetail from "@/components/ProjectDetail";
import { getProject } from "@/data/projects";
import { pageMeta } from "@/lib/seo";

const project = getProject("bytezone");
export const metadata = pageMeta(`${project.title} — Siddharth`, project.description, `/work/${project.slug}`);

export default function Page() {
  return <ProjectDetail project={project} />;
}
