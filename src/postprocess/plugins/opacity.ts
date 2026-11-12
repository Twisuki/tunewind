import type { Declaration } from "postcss"
import type { ScanPlugin } from "@/postprocess/scan/types"
import { hasLayer } from "@/postprocess/plugins/utils"
import { text } from "@/text"

/** bodies of every call of a function, in order of appearance */
function callBodies(value: string, name: string): string[] {
  const bodies: string[] = []
  const head = `${name}(`
  let from = 0

  while (true) {
    const start = value.indexOf(head, from)
    if (start < 0)
      break

    let depth = 1
    let end = start + head.length
    for (; end < value.length; end += 1) {
      const char = value[end]
      if (char === "(") {
        depth += 1
      }
      else if (char === ")") {
        depth -= 1
        if (depth === 0)
          break
      }
    }

    bodies.push(value.slice(start + head.length, end))
    from = end + 1
  }

  return bodies
}

/** split a call body by the commas outside brackets */
function splitArgs(body: string): string[] {
  const args: string[] = []
  let depth = 0
  let start = 0

  for (let index = 0; index < body.length; index += 1) {
    const char = body[index]
    if (char === "(" || char === "[") {
      depth += 1
    }
    else if (char === ")" || char === "]") {
      depth -= 1
    }
    else if (char === "," && depth === 0) {
      args.push(body.slice(start, index).trim())
      start = index + 1
    }
  }

  args.push(body.slice(start).trim())
  return args
}

/** trailing token of a value holding several, absent when it holds one */
function trailingToken(value: string): string | undefined {
  const text = value.trim()
  let depth = 0

  for (let index = text.length - 1; index >= 0; index -= 1) {
    const char = text[index]
    if (char === ")") {
      depth += 1
    }
    else if (char === "(") {
      depth -= 1
    }
    else if (/\s/.test(char) && depth === 0) {
      return text.slice(index + 1)
    }
  }

  return undefined
}

/** whether a slot is a literal percentage */
function isLiteral(slot: string): boolean {
  return /^[\d.]+%$/.test(slot.trim())
}

/** whether any opacity slot of a value is a literal percentage */
function hasLiteralSlot(value: string): boolean {
  for (const body of callBodies(value, "color-mix")) {
    const args = splitArgs(body)
    if (args.length !== 3 || args[2] !== "transparent")
      continue

    const amount = trailingToken(args[1])
    if (amount !== undefined && isLiteral(amount))
      return true
  }

  for (const body of callBodies(value, "opacity")) {
    if (isLiteral(body))
      return true
  }

  return false
}

/** whether a declaration applies an opacity outside the allowed keys */
function hasLiteralOpacity(declaration: Declaration): boolean {
  if (declaration.prop === "opacity")
    return isLiteral(declaration.value)

  return hasLiteralSlot(declaration.value)
}

/** drop every declaration whose opacity does not come from a theme key */
export function createOpacityPlugin(): ScanPlugin {
  return {
    declaration: (context) => {
      if (!hasLayer(context.atRules, "utilities"))
        return

      if (hasLiteralOpacity(context.declaration))
        context.drop(text.postprocess.reason.opacity)
    },
  }
}
