import { z } from "zod"
import { text } from "@/text"

const cssLength = z.string().regex(/^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em)$/)

const colorValue = z.string().min(1)

const keySchema = z.string().regex(/^\w+$/, { message: text.config.keyFormat })

const colorScaleSchema = z.record(z.string().regex(/^\d+$/), colorValue).refine(
  scale => Object.keys(scale).length > 0,
  { message: text.config.colorScaleEmpty },
)

export const paletteSchema = z.record(keySchema, colorScaleSchema)

export const shadeSchema = z.record(keySchema, z.number().int().min(0).max(1000))

export const opacitySchema = z.record(keySchema, z.number().min(0).max(100))

export const schemeSchema = z.strictObject({
  name: z.string().min(1).optional(),
  prefix: z.string().min(1).optional(),
  palette: paletteSchema.optional(),
  shade: shadeSchema.optional(),
  opacity: opacitySchema.optional(),
})

export const themeSchema = z.strictObject({
  palette: paletteSchema.optional(),
  shade: shadeSchema.optional(),
  opacity: opacitySchema.optional(),
  schemes: z.record(keySchema, schemeSchema).optional(),
})

export const unitSchema = z.union([
  cssLength,
  z.strictObject({
    value: cssLength,
    step: z.number().positive().optional(),
    max: z.union([
      z.number().positive(),
      z.literal("auto"),
    ]).optional(),
  }),
])

export const breakpointSchema = z.union([
  cssLength,
  z.strictObject({
    value: cssLength,
    units: z.record(keySchema, unitSchema).optional(),
  }),
])

export const sizeSchema = z.strictObject({
  step: z.number().positive().optional(),
  max: z.union([
    z.number().positive(),
    z.literal("auto"),
  ]).optional(),
  units: z
    .record(keySchema, unitSchema)
    .refine(units => "default" in units, { message: text.config.defaultUnitRequired }),
  breakpoints: z.record(keySchema, breakpointSchema).optional(),
})

export const configSchema = z.strictObject({
  theme: themeSchema.optional(),
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
