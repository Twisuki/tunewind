import type { Helpers, Plugin, PluginCreator, Root } from "postcss"
import { loadConfig } from "@/config/loader"
import { POSTPROCESS_PLUGIN_NAME } from "@/const/postcss"
import { messageOf, output, TuneError } from "@/plugins/output"
import { main } from "@/postprocess"

export interface PostprocessOptions {
  cwd?: string
}

export const postprocess: PluginCreator<PostprocessOptions> = Object.assign(
  (options: PostprocessOptions = {}): Plugin => ({
    postcssPlugin: POSTPROCESS_PLUGIN_NAME,
    async OnceExit(root: Root, { result }: Helpers) {
      output.bind({
        warn: line => result.warn(line, { plugin: POSTPROCESS_PLUGIN_NAME }),
      })

      try {
        const { config, dependencies } = await loadConfig(options.cwd)
        for (const file of dependencies)
          result.messages.push({ type: "dependency", plugin: POSTPROCESS_PLUGIN_NAME, file })

        main(root, config)
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
