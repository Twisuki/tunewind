import { z } from "zod"
import { STRICT_MODES } from "@/const/strict"
import { COLOR_FAMILIES, COLOR_SHADES } from "@/const/tailwind"
import { text } from "@/text"

/** css length with an explicit unit, such as `4px` or `1rem` */
const cssLength = z.string().regex(/^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem)$/)

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
    /** smallest usable number */
    min: z.number().min(0).optional(),
    /** allowed size number precision */
    step: z.number().positive().optional(),
    /** allowed size number upper bound */
    max: z.number().positive().optional(),
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
  /** default smallest usable number for all units */
  min: z.number().min(0).optional(),
  /** default size number precision for all units */
  step: z.number().positive().optional(),
  /** default size number upper bound for all units */
  max: z.number().positive().optional(),
  /** units, key to unit, must define a `default` unit */
  units: z
    .record(keySchema, unitSchema)
    .refine(units => "default" in units, { message: text.config.defaultUnitRequired }),
  /** breakpoints, key to breakpoint */
  breakpoints: z.record(keySchema, breakpointSchema).optional(),
})

/** strict flags, every key allows the listed escape */
export const strictFlagsSchema = z.strictObject({
  /** allow arbitrary values such as `w-[123px]` */
  arbitrary: z.boolean().optional(),
  /** allow raw color family names such as `text-sky-600` */
  family: z.boolean().optional(),
  /** allow the raw prefix to bypass the postprocess stage */
  bypass: z.boolean().optional(),
})

/** strict mode, a switch, a mode name, or explicit flags */
export const strictSchema = z.union([
  z.boolean(),
  z.enum(STRICT_MODES),
  strictFlagsSchema,
])

/** tunewind config */
export const configSchema = z.strictObject({
  /** color theme */
  theme: themeSchema.optional(),
  /** size system */
  size: sizeSchema.optional(),
  /** strict mode */
  strict: strictSchema.optional(),
})

export type TunePalette = z.output<typeof paletteSchema>
export type TuneShade = z.output<typeof shadeSchema>
export type TuneOpacity = z.output<typeof opacitySchema>
export type TuneScheme = z.output<typeof schemeSchema>
export type TuneTheme = z.output<typeof themeSchema>
export type TuneUnit = z.output<typeof unitSchema>
export type TuneBreakpoint = z.output<typeof breakpointSchema>
export type TuneSize = z.output<typeof sizeSchema>
export type TuneStrictFlags = z.output<typeof strictFlagsSchema>
export type TuneStrict = z.output<typeof strictSchema>
export type TuneConfig = z.output<typeof configSchema>
