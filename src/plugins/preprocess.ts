import type { AtRule, Plugin, PluginCreator, Root } from "postcss"
import { parse } from "postcss"
import { loadConfig } from "@/config/loader"
import { AT_RULE_NAME, PREPROCESS_PLUGIN_NAME } from "@/const/postcss"
import { main } from "@/preprocess"

export interface PreprocessOptions {
  cwd?: string
}

function findAtRules(root: Root): AtRule[] {
  const atRules: AtRule[] = []
  root.walkAtRules(AT_RULE_NAME, (atRule) => {
    atRules.push(atRule)
  })
  return atRules
}

export const preprocess: PluginCreator<PreprocessOptions> = Object.assign(
  (options: PreprocessOptions = {}): Plugin => ({
    postcssPlugin: PREPROCESS_PLUGIN_NAME,
    async Once(root: Root) {
      const atRules = findAtRules(root)
      if (atRules.length === 0)
        return

      const css = main(await loadConfig(options.cwd))
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
