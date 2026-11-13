---
title: Diagnostics
order: 6
---

# {{ $frontmatter.title }}

Diagnostics decide how removed nodes are reported at build time. Nothing is printed by default.

## Configuration

```ts
diagnostics: "warn"
```

| Form               | Behavior                         |
| ------------------ | -------------------------------- |
| Omitted or `"off"` | remove silently                  |
| `"warn"`           | warn line by line, keep building |
| `"error"`          | collect and abort the build      |

A form with a line limit:

```ts
diagnostics: {
  mode: "warn",
  limit: 20,
}
```

`limit` is a positive integer and defaults to `100`.

## Rules

The level decides how removed nodes are handled, and the limit caps how many lines one build prints.

Diagnostics collect removed nodes only. Undeclared colors and shades produce no nodes and never reach diagnostics; nodes exempted by the escape prefix are not reported either.

Lines are ordered by first occurrence and deduplicated. The limit applies to the unique lines, and when exceeded the last line is `... and N more`.

`error` aborts the current build in watch mode.

## Usage

Use `"warn"` during local development to spot out-of-range values without breaking the build.

```ts
diagnostics: "error"
```

Use `"error"` in CI with a full page build, so violations fail before merge.

## Output

`warn` prints one line per node, prefixed with `tunewind:`:

```text
tunewind: dropped .w-\[13px\] (arbitrary value is not allowed)
tunewind: dropped color: var(--color-sky) in .text-sky (raw color family is not allowed)
tunewind: dropped opacity: 30% in .opacity-30 (opacity outside the theme keys)
```

A removed selector reports the selector; a removed declaration includes the owning rule. There are four fixed reasons:

```text
arbitrary value is not allowed
raw color family is not allowed
opacity outside the theme keys
size outside the breakpoint unit range
```

`error` collects one error whose header counts every violation, with the list limited by `limit`:

```text
tunewind: 3 violations
  dropped .w-\[13px\] (arbitrary value is not allowed)
  dropped color: var(--color-sky) in .text-sky (raw color family is not allowed)
  dropped opacity: 30% in .opacity-30 (opacity outside the theme keys)
```

## Errors

Configuration errors and internal errors are thrown regardless of the level. An unsupported level in `diagnostics` is rejected by configuration validation.

## Related

- [Strict mode](./strict.md): arbitrary values and raw color names.
- [Breakpoints](./layout.md): ranges narrowed per breakpoint.
