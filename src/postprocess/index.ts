import type { Root } from "postcss"
import type { TuneConfig, TuneDiagnostics, TuneStrict } from "@/config/schema"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { DIAGNOSTIC_LIMIT } from "@/const/diagnostics"
import { DiagnosticsError } from "@/postprocess/error"
import { createArbitraryPlugin } from "@/postprocess/plugins/arbitrary"
import { createFamilyPlugin } from "@/postprocess/plugins/family"
import { createOpacityPlugin } from "@/postprocess/plugins/opacity"
import { scan } from "@/postprocess/scan"
import { text } from "@/text"

/** strict allowances, absent when the strict mode is off */
interface StrictPolicy {
  /** allow arbitrary values */
  arbitrary: boolean
  /** allow raw color family names */
  family: boolean
  /** honor the bypass marker */
  bypass: boolean
}

/** where the diagnostic lines of one postprocess go */
export interface PostprocessSink {
  /** emit one warning line */
  warn: (line: string) => void
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

/** build the enabled checks for a config */
function buildPlugins(config: TuneConfig, policy: StrictPolicy | undefined): ScanPlugin[] {
  const plugins: ScanPlugin[] = []

  if (policy !== undefined && !policy.arbitrary)
    plugins.push(createArbitraryPlugin())

  if (policy !== undefined && !policy.family)
    plugins.push(createFamilyPlugin(config.theme ?? {}))

  plugins.push(createOpacityPlugin())
  return plugins
}

/** report the dropped nodes according to the diagnostic level */
function report(lines: readonly string[], level: TuneDiagnostics, sink: PostprocessSink): void {
  if (level === "off" || lines.length === 0)
    return

  const unique = Array.from(new Set(lines))
  const shown = unique.slice(0, DIAGNOSTIC_LIMIT)

  if (level === "warn") {
    for (const line of shown)
      sink.warn(text.postprocess.warn(line))
    return
  }

  throw new DiagnosticsError(shown, unique.length)
}

/** entry of the postprocess stage */
export function main(root: Root, config: TuneConfig, sink: PostprocessSink): void {
  const policy = normalizeStrict(config.strict)
  const lines = scan(root, buildPlugins(config, policy), { bypass: policy?.bypass ?? false })
  report(lines, config.diagnostics ?? "off", sink)
}
