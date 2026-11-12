import type { Root } from "postcss"
import type { Recorder, ScanOptions, ScanPlugin } from "@/postprocess/scan/types"
import { commit } from "@/postprocess/scan/commit"
import { walk } from "@/postprocess/scan/walk"
import { text } from "@/text"

/** check that every node of the tree was visited */
function verify(root: Root, visited: number): void {
  let total = 0
  root.walk(() => {
    total += 1
  })

  if (total !== visited)
    throw new Error(text.postprocess.walkIncomplete(visited, total))
}

/** scan the built css once with the given plugins, returning the diagnostic lines */
export function scan(
  root: Root,
  plugins: readonly ScanPlugin[],
  options: ScanOptions = {},
): readonly string[] {
  const recorder: Recorder = {
    rules: new Set(),
    selectors: new Map(),
    declarations: new Set(),
    reports: [],
  }

  const visited = walk(root, plugins, recorder, options)
  if (options.verify)
    verify(root, visited)

  commit(recorder)
  return recorder.reports
}
