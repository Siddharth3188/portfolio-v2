import SectionHeading from "@/components/SectionHeading";
import ServiceList from "@/components/ServiceList";
import CTASection from "@/components/CTASection";
import { services } from "@/data/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Services — Siddharth", "Website design, development, responsive design, SEO basics and launch support for businesses and organizations.", "/services");

export default function Services() {
  return (
    <>
      <section className="pb-20 pt-16 md:pt-24">
        <div className="wrap">
          <SectionHeading as="h1" title="Websites built around your business." description="From focused business websites to more distinctive digital experiences, I create websites designed around what your business actually needs." className="mb-12" />
          <ServiceList services={services} />
        </div>
      </section>
      <CTASection title="Not sure what your project needs?" text="Tell me about your business and we can work out the right shape for the website together." label="Start a conversation →" />
    </>
  );
}
