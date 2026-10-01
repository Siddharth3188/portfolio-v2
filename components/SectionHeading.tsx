type Props = { eyebrow?: string; title: string; description?: string; as?: "h1" | "h2"; inverse?: boolean; className?: string };

export default function SectionHeading({ eyebrow, title, description, as: Tag = "h2", inverse, className = "" }: Props) {
  const size = Tag === "h1" ? "text-[clamp(2.6rem,7vw,5.4rem)]" : "text-[clamp(2rem,4.5vw,3.4rem)]";
  const muted = inverse ? "text-bg/70" : "text-mute";
  return (
    <div className={className}>
      {eyebrow && <p className={`mb-4 text-[12.5px] font-medium uppercase tracking-[0.14em] ${muted}`}>{eyebrow}</p>}
      <Tag className={`max-w-4xl font-display font-normal leading-[1.08] tracking-tight ${size}`}>{title}</Tag>
      {description && <p className={`mt-5 max-w-2xl text-lg ${muted}`}>{description}</p>}
    </div>
  );
}
