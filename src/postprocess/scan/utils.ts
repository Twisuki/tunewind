import type { SelectorItem } from "@/postprocess/scan/types"

/** fallback of an invalid code point */
const REPLACEMENT = "\uFFFD"

/** turn a code point into a character, invalid ones become the replacement */
function codePoint(code: number): string {
  if (code <= 0 || code > 0x10FFFF)
    return REPLACEMENT

  return String.fromCodePoint(code)
}

/** collect the matches of a value, once each */
function collect(value: string, pattern: RegExp): string[] {
  const found = new Set<string>()
  for (const match of value.matchAll(pattern))
    found.add(match[1])

  return [...found]
}

/** unescape the css escapes of a selector */
export function unescape(text: string): string {
  let result = ""

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (char !== "\\") {
      result += char
      continue
    }

    const hex = /^[\da-f]{1,6}/i.exec(text.slice(index + 1))
    if (hex) {
      result += codePoint(Number.parseInt(hex[0], 16))
      index += hex[0].length
      if (text[index + 1] === " ")
        index += 1
      continue
    }

    if (index + 1 < text.length) {
      result += text[index + 1]
      index += 1
    }
  }

  return result
}

/** split by a separator outside brackets, skipping escaped characters */
export function splitTopLevel(text: string, separator: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  let escaped = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (char === "\\") {
      escaped = true
      continue
    }

    if (char === "(" || char === "[") {
      depth += 1
      continue
    }

    if (char === ")" || char === "]") {
      depth = Math.max(0, depth - 1)
      continue
    }

    if (char === separator && depth === 0) {
      parts.push(text.slice(start, index))
      start = index + 1
    }
  }

  parts.push(text.slice(start))
  return parts
}

/** build one selector item from a part of a selector list */
export function toSelectorItem(part: string): SelectorItem {
  const raw = part.trim()
  let text = unescape(raw)
  if (text.startsWith("."))
    text = text.slice(1)

  return {
    raw,
    text,
    segments: splitTopLevel(text, ":"),
  }
}

/** collect the `var()` references of a value, escapes kept as written */
export function variablesOf(value: string): string[] {
  return collect(value, /var\(\s*(--(?:[\w-]|\\[^\n])+)/g)
}
