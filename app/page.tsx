import Hero from "@/components/Hero";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ProjectShowcase from "@/components/ProjectShowcase";
import ServiceList from "@/components/ServiceList";
import ProcessTimeline from "@/components/ProcessTimeline";
import CTASection from "@/components/CTASection";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(site.title, site.description, "/");

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-20">
        <div className="wrap">
          <SectionHeading title="Selected Work" description="A selection of websites designed and built for different kinds of businesses and organizations." />
          <div className="mt-10"><ProjectShowcase /></div>
        </div>
      </section>
      <section className="bg-fg py-24 text-bg">
        <div className="wrap">
          <SectionHeading inverse title="What I Do" className="mb-10" />
          <ServiceList inverse services={services.filter((s) => s.home)} />
        </div>
      </section>
      <section className="py-24">
        <div className="wrap">
          <SectionHeading title="Design with purpose. Technology with intention." description="A website should do more than look good. It should communicate clearly, feel effortless to use and represent the business behind it." />
        </div>
      </section>
      <section className="pb-24">
        <div className="wrap">
          <SectionHeading title="From idea to launch." className="mb-10" />
          <ProcessTimeline />
          <div className="mt-8"><Button href="/process">View my process →</Button></div>
        </div>
      </section>
      <section className="border-t border-line py-24">
        <div className="wrap">
          <SectionHeading title="Hi, I'm Siddharth." description="I design and build modern websites for businesses, organizations and brands. I care about clear structure, considered typography and sites that feel fast on every device." />
          <div className="mt-8"><Button href="/about">More about me →</Button></div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
