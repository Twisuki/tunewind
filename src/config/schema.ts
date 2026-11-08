import { z } from "zod"
import { COLOR_FAMILIES, COLOR_SHADES } from "@/const"
import { text } from "@/text"

/** css length with an explicit unit, such as `4px` or `1rem` */
const cssLength = z.string().regex(/^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em)$/)

/** any css color value */
const colorValue = z.string().min(1)

/** config key, limited to word characters */
const keySchema = z.string().regex(/^\w+$/, { message: text.config.keyFormat })

/** built-in color family name */
const colorFamilySchema = z.enum(COLOR_FAMILIES)

/** built-in shade number */
const colorShadeSchema = z.literal(COLOR_SHADES)

/** color family scale, shade number to color value */
const colorScaleSchema = z.record(z.string().regex(/^\d+$/), colorValue).refine(
  scale => Object.keys(scale).length > 0,
  { message: text.config.colorScaleEmpty },
)

/** palette entry, an alias to a built-in family or an explicit scale */
const paletteEntrySchema = z.union([colorFamilySchema, colorScaleSchema])

/** color families, alias name to family or scale */
export const paletteSchema = z.record(keySchema, paletteEntrySchema)

/** shade mapping, semantic key to shade number */
export const shadeSchema = z.record(keySchema, colorShadeSchema)

/** opacity mapping, semantic key to percentage */
export const opacitySchema = z.record(keySchema, z.number().min(0).max(100))

/** color scheme, overriding the global layers */
export const schemeSchema = z.strictObject({
  /** scheme name, defaults to its key */
  name: z.string().min(1).optional(),
  /** variant prefix, such as `dark` for `dark:bg-primary` */
  prefix: z.string().min(1).optional(),
  /** scheme palette */
  palette: paletteSchema.optional(),
  /** scheme shade mapping */
  shade: shadeSchema.optional(),
  /** scheme opacity mapping */
  opacity: opacitySchema.optional(),
})

/** color theme, global layers plus named schemes */
export const themeSchema = z.strictObject({
  /** global palette */
  palette: paletteSchema.optional(),
  /** global shade mapping */
  shade: shadeSchema.optional(),
  /** global opacity mapping */
  opacity: opacitySchema.optional(),
  /** named schemes, key to scheme */
  schemes: z.record(keySchema, schemeSchema).optional(),
})

/** size unit, a plain length or a constrained length */
export const unitSchema = z.union([
  cssLength,
  z.strictObject({
    /** unit length */
    value: cssLength,
    /** allowed size number precision */
    step: z.number().positive().optional(),
    /** allowed size number upper bound, `auto` takes twice the next larger unit */
    max: z.union([
      z.number().positive(),
      z.literal("auto"),
    ]).optional(),
  }),
])

/** breakpoint, a plain width or a width with unit overrides */
export const breakpointSchema = z.union([
  cssLength,
  z.strictObject({
    /** breakpoint width */
    value: cssLength,
    /** units redefined in this breakpoint */
    units: z.record(keySchema, unitSchema).optional(),
  }),
])

/** size system, units and breakpoints */
export const sizeSchema = z.strictObject({
  /** default size number precision for all units */
  step: z.number().positive().optional(),
  /** default size number upper bound for all units, `auto` takes twice the next larger unit */
  max: z.union([
    z.number().positive(),
    z.literal("auto"),
  ]).optional(),
  /** units, key to unit, must define a `default` unit */
  units: z
    .record(keySchema, unitSchema)
    .refine(units => "default" in units, { message: text.config.defaultUnitRequired }),
  /** breakpoints, key to breakpoint */
  breakpoints: z.record(keySchema, breakpointSchema).optional(),
})

/** tunewind config */
export const configSchema = z.strictObject({
  /** color theme */
  theme: themeSchema.optional(),
  /** size system */
  size: sizeSchema.optional(),
})

export type TunePalette = z.output<typeof paletteSchema>
export type TuneShade = z.output<typeof shadeSchema>
export type TuneOpacity = z.output<typeof opacitySchema>
export type TuneScheme = z.output<typeof schemeSchema>
export type TuneTheme = z.output<typeof themeSchema>
export type TuneUnit = z.output<typeof unitSchema>
export type TuneBreakpoint = z.output<typeof breakpointSchema>
export type TuneSize = z.output<typeof sizeSchema>
export type TuneConfig = z.output<typeof configSchema>
