/** diagnostic levels of the dropped nodes */
export const DIAGNOSTIC_LEVELS = [
  "off",
  "warn",
  "error",
] as const

/** diagnostic level */
export type DiagnosticLevel = (typeof DIAGNOSTIC_LEVELS)[number]

/** most lines reported by one build */
export const DIAGNOSTIC_LIMIT = 100
