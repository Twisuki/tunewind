import type { AtRule } from "postcss"
import type { TuneSize, TuneUnit } from "@/config/schema"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { MEDIA_AT_RULE } from "@/const/postcss"
import { BREAKPOINTS } from "@/const/tailwind"
import { hasLayer } from "@/postprocess/plugins/utils"
import { unescape } from "@/postprocess/scan/utils"
import { text } from "@/text"

/** prefix of the spacing keys */
const SPACING_PREFIX = "--spacing-"

/** min widths of the media at-rules, cached by node */
const WIDTHS = new WeakMap<AtRule, number | null>()

/** usable number range of one unit */
interface SizeRange {
  /** smallest usable number */
  min: number
  /** largest usable number */
  max: number
  /** usable number precision */
  step: number
}

/** unit ranges of one scope, keyed by unit name */
type SizeScope = Map<string, SizeRange>

/** one breakpoint of the config */
interface SizeBreakpoint {
  /** min width */
  width: string
  /** unit patches of the breakpoint */
  units: Record<string, TuneUnit>
}

/** convert a css length into pixels */
function toPixels(length: string): number {
  return length.endsWith("rem")
    ? Number.parseFloat(length) * 16
    : Number.parseFloat(length)
}

/** read the range of a unit, patched over the previous range */
function rangeOf(unit: TuneUnit, size: TuneSize, previous?: SizeRange): SizeRange | undefined {
  const options = typeof unit === "string"
    ? undefined
    : unit
  const max = options?.max ?? previous?.max ?? size.max
  const min = options?.min ?? previous?.min ?? size.min ?? 0

  if (max === undefined || min > max)
    return undefined

  return {
    min,
    max,
    step: options?.step ?? previous?.step ?? size.step ?? 1,
  }
}

/** patch the ranges of a scope, field by field */
function patchRanges(scope: SizeScope, patch: Record<string, TuneUnit>, size: TuneSize): SizeScope {
  const next = new Map(scope)

  for (const [name, unit] of Object.entries(patch)) {
    const range = rangeOf(unit, size, scope.get(name))
    if (range !== undefined)
      next.set(name, range)
  }

  return next
}

/** read the breakpoints ordered by width */
function parseBreakpoints(size: TuneSize): SizeBreakpoint[] {
  const parsed: SizeBreakpoint[] = []

  for (const [name, breakpoint] of Object.entries(size.breakpoints ?? {})) {
    const options = typeof breakpoint === "string"
      ? undefined
      : breakpoint
    const width = options?.value ?? BREAKPOINTS[name as keyof typeof BREAKPOINTS]

    if (width === undefined)
      continue

    parsed.push({ width, units: options?.units ?? {} })
  }

  return parsed.sort((a, b) => toPixels(a.width) - toPixels(b.width))
}

/** build the width to unit ranges table of the configured breakpoints */
function buildScopes(size: TuneSize): Map<number, SizeScope> {
  const scopes = new Map<number, SizeScope>()
  let current = patchRanges(new Map(), size.units, size)

  for (const breakpoint of parseBreakpoints(size)) {
    current = patchRanges(current, breakpoint.units, size)
    scopes.set(toPixels(breakpoint.width), current)
  }

  return scopes
}

/** min width in pixels of a media query, absent when it has none */
function minWidthOf(query: string): number | undefined {
  const body = query.replace(/[()\s]/g, "")

  if (body.startsWith("min-width:"))
    return toPixels(body.slice("min-width:".length))

  if (body.startsWith("width>="))
    return toPixels(body.slice("width>=".length))

  return undefined
}

/** min width in pixels of a media at-rule, cached by node */
function widthOf(atRule: AtRule): number | undefined {
  const cached = WIDTHS.get(atRule)
  if (cached !== undefined)
    return cached ?? undefined

  const width = minWidthOf(atRule.params)
  WIDTHS.set(atRule, width ?? null)
  return width
}

/** ranges of the widest matching breakpoint among the enclosing at-rules */
function scopeOf(atRules: readonly AtRule[], scopes: Map<number, SizeScope>): SizeScope | undefined {
  let found: SizeScope | undefined
  let widest = -1

  for (const atRule of atRules) {
    if (atRule.name !== MEDIA_AT_RULE)
      continue

    const width = widthOf(atRule)
    if (width === undefined || width <= widest)
      continue

    const scope = scopes.get(width)
    if (scope === undefined)
      continue

    widest = width
    found = scope
  }

  return found
}

/** whether a value stays inside the range of a unit */
function inRange(value: number, range: SizeRange): boolean {
  if (value === 0)
    return true

  const steps = value / range.step
  const index = Math.round(steps)

  if (Math.abs(steps - index) > 1e-6)
    return false

  return index >= Math.ceil(range.min / range.step) && index <= Math.floor(range.max / range.step)
}

/** read the number and the range of a spacing reference */
function spacingOf(name: string, scope: SizeScope): { value: number, range: SizeRange } | undefined {
  const plain = unescape(name)
  if (!plain.startsWith(SPACING_PREFIX))
    return undefined

  const body = plain.slice(SPACING_PREFIX.length)
  let matched: { suffix: string, range: SizeRange } | undefined

  for (const [unit, range] of scope) {
    const suffix = unit === "default"
      ? ""
      : unit

    if (!body.endsWith(suffix))
      continue

    if (matched !== undefined && matched.suffix.length >= suffix.length)
      continue

    matched = { suffix, range }
  }

  if (matched === undefined)
    return undefined

  const digits = body.slice(0, body.length - matched.suffix.length)
  if (digits === "")
    return undefined

  const value = Number(digits)
  if (!Number.isFinite(value))
    return undefined

  return { value, range: matched.range }
}

/** whether a variable reference breaks the unit range of the scope */
function isOutside(name: string, scope: SizeScope): boolean {
  const spacing = spacingOf(name, scope)
  if (spacing === undefined)
    return false

  return !inRange(spacing.value, spacing.range)
}

/** drop every declaration whose size breaks the range of its breakpoint */
export function createSizePlugin(size: TuneSize): ScanPlugin {
  const scopes = buildScopes(size)

  return {
    declaration: (context) => {
      if (!hasLayer(context.atRules, "utilities"))
        return

      const scope = scopeOf(context.atRules, scopes)
      if (scope === undefined)
        return

      if (context.variables().some(name => isOutside(name, scope)))
        context.drop(text.postprocess.reason.size)
    },
  }
}
