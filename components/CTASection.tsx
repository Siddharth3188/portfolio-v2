import Button from "./Button";
import SectionHeading from "./SectionHeading";

type Props = { title?: string; text?: string; label?: string; href?: string };
export default function CTASection({ title = "Have a project in mind?", text = "Tell me a little about what you're building, and let's start a conversation.", label = "Start a project →", href = "/contact" }: Props) {
  return (
    <section className="bg-fg py-24 text-bg">
      <div className="wrap">
        <SectionHeading inverse title={title} description={text} />
        <div className="mt-9"><Button href={href} variant="primary">{label}</Button></div>
      </div>
    </section>
  );
}
