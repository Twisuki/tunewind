import type { AtRule, Container, Root, Rule } from "postcss"
import type { Recorder, ScanOptions, ScanPlugin } from "@/postprocess/scan/types"
import { BLOCKED_AT_RULES, LAYER_AT_RULE, NODE_TYPES } from "@/const/postcss"
import { createDeclarationContext, createRuleContext } from "@/postprocess/scan/context"

/** traversal state carried down the tree */
interface Scope {
  /** enclosing `@layer` names, outer to inner */
  layers: readonly string[]
  /** nearest ancestor rule owning the declarations below */
  owner?: Rule
  /** whether the subtree ignores every check */
  blocked: boolean
}

/** extend the layer stack with the names of a `@layer` block */
function enterLayer(atRule: AtRule, layers: readonly string[]): readonly string[] {
  if (atRule.name !== LAYER_AT_RULE)
    return layers

  const names = atRule.params.split(",").map(name => name.trim()).filter(Boolean)
  return layers.concat(names)
}

/** keep the plugins whose scope covers the current layer stack */
function scoped(plugins: readonly ScanPlugin[], layers: readonly string[]): ScanPlugin[] {
  return plugins.filter(plugin =>
    plugin.layers === undefined || plugin.layers.some(name => layers.includes(name)),
  )
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
    : scoped(plugins, scope.layers)
  let count = 0

  // every child is counted, a skipped subtree trips the verify check
  for (const child of container.nodes ?? []) {
    count += 1

    // a rule owns the declarations below it
    if (child.type === NODE_TYPES.rule) {
      const context = createRuleContext(child, scope.layers, recorder, bypass)
      for (const plugin of active)
        plugin.rule?.(context)

      count += visit(
        child,
        {
          layers: scope.layers,
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
            layers: enterLayer(child, scope.layers),
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
        const context = createDeclarationContext(child, owner, scope.layers, recorder, bypass)
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
  return visit(root, { layers: [], blocked: false }, plugins, recorder, options.bypass ?? false)
}
