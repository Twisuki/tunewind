import type { TuneConfig } from "@/config/schema"
import { groupOf, mergeGroup, normalize } from "@/preprocess/theme/normalize"
import { buildContent, buildOpacity, customVariant, diffOpacity, diffTable, wrapTheme } from "@/preprocess/theme/serialize"
import { text } from "@/text"

/** build the css of the default theme and all schemes */
export function buildTheme(config: TuneConfig): string {
  const theme = config.theme ?? {}
  const base = groupOf(theme)
  const baseTable = normalize(base.palette, base.shade)

  const variants: string[] = []
  // the base always emits colors, opacity only when configured
  const blocks: string[][] = [
    wrapTheme(buildContent(baseTable), "color"),
  ]

  if (Object.keys(base.opacity).length > 0)
    blocks.push(wrapTheme(buildOpacity(base.opacity), "opacity"))

  // schemes switch by variant, so their identifiers must stay unique
  const identifiers = new Set<string>()

  // one variant and its changed blocks per scheme
  for (const [key, scheme] of Object.entries(theme.schemes ?? {})) {
    const identifier = scheme.prefix ?? key
    if (identifiers.has(identifier))
      throw new Error(text.preprocess.themeDuplicated(identifier))

    identifiers.add(identifier)
    variants.push(customVariant(identifier))

    // merge the scheme over the base, then keep what actually changed
    const merged = mergeGroup(base, groupOf(scheme))
    const table = diffTable(baseTable, normalize(merged.palette, merged.shade))
    const opacity = diffOpacity(base.opacity, merged.opacity)

    // one scheme may emit a color block and an opacity block
    if (table.size > 0)
      blocks.push(wrapTheme(buildContent(table), "color", identifier))

    if (Object.keys(opacity).length > 0)
      blocks.push(wrapTheme(buildOpacity(opacity), "opacity", identifier))
  }

  return [
    ...variants,
    ...blocks.flat(),
  ].join("\n")
}
