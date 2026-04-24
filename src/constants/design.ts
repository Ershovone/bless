export const COLORS = {
  parchment: "#e8dcc4",
  parchmentLight: "#fdf4e0",
  parchmentDarker: "#e0d2b4",
  parchmentGradientStart: "#f0e4ca",
  ink: "#3a2817",
  inkMuted: "#5a3a1a",
  sepia: "#6b4423",
  sepiaLight: "#8b6f47",
  rust: "#8b4a2b",
  amber: "#c9843d",
  sand: "#d4a574",
  slate: "#5a7a9a",
  modernBlue: "#3a6a8a",
  modernBlueDark: "#2a5a7a",
  landFill: "#e8d8b8",
  landStroke: "#6b4423",
  coastEmphasis: "#5a3a1a",
  hatch: "#8b6f47",
} as const;

export const JOURNEY_COLORS = [
  COLORS.sand,
  COLORS.amber,
  COLORS.rust,
  COLORS.slate,
] as const;

export const FONT_FAMILIES = {
  serif: "var(--font-cormorant), 'EB Garamond', Georgia, serif",
  sans: "var(--font-inter), sans-serif",
} as const;

export const ROMAN_NUMERALS = ["I", "II", "III", "IV"] as const;

export const ORNAMENT_GLYPH = "✦ ✦ ✦";

export const FLEURON_GLYPH = "❦";

export const EPISTLE_GLYPH = "✧";
