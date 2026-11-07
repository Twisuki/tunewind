import type { AtRule, Plugin, PluginCreator, Root } from "postcss"
import { parse } from "postcss"
import { AT_RULE_NAME, PRESET_PLUGIN_NAME } from "@/const"

interface PresetOptions {
  cwd?: string
}

function findAtRules(root: Root): AtRule[] {
  const atRules: AtRule[] = []
  root.walkAtRules(AT_RULE_NAME, (atRule) => {
    atRules.push(atRule)
  })
  return atRules
}

export const preset: PluginCreator<PresetOptions> = Object.assign(
  (_options: PresetOptions = {}): Plugin => ({
    postcssPlugin: PRESET_PLUGIN_NAME,
    Once(root: Root) {
      const atRules = findAtRules(root)
      if (atRules.length === 0)
        return

      const css: string = ""
      if (css.length === 0) {
        atRules.forEach(atRule => atRule.remove())
        return
      }

      const nodes = parse(css).nodes
      atRules.forEach(atRule => atRule.replaceWith(...nodes.map(node => node.clone())))
    },
  }),
  { postcss: true as const },
)
