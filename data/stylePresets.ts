/**
 * Style Playground: data + pure helpers.
 * Preset → data attributes on <html> → CSS tokens (components/style-playground.css) → existing components.
 */
export const STORAGE_KEY = "sp:v1";

export type PresetId = "current" | "skeuo" | "neumorph" | "glass" | "aero";
export type AccentId = "terracotta" | "violet" | "emerald" | "cyan" | "gold";
export type SurfaceId = "default" | "glass" | "solid" | "border";
export type RadiusId = "sharp" | "subtle" | "balanced" | "rounded";
export type TypeId = "current" | "sans" | "editorial" | "technical";
export type Tone = "system" | "light" | "dark";

/** `engine` presets are full visual languages (component-level skins); "current" is the untouched default design. */
export type Preset = { id: PresetId; label: string; description: string; tone: Tone; accent: AccentId; surface: SurfaceId; radius: RadiusId; type: TypeId; engine: boolean };
/** null = follow the preset's own default */
export type StyleConfig = { preset: PresetId; accent: AccentId | null; surface: SurfaceId | null; radius: RadiusId | null; type: TypeId | null };
export type OverrideKey = "accent" | "surface" | "radius" | "type";

export const presets: Preset[] = [
  { id: "current", label: "Current", description: "The existing Siddharth design.", tone: "system", accent: "terracotta", surface: "default", radius: "balanced", type: "current", engine: false },
  { id: "skeuo", label: "Classic Skeuomorphism", description: "Bevelled, tactile, physical.", tone: "light", accent: "gold", surface: "default", radius: "subtle", type: "current", engine: true },
  { id: "neumorph", label: "Neumorphism", description: "Soft extruded surfaces.", tone: "light", accent: "violet", surface: "default", radius: "rounded", type: "sans", engine: true },
  { id: "glass", label: "Glassmorphism", description: "Layered translucent panels.", tone: "dark", accent: "cyan", surface: "default", radius: "rounded", type: "sans", engine: true },
  { id: "aero", label: "Frutiger Aero", description: "Glossy sky, water and nature.", tone: "light", accent: "emerald", surface: "default", radius: "rounded", type: "sans", engine: true },
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

export const ATTR_KEYS = ["data-sp-preset", "data-sp-engine", "data-sp-tone", "data-sp-accent", "data-sp-surface", "data-sp-radius", "data-sp-type"];

export function toAttrs(c: StyleConfig): Record<string, string> {
  const r = resolveConfig(c);
  const attrs: Record<string, string> = { "data-sp-preset": r.preset, "data-sp-tone": r.tone, "data-sp-accent": r.accent, "data-sp-surface": r.surface, "data-sp-radius": r.radius, "data-sp-type": r.type };
  if (getPreset(c.preset).engine) attrs["data-sp-engine"] = "1";
  return attrs;
}

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

/** Runs before paint (inline in <head>) so a saved style never flashes the default on any page. */
export const STORAGE_VERSION = 2;
export const BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"null");if(s&&s.v===${STORAGE_VERSION}&&s.attrs){var h=document.documentElement;for(var k in s.attrs){if(k.indexOf("data-sp-")===0)h.setAttribute(k,String(s.attrs[k]))}}}catch(e){}`;
