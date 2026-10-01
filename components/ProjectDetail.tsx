import Link from "next/link";
import type { Project } from "@/data/types";
import { projects, projectHref } from "@/data/projects";
import Button from "./Button";
import CTASection from "./CTASection";
import ProjectImage from "./ProjectImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h2 className="mb-3 text-base font-semibold">{title}</h2>
    <ul className="grid list-none gap-1.5 p-0 text-mute">{items.map((i) => <li key={i}>{i}</li>)}</ul>
  </div>
);

export default function ProjectDetail({ project }: { project: Project }) {
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];
  return (
    <>
      <section className="pb-12 pt-14 md:pt-20">
        <div className="wrap">
          <Link href="/work" className="text-sm text-mute hover:text-fg">← All work</Link>
          <SectionHeading as="h1" className="mt-6" eyebrow={`${project.category} · ${project.status}`} title={project.title} description={project.overview} />
          <div className="mt-8">
            {project.liveUrl ? (
              <Button href={project.liveUrl} external variant="primary">View live website →</Button>
            ) : (
              <span aria-disabled="true" title="Live URL will be added in data/projects.ts" className="inline-flex cursor-not-allowed rounded-full border border-line px-6 py-3.5 text-[14.5px] font-semibold text-mute">View live website → (link coming soon)</span>
            )}
          </div>
          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-lg border border-line bg-card"><ProjectImage image={project.featuredImage} priority /></div>
          </Reveal>
        </div>
      </section>
      <section className="py-14">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div><h2 className="mb-3 text-base font-semibold">Project objective</h2><p className="text-mute">{project.objective}</p></div>
          <div><h2 className="mb-3 text-base font-semibold">Design approach</h2><p className="text-mute">{project.approach}</p></div>
          <List title="Pages and screens" items={project.highlights} />
          <List title="Key considerations" items={project.considerations} />
          {project.technologies.length > 0 && <List title="Technologies" items={project.technologies} />}
        </div>
      </section>
      <section className="pb-20">
        <div className="wrap grid gap-6 md:grid-cols-2">
          {project.gallery.map((g) => (
            <Reveal key={g.src}><div className="overflow-hidden rounded-lg border border-line bg-card"><ProjectImage image={g} sizes="(min-width:768px) 50vw, 100vw" /></div></Reveal>
          ))}
        </div>
      </section>
      <section className="border-t border-line py-12">
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <p className="text-mute">Next project</p>
          <Link href={projectHref(next)} className="font-display text-2xl hover:underline">{next.title} →</Link>
        </div>
      </section>
      <CTASection />
    </>
  );
}
