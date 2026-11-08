import type { TuneConfig } from "@/config/schema"
import { buildSize } from "@/generate/size"
import { buildTheme } from "@/generate/theme"

export function generate(config: TuneConfig): string {
  return [
    buildTheme(config),
    buildSize(config),
  ].filter(Boolean).join("\n")
}
