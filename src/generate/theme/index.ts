import type { TuneConfig, TuneOpacity, TunePalette, TuneShade } from "@/config/schema"
import type { ThemeTable, ThemeValue } from "@/generate/theme/types"
import { normalize } from "@/generate/theme/normalize"
import { buildContent, buildOpacity, customVariant, wrapTheme } from "@/generate/theme/serialize"
import { text } from "@/text"

interface ThemeGroup {
  /** palette of the group */
  palette: TunePalette
  /** shade mapping of the group */
  shade: TuneShade
  /** opacity mapping of the group */
  opacity: TuneOpacity
}

function groupOf(theme: { palette?: TunePalette, shade?: TuneShade, opacity?: TuneOpacity }): ThemeGroup {
  return {
    palette: theme.palette ?? {},
    shade: theme.shade ?? {},
    opacity: theme.opacity ?? {},
  }
}

/** merge a scheme group over the default group, name by name */
function mergeGroup(base: ThemeGroup, scheme: ThemeGroup): ThemeGroup {
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

/** keep the opacity of a scheme that differ from the default theme */
function diffOpacity(base: TuneOpacity, next: TuneOpacity): TuneOpacity {
  const opacity: TuneOpacity = {}

  for (const [key, value] of Object.entries(next)) {
    if (base[key] !== value)
      opacity[key] = value
  }

  return opacity
}

/** keep the colors of a scheme that differ from the default theme */
function diffTable(base: ThemeTable, next: ThemeTable): ThemeTable {
  const table: ThemeTable = new Map()

  for (const [name, values] of next) {
    const changed = new Map<string, ThemeValue>()
    for (const [key, value] of values) {
      if (base.get(name)?.get(key) !== value)
        changed.set(key, value)
    }

    if (changed.size > 0)
      table.set(name, changed)
  }

  return table
}

/** build the css of the default theme and all schemes */
export function buildTheme(config: TuneConfig): string {
  const theme = config.theme ?? {}
  const base = groupOf(theme)
  const baseTable = normalize(base.palette, base.shade)

  const variants: string[] = []
  const blocks: string[][] = [
    wrapTheme(buildContent(baseTable), "color"),
  ]

  if (Object.keys(base.opacity).length > 0)
    blocks.push(wrapTheme(buildOpacity(base.opacity), "opacity"))

  const identifiers = new Set<string>()

  for (const [key, scheme] of Object.entries(theme.schemes ?? {})) {
    const identifier = scheme.prefix ?? key
    if (identifiers.has(identifier))
      throw new Error(text.generate.themeDuplicated(identifier))

    identifiers.add(identifier)
    variants.push(customVariant(identifier))

    const merged = mergeGroup(base, groupOf(scheme))
    const table = diffTable(baseTable, normalize(merged.palette, merged.shade))
    if (table.size > 0)
      blocks.push(wrapTheme(buildContent(table), "color", identifier))

    const opacity = diffOpacity(base.opacity, merged.opacity)
    if (Object.keys(opacity).length > 0)
      blocks.push(wrapTheme(buildOpacity(opacity), "opacity", identifier))
  }

  return [
    ...variants,
    ...blocks.flat(),
  ].join("\n")
}
