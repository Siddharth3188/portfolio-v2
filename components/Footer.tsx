import Link from "next/link";
import { nav, site } from "@/data/site";
import { mailtoUrl, whatsappUrl } from "@/data/contact";

export default function Footer() {
  const links = [...nav, { label: "Contact", href: "/contact" }];
  return (
    <footer className="border-t border-line py-14 text-[15px] text-mute">
      <div className="wrap flex flex-wrap justify-between gap-10">
        <div>
          <p className="font-display text-lg tracking-[0.2em] text-fg">SIDDHARTH</p>
          <p className="mt-2">{site.tagline}</p>
        </div>
        <ul className="grid list-none gap-2 p-0">{links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-fg">{l.label}</Link></li>)}</ul>
        <ul className="grid list-none content-start gap-2 p-0">
          <li><a href={mailtoUrl} className="hover:text-fg">Email</a></li>
          <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-fg">WhatsApp</a></li>
          {site.socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">{s.label}</a></li>)}
        </ul>
        <p className="w-full text-sm">© 2026 Siddharth. All rights reserved.</p>
      </div>
    </footer>
  );
}
