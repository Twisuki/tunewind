import type { ScanPlugin } from "@/postprocess/scan/types"
import { hasLayer } from "@/postprocess/plugins/utils"
import { text } from "@/text"

/** drop every selector holding an arbitrary value */
export function createArbitraryPlugin(): ScanPlugin {
  return {
    rule: (context) => {
      if (!hasLayer(context.atRules, "utilities"))
        return

      if (context.bypassed())
        return

      const hit = context.selectors().filter(item => item.raw.includes("\\["))
      if (hit.length > 0)
        context.dropSelectors(hit, text.postprocess.reason.arbitrary)
    },
  }
}
