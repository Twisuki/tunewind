import type { TuneConfig } from "@/config/schema"
import { buildSize } from "@/preprocess/size"
import { buildTheme } from "@/preprocess/theme"

export function main(config: TuneConfig): string {
  return [
    buildTheme(config),
    buildSize(config),
  ].filter(Boolean).join("\n")
}
