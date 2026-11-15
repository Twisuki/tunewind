import type { TuneOpacity, TunePalette, TunePaletteEntry, TuneShade, TuneShadeValue } from "@/config/schema"
import type { ColorFamily, ColorShade } from "@/const/tailwind"

/** color name (family or alias) */
export type ThemeFamily = string | ColorFamily

/** css value */
export type ThemeValue = string

/** shade key of the shade mapping */
export type ThemeShade = string

/** one theme scope, colors and opacity */
export interface ThemeGroup {
  /** palette of the scope */
  palette: TunePalette
  /** shade mapping of the scope */
  shade: TuneShade
  /** opacity mapping of the scope */
  opacity: TuneOpacity
}

/** value mode of the color system */
export type ThemeMode = "light" | "dark"

/** colors of one mode, opacity excluded */
export interface ThemeLayers {
  /** palette of the mode */
  palette: Record<string, TunePaletteEntry>
  /** shade mapping of the mode */
  shade: Record<string, TuneShadeValue>
}

/** color layers of both modes, opacity shared */
export interface ThemeModes {
  /** light mode */
  light: ThemeLayers
  /** dark mode */
  dark: ThemeLayers
  /** opacity mapping, shared by both modes */
  opacity: TuneOpacity
}

/** palette before and after merging, color name to shade scale */
export type ThemePalette = Map<ThemeFamily, Map<ColorShade, ThemeValue>>

/** theme table, color name to shade key to css value */
export type ThemeTable = Map<ThemeFamily, Map<ThemeShade, ThemeValue>>
