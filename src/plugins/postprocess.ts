import type { Plugin, PluginCreator } from "postcss"
import { POSTPROCESS_PLUGIN_NAME } from "@/const/postcss"

export interface PostprocessOptions {
  cwd?: string
  strict?: boolean
}

export const postprocess: PluginCreator<PostprocessOptions> = Object.assign(
  (_options: PostprocessOptions = {}): Plugin => ({
    postcssPlugin: POSTPROCESS_PLUGIN_NAME,
    OnceExit() {},
  }),
  { postcss: true as const },
)
