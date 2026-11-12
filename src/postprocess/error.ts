import { text } from "@/text"

/** body of the error message, listing the dropped nodes */
function body(lines: readonly string[], total: number): string {
  const listed = lines.map(line => `  ${line}`).join("\n")
  if (total <= lines.length)
    return listed

  return `${listed}\n  ${text.postprocess.more(total - lines.length)}`
}

/** thrown when the diagnostic level is `error` and nodes were dropped */
export class DiagnosticsError extends Error {
  /** dropped nodes, at most the reported limit */
  readonly lines: readonly string[]
  /** dropped node count before the limit */
  readonly total: number

  constructor(lines: readonly string[], total: number) {
    super(`${text.postprocess.summary(total)}\n${body(lines, total)}`)
    this.name = "DiagnosticsError"
    this.lines = lines
    this.total = total
  }
}
