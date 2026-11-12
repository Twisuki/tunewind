import type { AtRule, Declaration, Rule } from "postcss"
import type { DeclarationContext, Recorder, RuleContext, SelectorItem } from "@/postprocess/scan/types"
import { BYPASS_MARKER } from "@/const/postcss"
import { splitTopLevel, toSelectorItem, variablesOf } from "@/postprocess/scan/utils"
import { text } from "@/text"

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
  atRules: readonly AtRule[],
  recorder: Recorder,
  bypass: boolean,
): RuleContext {
  return {
    rule,
    atRules,
    selectors: () => selectorsOf(rule),
    bypassed: () => isBypassed(rule, bypass),
    drop: (reason) => {
      recorder.rules.add(rule)
      recorder.reports.push(text.postprocess.dropped(reason, rule.selector))
    },
    dropSelectors: (items, reason) => {
      const dropped = recorder.selectors.get(rule) ?? new Set<SelectorItem>()
      for (const item of items) {
        dropped.add(item)
        recorder.reports.push(text.postprocess.dropped(reason, item.raw))
      }
      recorder.selectors.set(rule, dropped)
    },
  }
}

/** build the context of a scanned declaration */
export function createDeclarationContext(
  declaration: Declaration,
  rule: Rule,
  atRules: readonly AtRule[],
  recorder: Recorder,
  bypass: boolean,
): DeclarationContext {
  return {
    declaration,
    rule,
    atRules,
    variables: () => variablesOf(declaration.value),
    bypassed: () => isBypassed(rule, bypass),
    drop: (reason) => {
      recorder.declarations.add(declaration)
      recorder.reports.push(
        text.postprocess.dropped(reason, `${declaration.prop}: ${declaration.value}`, rule.selector),
      )
    },
  }
}
