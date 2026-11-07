import type { Plugin, PluginCreator } from "postcss"
import { GUARD_PLUGIN_NAME } from "@/const"

interface GuardOptions {
  cwd?: string
  strict?: boolean
}

export const guard: PluginCreator<GuardOptions> = Object.assign(
  (_options: GuardOptions = {}): Plugin => ({
    postcssPlugin: GUARD_PLUGIN_NAME,
    OnceExit() {},
  }),
  { postcss: true as const },
)
