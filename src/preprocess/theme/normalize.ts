import type { TuneOpacity, TunePalette, TuneShade } from "@/config/schema"
import type { ColorShade } from "@/const/tailwind"
import type { ThemeGroup, ThemePalette, ThemeTable, ThemeValue } from "@/preprocess/theme/types"
import { COLOR_FAMILIES, COLOR_SHADES, PALETTE } from "@/const/tailwind"
import { output } from "@/plugins/output"
import { text } from "@/text"

/** fold a theme config into a group, filling the absent dimensions */
export function groupOf(theme: { palette?: TunePalette, shade?: TuneShade, opacity?: TuneOpacity }): ThemeGroup {
  return {
    palette: theme.palette ?? {},
    shade: theme.shade ?? {},
    opacity: theme.opacity ?? {},
  }
}

/** merge a scheme group over the default group, name by name */
export function mergeGroup(base: ThemeGroup, scheme: ThemeGroup): ThemeGroup {
  return {
    palette: {
      ...base.palette,
      ...scheme.palette,
    },
    shade: {
      ...base.shade,
      ...scheme.shade,
    },
    opacity: {
      ...base.opacity,
      ...scheme.opacity,
    },
  }
}

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
        output.error(text.preprocess.shadeMissing(name, colorShade))

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
