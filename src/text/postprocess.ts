export const postprocess = {
  walkIncomplete: (visited: number, total: number) => `walk visited ${visited} of ${total} nodes`,
  /** reason phrases given by the checks */
  reason: {
    arbitrary: "arbitrary value is not allowed",
    family: "raw color family is not allowed",
    opacity: "opacity outside the theme keys",
  },
  /** one dropped node */
  dropped: (reason: string, target: string, owner?: string) => owner
    ? `dropped ${target} in ${owner} (${reason})`
    : `dropped ${target} (${reason})`,
  /** prefix of one warning line */
  warn: (line: string) => `tunewind: ${line}`,
  /** header of an error listing several lines */
  summary: (count: number) => `tunewind: ${count} violations`,
  /** tail of a list cut by the limit */
  more: (count: number) => `... and ${count} more`,
}
