---
title: 使用
order: 3
---

# {{ $frontmatter.title }}

本页以内容站点为例, 依次说明规范设计, 配置编写与页面写法.

## 设计

- 颜色: 主色为 `sky`, 正文用 `slate`; 主色需要默认, 弱化, 强调三档; 透明度只用 `100%` 与 `80%`.
- 尺寸: 边框与分隔线用 `1px`, 文本间距用 `4px` 基准, 内容卡片用 `4rem`, 布局容器用 `8rem`; 数字不超过 `64`; 大屏基准放宽到 `6px`.
- 主题: 除默认主题外需要 `ocean`, 主色改为 `teal`.
- 约束: 禁用任意值与原始色名, 保留放行前缀; 构建时输出违规.

## 配置

`tune.config.ts`:

```ts
import { defineConfig } from "tunewind"

export default defineConfig({
  theme: {
    palette: { primary: "sky", ink: "slate" },
    shade: { default: 600, subtle: 300, strong: 800 },
    opacity: { default: 100, weak: 80 },
    schemes: {
      ocean: {
        prefix: "ocean",
        palette: { primary: "teal" }
      },
    },
  },
  size: {
    max: 64,
    units: {
      default: "4px",
      x: "1px",
      r: "1rem",
      q: "4rem",
      o: "8rem"
    },
    breakpoints: {
      xl: {
        units: { default: "6px" }
      },
    },
  },
  strict: "bypass",
  diagnostics: "warn",
})
```

入口样式:

```css
@import "tailwindcss";
@tunewind;

@utility text-muted {
  color: var(--color-ink-subtle);
}
```

入口样式与 `tune.config.ts` 同属配置层. `@utility` 用于定义业务语义类, 这类写法不进入配置, 也不参与检查.

## 使用

### 颜色与主题

```html
<html data-theme="ocean">
  <h1 class="text-primary">标题</h1>
  <p class="text-ink-subtle">说明文字</p>
  <aside class="bg-primary/weak ocean:text-ink">提示</aside>
</html>
```

语义名之后可以跟档位, 键名直接来自 `shade`; 透明度写在修饰符位置, 键名来自 `opacity`.

颜色随主题变化, 类名无需修改. 针对某个主题单独指定时, 使用该主题的 `prefix` 作为变体.

`white` 与 `black` 以及颜色关键字不受限制.

### 尺寸与布局

```html
<section class="px-1o py-2q xl:px-2o xl:py-4q">
  <div class="flex items-center gap-1q">
    <div class="w-4q">
      <h1 class="mb-1 text-2xl text-primary">把设计系统规范带给 Tailwind</h1>
      <p class="mb-2 text-sm text-ink-subtle">强配置, 强约束, 可拓展的原子化 CSS 方案与设计系统.</p>
      <button class="px-2q py-1 text-sm">快速开始</button>
    </div>
    <img class="h-2q w-4q" src="/hero.png" alt="">
  </div>
</section>
```

外层 `section` 使用 `o` 与 `q`, 承担页面级留白, `xl` 前缀换成更大的数值.

文本列 `w-4q` 与图片 `w-4q` 使用 `q`, 属内容块尺度. 同一长度也可写作 `w-16r`, 单位按所描述的对象选择.

文本内部 `mb-1` `mb-2` 与按钮 `py-1` 使用默认单位, 属紧凑间距; 图片高度 `h-2q` 与宽度同属内容块尺度, `1x` 则用于分隔线一类的最小尺寸.

字号 `text-2xl` 与 `text-sm` 属于 Tailwind 的语义 API, 不受尺寸体系约束.

数字乘以单位得到实际尺寸, 越界的数字不会生成. 断点内可以覆盖单位, 因此同一个数字在不同断点表示不同长度.

### 放行

```html
<div class="raw:grid-cols-[repeat(2fr,4rem)]">内容</div>
```

放行前缀对任意值与原始色名生效, 尺寸范围与透明度白名单不接受放行. 一次性例外可以直接使用, 长期复用的例外应写成 `@utility`.

## 检查

类没有产生样式时, 先确认颜色名与档位是否在配置中声明, 未声明时不会生成; 再启用 `diagnostics` 查看被移除的节点. 未声明的颜色不进入诊断, 只能通过产物对比发现.
