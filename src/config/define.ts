import type { z } from "zod"
import { configSchema } from "@/config/schema"

export function defineConfig(input: z.input<typeof configSchema>): z.output<typeof configSchema> {
  return configSchema.parse(input)
}
