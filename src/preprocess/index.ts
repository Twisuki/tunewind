import type { TuneConfig } from "@/config/schema"
import { buildRaw } from "@/preprocess/raw"
import { buildSize } from "@/preprocess/size"
import { buildTheme } from "@/preprocess/theme"

export function main(config: TuneConfig): string {
  return [
    buildRaw(),
    buildTheme(config),
    buildSize(config),
  ].filter(Boolean).join("\n")
}
