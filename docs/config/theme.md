---
title: Themes
order: 2
---

# {{ $frontmatter.title }}

Themes switch colors under the same class names. Each theme declares only what differs from the base, and pages keep their classes.

## Configuration

```ts
theme: {
  palette: {
    primary: { light: "sky", dark: "slate" },
    ink: "slate",
  },
  shade: {
    default: { light: 600, dark: 500 },
    subtle: 300,
  },
  schemes: {
    ocean: {
      prefix: "ocean",
      palette: {
        primary: { light: "teal", dark: "cyan" },
      },
    },
  },
}
```

Keys of `schemes` are theme names and the identity of each theme; a value mirrors the base and accepts `palette`, `shade`, `opacity` and an optional `prefix`.

The variant name defaults to the theme name, so the `ocean` theme uses the `ocean:` prefix and `data-theme="ocean"`. When the theme name is a poor variant name, or collides with another variant, set `prefix`.

## Rules

Themes are patches. They may override keys declared by the base, but they do not add new keys. The base defines the full key space; a theme-only key is not registered in `@theme` and produces no utility.

A theme value overrides the mode it belongs to; the other mode keeps the base value.

`light` and `dark` are reserved theme names.

Variant names must be unique. The name is the theme name unless `prefix` is set; duplicates fail the build.

A theme's `palette` using a string alias requires the target family to exist and to provide the referenced shades. `shade` and `opacity` in a theme replace those keys for every color in the theme. `opacity` is global and is not split by mode.

A theme changes colors only. Utilities unrelated to color, as well as sizes and breakpoints, are unaffected.

## Usage

Dark mode follows `prefers-color-scheme: dark`. The same `data-theme` marker selects the theme in both modes.

The default theme needs no marker. Other themes are enabled by the `data-theme` attribute, whose value is the variant name, on `html` or any container:

```html
<html data-theme="ocean">
  <h1 class="text-primary">Ocean theme</h1>
  <p class="text-ink-subtle">Supporting text</p>
</html>
```

Class names stay as they are; colors switch through variables. To set a color explicitly inside a theme, use the theme's variant name as a prefix:

```html
<p class="ocean:text-ink">Supporting text</p>
```

The variant composes with other variants.

## Output

Light themes emit a scoped set of variables, only the keys that differ from the base light theme:

```css
[data-theme="ocean"] {
  --color-primary: oklch(60% 0.118 184.704);
}
```

Dark values are emitted under the media query, including a full base dark block and a full block per changed theme:

```css
@media (prefers-color-scheme: dark) {
  :root, :host {
    --color-primary: oklch(55.4% 0.046 257.417);
  }

  [data-theme="ocean"] {
    --color-primary: oklch(71.5% 0.143 215.221);
  }
}
```

Dark blocks are full rather than diffs, so a light theme patch cannot leak into dark mode. Variants are registered under the variant name for the `ocean:` prefix.

## Errors

A duplicate variant name fails the build with that name:

```text
theme "ocean" is defined more than once
```

`light` and `dark` are reserved and fail the build:

```text
theme "dark" is reserved for the light or dark mode
```

## Related

- [Colors](./color.md): the three layers in detail.
- [Breakpoints](./layout.md): size units can also change per breakpoint.
