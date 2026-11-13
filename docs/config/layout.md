---
title: Breakpoints
order: 4
---

# {{ $frontmatter.title }}

Breakpoints keep Tailwind's variant syntax and allow size units to be overridden per breakpoint.

## Configuration

```ts
size: {
  max: 64,
  units: {
    default: "4px",
    r: "1rem",
    q: "4rem",
    o: "8rem",
  },
  breakpoints: {
    md: "768px",
    xl: {
      prefix: "xl",
      value: "1280px",
      units: {
        default: "6px",
        o: "12rem",
      },
    },
  },
}
```

When the key matches a built-in Tailwind breakpoint, the width can be omitted; a custom name must provide `value`.

`prefix` is the variant name and defaults to the key. Widths accept `px` and `rem`.

`units` lists only the units that change; the rest come from the previous layer.

## Rules

A breakpoint's width sets where the variant applies, and units merge layer by layer in width order. Units left out of a breakpoint come from the layer above; units listed replace their length and range.

When a breakpoint narrows a range, classes outside it are removed under that breakpoint.

Breakpoints not configured keep Tailwind's default widths, so only list what changes.

Breakpoints belong to `size`; without `size` they have no effect.

## Usage

```html
<section class="px-1o xl:px-2o">Content</section>
```

The prefix matches Tailwind and composes with variants such as `hover`. Class names stay the same; only the length behind a number changes.

## Output

Breakpoints are registered as variants, and unit overrides are emitted inside the matching media query:

```css
@theme {
  --breakpoint-xl: 1280px;
}

@media (min-width: 1280px) {
  :root {
    --unit: 6px;
    --unit-o: 12rem;
  }
}
```

## Errors

Two breakpoints with the same width fail, reported with both keys:

```text
breakpoints "md" and "xl" have the same width
```

A duplicate variant name fails:

```text
breakpoints "wide" and "xl" share the same prefix
```

A custom name without `value` and without a built-in width fails:

```text
breakpoint "tablet" has no width and no built-in width
```

A breakpoint overriding a unit not declared in `units` fails:

```text
breakpoint "xl" overrides unknown unit "z"
```

## Related

- [Sizes](./size.md): units and ranges.
- [Themes](./theme.md): the other conditional configuration.
