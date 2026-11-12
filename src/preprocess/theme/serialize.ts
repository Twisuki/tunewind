import type { TuneOpacity } from "@/config/schema"
import type { ThemeTable, ThemeValue } from "@/preprocess/theme/types"
import { FLAT_COLORS } from "@/const/tailwind"

/** theme namespace reset by a block */
type ThemeSpace = "color" | "opacity"

/** build one color declaration, omitting the suffix of the default shade */
function buildColor(name: string, value: string, key?: string): string {
  const suffix = key === undefined || key === "default"
    ? ""
    : `-${key}`

  return `  --color-${name}${suffix}: ${value};`
}

/** build the content of a theme block from the opacity mapping */
export function buildOpacity(opacity: TuneOpacity): string[] {
  return Object.entries(opacity).map(([key, value]) => `  --opacity-${key}: ${value}%;`)
}

/** build the content of a theme block from the color table */
export function buildContent(table: ThemeTable): string[] {
  const content: string[] = []

  for (const [name, values] of table) {
    for (const [key, value] of values)
      content.push(buildColor(name, value, key))
  }

  return content
}

/** keep the opacity of a scheme that differ from the default theme */
export function diffOpacity(base: TuneOpacity, next: TuneOpacity): TuneOpacity {
  const opacity: TuneOpacity = {}

  for (const [key, value] of Object.entries(next)) {
    if (base[key] !== value)
      opacity[key] = value
  }

  return opacity
}

/** keep the colors of a scheme that differ from the default theme */
export function diffTable(base: ThemeTable, next: ThemeTable): ThemeTable {
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

/** wrap theme content into a block, resetting the namespace for the default theme */
export function wrapTheme(content: string[], space: ThemeSpace, theme?: string): string[] {
  if (theme === undefined) {
    const constants = space === "color"
      ? Object.entries(FLAT_COLORS).map(([name, value]) => buildColor(name, value))
      : []

    return [
      "@theme {",
      `  --${space}-*: initial;`,
      ...constants,
      ...content,
      "}",
    ]
  }

  return [
    `[data-theme="${theme}"] {`,
    ...content,
    "}",
  ]
}

/** register the variant that scopes utilities to a theme */
export function customVariant(theme: string): string {
  return `@custom-variant ${theme} (&:where([data-theme="${theme}"] *));`
}
