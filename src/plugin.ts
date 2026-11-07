import type { AtRule, Plugin, PluginCreator, Root } from "postcss"
import { parse } from "postcss"
import { loadConfig } from "@/config/loader"
import { AT_RULE_NAME, PLUGIN_NAME } from "@/const"

export interface TunewindPluginOptions {
  cwd?: string
}

function findAtRules(root: Root): AtRule[] {
  const atRules: AtRule[] = []
  root.walkAtRules(AT_RULE_NAME, (atRule) => {
    atRules.push(atRule)
  })
  return atRules
}

export const tunewind: PluginCreator<TunewindPluginOptions> = Object.assign(
  (options: TunewindPluginOptions = {}): Plugin => ({
    postcssPlugin: PLUGIN_NAME,
    async Once(root: Root) {
      const atRules = findAtRules(root)
      if (atRules.length === 0)
        return

      await loadConfig(options.cwd)

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
