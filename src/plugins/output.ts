/** where the non-fatal lines go */
export interface OutputSink {
  /** emit one warning line */
  warn: (line: string) => void
}

/** one expected failure of the build */
export class TuneError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TuneError"
  }
}

/** read the message of an unknown thrown value */
export function messageOf(error: unknown): string {
  return error instanceof Error
    ? error.message
    : String(error)
}

/** one output of the build in progress */
export interface Output {
  /** attach the sink of the build in progress */
  bind: (sink: OutputSink | undefined) => void
  /** stop the build */
  error: (message: string) => never
  /** report a non-fatal line */
  warn: (line: string) => void
}

/** sink of the build in progress */
let sink: OutputSink | undefined

export const output: Output = {
  /** attach the sink of the build in progress */
  bind: (next: OutputSink | undefined) => {
    sink = next
  },
  /** stop the build */
  error: (message: string): never => {
    throw new TuneError(message)
  },
  /** report a non-fatal line, a missing sink escalates to an error */
  warn: (line: string) => {
    if (sink === undefined)
      output.error(line)

    sink.warn(line)
  },
}
