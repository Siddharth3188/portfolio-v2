/**
 * Style Playground: data + pure helpers.
 * Preset → data attributes on <html> → CSS tokens (components/style-playground.css) → existing components.
 */
export const STORAGE_KEY = "sp:v1";

export type PresetId = "current" | "minimal" | "editorial" | "glass" | "midnight" | "cyber";
export type AccentId = "terracotta" | "violet" | "emerald" | "cyan" | "gold";
export type SurfaceId = "default" | "glass" | "solid" | "border";
export type RadiusId = "sharp" | "subtle" | "balanced" | "rounded";
export type TypeId = "current" | "sans" | "editorial" | "technical";
export type Tone = "system" | "light" | "dark";

export type Preset = { id: PresetId; label: string; description: string; tone: Tone; accent: AccentId; surface: SurfaceId; radius: RadiusId; type: TypeId };
/** null = follow the preset's own default */
export type StyleConfig = { preset: PresetId; accent: AccentId | null; surface: SurfaceId | null; radius: RadiusId | null; type: TypeId | null };
export type OverrideKey = "accent" | "surface" | "radius" | "type";

export const presets: Preset[] = [
  { id: "current", label: "Current", description: "The existing portfolio design.", tone: "system", accent: "terracotta", surface: "default", radius: "balanced", type: "current" },
  { id: "minimal", label: "Minimal", description: "Quiet surfaces, sharp hierarchy.", tone: "light", accent: "emerald", surface: "border", radius: "subtle", type: "sans" },
  { id: "editorial", label: "Editorial", description: "Warm paper, serif-led, square corners.", tone: "light", accent: "terracotta", surface: "default", radius: "sharp", type: "editorial" },
  { id: "glass", label: "Glass", description: "Soft translucent panels.", tone: "light", accent: "violet", surface: "glass", radius: "rounded", type: "sans" },
  { id: "midnight", label: "Midnight", description: "Dark, high contrast, refined gold.", tone: "dark", accent: "gold", surface: "border", radius: "subtle", type: "current" },
  { id: "cyber", label: "Cyber", description: "Technical, with a controlled glow.", tone: "dark", accent: "cyan", surface: "glass", radius: "subtle", type: "technical" },
];
export const accents: { id: AccentId; label: string }[] = [
  { id: "terracotta", label: "Terracotta" }, { id: "violet", label: "Violet" }, { id: "emerald", label: "Emerald" }, { id: "cyan", label: "Cyan" }, { id: "gold", label: "Gold" },
];
export const surfaces: { id: SurfaceId; label: string }[] = [
  { id: "default", label: "Default" }, { id: "glass", label: "Glass" }, { id: "solid", label: "Solid" }, { id: "border", label: "Border" },
];
export const radii: { id: RadiusId; label: string }[] = [
  { id: "sharp", label: "Sharp" }, { id: "subtle", label: "Subtle" }, { id: "balanced", label: "Balanced" }, { id: "rounded", label: "Rounded" },
];
export const typographies: { id: TypeId; label: string }[] = [
  { id: "current", label: "Current" }, { id: "sans", label: "Clean Sans" }, { id: "editorial", label: "Editorial" }, { id: "technical", label: "Technical" },
];

export const DEFAULT_CONFIG: StyleConfig = { preset: "current", accent: null, surface: null, radius: null, type: null };
export const getPreset = (id: PresetId): Preset => presets.find((p) => p.id === id) ?? presets[0];

export const isDefault = (c: StyleConfig) => c.preset === "current" && !c.accent && !c.surface && !c.radius && !c.type;

export function resolveConfig(c: StyleConfig) {
  const p = getPreset(c.preset);
  return { preset: p.id, tone: p.tone, accent: c.accent ?? p.accent, surface: c.surface ?? p.surface, radius: c.radius ?? p.radius, type: c.type ?? p.type };
}

export function toAttrs(c: StyleConfig): Record<string, string> {
  const r = resolveConfig(c);
  return { "data-sp-preset": r.preset, "data-sp-tone": r.tone, "data-sp-accent": r.accent, "data-sp-surface": r.surface, "data-sp-radius": r.radius, "data-sp-type": r.type };
}
export const ATTR_KEYS = Object.keys(toAttrs(DEFAULT_CONFIG));

/** Selecting a preset clears overrides so the preset shows as designed. */
export const withPreset = (id: PresetId): StyleConfig => ({ ...DEFAULT_CONFIG, preset: id });

export function withOverride<K extends OverrideKey>(c: StyleConfig, key: K, value: NonNullable<StyleConfig[K]>): StyleConfig {
  const def: string = getPreset(c.preset)[key];
  return { ...c, [key]: value === def ? null : value };
}

const ids = (list: { id: string }[], v: unknown) => (typeof v === "string" && list.some((i) => i.id === v) ? v : null);
export function sanitize(raw: unknown): StyleConfig {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    preset: (ids(presets, r.preset) as PresetId | null) ?? "current",
    accent: ids(accents, r.accent) as AccentId | null,
    surface: ids(surfaces, r.surface) as SurfaceId | null,
    radius: ids(radii, r.radius) as RadiusId | null,
    type: ids(typographies, r.type) as TypeId | null,
  };
}

/** Runs before paint (inline in <head>) so a saved style never flashes the default. Only acts on /process. */
export const BOOT_SCRIPT = `try{var p=location.pathname.replace(/\\/$/,"");if(p==="/process"){var s=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"null");if(s&&s.attrs){var h=document.documentElement;for(var k in s.attrs){if(k.indexOf("data-sp-")===0)h.setAttribute(k,String(s.attrs[k]))}}}}catch(e){}`;
