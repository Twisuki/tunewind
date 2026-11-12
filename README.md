<div align="center">

# Tunewind

Bring design system standards to Tailwind !

[![npm version](https://img.shields.io/npm/v/tunewind)](https://www.npmjs.com/package/tunewind)
[![CI](https://img.shields.io/github/actions/workflow/status/Twisuki/tunewind/ci.yml?branch=main)](https://github.com/Twisuki/tunewind/actions)
[![License](https://img.shields.io/npm/l/tunewind)](./LICENSE)

</div>

## Getting Started

### 1. Install

```bash
pnpm add -D tunewind postcss tailwindcss @tailwindcss/postcss
```

Not published to npm yet; link the repository locally until it is.

### 2. PostCSS plugins

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

Keep the order. Tunewind runs before and after Tailwind; swapped around, the build still passes but the output comes out without the theme.

### 3. Entry CSS

```css
@import "tailwindcss";
@tunewind;
```

### 4. Config

```js
import { defineConfig } from "tunewind"

export default defineConfig({
  theme: {
    // color names or alias
    palette: {
      primary: "sky",
      accent: "violet",
    },
    // allowed shades and alias
    shade: {
      default: 600,
      subtle: 300,
    },
  },
  size: {
    // allowed numbers
    max: 8,
    // allowed units and suffix
    units: {
      default: "4px",
      x: "1px",
      r: "1rem",
    },
  },
  // enforcement and escape hatches
  strict: "bypass",
  // visibility of the dropped nodes
  diagnostics: "warn",
})
```

### 5. Usage

```html
<article class="w-8r rounded-lg border border-primary bg-white p-4">
  <!-- sizes: w-8r is 8 * units.r(1rem) -->
  <h2 class="text-sm font-semibold text-primary">Tunewind</h2>
  <p class="mt-2 text-sm text-primary-subtle">Bring design system standards to Tailwind !</p>
  <!-- colors: text-primary-subtle is the shade.subtle(300) of palette.primary(sky) -->
</article>
```

This is the difference Tunewind makes: a class exists only if the config allows it.

```html
<article class="w-[720px] border border-sky p-[13px]">
  <!-- dropped: arbitrary values are off under strict -->
  <h2 class="text-sky">Tunewind</h2>
  <!-- dropped: sky is not named in palette -->
</article>
```

## Documentation

Full documentation is coming soon.

## License

[MIT](./LICENSE)
