import type { Root } from "postcss"
import type { TuneConfig, TuneDiagnostics, TuneStrict } from "@/config/schema"
import type { DiagnosticLevel } from "@/const/diagnostics"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { DIAGNOSTIC_LIMIT } from "@/const/diagnostics"
import { output } from "@/plugins/output"
import { createArbitraryPlugin } from "@/postprocess/plugins/arbitrary"
import { createFamilyPlugin } from "@/postprocess/plugins/family"
import { createOpacityPlugin } from "@/postprocess/plugins/opacity"
import { createSizePlugin } from "@/postprocess/plugins/size"
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

/** resolved diagnostic settings */
interface DiagnosticPolicy {
  /** diagnostic level */
  level: DiagnosticLevel
  /** most lines reported */
  limit: number
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

/** normalize the diagnostics forms into an explicit level and limit */
function normalizeDiagnostics(diagnostics: TuneDiagnostics | undefined): DiagnosticPolicy {
  if (diagnostics === undefined)
    return { level: "off", limit: DIAGNOSTIC_LIMIT }

  if (typeof diagnostics === "string")
    return { level: diagnostics, limit: DIAGNOSTIC_LIMIT }

  return { level: diagnostics.mode, limit: diagnostics.limit ?? DIAGNOSTIC_LIMIT }
}

/** build the enabled checks for a config */
function buildPlugins(config: TuneConfig, policy: StrictPolicy | undefined): ScanPlugin[] {
  const plugins: ScanPlugin[] = []

  if (policy !== undefined && !policy.arbitrary)
    plugins.push(createArbitraryPlugin())

  if (policy !== undefined && !policy.family)
    plugins.push(createFamilyPlugin(config.theme ?? {}))

  plugins.push(createOpacityPlugin())

  if (config.size !== undefined)
    plugins.push(createSizePlugin(config.size))

  return plugins
}

/** build the message listing the dropped nodes */
function listing(lines: readonly string[], total: number): string {
  const body = lines.map(line => `  ${line}`).join("\n")
  const tail = total > lines.length
    ? `\n  ${text.postprocess.more(total - lines.length)}`
    : ""

  return `${text.postprocess.summary(total)}\n${body}${tail}`
}

/** report the dropped nodes according to the diagnostic settings */
function report(lines: readonly string[], policy: DiagnosticPolicy): void {
  if (policy.level === "off" || lines.length === 0)
    return

  const unique = Array.from(new Set(lines))
  const shown = unique.slice(0, policy.limit)

  if (policy.level === "warn") {
    for (const line of shown)
      output.warn(text.postprocess.warn(line))

    if (unique.length > shown.length)
      output.warn(text.postprocess.warn(text.postprocess.more(unique.length - shown.length)))

    return
  }

  output.error(listing(shown, unique.length))
}

/** entry of the postprocess stage */
export function main(root: Root, config: TuneConfig): void {
  const policy = normalizeStrict(config.strict)
  const lines = scan(root, buildPlugins(config, policy), { bypass: policy?.bypass ?? false })
  report(lines, normalizeDiagnostics(config.diagnostics))
}
