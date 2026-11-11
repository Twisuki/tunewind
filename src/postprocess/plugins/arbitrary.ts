import type { ScanPlugin } from "@/postprocess/scan/types"

/** drop every selector holding an arbitrary value */
export function createArbitraryPlugin(): ScanPlugin {
  return {
    layers: ["utilities"],
    rule: (context) => {
      if (context.bypassed())
        return

      const hit = context.selectors().filter(item => item.raw.includes("\\["))
      if (hit.length > 0)
        context.dropSelectors(hit)
    },
  }
}
