---
title: Core Concepts
order: 2
---

# {{ $frontmatter.title }}

This page explains how configuration decides colors and sizes, and what strict mode and diagnostics do.

## Design

CSS conventions have long relied on discipline: no magic numbers, colors and sizes through shared variables. Tailwind provides the atomic syntax, but leaves every color and size open, so a team convention can only be enforced by code review.

Tunewind writes that convention as configuration and applies it at build time. Colors and sizes become finite sets in the config, so whether a class is usable is decided when the build runs.

The boundary of the design system therefore lives in the config instead of in review.

Tunewind keeps Tailwind's syntax and usage. Class structure, variants, breakpoints and most utilities stay as they are; only color and size values are narrowed.

## Themes

The color system has three layers.

- **Palette**: the source of colors. 26 built-in families with 11 shades each; an object can override one shade or define a new family.
- **Aliases**: semantic names. The string form of `palette`, where `{ primary: "sky" }` makes `primary` and `sky` point to the same scale.
- **Mappings**: the available shades and opacities. Keys of `shade` and `opacity` become class suffixes; undeclared keys are unavailable.

With the primary color as an example:

```ts
theme: {
  palette: { primary: "sky" },
  shade: { default: 600, subtle: 300 },
  opacity: { default: 100, weak: 80 },
}
```

- `text-primary` uses the default shade, `600`.
- `text-primary-subtle` uses `300`.
- `bg-primary/weak` uses `80%` opacity.

Themes override these three layers. Each scheme declares only what differs from the default theme, and class names stay unchanged.

Use a scheme's `prefix` when a color must be set explicitly for one theme, such as `ocean:text-primary`.

`white` and `black` are always available. Built-in families not declared in `palette` still produce output; whether they survive is decided by strict mode.

See [colors](../config/color.md) and [themes](../config/theme.md) for the full configuration.

## Sizes

The size system has two parts.

- **Units**: length and suffix. Keys of `units` become class suffixes, `default` has none; a unit can be a fixed length or carry its own range.
- **Ranges**: usable numbers. `min`, `step` and `max` can be global or per unit; numbers outside the range are unavailable.

With the default unit as an example:

```ts
size: {
  max: 64,
  units: { default: "4px", r: "1rem" },
}
```

- `p-4` is `4 * 4px`.
- `w-8r` is `8 * 1rem`.
- `w-96` exceeds `max` and is unavailable.

Breakpoints override the length on top of the same units, with the same numbers and class names:

```ts
breakpoints: {
  xl: { units: { r: "1.25rem" } },
}
```

Here `xl:w-8r` is 8 times `1.25rem`.

See [sizes](../config/size.md) and [breakpoints](../config/layout.md) for the full configuration.

## Strict mode

Strict mode decides whether values outside the config survive, covering arbitrary values, raw color names and the escape prefix. It can be turned off as a whole or enabled per check; at its strictest, only declared colors and in-range sizes are usable.

The `raw:` prefix applies to arbitrary values and raw color names only; size ranges and the opacity whitelist do not accept it. See [strict mode](../config/strict.md) for the modes and flags.

## Diagnostics

Nothing is printed by default; violations only show up as declarations missing from the output. When enabled, the build handles removed nodes by level:

- `off`: remove silently.
- `warn`: print each target and reason, keep building.
- `error`: collect and throw, aborting the build; suitable for CI.

Lines are ordered by first occurrence and deduplicated, with a configurable limit. Configuration errors are thrown regardless of the level.

See [diagnostics](../config/diagnostics.md) for levels and output.
