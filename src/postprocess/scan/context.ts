import type { Declaration, Rule } from "postcss"
import type { DeclarationContext, Recorder, RuleContext, SelectorItem } from "@/postprocess/scan/types"
import { BYPASS_MARKER } from "@/const/postcss"
import { splitTopLevel, toSelectorItem, variablesOf } from "@/postprocess/scan/utils"

/** selector lists already split, keyed by rule */
const SELECTORS = new WeakMap<Rule, readonly SelectorItem[]>()

/** split the selector list of a rule, reusing the split of the same rule */
export function selectorsOf(rule: Rule): readonly SelectorItem[] {
  const cached = SELECTORS.get(rule)
  if (cached)
    return cached

  const items = splitTopLevel(rule.selector, ",").map(toSelectorItem)
  SELECTORS.set(rule, items)
  return items
}

/** whether the bypass marker of a rule exempts its nodes */
function isBypassed(rule: Rule, enabled: boolean): boolean {
  if (!enabled)
    return false

  return selectorsOf(rule).some(item => item.segments.includes(BYPASS_MARKER))
}

/** build the context of a scanned rule */
export function createRuleContext(
  rule: Rule,
  layers: readonly string[],
  recorder: Recorder,
  bypass: boolean,
): RuleContext {
  return {
    rule,
    layers,
    selectors: () => selectorsOf(rule),
    bypassed: () => isBypassed(rule, bypass),
    drop: () => {
      recorder.rules.add(rule)
    },
    dropSelectors: (items) => {
      const dropped = recorder.selectors.get(rule) ?? new Set<SelectorItem>()
      for (const item of items)
        dropped.add(item)
      recorder.selectors.set(rule, dropped)
    },
  }
}

/** build the context of a scanned declaration */
export function createDeclarationContext(
  declaration: Declaration,
  rule: Rule,
  layers: readonly string[],
  recorder: Recorder,
  bypass: boolean,
): DeclarationContext {
  return {
    declaration,
    rule,
    layers,
    variables: () => variablesOf(declaration.value),
    bypassed: () => isBypassed(rule, bypass),
    drop: () => {
      recorder.declarations.add(declaration)
    },
  }
}
