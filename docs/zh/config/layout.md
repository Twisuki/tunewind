---
title: 断点
order: 4
---

# {{ $frontmatter.title }}

断点沿用 Tailwind 的变体写法, 并允许在断点内覆盖尺寸单位.

## 配置

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

键名与 Tailwind 内置断点同名时, 宽度可以省略; 自定义名称必须提供 `value`.

`prefix` 是变体名, 省略时与键名相同. 宽度支持 `px` 与 `rem`.

`units` 只写需要改变的单位, 其余沿用上一层配置.

## 规则

断点的宽度决定变体生效的范围, 单位按宽度顺序逐层合并. 断点内未写出的单位沿用上一层, 写出的单位替换其长度与范围.

断点内收窄范围后, 越界的类会在该断点下被移除.

未配置的断点保持 Tailwind 的默认宽度, 因此只需写出需要调整的项.

断点属于 `size` 配置, 未配置 `size` 时不会生效.

## 用法

```html
<section class="px-1o xl:px-2o">内容</section>
```

前缀与 Tailwind 一致, 可以和 `hover` 等变体组合. 类名不变, 断点内只改变数字对应的长度.

## 输出

断点注册为变体, 单位覆盖输出在对应的媒体查询内:

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

## 报错

两个断点的宽度相同时报错, 文案中给出双方的键名:

```text
breakpoints "md" and "xl" have the same width
```

变体名重复时报错:

```text
breakpoints "wide" and "xl" share the same prefix
```

自定义名称既不提供 `value`, 也不与内置断点同名时报错:

```text
breakpoint "tablet" has no width and no built-in width
```

断点覆盖了未在 `units` 中声明的单位时报错:

```text
breakpoint "xl" overrides unknown unit "z"
```

## 相关

- [尺寸](./size.md): 单位与范围.
- [主题](./theme.md): 另一类按条件切换的配置.
