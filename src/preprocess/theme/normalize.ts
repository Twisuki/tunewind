import type { TuneOpacity, TunePalette, TunePaletteEntry, TuneShade, TuneShadeValue } from "@/config/schema"
import type { ColorShade } from "@/const/tailwind"
import type { ThemeLayers, ThemeMode, ThemeModes, ThemePalette, ThemeTable, ThemeValue } from "@/preprocess/theme/types"
import { COLOR_FAMILIES, COLOR_SHADES, PALETTE } from "@/const/tailwind"
import { output } from "@/plugins/output"
import { text } from "@/text"

/** value that may define a separate light and dark form */
type ModeEntry<T> = T | { light?: T, dark?: T }

/** whether an entry is a light and dark pair instead of a plain value */
function isModeEntry<T>(value: unknown): value is { light?: T, dark?: T } {
  return typeof value === "object" && value !== null
    && (Object.hasOwn(value, "light") || Object.hasOwn(value, "dark"))
}

/** resolve one entry for a mode, the fill flag controls inheritance */
function splitValue<T>(value: ModeEntry<T>, mode: ThemeMode, fill: boolean): T | undefined {
  if (!isModeEntry(value)) {
    if (mode === "dark" && !fill)
      return undefined

    return value
  }

  if (mode === "light")
    return value.light ?? (fill ? value.dark : undefined)

  return value.dark ?? (fill ? value.light : undefined)
}

/** resolve one layer for a mode into a flat record */
function splitLayer<T>(
  source: Record<string, ModeEntry<T>> | undefined,
  mode: ThemeMode,
  fill: boolean,
): Record<string, T> {
  const layer: Record<string, T> = {}

  for (const [key, value] of Object.entries(source ?? {})) {
    const resolved = splitValue(value, mode, fill)
    if (resolved !== undefined)
      layer[key] = resolved
  }

  return layer
}

/** merge one color patch over a base, key by key */
function mergeLayers(base: ThemeLayers, patch: ThemeLayers): ThemeLayers {
  return {
    palette: {
      ...base.palette,
      ...patch.palette,
    },
    shade: {
      ...base.shade,
      ...patch.shade,
    },
  }
}

/** fold a theme config into both modes, filling the absent sides for the base */
export function groupOf(
  theme: { palette?: TunePalette, shade?: TuneShade, opacity?: TuneOpacity },
  isBase = true,
): ThemeModes {
  const light: ThemeLayers = {
    palette: splitLayer<TunePaletteEntry>(theme.palette, "light", isBase),
    shade: splitLayer<TuneShadeValue>(theme.shade, "light", isBase),
  }
  const dark: ThemeLayers = {
    palette: splitLayer<TunePaletteEntry>(theme.palette, "dark", false),
    shade: splitLayer<TuneShadeValue>(theme.shade, "dark", false),
  }

  return {
    light,
    dark: isBase
      ? mergeLayers(light, dark)
      : dark,
    opacity: theme.opacity ?? {},
  }
}

/** merge a scheme group over the default group, mode by mode */
export function mergeGroup(base: ThemeModes, scheme: ThemeModes): ThemeModes {
  return {
    light: mergeLayers(base.light, scheme.light),
    dark: mergeLayers(base.dark, scheme.dark),
    opacity: {
      ...base.opacity,
      ...scheme.opacity,
    },
  }
}

/** build the palette of every usable color name */
function buildPalette(palette: Record<string, TunePaletteEntry>): ThemePalette {
  const themePalette: ThemePalette = new Map()
  // copy the builtin palette
  for (const family of COLOR_FAMILIES) {
    const scale = new Map<ColorShade, ThemeValue>()
    for (const shade of COLOR_SHADES)
      scale.set(shade, PALETTE[family][shade])
    themePalette.set(family, scale)
  }

  // patch the configured scales
  for (const [name, entry] of Object.entries(palette)) {
    if (typeof entry === "string")
      continue

    const scale = themePalette.get(name) ?? new Map<ColorShade, ThemeValue>()
    for (const [shade, value] of Object.entries(entry))
      scale.set(Number(shade) as ColorShade, value)
    themePalette.set(name, scale)
  }

  // copy the alias scales
  for (const [name, entry] of Object.entries(palette)) {
    if (typeof entry !== "string")
      continue

    const scale = themePalette.get(entry) ?? new Map<ColorShade, ThemeValue>()
    themePalette.set(name, new Map(scale))
  }

  return themePalette
}

/** build the color table of every usable color name by the shade mapping */
function buildTable(themePalette: ThemePalette, shade: Record<string, TuneShadeValue>): ThemeTable {
  const table: ThemeTable = new Map()

  for (const [name, scale] of themePalette) {
    const values = new Map<string, ThemeValue>()
    for (const [key, colorShade] of Object.entries(shade)) {
      const value = scale.get(colorShade)
      if (value === undefined)
        output.error(text.preprocess.shadeMissing(name, colorShade))

      values.set(key, value)
    }
    table.set(name, values)
  }

  return table
}

/** resolve palette and shade mapping into the color table of every usable name */
export function normalize(palette: Record<string, TunePaletteEntry>, shade: Record<string, TuneShadeValue>): ThemeTable {
  return buildTable(buildPalette(palette), shade)
}
