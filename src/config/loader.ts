import type { TuneConfig } from "@/config/schema"
import { existsSync, readFileSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import process from "node:process"
import { createJiti } from "jiti"
import { z } from "zod"
import { configSchema } from "@/config/schema"
import { CONFIG_FILES } from "@/const/config"
import { output } from "@/plugins/output"
import { text } from "@/text"

/** extensions tried when resolving an imported config file */
const IMPORT_EXTENSIONS = [
  "",
  ".ts",
  ".mts",
  ".cts",
  ".js",
  ".mjs",
  ".cjs",
]

/** import forms a config may use for a local file */
const IMPORT_PATTERN = /(?:from|import|require)[\s(]*["']([^"']+)["']/g

/** one loaded tune config and the files it was built from */
export interface LoadedConfig {
  /** parsed config */
  config: TuneConfig
  /** absolute paths of the config file and its local imports */
  dependencies: string[]
}

/** shared loader, evaluating the config source on every call */
const jiti = createJiti(import.meta.url, {
  fsCache: false,
  moduleCache: false,
})

export function findConfigFile(cwd: string = process.cwd()): string | undefined {
  for (const name of CONFIG_FILES) {
    const file = resolve(cwd, name)
    if (existsSync(file))
      return file
  }
  return undefined
}

/** resolve one local import of a config file */
function resolveImport(from: string, specifier: string): string | undefined {
  const base = resolve(dirname(from), specifier)

  for (const extension of IMPORT_EXTENSIONS) {
    const file = `${base}${extension}`
    if (existsSync(file))
      return file
  }

  return undefined
}

/** collect the local files a config imports, depth first */
function collectDependencies(file: string, found: Set<string>): void {
  if (found.has(file))
    return

  found.add(file)

  let source: string
  try {
    source = readFileSync(file, "utf8")
  }
  catch {
    return
  }

  for (const match of source.matchAll(IMPORT_PATTERN)) {
    const specifier = match[1]
    if (!specifier.startsWith("."))
      continue

    const target = resolveImport(file, specifier)
    if (target !== undefined)
      collectDependencies(target, found)
  }
}

/** find the config file and every local file it imports */
export function findConfigDependencies(file: string): string[] {
  const found = new Set<string>()
  collectDependencies(file, found)
  return Array.from(found)
}

export async function loadConfig(cwd: string = process.cwd()): Promise<LoadedConfig> {
  const file = findConfigFile(cwd)
  if (!file)
    output.error(text.config.fileNotFound(cwd, CONFIG_FILES))

  const source = await readFile(file, "utf8")
  const mod = jiti.evalModule(source, { filename: file, id: file }) as { default?: unknown, config?: unknown }
  const input = mod.default ?? mod.config
  if (input === undefined)
    output.error(text.config.defaultExportRequired(file))

  try {
    const config = configSchema.parse(input)
    const dependencies = findConfigDependencies(file)
    return { config, dependencies }
  }
  catch (error) {
    if (error instanceof z.ZodError)
      output.error(text.config.invalid(file, z.prettifyError(error)))
    throw error
  }
}
