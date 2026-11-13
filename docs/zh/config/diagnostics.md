---
title: 诊断
order: 6
---

# {{ $frontmatter.title }}

诊断决定构建时如何报告被移除的节点. 默认不输出.

## 配置

```ts
diagnostics: "warn"
```

| 写法           | 行为               |
| -------------- | ------------------ |
| 省略或 `"off"` | 静默移除           |
| `"warn"`       | 逐行警告, 构建继续 |
| `"error"`      | 汇总后中断构建     |

带条数上限的写法:

```ts
diagnostics: {
  mode: "warn",
  limit: 20,
}
```

`limit` 为正整数, 省略时为 `100`.

## 规则

等级决定被移除节点的处理方式, 上限决定一次构建最多输出多少行.

诊断只采集被移除的节点. 未声明的颜色与档位不产生节点, 也不进入诊断; 放行前缀命中的节点同样不报告.

输出按首次出现排序, 重复的行只出现一次. 上限作用于去重后的行数, 超出时末行为 `... and N more`.

`error` 在 watch 模式下会中断本次构建.

## 用法

本地开发使用 `"warn"`, 便于发现越界写法而不打断构建.

```ts
diagnostics: "error"
```

CI 使用 `"error"`, 配合全量页面构建, 可以把违规写法拦在合并前.

## 输出

`warn` 每条一行, 以 `tunewind:` 开头:

```text
tunewind: dropped .w-\[13px\] (arbitrary value is not allowed)
tunewind: dropped color: var(--color-sky) in .text-sky (raw color family is not allowed)
tunewind: dropped opacity: 30% in .opacity-30 (opacity outside the theme keys)
```

选择器被移除时报告选择器, 声明被移除时附带所属规则. 原因短语固定, 共四种:

```text
arbitrary value is not allowed
raw color family is not allowed
opacity outside the theme keys
size outside the breakpoint unit range
```

`error` 汇总为一个错误, 头部计数为真实总数, 列表受 `limit` 限制:

```text
tunewind: 3 violations
  dropped .w-\[13px\] (arbitrary value is not allowed)
  dropped color: var(--color-sky) in .text-sky (raw color family is not allowed)
  dropped opacity: 30% in .opacity-30 (opacity outside the theme keys)
```

## 报错

配置错误与内部错误始终直接抛出, 与等级无关. `diagnostics` 写成不支持的等级时由配置校验报错.

## 相关

- [严格模式](./strict.md): 任意值与原始色名.
- [断点](./layout.md): 断点内收窄的尺寸范围.
