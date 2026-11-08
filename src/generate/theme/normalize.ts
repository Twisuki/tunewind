import type { TunePalette, TuneShade } from "@/config/schema"
import type { ColorShade } from "@/const/tailwind"
import type { ThemePalette, ThemeTable, ThemeValue } from "@/generate/theme/types"
import { COLOR_FAMILIES, COLOR_SHADES, PALETTE } from "@/const/tailwind"
import { text } from "@/text"

/** build the palette of every usable color name */
function buildPalette(palette: TunePalette): ThemePalette {
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
function buildTable(themePalette: ThemePalette, shade: TuneShade): ThemeTable {
  const table: ThemeTable = new Map()

  for (const [name, scale] of themePalette) {
    const values = new Map<string, ThemeValue>()
    for (const [key, colorShade] of Object.entries(shade)) {
      const value = scale.get(colorShade)
      if (value === undefined)
        throw new Error(text.generate.shadeMissing(name, colorShade))

      values.set(key, value)
    }
    table.set(name, values)
  }

  return table
}

/** resolve palette and shade mapping into the color table of every usable name */
export function normalize(palette: TunePalette, shade: TuneShade): ThemeTable {
  return buildTable(buildPalette(palette), shade)
}
