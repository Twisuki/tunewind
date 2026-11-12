import type { TuneUnit } from "@/config/schema"

/** object form of a unit definition */
export type TuneUnitOptions = Extract<TuneUnit, object>

/** one resolved size unit, ready to become css */
export interface SizeUnit {
  /** unit name, `default` is the base unit */
  name: string
  /** css length of one step */
  value: string
  /** smallest usable number */
  min: number
  /** largest usable number */
  max: number
  /** usable number precision */
  step: number
}

/** one parsed breakpoint, ordered by width with the others */
export interface SizeBreakpoint {
  /** breakpoint key */
  name: string
  /** min width */
  width: string
  /** unit overrides of the breakpoint */
  units: Record<string, TuneUnit>
}
