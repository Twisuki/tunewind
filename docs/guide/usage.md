---
title: Usage
order: 3
---

# {{ $frontmatter.title }}

This page walks through a content site: the rules, the config, and the markup.

## Design

- Colors: `sky` as primary, `slate` for body text; three shades for primary; opacity limited to `100%` and `80%`.
- Sizes: `1px` for borders and dividers, `4px` as the text-spacing basis, `4rem` for content cards, `8rem` for layout containers; numbers up to `64`; a wider basis of `6px` on large screens.
- Theme: an `ocean` scheme on top of the default, with `teal` as primary.
- Constraints: arbitrary values and raw color names disabled, the escape prefix kept, violations printed at build time.

## Configuration

`tune.config.ts`:

```ts
import { defineConfig } from "tunewind"

export default defineConfig({
  theme: {
    palette: { primary: "sky", ink: "slate" },
    shade: { default: 600, subtle: 300, strong: 800 },
    opacity: { default: 100, weak: 80 },
    schemes: {
      ocean: {
        prefix: "ocean",
        palette: { primary: "teal" },
      },
    },
  },
  size: {
    max: 64,
    units: {
      default: "4px",
      x: "1px",
      r: "1rem",
      q: "4rem",
      o: "8rem",
    },
    breakpoints: {
      xl: {
        units: { default: "6px" },
      },
    },
  },
  strict: "bypass",
  diagnostics: "warn",
})
```

Entry stylesheet:

```css
@import "tailwindcss";
@tunewind;

@utility text-muted {
  color: var(--color-ink-subtle);
}
```

The entry stylesheet and `tune.config.ts` both belong to configuration. `@utility` defines business-level classes; those do not enter the config and are not checked.

## Usage

### Colors and themes

```html
<html data-theme="ocean">
  <h1 class="text-primary">Title</h1>
  <p class="text-ink-subtle">Supporting text</p>
  <aside class="bg-primary/weak ocean:text-ink">Notice</aside>
</html>
```

A shade key can follow the color name, and the key comes from `shade`; an opacity key goes in the modifier slot and comes from `opacity`.

Colors follow the theme without class changes. Use the scheme's `prefix` as a variant to override a color for one theme.

`white` and `black`, as well as the color keywords, are unrestricted.

### Sizes and layout

```html
<section class="px-1o py-2q xl:px-2o xl:py-4q">
  <div class="flex items-center gap-1q">
    <div class="w-4q">
      <h1 class="mb-1 text-2xl text-primary">Bring design system standards to Tailwind</h1>
      <p class="mb-2 text-sm text-ink-subtle">A highly configurable, strongly constrained and extensible atomic CSS solution and design system.</p>
      <button class="px-2q py-1 text-sm">Get started</button>
    </div>
    <img class="h-2q w-4q" src="/hero.png" alt="">
  </div>
</section>
```

The outer `section` uses `o` and `q` for page-level spacing, with larger numbers under `xl`.

The text column `w-4q` and the image `w-4q` use `q`, a content-block scale. The same length can be written as `w-16r`; pick the unit by the object being described.

Inner margins `mb-1` and `mb-2` and the button's `py-1` use the default unit, a compact scale; the image height `h-2q` belongs to the same block scale, while `1x` serves the smallest sizes such as dividers.

Font sizes `text-2xl` and `text-sm` are Tailwind's semantic API and are not governed by the size system.

A number times a unit gives the actual size; out-of-range numbers produce nothing. A breakpoint can override units, so the same number maps to different lengths.

### Escape hatch

```html
<div class="raw:grid-cols-[repeat(2fr,4rem)]">Content</div>
```

The escape prefix applies to arbitrary values and raw color names; size ranges and the opacity whitelist do not accept it. Use it for one-off exceptions, and write `@utility` for exceptions that repeat.

## Troubleshooting

When a class produces no styles, first check whether the color name and shade are declared in the config; undeclared keys produce nothing. Then enable `diagnostics` to see removed nodes. Undeclared colors never reach diagnostics and only show up in an output comparison.
