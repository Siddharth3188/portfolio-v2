import type { Preset } from "@/data/stylePresets";

export default function StylePresetCard({ preset, selected, onSelect }: { preset: Preset; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-lg border p-2 text-left transition duration-200 ${selected ? "border-fg ring-1 ring-fg" : "border-line hover:border-fg"}`}
    >
      <div data-sp-preview={preset.id} data-sp-accent={preset.accent} data-sp-tone={preset.tone} aria-hidden="true" className="flex h-16 flex-col justify-between rounded-md border border-line bg-bg p-2">
        <div className="space-y-1">
          <div className="h-1.5 w-10 rounded-full bg-fg" />
          <div className="h-1 w-14 rounded-full bg-mute/60" />
        </div>
        <div className="flex items-end justify-between">
          <div className="h-4 w-9 rounded-sm border border-line bg-card" />
          <div className="h-2.5 w-2.5 rounded-full bg-acc" />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
        <span className="text-sm font-semibold">{preset.label}</span>
        {selected && <span aria-hidden="true" className="text-xs">✓</span>}
      </div>
      <p className="px-0.5 text-xs leading-snug text-mute">{preset.description}</p>
    </button>
  );
}
