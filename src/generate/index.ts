import type { TuneConfig } from "@/config/schema"
import { buildTheme } from "@/generate/theme"

export function generate(config: TuneConfig): string {
  return buildTheme(config)
}
