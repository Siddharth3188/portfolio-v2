"use client";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import StylePresetCard from "./StylePresetCard";
import { useStyle } from "./StyleProvider";
import { presets, withPreset } from "@/data/stylePresets";

/** Home-page entry point. Reuses the shared drawer and preset cards; no style logic lives here. */
export default function StyleShowcase() {
  const { config, setConfig, openDrawer } = useStyle();
  return (
    <section className="border-t border-line py-24">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Design system" title="Design has more than one direction." description="Explore how the same digital system can evolve across different visual languages." />
        </Reveal>
        <Reveal delay={0.05} className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {presets.filter((p) => p.engine).map((p) => (
              <StylePresetCard key={p.id} size="lg" preset={p} selected={config.preset === p.id} onSelect={() => { setConfig(withPreset(p.id)); openDrawer(); }} />
            ))}
          </div>
          <div className="mt-8">
            <button type="button" data-btn="primary" onClick={openDrawer} aria-haspopup="dialog" className="inline-flex items-center justify-center rounded-full border border-acc bg-acc px-6 py-3.5 text-[14.5px] font-semibold tracking-wide text-accfg transition duration-300 hover:-translate-y-0.5">Explore visual styles →</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
