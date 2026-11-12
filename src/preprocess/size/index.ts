import type { TuneConfig } from "@/config/schema"
import { output } from "@/plugins/output"
import { mergeUnits, parseBreakpoints, resolveUnits } from "@/preprocess/size/normalize"
import { buildBreakpoints, buildKeys, buildUnits, diffUnits, wrapBreakpoint, wrapTheme } from "@/preprocess/size/serialize"
import { text } from "@/text"

/** build the css of the size system and its breakpoints */
export function buildSize(config: TuneConfig): string {
  const size = config.size
  if (size === undefined)
    return ""

  const defaults = [size.min, size.max, size.step] as const
  const base = resolveUnits(size.units, ...defaults)
  const breakpoints = parseBreakpoints(size.breakpoints ?? {})

  // each scope adds its own numbers, so keys stay global
  const keys = new Set(buildKeys(base))
  const blocks: string[][] = []
  let units = size.units
  let previous = base

  // one config patch and its changed units per breakpoint
  for (const breakpoint of breakpoints) {
    for (const name of Object.keys(breakpoint.units)) {
      if (!(name in size.units))
        output.error(text.preprocess.unknownUnit(breakpoint.name, name))
    }

    units = mergeUnits(units, breakpoint.units)
    const scoped = resolveUnits(units, ...defaults)
    for (const key of buildKeys(scoped))
      keys.add(key)

    // keep only the units that changed
    const changed = diffUnits(previous, scoped)
    if (changed.length > 0)
      blocks.push(wrapBreakpoint(buildUnits(changed), breakpoint.width))

    previous = scoped
  }

  // the theme block holds every key, so it comes last
  return [
    ...wrapTheme([
      ...buildBreakpoints(breakpoints),
      ...buildUnits(base),
      ...keys,
    ]),
    ...blocks.flat(),
  ].join("\n")
}
