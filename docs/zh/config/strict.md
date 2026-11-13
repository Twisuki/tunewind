---
title: 严格模式
order: 5
---

# {{ $frontmatter.title }}

严格模式决定超出配置的写法是否保留. 默认关闭, 所有写法照常生成.

## 配置

```ts
strict: "bypass"
```

| 写法           | 任意值 | 原始色名 | 放行前缀 |
| -------------- | ------ | -------- | -------- |
| 省略或 `false` | 允许   | 允许     | 允许     |
| `true`         | 禁止   | 禁止     | 禁止     |
| `"bypass"`     | 禁止   | 禁止     | 允许     |

对象形式逐项设置, 未写出的项视为 `false`:

```ts
strict: {
  arbitrary: false,
  family: false,
  bypass: true,
}
```

- `arbitrary`: 允许 `w-[13px]` 一类任意值.
- `family`: 允许未在 `palette` 中声明的原始家族名.
- `bypass`: 允许 `raw:` 前缀豁免以上两项检查.

因此 `{}` 与 `true` 等价.

## 规则

检查只作用于 Tailwind 生成的工具类, 写在 CSS 里的 `@apply` 不受影响.

任意值移除整个选择器; 原始色名移除对应声明, 规则中其余声明保留.

`raw:` 需要 `bypass` 打开时才具备豁免作用, 关闭时只是普通变体. 它只对任意值与原始色名生效, 尺寸范围与透明度白名单不接受放行.

匹配按类名的段进行, `raw` 必须是独立的一段, `drawer:flex` 不会被当作放行.

## 用法

```html
<div class="raw:grid-cols-[repeat(2fr,4rem)]">内容</div>
```

变体可以组合使用, 例如 `md:raw:w-[720px]`.

新项目可以从 `"bypass"` 开始, 让例外显式出现. 存量项目先开启[诊断](./diagnostics.md), 观察将被移除的写法, 再启用严格模式. 需要完全封闭时使用 `true`.

## 输出

`strict: true` 时, 以下写法在产物中消失:

```html
<div class="w-[13px] text-sky">内容</div>
```

- `w-[13px]` 的选择器被移除.
- `text-sky` 的颜色声明被移除, 若同一规则还有其他声明, 那些声明保留.

## 报错

严格模式本身没有额外报错. 配置形态不合法时由配置校验直接抛出, 例如 `strict` 写成不支持的字符串.

## 相关

- [颜色](./color.md): `palette` 的键集合决定哪些家族名属于原始色名.
- [诊断](./diagnostics.md): 被移除节点的输出.
