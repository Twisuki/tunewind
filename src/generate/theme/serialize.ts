import type { TuneOpacity } from "@/config/schema"
import type { ThemeTable } from "@/generate/theme/types"

/** build the content of a theme block from the color table */
export function buildContent(table: ThemeTable): string[] {
  const content: string[] = []

  for (const [name, values] of table) {
    for (const [key, value] of values) {
      const suffix = key === "default"
        ? ""
        : `-${key}`

      content.push(`  --color-${name}${suffix}: ${value};`)
    }
  }

  return content
}

/** build the content of a theme block from the opacity mapping */
export function buildOpacity(opacity: TuneOpacity): string[] {
  return Object.entries(opacity).map(([key, value]) => `  --opacity-${key}: ${value}%;`)
}

/** wrap theme content into a block, resetting the namespace for the default theme */
export function wrapTheme(content: string[], space: string, theme?: string): string[] {
  if (theme === undefined) {
    return [
      "@theme {",
      `  --${space}-*: initial;`,
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
