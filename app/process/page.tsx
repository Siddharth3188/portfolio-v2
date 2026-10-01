import SectionHeading from "@/components/SectionHeading";
import ProcessTimeline from "@/components/ProcessTimeline";
import CTASection from "@/components/CTASection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Process — Siddharth", "A realistic, collaborative process from first conversation to launch.", "/process");

export default function Process() {
  return (
    <>
      <section className="pb-20 pt-16 md:pt-24">
        <div className="wrap">
          <SectionHeading as="h1" title="From idea to launch." description="A realistic, collaborative process. Timelines depend on the scope of each project and are agreed up front." className="mb-12" />
          <ProcessTimeline twoCol />
        </div>
      </section>
      <CTASection />
    </>
  );
}
