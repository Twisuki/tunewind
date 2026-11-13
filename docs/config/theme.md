---
title: Themes
order: 2
---

# {{ $frontmatter.title }}

Themes switch colors under the same class names. Each theme declares only what differs from the default theme, and pages keep their classes.

## Configuration

```ts
theme: {
  palette: {
    primary: "sky",
    ink: "slate",
  },
  shade: {
    default: 600,
    subtle: 300,
  },
  schemes: {
    ocean: {
      prefix: "ocean",
      palette: {
        primary: "teal",
      },
    },
  },
}
```

Keys of `schemes` are theme names and the identity of each theme; a value mirrors the default theme and accepts `palette`, `shade`, `opacity` and an optional `prefix`.

The variant name defaults to the theme name, so the `ocean` theme uses the `ocean:` prefix and `data-theme="ocean"`. When the theme name is a poor variant name, or collides with another variant, set `prefix`.

## Rules

Overrides merge layer by layer, and keys left out fall back to the default theme. A theme can override or add keys, but cannot remove keys from the default theme.

Variant names must be unique. The name is the theme name unless `prefix` is set; duplicates fail the build.

A theme's `palette` using a string alias requires the target family to exist and to provide the referenced shades. `shade` and `opacity` in a theme replace those keys for every color in the theme.

A theme changes colors only. Utilities unrelated to color, as well as sizes and breakpoints, are unaffected.

## Usage

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

Each theme emits a scoped set of variables, only the keys that differ from the default:

```css
[data-theme="ocean"] {
  --color-primary: oklch(60% 0.118 184.704);
}
```

Variants are registered under the variant name for the `ocean:` prefix.

## Errors

A duplicate variant name fails the build with that name:

```text
theme "ocean" is defined more than once
```

## Related

- [Colors](./color.md): the three layers in detail.
- [Breakpoints](./layout.md): size units can also change per breakpoint.
