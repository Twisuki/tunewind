import type { TuneBreakpoint, TuneUnit } from "@/config/schema"
import type { SizeBreakpoint, SizeUnit, TuneUnitOptions } from "@/preprocess/size/types"
import { BREAKPOINTS } from "@/const/tailwind"
import { output } from "@/plugins/output"
import { text } from "@/text"

/** read a unit definition as options, a plain length becomes `{ value }` */
function toOptions(unit: TuneUnit): TuneUnitOptions {
  return typeof unit === "string"
    ? { value: unit }
    : unit
}

/** merge a unit patch into the units, field by field */
export function mergeUnits(units: Record<string, TuneUnit>, patch: Record<string, TuneUnit>): Record<string, TuneUnit> {
  const merged = { ...units }

  for (const [name, next] of Object.entries(patch)) {
    merged[name] = {
      ...toOptions(units[name] ?? next),
      ...toOptions(next),
    }
  }

  return merged
}

/** convert a css length into pixels, used to order breakpoints */
function toPixels(length: string): number {
  return length.endsWith("rem")
    ? Number.parseFloat(length) * 16
    : Number.parseFloat(length)
}

/** parse the breakpoints and order them by width */
export function parseBreakpoints(breakpoints: Record<string, TuneBreakpoint>): SizeBreakpoint[] {
  const parsed = Object.entries(breakpoints).map(([name, breakpoint]) => {
    const options = typeof breakpoint === "string"
      ? undefined
      : breakpoint
    const builtin: string | undefined = BREAKPOINTS[name as keyof typeof BREAKPOINTS]
    const width = options?.value ?? builtin

    if (width === undefined)
      output.error(text.preprocess.breakpointWidthMissing(name))

    return {
      name,
      prefix: options?.prefix ?? name,
      width,
      units: options?.units ?? {},
    }
  })

  const ordered = parsed.sort((a, b) => toPixels(a.width) - toPixels(b.width))
  const identifiers = new Map<string, string>()

  for (const [index, current] of ordered.entries()) {
    const previous = ordered[index - 1]
    if (previous !== undefined && toPixels(previous.width) === toPixels(current.width))
      output.error(text.preprocess.breakpointDuplicated(previous.name, current.name))

    const first = identifiers.get(current.prefix)
    if (first !== undefined)
      output.error(text.preprocess.breakpointPrefixDuplicated(first, current.name))

    identifiers.set(current.prefix, current.name)
  }

  return ordered
}

/** resolve one scope of units into size units */
export function resolveUnits(
  units: Record<string, TuneUnit>,
  min?: number,
  max?: number,
  step?: number,
): SizeUnit[] {
  return Object.entries(units).map(([name, unit]) => {
    const options = toOptions(unit)
    const bound = options.max ?? max

    if (bound === undefined)
      output.error(text.preprocess.maxMissing(name))

    const lower = options.min ?? min ?? 0

    if (lower > bound)
      output.error(text.preprocess.rangeReversed(name))

    return {
      name,
      value: options.value,
      min: lower,
      max: bound,
      step: options.step ?? step ?? 1,
    }
  })
}
