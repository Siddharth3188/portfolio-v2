import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { mailtoUrl, whatsappUrl } from "@/data/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Contact — Siddharth", "Tell me about your project and I'll get back to you.", "/contact");

export default function Contact() {
  return (
    <section className="pb-24 pt-16 md:pt-24">
      <div className="wrap">
        <SectionHeading as="h1" title="Let's build something that represents your business." description="Tell me a little about your project, and I'll get back to you." />
        <ContactForm />
        <p className="mt-10 text-mute">Or reach out directly: <a href={mailtoUrl} className="text-fg underline underline-offset-4">Email</a> · <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4">WhatsApp</a></p>
      </div>
    </section>
  );
}
