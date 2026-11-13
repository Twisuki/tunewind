---
title: Getting Started
order: 1
---

# {{ $frontmatter.title }}

This page covers installation and integration, and verifies the setup through the build output.

## Installation

Tunewind runs at build time only and is not shipped in the output, so it belongs in development dependencies.

```bash
pnpm add -D tunewind postcss tailwindcss @tailwindcss/postcss
```

## PostCSS

Tunewind consists of two PostCSS plugins, placed before and after Tailwind.

```js
import tailwindcss from "@tailwindcss/postcss"
import { tunewind } from "tunewind"

export default {
  plugins: [
    tunewind.preprocess(),
    tailwindcss(),
    tunewind.postprocess(),
  ],
}
```

The order is fixed. The first plugin injects the theme, the second processes the output. Swapping them still builds, but the output has no theme.

## Entry stylesheet

```css
@import "tailwindcss";
@tunewind;
```

`@tunewind` is replaced with the generated theme CSS at build time. Without the at-rule, the first plugin does nothing.

## Configuration

Create `tune.config.ts` in the project root.

```ts
import { defineConfig } from "tunewind"

export default defineConfig({
  theme: {
    // primary color, with limited shades and opacities
    palette: { primary: "sky" },
    shade: { default: 600, subtle: 300, strong: 800 },
    opacity: { default: 100, weak: 80 },
  },
  size: {
    // 4px basis, numbers up to 64
    max: 64,
    units: { default: "4px", r: "1rem" },
  },
  strict: true,
})
```

See [colors](../config/color.md), [sizes](../config/size.md) and [strict mode](../config/strict.md) for these fields.

## Verification

These classes should produce declarations in the output:

```html
<h1 class="text-primary-subtle p-4">Tunewind</h1>
```

```css
.text-primary-subtle { color: var(--color-primary-subtle); }
.p-4 { padding: var(--spacing-4); }
```

These classes should produce no declarations:

```html
<h1 class="text-sky-600 text-sky p-[13px]">Tunewind</h1>
```

When both results hold, the integration is correct.

## Next

- [Core concepts](./concepts.md): how the usable set is formed.
- [Colors](../config/color.md) and [sizes](../config/size.md): the full configuration.
- [Usage](./usage.md): writing classes in pages.
