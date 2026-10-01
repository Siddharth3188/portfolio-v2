import type { Service } from "@/data/types";
import Reveal from "./Reveal";

export default function ServiceList({ services, inverse }: { services: Service[]; inverse?: boolean }) {
  return (
    <div>
      {services.map((s, i) => (
        <Reveal key={s.title}>
          <div className={`grid grid-cols-[44px_1fr] gap-x-4 gap-y-2 border-t py-7 md:grid-cols-[70px_1fr_1.3fr] md:gap-6 ${inverse ? "border-bg/20" : "border-line"}`}>
            <span className="font-display text-xl text-acc">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-base font-semibold">{s.title}</h3>
            <p className={`col-start-2 md:col-start-auto ${inverse ? "text-bg/70" : "text-mute"}`}>{s.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
