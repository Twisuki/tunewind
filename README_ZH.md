<div align="center">

# Tunewind

把设计系统规范带给 Tailwind !

[English](./README.md) | [简体中文](./README_ZH.md)

[![npm version](https://img.shields.io/npm/v/tunewind)](https://www.npmjs.com/package/tunewind)
[![CI](https://img.shields.io/github/actions/workflow/status/Twisuki/tunewind/ci.yml?branch=main)](https://github.com/Twisuki/tunewind/actions)
[![License](https://img.shields.io/npm/l/tunewind)](./LICENSE)

</div>

## 快速开始

### 1. 安装

```bash
pnpm add -D tunewind postcss tailwindcss @tailwindcss/postcss
```

### 2. 接入 PostCSS

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

顺序不可调换. Tunewind 在 Tailwind 前后各运行一次; 调换之后构建仍会通过, 但产物中不含主题.

### 3. 入口样式

```css
@import "tailwindcss";
@tunewind;
```

### 4. 配置

```js
import { defineConfig } from "tunewind"

export default defineConfig({
  theme: {
    // 颜色名或别名
    palette: {
      primary: "sky",
      accent: "violet",
    },
    // 可用档位与别名
    shade: {
      default: 600,
      subtle: 300,
    },
  },
  size: {
    // 可用数字上限
    max: 8,
    // 可用单位与后缀
    units: {
      default: "4px",
      x: "1px",
      r: "1rem",
    },
  },
  // 约束强度与放行口
  strict: "bypass",
  // 被移除节点的可见性
  diagnostics: "warn",
})
```

### 5. 使用

```html
<article class="w-8r rounded-lg border border-primary bg-white p-4">
  <!-- 尺寸: w-8r 是 8 * units.r(1rem) -->
  <h2 class="text-sm font-semibold text-primary">Tunewind</h2>
  <p class="mt-2 text-sm text-primary-subtle">把设计系统规范带给 Tailwind !</p>
  <!-- 颜色: text-primary-subtle 是 palette.primary(sky) 的 shade.subtle(300) -->
</article>
```

Tunewind 带来的差异在于: 只有配置允许的类才会存在.

```html
<article class="w-[720px] border border-sky p-[13px]">
  <!-- 被移除: 严格模式下不启用任意值 -->
  <h2 class="text-sky">Tunewind</h2>
  <!-- 被移除: sky 未在 palette 中声明 -->
</article>
```

## 文档

完整文档: <https://tune.twis.uk/zh/>.

## 更新日志

[CHANGELOG.md](./CHANGELOG.md)

## 许可证

[MIT](./LICENSE)
