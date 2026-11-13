---
title: Colors
order: 1
---

# {{ $frontmatter.title }}

Colors are determined by `theme.palette`, `theme.shade` and `theme.opacity`: the first decides which colors exist, the other two decide the available shades and opacities.

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
    strong: 800,
  },
  opacity: {
    default: 100,
    weak: 80,
  },
}
```

### palette

The built-in palette matches Tailwind: 26 families, 11 shades each.

`palette` has two forms: a string references a built-in family, an object defines a custom scale.

The string form aliases a built-in family; after `{ primary: "sky" }`, `primary` and `sky` point to the same scale.

The object form defines a custom scale, with shade numbers as keys and any CSS color as value, at least one shade. Writing an object under an existing family overrides it, and shades left out keep the built-in values.

### shade

The key becomes the class suffix and must be one of the built-in shades `50` to `950`. `default` produces no suffix, so `text-primary` uses the shade mapped to `default`.

### opacity

The key becomes the color modifier and must be a number from `0` to `100`. `default` has no special meaning here and equals any other key.

## Rules

A color name comes from `palette`, the shade and opacity from `shade` and `opacity`; the three combine into a class name. Keys left out are unavailable, and Tailwind's numeric shades and default modifiers disappear with them.

Built-in families not declared in `palette` are not removed automatically; whether they survive depends on the `family` check in [strict mode](./strict.md). Arbitrary colors such as `text-[#fff]` are controlled by the `arbitrary` check there.

`white` and `black` are single values: there is no `text-white-subtle`, and opacity still requires a matching `opacity` key. The `transparent`, `current` and `inherit` keywords are always available.

## Usage

The config above maps to the following classes, with the Tailwind equivalent on the right:

| Class                 | Result                          | Equivalent         |
| --------------------- | ------------------------------- | ------------------ |
| `text-primary`        | default shade, `600`            | `text-sky-600`     |
| `text-primary-subtle` | `300`                           | `text-sky-300`     |
| `border-ink-strong`   | `800`                           | `border-slate-800` |
| `bg-primary/weak`     | `80%` opacity                   | `bg-sky-600/80`    |
| `text-white`          | built-in constant, unconfigured | `text-white`       |

## Output

Colors are exposed as variables, which custom styles can reference directly:

```css
.card {
  color: var(--color-primary-subtle);
  border-color: var(--color-ink-strong);
  background: color-mix(in oklab, var(--color-primary) var(--opacity-weak), transparent);
}
```

The naming is `--color-<name>`, `--color-<name>-<key>` and `--opacity-<key>`.

## Errors

A custom scale missing a referenced shade fails the build with the family and shade:

```text
color family "primary" has no shade 400
```

An empty scale, or a key that does not match `[A-Za-z0-9_]+`, fails as well.

## Related

- [Themes](./theme.md): color overrides per theme.
- [Strict mode](./strict.md): raw color names and arbitrary values.
