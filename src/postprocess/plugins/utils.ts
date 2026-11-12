import type { AtRule } from "postcss"
import { LAYER_AT_RULE } from "@/const/postcss"

/** whether the node sits in the given cascade layer */
export function hasLayer(atRules: readonly AtRule[], name: string): boolean {
  return atRules.some(rule =>
    rule.name === LAYER_AT_RULE && rule.params.split(",").some(part => part.trim() === name),
  )
}
