import type { ColorFamily, ColorShade } from "@/const/tailwind"

/** color name (family or alias) */
export type ThemeFamily = string | ColorFamily

/** css value */
export type ThemeValue = string

/** shade key of the shade mapping */
export type ThemeShade = string

/** palette before and after merging, color name to shade scale */
export type ThemePalette = Map<ThemeFamily, Map<ColorShade, ThemeValue>>

/** theme table, color name to shade key to css value */
export type ThemeTable = Map<ThemeFamily, Map<ThemeShade, ThemeValue>>
