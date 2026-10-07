import Link from "next/link";
import { getProject, projectHref } from "@/data/projects";
import Button from "./Button";
import ProjectImage from "./ProjectImage";
import Reveal from "./Reveal";

export default function Hero() {
  const feature = getProject("atelier");
  return (
    <section data-hero="" className="pb-16 pt-16 md:pt-24">
      <div className="wrap">
        <Reveal><p className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-mute">Web design · Development · Digital experiences</p></Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[1.05] tracking-tight">Websites that make your business <em className="italic text-acc">stand out.</em></h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-mute">I design and build modern websites for businesses that want to stand out online.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/work" variant="primary">View selected work →</Button>
            <Button href="/contact">Start a project →</Button>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="mt-14">
          <Link href={projectHref(feature)} data-frame="" className="group block overflow-hidden rounded-lg border border-line bg-card" aria-label={`View ${feature.title}`}>
            <ProjectImage image={feature.featuredImage} priority sizes="(min-width:1180px) 1132px, 100vw" className="transition duration-700 group-hover:scale-[1.02]" />
          </Link>
          <p className="mt-3 text-sm text-mute">{feature.title} · {feature.status}</p>
        </Reveal>
      </div>
    </section>
  );
}
