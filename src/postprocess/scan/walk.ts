import type { AtRule, Container, Root, Rule } from "postcss"
import type { Recorder, ScanOptions, ScanPlugin } from "@/postprocess/scan/types"
import { BLOCKED_AT_RULES, NODE_TYPES } from "@/const/postcss"
import { createDeclarationContext, createRuleContext } from "@/postprocess/scan/context"

/** traversal state carried down the tree */
interface Scope {
  /** enclosing at-rules, outer to inner */
  atRules: readonly AtRule[]
  /** nearest ancestor rule owning the declarations below */
  owner?: Rule
  /** whether the subtree ignores every check */
  blocked: boolean
}

/** extend the at-rule stack with one block */
function enterAtRule(atRule: AtRule, atRules: readonly AtRule[]): readonly AtRule[] {
  return atRules.concat(atRule)
}

/** dispatch the plugins over the subtree of a container, returning the node count */
function visit(
  container: Container,
  scope: Scope,
  plugins: readonly ScanPlugin[],
  recorder: Recorder,
  bypass: boolean,
): number {
  const active = scope.blocked
    ? []
    : plugins
  let count = 0

  // every child is counted, a skipped subtree trips the verify check
  for (const child of container.nodes ?? []) {
    count += 1

    // a rule owns the declarations below it
    if (child.type === NODE_TYPES.rule) {
      const context = createRuleContext(child, scope.atRules, recorder, bypass)
      for (const plugin of active)
        plugin.rule?.(context)

      count += visit(
        child,
        {
          atRules: scope.atRules,
          owner: child,
          blocked: scope.blocked,
        },
        plugins,
        recorder,
        bypass,
      )
    }
    // an at-rule only reshapes the scope, it owns no declaration
    else if (child.type === NODE_TYPES.atRule) {
      if (child.nodes) {
        count += visit(
          child,
          {
            atRules: enterAtRule(child, scope.atRules),
            owner: scope.owner,
            blocked: scope.blocked || BLOCKED_AT_RULES.includes(child.name),
          },
          plugins,
          recorder,
          bypass,
        )
      }
    }
    // a declaration is checked only when a live rule owns it
    else if (child.type === NODE_TYPES.declaration) {
      const owner = scope.owner
      if (owner !== undefined && !recorder.rules.has(owner)) {
        const context = createDeclarationContext(child, owner, scope.atRules, recorder, bypass)
        for (const plugin of active)
          plugin.declaration?.(context)
      }
    }
  }

  return count
}

/** walk the tree once, dispatching the plugins in order, returning the visited node count */
export function walk(
  root: Root,
  plugins: readonly ScanPlugin[],
  recorder: Recorder,
  options: ScanOptions,
): number {
  return visit(root, { atRules: [], blocked: false }, plugins, recorder, options.bypass ?? false)
}
