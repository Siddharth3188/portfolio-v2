import type { Preset } from "@/data/stylePresets";

/** Preview scope: the same tokens as the live engine, so each card truly demonstrates its style. */
export default function StylePresetCard({ preset, selected, onSelect, size = "sm", className = "" }: { preset: Preset; selected: boolean; onSelect: () => void; size?: "sm" | "lg"; className?: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-lg border p-2 text-left transition duration-200 ${selected ? "border-fg ring-1 ring-fg" : "border-line hover:border-fg"} ${className}`}
    >
      <div
        data-sp-preview={preset.id} data-sp-accent={preset.accent} data-sp-tone={preset.tone} data-sp-radius={preset.radius}
        aria-hidden="true"
        className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-md border border-line bg-bg p-3 ${size === "lg" ? "h-36" : "h-20"}`}
      >
        <div data-mini="panel" className="relative z-10 flex flex-1 flex-col gap-1.5 p-2.5">
          <span className="h-1.5 w-12 rounded-full bg-fg" />
          <span className="h-1 w-16 rounded-full bg-mute/60" />
        </div>
        <span data-mini="btn" className="relative z-10 shrink-0 px-3 py-1.5 text-xs font-semibold">Button</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
        <span className="text-sm font-semibold">{preset.label}</span>
        {selected && <span className="text-xs font-medium"><span aria-hidden="true">✓ </span>Active</span>}
      </div>
      <p className="px-0.5 text-xs leading-snug text-mute">{preset.description}</p>
    </button>
  );
}
