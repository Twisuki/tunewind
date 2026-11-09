/** strict mode names */
export const STRICT_MODES = [
  "bypass",
] as const

/** strict mode name */
export type StrictMode = (typeof STRICT_MODES)[number]
