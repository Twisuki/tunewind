---
title: 快速开始
order: 1
---

# {{ $frontmatter.title }}

本页说明 Tunewind 的安装与接入方式, 并通过构建产物确认配置生效.

## 安装

Tunewind 仅在构建期运行, 不进入产物, 应作为开发依赖安装.

```bash
pnpm add -D tunewind postcss tailwindcss @tailwindcss/postcss
```

## 接入 PostCSS

Tunewind 由两个 PostCSS 插件组成, 分别位于 Tailwind 之前与之后.

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

顺序不可调换. 前置插件注入主题, 后置插件处理产物. 调换顺序后构建仍会通过, 但产物中不含主题.

## 引入入口样式

```css
@import "tailwindcss";
@tunewind;
```

`@tunewind` 在构建时替换为生成的主题 CSS. 该 at-rule 缺失时, 前置插件不执行任何操作.

## 编写配置

在项目根目录创建 `tune.config.ts`.

```ts
import { defineConfig } from "tunewind"

export default defineConfig({
  theme: {
    // 主色声明为 primary, 并限定档位与透明度
    palette: { primary: "sky" },
    shade: { default: 600, subtle: 300, strong: 800 },
    opacity: { default: 100, weak: 80 },
  },
  size: {
    // 4px 基准, 数值上限 64
    max: 64,
    units: { default: "4px", r: "1rem" },
  },
  strict: true,
})
```

配置项的含义见[颜色](../config/color.md), [尺寸](../config/size.md) 与[严格模式](../config/strict.md).

## 验证

下列类在产物中应有对应声明:

```html
<h1 class="text-primary-subtle p-4">Tunewind</h1>
```

```css
.text-primary-subtle { color: var(--color-primary-subtle); }
.p-4 { padding: var(--spacing-4); }
```

下列类在产物中不应有任何声明:

```html
<h1 class="text-sky-600 text-sky p-[13px]">Tunewind</h1>
```

两类结果都符合, 说明接入正确.

## 后续

- [核心概念](./concepts.md): 可写范围的构成.
- [颜色](../config/color.md) 与 [尺寸](../config/size.md): 完整配置项.
- [使用](./usage.md): 页面中的各类写法.
