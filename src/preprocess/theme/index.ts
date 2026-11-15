import type { TuneConfig } from "@/config/schema"
import type { ThemeTable } from "@/preprocess/theme/types"
import { output } from "@/plugins/output"
import { groupOf, mergeGroup, normalize } from "@/preprocess/theme/normalize"
import { buildContent, buildOpacity, customVariant, diffOpacity, diffTable, wrapDark, wrapTheme } from "@/preprocess/theme/serialize"
import { text } from "@/text"

/** one dark theme block emitted after the schemes */
interface DarkScheme {
  /** marker of the scheme */
  identifier: string
  /** dark color table */
  table: ThemeTable
}

/** build the css of the default theme, the named themes and both modes */
export function buildTheme(config: TuneConfig): string {
  const theme = config.theme ?? {}
  const base = groupOf(theme, true)
  const baseLight = normalize(base.light.palette, base.light.shade)
  const baseDark = normalize(base.dark.palette, base.dark.shade)

  const variants: string[] = []
  const blocks: string[][] = [
    wrapTheme(buildContent(baseLight), "color"),
  ]

  if (Object.keys(base.opacity).length > 0)
    blocks.push(wrapTheme(buildOpacity(base.opacity), "opacity"))

  const identifiers = new Set<string>()
  const darkSchemes: DarkScheme[] = []
  let needsDark = diffTable(baseLight, baseDark).size > 0

  for (const [key, scheme] of Object.entries(theme.schemes ?? {})) {
    const identifier = scheme.prefix ?? key
    if (key === "light" || key === "dark")
      output.error(text.preprocess.themeReserved(key))
    if (identifier === "light" || identifier === "dark")
      output.error(text.preprocess.themeReserved(identifier))
    if (identifiers.has(identifier))
      output.error(text.preprocess.themeDuplicated(identifier))

    identifiers.add(identifier)
    variants.push(customVariant(identifier))

    const merged = mergeGroup(base, groupOf(scheme, false))
    const light = normalize(merged.light.palette, merged.light.shade)
    const dark = normalize(merged.dark.palette, merged.dark.shade)
    const table = diffTable(baseLight, light)
    const darkDiff = diffTable(baseDark, dark)
    const opacity = diffOpacity(base.opacity, merged.opacity)

    if (table.size > 0)
      blocks.push(wrapTheme(buildContent(table), "color", identifier))

    if (Object.keys(opacity).length > 0)
      blocks.push(wrapTheme(buildOpacity(opacity), "opacity", identifier))

    if (table.size > 0 || darkDiff.size > 0) {
      needsDark = true
      darkSchemes.push({ identifier, table: dark })
    }
  }

  if (needsDark) {
    blocks.push(wrapDark(buildContent(baseDark)))

    for (const scheme of darkSchemes)
      blocks.push(wrapDark(buildContent(scheme.table), scheme.identifier))
  }

  return [
    ...variants,
    ...blocks.flat(),
  ].join("\n")
}
