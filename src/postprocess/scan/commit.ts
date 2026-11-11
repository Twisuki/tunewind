import type { AtRule, ChildNode, Container, Rule } from "postcss"
import type { Recorder } from "@/postprocess/scan/types"
import { EMPTY_AT_RULES, NODE_TYPES } from "@/const/postcss"
import { selectorsOf } from "@/postprocess/scan/context"

/** whether a container kind is removable once emptied */
function cleanable(node: Rule | AtRule): boolean {
  if (node.type === NODE_TYPES.rule)
    return true

  return EMPTY_AT_RULES.includes(node.name)
}

/** whether a container belongs to a removable kind */
function prunable(node: Container): node is Rule | AtRule {
  return node.type === NODE_TYPES.rule || node.type === NODE_TYPES.atRule
}

/** remove the containers emptied by the last removal, climbing up */
function clean(start: Container): void {
  let current = start

  while (current.parent && prunable(current) && cleanable(current) && current.nodes?.length === 0) {
    const parent: Container = current.parent
    current.remove()
    current = parent
  }
}

/** remove one node, then clean up what it leaves empty */
function remove(node: ChildNode): void {
  const parent = node.parent
  node.remove()

  if (parent)
    clean(parent)
}

/** apply the recorded deletions, cleaning the nodes they empty */
export function commit(recorder: Recorder): void {
  for (const [rule, dropped] of recorder.selectors) {
    if (!rule.parent)
      continue

    const kept = selectorsOf(rule).filter(item => !dropped.has(item))
    if (kept.length === 0) {
      remove(rule)
      continue
    }

    rule.selector = kept.map(item => item.raw).join(", ")
  }

  for (const rule of recorder.rules) {
    if (rule.parent)
      remove(rule)
  }

  for (const declaration of recorder.declarations) {
    if (declaration.parent)
      remove(declaration)
  }
}
