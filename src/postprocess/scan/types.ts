import type { Declaration, Rule } from "postcss"

/** one selector of a selector list */
export interface SelectorItem {
  /** selector as written */
  raw: string
  /** unescaped selector text, without the leading class dot */
  text: string
  /** selector text split by top-level colons */
  segments: string[]
}

/** context of a rule hook */
export interface RuleContext {
  /** scanned rule */
  readonly rule: Rule
  /** enclosing `@layer` names, outer to inner */
  readonly layers: readonly string[]

  /** split the selector list of the scanned rule */
  selectors: () => readonly SelectorItem[]
  /** whether a bypass marker exempts the scanned node */
  bypassed: () => boolean

  /** drop the scanned rule */
  drop: (reason: string) => void
  /** drop the listed selectors, the whole rule when nothing is left */
  dropSelectors: (selectors: readonly SelectorItem[], reason: string) => void
}

/** context of a declaration hook */
export interface DeclarationContext {
  /** scanned declaration */
  readonly declaration: Declaration
  /** rule owning the scanned declaration */
  readonly rule: Rule
  /** enclosing `@layer` names, outer to inner */
  readonly layers: readonly string[]

  /** collect the `var()` references of the scanned declaration value */
  variables: () => string[]
  /** whether a bypass marker exempts the scanned node */
  bypassed: () => boolean

  /** drop the scanned declaration */
  drop: (reason: string) => void
}

/** one scanner plugin */
export interface ScanPlugin {
  /** at-rules to scan, every node when omitted */
  layers?: readonly string[]
  /** check a rule and its selector list */
  rule?: (context: RuleContext) => void
  /** check a declaration inside a scanned rule */
  declaration?: (context: DeclarationContext) => void
}

/** options of one scan */
export interface ScanOptions {
  /** honor the bypass marker */
  bypass?: boolean
  /** check that the walk covered every node */
  verify?: boolean
}

/** deferred deletions of one scan, applied once the walk is over */
export interface Recorder {
  /** rules dropped as a whole */
  rules: Set<Rule>
  /** selectors dropped from a rule */
  selectors: Map<Rule, Set<SelectorItem>>
  /** declarations dropped in place */
  declarations: Set<Declaration>
  /** diagnostic lines of the dropped nodes */
  reports: string[]
}
