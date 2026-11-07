import type { TuneConfig } from "@/config/schema"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import process from "node:process"
import { pathToFileURL } from "node:url"
import { z } from "zod"
import { configSchema } from "@/config/schema"
import { CONFIG_FILES } from "@/const"
import { text } from "@/text"

export function findConfigFile(cwd: string = process.cwd()): string | undefined {
  for (const name of CONFIG_FILES) {
    const file = resolve(cwd, name)
    if (existsSync(file))
      return file
  }
  return undefined
}

export async function loadConfig(cwd: string = process.cwd()): Promise<TuneConfig> {
  const file = findConfigFile(cwd)
  if (!file)
    throw new Error(text.config.fileNotFound(cwd, CONFIG_FILES))

  const mod: { default?: unknown, config?: unknown } = await import(pathToFileURL(file).href)
  const input = mod.default ?? mod.config
  if (input === undefined)
    throw new Error(text.config.defaultExportRequired(file))

  try {
    return configSchema.parse(input)
  }
  catch (error) {
    if (error instanceof z.ZodError)
      throw new Error(text.config.invalid(file, z.prettifyError(error)))
    throw error
  }
}
