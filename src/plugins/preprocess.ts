import type { AtRule, Helpers, Plugin, PluginCreator, Root } from "postcss"
import { parse } from "postcss"
import { loadConfig } from "@/config/loader"
import { AT_RULE_NAME, PREPROCESS_PLUGIN_NAME } from "@/const/postcss"
import { messageOf, output, TuneError } from "@/plugins/output"
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
    async Once(root: Root, { result }: Helpers) {
      output.bind({
        warn: line => result.warn(line, { plugin: PREPROCESS_PLUGIN_NAME }),
      })

      try {
        const atRules = findAtRules(root)
        if (atRules.length === 0)
          return

        const { config, dependencies } = await loadConfig(options.cwd)
        for (const file of dependencies)
          result.messages.push({ type: "dependency", plugin: PREPROCESS_PLUGIN_NAME, file })

        const css = main(config)
        if (css.length === 0) {
          atRules.forEach(atRule => atRule.remove())
          return
        }

        const nodes = parse(css).nodes
        atRules.forEach(atRule => atRule.replaceWith(...nodes.map(node => node.clone())))
      }
      catch (error) {
        if (error instanceof TuneError)
          throw error

        output.error(messageOf(error))
      }
      finally {
        output.bind(undefined)
      }
    },
  }),
  { postcss: true as const },
)
