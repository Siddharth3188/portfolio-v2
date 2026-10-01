import { process } from "@/data/process";
import Reveal from "./Reveal";

export default function ProcessTimeline({ twoCol }: { twoCol?: boolean }) {
  return (
    <ol className={`grid list-none gap-px border border-line bg-line p-0 sm:grid-cols-2 ${twoCol ? "" : "lg:grid-cols-3"}`}>
      {process.map((s, i) => (
        <li key={s.title} className="bg-bg">
          <Reveal className="h-full p-7">
            <span className="font-display text-2xl text-acc">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mb-2 mt-2 text-base font-semibold">{s.title}</h3>
            <p className="text-[16px] text-mute">{s.description}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
