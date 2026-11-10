import type { TuneConfig } from "@/config/schema"
import { parseBreakpoints, resolveUnits } from "@/preprocess/size/normalize"
import { buildKeys, buildUnits, wrapMedia, wrapTheme } from "@/preprocess/size/serialize"
import { text } from "@/text"

/** build the css of the size system and its breakpoints */
export function buildSize(config: TuneConfig): string {
  const size = config.size
  if (size === undefined)
    return ""

  // resolve the base scope
  const options = [size.min, size.max, size.step] as const
  const base = resolveUnits(size.units, ...options)
  const lengths = new Map(base.map(unit => [unit.name, unit.value]))
  const blocks: string[][] = [
    wrapTheme([
      ...buildUnits(base),
      ...buildKeys(base),
    ]),
  ]

  // order breakpoints by width
  const breakpoints = parseBreakpoints(size.breakpoints ?? {})

  // emit the variables changed by each breakpoint
  let units = size.units
  for (const breakpoint of breakpoints) {
    for (const unit of Object.keys(breakpoint.units)) {
      if (!(unit in size.units))
        throw new Error(text.preprocess.unknownUnit(breakpoint.name, unit))
    }

    units = {
      ...units,
      ...breakpoint.units,
    }

    const scoped = resolveUnits(units, ...options)
    const changed = scoped.filter(unit => lengths.get(unit.name) !== unit.value)
    for (const unit of scoped)
      lengths.set(unit.name, unit.value)

    if (changed.length > 0)
      blocks.push(wrapMedia(buildUnits(changed), breakpoint.width))
  }

  return blocks.flat().join("\n")
}
