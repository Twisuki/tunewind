/** diagnostic levels of the dropped nodes */
export const DIAGNOSTIC_LEVELS = [
  "off",
  "warn",
  "error",
] as const

/** diagnostic level */
export type DiagnosticLevel = (typeof DIAGNOSTIC_LEVELS)[number]
