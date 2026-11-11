import type { Root } from "postcss"
import type { TuneConfig, TuneStrict } from "@/config/schema"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { createArbitraryPlugin } from "@/postprocess/plugins/arbitrary"
import { createFamilyPlugin } from "@/postprocess/plugins/family"
import { createOpacityPlugin } from "@/postprocess/plugins/opacity"
import { scan } from "@/postprocess/scan"

/** strict allowances, absent when the strict mode is off */
interface StrictPolicy {
  /** allow arbitrary values */
  arbitrary: boolean
  /** allow raw color family names */
  family: boolean
  /** honor the bypass marker */
  bypass: boolean
}

/** normalize the strict forms into explicit allowances */
function normalizeStrict(strict: TuneStrict | undefined): StrictPolicy | undefined {
  if (strict === undefined || strict === false)
    return undefined

  if (typeof strict === "object") {
    return {
      arbitrary: strict.arbitrary === true,
      family: strict.family === true,
      bypass: strict.bypass === true,
    }
  }

  return {
    arbitrary: false,
    family: false,
    bypass: strict === "bypass",
  }
}

/** entry of the postprocess stage */
export function main(root: Root, config: TuneConfig): void {
  const policy = normalizeStrict(config.strict)
  const plugins: ScanPlugin[] = []

  if (policy !== undefined && !policy.arbitrary)
    plugins.push(createArbitraryPlugin())

  if (policy !== undefined && !policy.family)
    plugins.push(createFamilyPlugin(config.theme ?? {}))

  plugins.push(createOpacityPlugin())

  scan(root, plugins, { bypass: policy?.bypass ?? false })
}
