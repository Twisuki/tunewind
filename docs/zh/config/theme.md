---
title: 主题
order: 2
---

# {{ $frontmatter.title }}

主题用于在同一套类名下切换颜色. 每个主题只声明与 base 不同的部分, 页面无需改动类名.

## 配置

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

`schemes` 的键是主题名, 也是该主题的唯一标识; 值与 base 同构, 包含 `palette`, `shade`, `opacity` 与可选的 `prefix`.

变体名默认取主题名, 因此 `ocean` 主题使用 `ocean:` 前缀, 并对应 `data-theme="ocean"`. 主题名不便作为变体名, 或与其他变体名冲突时, 通过 `prefix` 另行指定.

## 规则

主题是补丁. 它可以覆盖 base 已声明的键, 但不新增键. 键空间由 base 定义, 只存在于主题中的键不会注册到 `@theme`, 也不会生成工具类.

主题值覆盖它所属的模式, 另一模式沿用 base 的值.

`light` 与 `dark` 是保留主题名.

变体名必须唯一. 未配置 `prefix` 时取主题名, 配置后取 `prefix`, 重复时构建报错.

主题的 `palette` 取字符串别名时, 目标家族必须存在且具备被引用的档位. 主题内的 `shade` 与 `opacity` 会替换对应键, 影响该主题下所有颜色. `opacity` 是全局的, 不分明暗.

主题只改变颜色. 与颜色无关的工具类, 以及尺寸与断点, 不受主题影响.

## 用法

暗色跟随 `prefers-color-scheme: dark`. 同一个 `data-theme` 标记在两种模式下都用于选择主题.

默认主题不需要标记. 其余主题通过 `data-theme` 属性启用, 属性值即该主题的变体名, 可以加在 `html`, 也可以加在任意容器上:

```html
<html data-theme="ocean">
  <h1 class="text-primary">海洋主题</h1>
  <p class="text-ink-subtle">说明文字</p>
</html>
```

类名保持不变, 颜色由变量切换. 需要在某个主题内单独指定颜色时, 使用该主题的变体名作为前缀:

```html
<p class="ocean:text-ink">说明文字</p>
```

该变体可以与其他变体组合使用.

## 输出

亮色主题输出一组作用域变量, 只包含与 base light 不同的键:

```css
[data-theme="ocean"] {
  --color-primary: oklch(60% 0.118 184.704);
}
```

暗色值输出在媒体查询内, 包含一份全量 base dark 和每个有变化的主题的全量块:

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

暗色块是全量而不是差异, 避免亮色主题补丁泄漏到暗色. 同时注册以变体名命名的变体, 供 `ocean:` 前缀使用.

## 报错

变体名重复时构建报错, 文案中的名称即发生重复的变体名:

```text
theme "ocean" is defined more than once
```

`light` 与 `dark` 是保留名, 使用时会构建报错:

```text
theme "dark" is reserved for the light or dark mode
```

## 相关

- [颜色](./color.md): 三层配置的具体含义.
- [断点](./layout.md): 尺寸单位也可以按断点切换.
