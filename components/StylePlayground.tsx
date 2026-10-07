"use client";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { useStyle } from "./StyleProvider";
import { getPreset, isDefault } from "@/data/stylePresets";

/** Process-page entry point. State and the drawer live in StyleProvider (shared site-wide). */
export default function StylePlayground() {
  const { config, openDrawer } = useStyle();
  return (
    <section className="border-t border-line py-20">
      <div className="wrap">
        <Reveal>
          <SectionHeading eyebrow="Design system" title="Explore the visual direction" description="See how the same design system can adapt to different visual directions without losing clarity, usability or personality." />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" data-btn="ghost" onClick={openDrawer} aria-haspopup="dialog" className="inline-flex items-center justify-center rounded-full border border-fg px-6 py-3.5 text-[14.5px] font-semibold tracking-wide text-fg transition duration-300 hover:-translate-y-0.5">Open Style Playground</button>
            <p aria-live="polite" className="text-sm text-mute">{isDefault(config) ? "" : `Current direction: ${getPreset(config.preset).label}`}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
