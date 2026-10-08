import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { contact, gmailComposeUrl, whatsappUrl, altMailtoUrl } from "@/data/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("About Siddharth", "I design and build modern websites for businesses, organizations and brands.", "/about");

const values = [
  ["Good design", "A website should feel intentional, not templated."],
  ["Clarity", "Visitors should understand what a business does quickly."],
  ["Performance", "Beautiful websites should still feel fast."],
  ["Details", "Spacing, typography, interactions and responsiveness all matter."],
];

const link = "underline underline-offset-4 hover:text-acc";
const details: [string, React.ReactNode][] = [
  ["Email", <a key="e" href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" className={link}>{contact.email}</a>],
  ["Alternative", <a key="a" href={altMailtoUrl} className={link}>{contact.altEmail}</a>],
  ["WhatsApp", <a key="w" href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={link}>{contact.whatsappDisplay}</a>],
  ["Location", <span key="l">{contact.location}</span>],
  ["Instagram", <a key="i" href={contact.instagram.url} target="_blank" rel="noopener noreferrer" className={link}>{contact.instagram.handle}</a>],
  ["LinkedIn", <a key="n" href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" className={link}>{contact.linkedin.handle}</a>],
];

export default function About() {
  return (
    <>
      <section className="pb-20 pt-16 md:pt-24">
        <div className="wrap">
          <SectionHeading as="h1" title="Hi, I'm Siddharth." />
          <div className="mt-8 max-w-2xl space-y-5 text-lg text-mute">
            <p>I’m Siddharth — someone who enjoys turning ideas into things people can actually experience. I’m naturally curious about technology, design, and the way digital products come together, and I like experimenting until an idea feels right, not simply finished.</p>
            <p>I care about the details that make something feel polished — how it looks, how it works, and how naturally someone can move through it. Every project is an opportunity to learn something new, solve a different problem, and build something I’m genuinely proud of.</p>
          </div>
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {values.map(([t, d]) => (
              <Reveal key={t}><h2 className="mb-2 text-base font-semibold">{t}</h2><p className="text-mute">{d}</p></Reveal>
            ))}
          </div>
          <div className="mt-16 max-w-2xl">
            <h2 className="mb-4 text-[12.5px] font-medium uppercase tracking-[0.14em] text-mute">Details</h2>
            <dl>
              {details.map(([label, value]) => (
                <Reveal key={label}>
                  <div data-row="" className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-t border-line py-4">
                    <dt className="text-sm text-mute">{label}</dt>
                    <dd className="m-0 break-words">{value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
