---
title: Strict Mode
order: 5
---

# {{ $frontmatter.title }}

Strict mode decides whether values outside the config survive. It is off by default, and every value compiles.

## Configuration

```ts
strict: "bypass"
```

| Form               | Arbitrary values | Raw color names | Escape prefix |
| ------------------ | ---------------- | --------------- | ------------- |
| Omitted or `false` | allowed          | allowed         | allowed       |
| `true`             | forbidden        | forbidden       | forbidden     |
| `"bypass"`         | forbidden        | forbidden       | allowed       |

The object form sets each flag, and omitted flags count as `false`:

```ts
strict: {
  arbitrary: false,
  family: false,
  bypass: true,
}
```

- `arbitrary`: allow arbitrary values such as `w-[13px]`.
- `family`: allow raw family names not declared in `palette`.
- `bypass`: allow the `raw:` prefix to exempt the two checks above.

So `{}` equals `true`.

## Rules

Checks apply to Tailwind-generated utilities only; `@apply` in CSS is unaffected.

An arbitrary value removes the whole selector; a raw color name removes that declaration and keeps the rest of the rule.

`raw:` exempts only when `bypass` is on; otherwise it is an ordinary variant. It applies to arbitrary values and raw color names only; size ranges and the opacity whitelist do not accept it.

Matching works on class segments: `raw` must be a segment of its own, so `drawer:flex` is not treated as an exemption.

## Usage

```html
<div class="raw:grid-cols-[repeat(2fr,4rem)]">Content</div>
```

Variants compose, for example `md:raw:w-[720px]`.

Start a new project with `"bypass"` so exceptions are explicit. Existing projects enable [diagnostics](./diagnostics.md) first, watch what would be removed, then enable strict mode. Use `true` for full closure.

## Output

With `strict: true`, the following markup loses styles:

```html
<div class="w-[13px] text-sky">Content</div>
```

- The selector for `w-[13px]` is removed.
- The color declaration for `text-sky` is removed; other declarations in the same rule remain.

## Errors

Strict mode has no errors of its own. An invalid shape is rejected by configuration validation, for example a `strict` string that is not supported.

## Related

- [Colors](./color.md): the keys of `palette` decide which family names count as raw.
- [Diagnostics](./diagnostics.md): output for removed nodes.
