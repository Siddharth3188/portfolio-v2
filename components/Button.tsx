import Link from "next/link";
import type { ReactNode } from "react";

type Props = { href: string; variant?: "primary" | "ghost" | "onDark"; children: ReactNode; external?: boolean };
const base = "inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-[14.5px] font-semibold tracking-wide transition duration-300 hover:-translate-y-0.5";
const variants = { primary: "border-acc bg-acc text-accfg", ghost: "border-fg text-fg", onDark: "border-bg text-bg" };

export default function Button({ href, variant = "ghost", children, external }: Props) {
  const cls = `${base} ${variants[variant]}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}
