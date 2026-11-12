import type { SizeBreakpoint, SizeUnit } from "@/preprocess/size/types"

function unitName(unit: SizeUnit): string {
  return unit.name === "default"
    ? "--unit"
    : `--unit-${unit.name}`
}

/** build the unit variables of one scope */
export function buildUnits(units: SizeUnit[]): string[] {
  return units.map(unit => `  ${unitName(unit)}: ${unit.value};`)
}

/** build the spacing keys of one scope */
export function buildKeys(units: SizeUnit[]): string[] {
  const content: string[] = []

  for (const unit of units) {
    const suffix = unit.name === "default"
      ? ""
      : unit.name
    const precision = `${unit.step}`.split(".")[1]?.length ?? 0
    const numbers = new Set<number>([0])
    const start = Math.ceil(unit.min / unit.step)
    const end = Math.floor(unit.max / unit.step)

    for (let index = start; index <= end; index++)
      numbers.add(Number((index * unit.step).toFixed(precision)))

    for (const number of [...numbers].sort((a, b) => a - b))
      content.push(`  --spacing-${number}${suffix}: calc(${number} * var(${unitName(unit)}));`)
  }

  return content
}

/** build the width variables of the configured breakpoints */
export function buildBreakpoints(breakpoints: readonly SizeBreakpoint[]): string[] {
  return breakpoints.map(breakpoint => `  --breakpoint-${breakpoint.prefix}: ${breakpoint.width};`)
}

/** keep the units whose length differs from the previous table */
export function diffUnits(previous: SizeUnit[], next: SizeUnit[]): SizeUnit[] {
  return next.filter(unit => previous.find(item => item.name === unit.name)?.value !== unit.value)
}

/** wrap the content into the theme block that resets the tailwind spacing */
export function wrapTheme(content: string[]): string[] {
  return [
    "@theme {",
    "  --spacing: initial;",
    ...content,
    "}",
  ]
}

/** wrap the content into the media query of a breakpoint */
export function wrapBreakpoint(content: string[], width: string): string[] {
  return [
    `@media (min-width: ${width}) {`,
    "  :root {",
    ...content.map(line => `  ${line}`),
    "  }",
    "}",
  ]
}
