import type { TuneTheme } from "@/config/schema"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { COLOR_FAMILIES } from "@/const/tailwind"
import { hasLayer } from "@/postprocess/plugins/utils"
import { text } from "@/text"

/** collect the color variables that only exist under their raw family name */
function collectRawVars(theme: TuneTheme): Set<string> {
  const aliases = new Set(Object.keys(theme.palette ?? {}))
  const keys = new Set(Object.keys(theme.shade ?? {}))

  for (const scheme of Object.values(theme.schemes ?? {})) {
    for (const name of Object.keys(scheme.palette ?? {}))
      aliases.add(name)

    for (const key of Object.keys(scheme.shade ?? {}))
      keys.add(key)
  }

  const vars = new Set<string>()
  for (const family of COLOR_FAMILIES) {
    if (aliases.has(family))
      continue

    for (const key of keys) {
      vars.add(key === "default"
        ? `--color-${family}`
        : `--color-${family}-${key}`)
    }
  }

  return vars
}

/** drop every declaration referencing a raw color family name */
export function createFamilyPlugin(theme: TuneTheme): ScanPlugin {
  const vars = collectRawVars(theme)

  return {
    filter: atRules => hasLayer(atRules, "utilities"),
    declaration: (context) => {
      if (context.bypassed())
        return

      if (context.variables().some(name => vars.has(name)))
        context.drop(text.postprocess.reason.family)
    },
  }
}
