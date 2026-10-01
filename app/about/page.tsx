import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("About — Siddharth", "I design and build modern websites for businesses, organizations and brands.", "/about");

const values = [
  ["Good design", "A website should feel intentional, not templated."],
  ["Clarity", "Visitors should understand what a business does quickly."],
  ["Performance", "Beautiful websites should still feel fast."],
  ["Details", "Spacing, typography, interactions and responsiveness all matter."],
];

export default function About() {
  return (
    <>
      <section className="pb-20 pt-16 md:pt-24">
        <div className="wrap">
          <SectionHeading as="h1" title="Hi, I'm Siddharth." description="I design and build modern websites for businesses, organizations and brands." />
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {values.map(([t, d]) => (
              <Reveal key={t}><h2 className="mb-2 text-base font-semibold">{t}</h2><p className="text-mute">{d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
