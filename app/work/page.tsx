import SectionHeading from "@/components/SectionHeading";
import ProjectShowcase from "@/components/ProjectShowcase";
import CTASection from "@/components/CTASection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Work — Siddharth", "Selected website projects designed and built for different businesses, audiences and goals.", "/work");

export default function Work() {
  return (
    <>
      <section className="pb-16 pt-16 md:pt-24">
        <div className="wrap">
          <SectionHeading as="h1" title="Selected Work" description="Websites built with different businesses, audiences and goals in mind. All three are portfolio concepts, not paying clients." />
          <div className="mt-12"><ProjectShowcase detailed /></div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
