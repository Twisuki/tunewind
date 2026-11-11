import type { Root } from "postcss"
import type { TuneConfig } from "@/config/schema"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { scan } from "@/postprocess/scan"

/** entry of the postprocess stage */
export function main(root: Root, _config: TuneConfig): void {
  const plugins: ScanPlugin[] = []
  scan(root, plugins)
}
