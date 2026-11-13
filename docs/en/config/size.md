---
title: Sizes
order: 3
---

# {{ $frontmatter.title }}

Sizes consist of units and ranges. Numbers are no longer fixed multiples of `0.25rem` but are computed from the configured units.

## Configuration

```ts
size: {
  min: 0,
  step: 1,
  max: 64,
  units: {
    default: "4px",
    x: "1px",
    r: { value: "1rem", step: 0.5 },
    q: "4rem",
    o: { value: "8rem", max: 16 },
  },
}
```

`units` must contain `default`; other names are free and become class suffixes.

A unit is either a length string or an object. The object requires `value`, and `min`, `step`, `max` override the global values.

`max` is required, either on `size.max` or on the unit. `min` defaults to `0` and `step` to `1`.

## Rules

A number times a unit gives the actual size; usable numbers are enumerated from the range. A unit without its own range uses the global values from `size`.

`step` sets the increment. With `1` only integers are usable; with `0.5`, values such as `0`, `0.5`, `1`, `1.5` are usable.

`min` and `max` are inclusive; numbers outside the range produce nothing. Unknown numbers and out-of-range numbers behave the same: no declarations.

Values that do not describe a length keep Tailwind behavior, including `w-full`, `w-1/3`, `w-fit`, `h-screen`, and utilities unrelated to sizes such as `text-sm`, `font-semibold`, `rounded-lg`, `z-10`, `grid-cols-3`, `border-2`.

Breakpoints can override units, see [breakpoints](./layout.md).

## Usage

Numeric size classes combine a number and a unit name, such as `p-4` and `w-8r`.

| Class    | Result                               |
| -------- | ------------------------------------ |
| `p-4`    | `4 * 4px`, that is `16px`            |
| `w-64x`  | `64 * 1px`, that is `64px`           |
| `w-8r`   | `8 * 1rem`                           |
| `w-0.5r` | `0.5 * 1rem`, because `r` uses `0.5` |
| `w-16q`  | `16 * 4rem`                          |
| `w-0`    | `0`, always available                |

The same length has several spellings, for example `w-4r`, `w-16q` and `w-64x` all equal `64px`. The config decides which spellings exist; choose the unit that matches the scale of the object.

## Output

Units and spacing are exposed as variables:

```css
.panel {
  padding: calc(2 * var(--unit));
  gap: var(--spacing-4);
  width: var(--spacing-8r);
}
```

The naming is `--unit`, `--unit-<name>` and `--spacing-<number><suffix>`.

## Errors

A unit without `max`, when `size.max` is also missing, fails with the unit name:

```text
size unit "r" has no max
```

A unit whose `min` is larger than `max` fails:

```text
size unit "q" has larger min than max
```

`units` without `default` fails:

```text
units must define a default unit
```

## Related

- [Breakpoints](./layout.md): unit overrides per breakpoint.
- [Strict mode](./strict.md): arbitrary size values.
