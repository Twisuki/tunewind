import type { Plugin, PluginCreator, Root } from "postcss"
import { loadConfig } from "@/config/loader"
import { POSTPROCESS_PLUGIN_NAME } from "@/const/postcss"
import { main } from "@/postprocess"

export interface PostprocessOptions {
  cwd?: string
}

export const postprocess: PluginCreator<PostprocessOptions> = Object.assign(
  (options: PostprocessOptions = {}): Plugin => ({
    postcssPlugin: POSTPROCESS_PLUGIN_NAME,
    async OnceExit(root: Root) {
      main(root, await loadConfig(options.cwd))
    },
  }),
  { postcss: true as const },
)
