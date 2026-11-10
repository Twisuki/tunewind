import type { TuneBreakpoint, TuneUnit } from "@/config/schema"
import type { SizeBreakpoint, SizeUnit } from "@/preprocess/size/types"
import { text } from "@/text"

/** resolve one scope of units into size units */
export function resolveUnits(units: Record<string, TuneUnit>, min?: number, max?: number, step?: number): SizeUnit[] {
  return Object.entries(units).map(([name, unit]) => {
    const options = typeof unit === "string"
      ? undefined
      : unit
    const bound = options?.max ?? max

    if (bound === undefined)
      throw new Error(text.preprocess.maxMissing(name))

    return {
      name,
      value: typeof unit === "string"
        ? unit
        : unit.value,
      min: options?.min ?? min ?? 0,
      max: bound,
      step: options?.step ?? step ?? 1,
    }
  })
}

/** convert a css length into pixels, used to order breakpoints */
function toPixels(length: string): number {
  return length.endsWith("rem")
    ? Number.parseFloat(length) * 16
    : Number.parseFloat(length)
}

/** parse the breakpoints and order them by width */
export function parseBreakpoints(breakpoints: Record<string, TuneBreakpoint>): SizeBreakpoint[] {
  const parsed = Object.entries(breakpoints).map(([name, breakpoint]) => ({
    name,
    width: typeof breakpoint === "string"
      ? breakpoint
      : breakpoint.value,
    units: typeof breakpoint === "string"
      ? {}
      : breakpoint.units ?? {},
  }))

  return parsed.sort((a, b) => toPixels(a.width) - toPixels(b.width))
}
