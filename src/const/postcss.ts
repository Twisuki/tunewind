/** postcss plugin name of the preprocess plugin */
export const PREPROCESS_PLUGIN_NAME = "tunewind-preprocess"

/** postcss plugin name of the postprocess plugin */
export const POSTPROCESS_PLUGIN_NAME = "tunewind-postprocess"

/** at-rule replaced by the generated css */
export const AT_RULE_NAME = "tunewind"

/** node types of the postcss ast */
export const NODE_TYPES = {
  root: "root",
  rule: "rule",
  atRule: "atrule",
  declaration: "decl",
  comment: "comment",
} as const

/** at-rule opening a cascade layer */
export const LAYER_AT_RULE = "layer"

/** class segment exempting a rule from the checks */
export const BYPASS_MARKER = "raw"

/** at-rules removed when they lose every child */
export const EMPTY_AT_RULES: readonly string[] = [
  "media",
  "supports",
  "container",
  "layer",
]

/** at-rules whose content never takes part in the checks */
export const BLOCKED_AT_RULES: readonly string[] = [
  "keyframes",
  "font-face",
  "page",
  "property",
]
